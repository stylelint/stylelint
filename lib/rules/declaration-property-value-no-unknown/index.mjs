import { ParseErrorMessage, calcFromComponentValues } from '@csstools/css-calc';
import { find, parse, string } from 'css-tree';
import { parseListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleRegexes } from '../../utils/regexes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import getLexer from '../../utils/getLexer.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import { isDeclaration } from '../../utils/typeGuards.mjs';
import isDescriptorDeclaration from '../../utils/isDescriptorDeclaration.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import { mathFunctions } from '../../reference/functions.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateObjectWithArrayProps from '../../utils/validateObjectWithArrayProps.mjs';
import validateObjectWithProps from '../../utils/validateObjectWithProps.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'declaration-property-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unexpected unknown value "${value}" for property "${property}"`,
	rejectedParseError: (property, value) =>
		`Cannot parse property value "${value}" for property "${property}"`,
	rejectedMath: (property, expression) =>
		`Unexpected invalid math expression "${expression}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown',
};

const SYNTAX_DESCRIPTOR = /^syntax$/i;

const UNSUPPORTED_FUNCTIONS_IN_CSSTREE = new Set(['clamp', 'min', 'max', 'env']);

const HAS_MATH_FUNCTION = new RegExp(`\\b(?:${[...mathFunctions.values()].join('|')})\\(`, 'i');

/** @import { CssNode } from 'css-tree' */
/** @import { ParseError } from '@csstools/css-calc' */

/** @typedef {import('stylelint').CoreRules[ruleName]} Rule */
/** @typedef {Parameters<Rule>[1]} SecondaryOptions */

