import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { find, parse, string } from 'css-tree';
import {
	isFunctionNode,
	parseListOfComponentValues,
	stringify,
	walk,
} from '@csstools/css-parser-algorithms';
import { calcFromComponentValues } from '@csstools/css-calc';

import { atRuleRegexes, mayIncludeRegexes } from '../../utils/regexes.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import getLexer from '../../utils/getLexer.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import { isDeclaration } from '../../utils/typeGuards.mjs';
import isDescriptorDeclaration from '../../utils/isDescriptorDeclaration.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import optionsMatchesEntry from '../../utils/optionsMatchesEntry.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateObjectWithArrayProps from '../../utils/validateObjectWithArrayProps.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'declaration-property-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unknown value "${value}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown',
};

const SYNTAX_DESCRIPTOR = /^syntax$/i;

const UNSUPPORTED_FUNCTIONS_IN_CSSTREE = new Set(['clamp', 'min', 'max', 'env']);

/** @type {WeakMap<object, Set<string>>} */
const validMatchesCacheByLexer = new WeakMap();
const MAX_CACHE_SIZE = 10000;

/** @import { CssNode, Lexer } from 'css-tree' */

/** @typedef {import('stylelint').CoreRules[typeof ruleName]} Rule */
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
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/** @type {(name: string, propValue: string) => boolean} */
		const isPropIgnored = (name, value) =>
			optionsMatchesEntry(secondaryOptions, 'ignoreProperties', name, value);

		/** @type {Record<string, string>} */
		const propertiesSyntax = {};

		/** @type {Map<string, string>} */
		const typedCustomPropertyNames = new Map();

		const referenceRoots = result.stylelint.referenceRoots;

		for (const rootNode of [...referenceRoots, root]) {
			rootNode.walkAtRules(atRuleRegexes.propertyName, (atRule) => {
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
		}

		const hasExtraSyntax = Object.keys(propertiesSyntax).length > 0;

		const lexer = hasExtraSyntax
			? getLexer(result.stylelint.config ?? {}, { properties: propertiesSyntax })
			: /** @type {Lexer} */ (result.stylelint.lexer);

		let validMatchesCache = validMatchesCacheByLexer.get(lexer);

		if (!validMatchesCache) {
			validMatchesCache = new Set();
			validMatchesCacheByLexer.set(lexer, validMatchesCache);
		}

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

			const cacheKey = isCustomProperty(prop) ? null : `${prop}:${value}`;

			if (cacheKey && validMatchesCache.has(cacheKey)) return;

			// Check if value contains math functions that need validation
			const mathFuncResult = validateMathFunctions(value, prop, lexer, typedCustomPropertyNames);

			if (mathFuncResult === 'valid' || mathFuncResult === 'skip-validation') {
				if (cacheKey && validMatchesCache.size < MAX_CACHE_SIZE) validMatchesCache.add(cacheKey);

				return;
			}

			/** @type {CssNode} */
			let cssTreeValueNode;

			try {
				cssTreeValueNode = parse(value, { context: 'value', positions: true });
			} catch {
				return;
			}

			const valueIndex = declarationValueIndex(decl);

			/**
			 * Report the enclosing function, if any, rather than the mismatched fragment within it
			 *
			 * @param {number} startOffset
			 * @param {number} endOffset
			 */
			const complain = (startOffset, endOffset) => {
				const functionNode = findEnclosingFunction(cssTreeValueNode, startOffset, endOffset);
				const start = functionNode?.loc?.start.offset ?? startOffset;
				const end = functionNode?.loc?.end.offset ?? endOffset;

				report({
					message: messages.rejected,
					messageArgs: [prop, value.slice(start, end)],
					node: decl,
					index: valueIndex + start,
					endIndex: valueIndex + end,
					result,
					ruleName,
				});
			};

			// The remaining result is the range of an invalid math expression
			if (mathFuncResult !== 'undetermined') {
				const [startOffset, endOffset] = mathFuncResult;

				complain(startOffset, endOffset);

				return;
			}

			if (containsFunctionsNotSupportedInCSSTree(cssTreeValueNode)) return;

			const { error } = lexer.matchProperty(
				typedCustomPropertyNames.get(prop) ?? prop,
				cssTreeValueNode,
			);

			if (!error) {
				if (cacheKey && validMatchesCache.size < MAX_CACHE_SIZE) validMatchesCache.add(cacheKey);

				return;
			}

			if (!('mismatchLength' in error)) return;

			const { name, rawMessage, loc } = error;

			if (name !== 'SyntaxMatchError') return;

			if (rawMessage !== 'Mismatch') return;

			complain(loc.start.offset, loc.end.offset);
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
 * Detect `calc-size()` with the `size` keyword in its arguments.
 *
 * @param {Array<import('@csstools/css-parser-algorithms').ComponentValue>} componentValues
 * @returns {boolean}
 */
function containsCalcSizeWithSizeKeyword(componentValues) {
	let contains = false;

	walk(componentValues, ({ node }) => {
		if (!isFunctionNode(node) || node.getName().toLowerCase() !== 'calc-size') return;

		contains = node
			.tokens()
			.some((token) => token[0] === TokenType.Ident && token[4]?.value.toLowerCase() === 'size');

		if (contains) return false; // halt
	});

	return contains;
}

/**
 * Validate math functions (calc, min, max, clamp, etc.) in a CSS value.
 * Uses @csstools/css-calc to solve expressions and validate the result.
 *
 * @param {string} value - The CSS property value
 * @param {string} prop - The property name
 * @param {Lexer} lexer - The csstree lexer
 * @param {Map<string, string>} typedCustomPropertyNames - Map of typed custom property names
 * @returns {'undetermined' | 'valid' | 'skip-validation' | [startOffset: number, endOffset: number]} - The validation result, or the range of the invalid expression
 */
function validateMathFunctions(value, prop, lexer, typedCustomPropertyNames) {
	// If the value doesn't contain any math functions, continue with normal validation
	if (!mayIncludeRegexes.mathFunction.test(value)) return 'undetermined';

	const nodes = parseListOfComponentValues(tokenize({ css: value }), {});

	if (containsCalcSizeWithSizeKeyword(nodes)) {
		return 'skip-validation';
	}

	// Try to solve the math expression
	const solvedNodes = calcFromComponentValues([nodes]);

	const solvedValue = stringify(solvedNodes);

	// For other cases where calc can't be fully solved (like 100% - 10px),
	// skip validation and let csstree handle it (csstree allows these)
	if (mayIncludeRegexes.mathFunction.test(solvedValue)) {
		return 'undetermined';
	}

	// If the expression was fully solved (no more math functions),
	// validate the result with csstree
	try {
		const solvedCssTreeNode = parse(solvedValue, { context: 'value', positions: true });

		if (containsFunctionsNotSupportedInCSSTree(solvedCssTreeNode)) {
			return 'skip-validation';
		}

		const { error } = lexer.matchProperty(
			typedCustomPropertyNames.get(prop) ?? prop,
			solvedCssTreeNode,
		);

		// If the solved value is valid, skip further validation
		if (!error) return 'valid';

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

			for (const token of solvedTokens) {
				if (startOffset === counter) {
					startToken = token;
				}

				counter += token[1].length;

				if (endOffset === counter) {
					endToken = token;
				}
			}

			if (!startToken || !endToken) return [0, value.length];

			return [startToken[2], endToken[3] + 1];
		}
	} catch {
		// If parsing fails, continue with normal validation
		return 'undetermined';
	}

	return 'undetermined';
}

/**
 * @param {CssNode} cssTreeValueNode
 * @param {number} startOffset
 * @param {number} endOffset
 * @returns {CssNode | null}
 */
function findEnclosingFunction(cssTreeValueNode, startOffset, endOffset) {
	return find(
		cssTreeValueNode,
		(node) =>
			node.type === 'Function' &&
			node.loc !== undefined &&
			startOffset >= node.loc.start.offset &&
			endOffset <= node.loc.end.offset,
	);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