/** @type {Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [validateObjectWithArrayProps(isString, isRegExp)],
					propertiesSyntax: [validateObjectWithProps(isString)],
					typesSyntax: [validateObjectWithProps(isString)],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreProperties = Array.from(Object.entries(secondaryOptions?.ignoreProperties ?? {}));

		/** @type {(name: string, propValue: string) => boolean} */
		const isPropIgnored = (name, value) => {
			const [, valuePattern] =
				ignoreProperties.find(([namePattern]) => matchesStringOrRegExp(name, namePattern)) || [];

			return Boolean(valuePattern && matchesStringOrRegExp(value, valuePattern));
		};

		const propertiesSyntax = { ...secondaryOptions?.propertiesSyntax };
		const typesSyntax = { ...secondaryOptions?.typesSyntax };

		/** @type {Map<string, string>} */
		const typedCustomPropertyNames = new Map();

		root.walkAtRules(atRuleRegexes.propertyName, (atRule) => {
			const propName = atRule.params.trim();

			if (!propName || !atRule.nodes || !isCustomProperty(propName)) return;

			for (const node of atRule.nodes) {
				if (isDeclaration(node) && SYNTAX_DESCRIPTOR.test(node.prop)) {
					const value = node.value.trim();
					const unquoted = string.decode(value);

					// Only string values are valid.
					// We can not check the syntax of this property.
					if (unquoted === value) continue;

					// Any value is allowed in this custom property.
					// We don't need to check this property.
					if (unquoted === '*') continue;

					// https://github.com/csstree/csstree/pull/256
					// We can circumvent this issue by prefixing the property name,
					// making it a vendor-prefixed property instead of a custom property.
					// No one should be using `-stylelint--` as a property prefix.
					//
					// When this is resolved `typedCustomPropertyNames` can become a `Set<string>`
					// and the prefix can be removed.
					const prefixedPropName = `-stylelint${propName}`;

					typedCustomPropertyNames.set(propName, prefixedPropName);
					propertiesSyntax[prefixedPropName] = unquoted;
				}
			}
		});

		const hasExtraSyntax =
			Object.keys(propertiesSyntax).length > 0 || Object.keys(typesSyntax).length > 0;

		const lexer = hasExtraSyntax
			? getLexer(result.stylelint.config ?? {}, {
					properties: propertiesSyntax,
					types: typesSyntax,
				})
			: result.stylelint.lexer;

		root.walkDecls((decl) => {
			const { prop } = decl;
			const value = getDeclarationValue(decl);

			// csstree/csstree#243
			// NOTE: CSSTree's `fork()` doesn't support `-moz-initial`, but it may be possible in the future.
			if (/^-moz-initial$/i.test(value)) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			if (isDescriptorDeclaration(decl)) return;

			if (!isStandardSyntaxProperty(prop)) return;

			if (!isStandardSyntaxValue(value)) return;

			if (isCustomProperty(prop) && !typedCustomPropertyNames.has(prop)) return;

			if (isPropIgnored(prop, value)) return;

			// TODO: csstree treats any value containing `var()` as valid, even if the `var()` expression itself is invalid.
			// csstree should be updated to mark invalidate values that contain invalid `var()` expressions.
			// skipping parsing by returning early until this is resolved upstream.
			if (/\bvar\s*\(/i.test(value)) return;

			// Check if value contains math functions that need validation
			const [mathFuncResult, mathFuncResultStartOffset, mathFuncResultEndOffset] =
				validateMathFunctions(value, prop, lexer, typedCustomPropertyNames);

			if (mathFuncResult === 'valid' || mathFuncResult === 'skip-validation') return;

			if (mathFuncResult === 'invalid') {
				const valueIndex = declarationValueIndex(decl);

				let expression = value;
				let index = valueIndex;
				let endIndex = index + expression.length;

				if (mathFuncResultStartOffset !== -1 && mathFuncResultEndOffset !== -1) {
					expression = value.slice(mathFuncResultStartOffset, mathFuncResultEndOffset);

					index = valueIndex + mathFuncResultStartOffset;
					endIndex = index + expression.length;
				}

				report({
					message: messages.rejectedMath,
					messageArgs: [prop, expression],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});

				return;
			}

			/** @type {CssNode} */
			let cssTreeValueNode;

			try {
				cssTreeValueNode = parse(value, { context: 'value', positions: true });

				if (containsFunctionsNotSupportedInCSSTree(cssTreeValueNode)) return;
			} catch {
				// Ignore parse errors for `attr()`, `if()` and custom functions
				// See: https://github.com/stylelint/stylelint/issues/8779
				if (/(?:^|[^\w-])(?:attr|if|--[\w-]+)\(/i.test(value)) return;

				const index = declarationValueIndex(decl);
				const endIndex = index + value.length;

				report({
					message: messages.rejectedParseError,
					messageArgs: [prop, value],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});

				return;
			}

			const { error } = lexer.matchProperty(
				typedCustomPropertyNames.get(prop) ?? prop,
				cssTreeValueNode,
			);

			if (!error) return;

			if (!('mismatchLength' in error)) return;

			const { name, rawMessage, loc } = error;

			if (name !== 'SyntaxMatchError') return;

			if (rawMessage !== 'Mismatch') return;

			const valueIndex = declarationValueIndex(decl);
			const mismatchValue = value.slice(loc.start.offset, loc.end.offset);

			const functionNode = find(
				cssTreeValueNode,
				(node) =>
					node.type === 'Function' &&
					node.loc !== undefined &&
					loc.start.offset >= node.loc.start.offset &&
					loc.end.offset <= node.loc.end.offset,
			);

			if (functionNode?.loc) {
				const valueFunction = value.slice(
					functionNode.loc.start.offset,
					functionNode.loc.end.offset,
				);

				const index = valueIndex + functionNode.loc.start.offset;
				const endIndex = index + valueFunction.length;

				report({
					message: messages.rejected,
					messageArgs: [prop, valueFunction],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});

				return;
			}

			report({
				message: messages.rejected,
				messageArgs: [prop, mismatchValue],
				node: decl,
				index: valueIndex + loc.start.offset,
				endIndex: valueIndex + loc.end.offset,
				result,
				ruleName,
			});
		});
	};
};

/**
 * @see csstree/csstree#245 env
 * @param {CssNode} cssTreeNode
 * @returns {boolean}
 */
function containsFunctionsNotSupportedInCSSTree(cssTreeNode) {
	return Boolean(
		find(
			cssTreeNode,
			(node) =>
				node.type === 'Function' && UNSUPPORTED_FUNCTIONS_IN_CSSTREE.has(node.name.toLowerCase()),
		),
	);
}

/**
 * Validate math functions (calc, min, max, clamp, etc.) in a CSS value.
 * Uses @csstools/css-calc to solve expressions and validate the result.
 *
 * @param {string} value - The CSS property value
 * @param {string} prop - The property name
 * @param {ReturnType<import('css-tree')['fork']>['lexer']} lexer - The csstree lexer
 * @param {Map<string, string>} typedCustomPropertyNames - Map of typed custom property names
 * @returns {['undetermined' | 'valid' | 'invalid' | 'skip-validation', number, number]} - The validation result
 */
function validateMathFunctions(value, prop, lexer, typedCustomPropertyNames) {
	// If the value doesn't contain any math functions, continue with normal validation
	if (!HAS_MATH_FUNCTION.test(value)) return ['undetermined', -1, -1];

	const nodes = parseListOfComponentValues(tokenize({ css: value }), {});

	/** @type {Array<ParseError>} */
	const calcParseErrors = [];

	// Try to solve the math expression
	const solvedNodes = calcFromComponentValues([nodes], {
		onParseError: (err) => {
			calcParseErrors.push(err);
		},
	});

	// Check if any known errors were detected during parsing
	for (const calcParseError of calcParseErrors) {
		switch (calcParseError.message) {
			case ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber:
			case ParseErrorMessage.UnexpectedSubtractionOfDimensionOrPercentageWithNumber:
				return ['invalid', calcParseError.sourceStart, calcParseError.sourceEnd + 1];

			default:
				break;
		}
	}

	const solvedValue = stringify(solvedNodes);

	// For other cases where calc can't be fully solved (like 100% - 10px),
	// skip validation and let csstree handle it (csstree allows these)
	if (HAS_MATH_FUNCTION.test(solvedValue)) {
		return ['undetermined', -1, -1];
	}

	// If the expression was fully solved (no more math functions),
	// validate the result with csstree
	try {
		const solvedCssTreeNode = parse(solvedValue, { context: 'value', positions: true });

		if (containsFunctionsNotSupportedInCSSTree(solvedCssTreeNode)) {
			return ['skip-validation', -1, -1];
		}

		const { error } = lexer.matchProperty(
			typedCustomPropertyNames.get(prop) ?? prop,
			solvedCssTreeNode,
		);

		// If the solved value is valid, skip further validation
		if (!error) return ['valid', -1, -1];

		// If the solved value is invalid, it means the calc result type doesn't match the property
		// e.g., calc(2) for height: results in a number "2", but height expects a length
		if (
			'mismatchLength' in error &&
			error.name === 'SyntaxMatchError' &&
			error.rawMessage === 'Mismatch'
		) {
			const startOffset = error.loc.start.offset;
			const endOffset = error.loc.end.offset;

			// Lookup the original source position of the invalid expression
			// by finding the tokens that correspond to the positions reported by csstree
			const solvedTokens = solvedNodes.flatMap((componentValues) =>
				componentValues.flatMap((node) => node.tokens()),
			);
			let counter = 0;
			let startToken;
			let endToken;

			solvedTokens.forEach((token) => {
				if (startOffset === counter) {
					startToken = token;
				}

				counter += token[1].length;

				if (endOffset === counter) {
					endToken = token;
				}
			});

			if (!startToken || !endToken) return ['invalid', -1, -1];

			return ['invalid', startToken[2], endToken[3] + 1];
		}
	} catch {
		// If parsing fails, continue with normal validation
		return ['undetermined', -1, -1];
	}

	return ['undetermined', -1, -1];
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
