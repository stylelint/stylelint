import { find, fork, parse, string } from 'css-tree';
import {
	isFunctionNode,
	isTokenNode,
	parseListOfComponentValues,
} from '@csstools/css-parser-algorithms';
import {
	isTokenDelim,
	isTokenDimension,
	isTokenNumber,
	isTokenPercentage,
	tokenize,
} from '@csstools/css-tokenizer';
import { calc } from '@csstools/css-calc';
import syntaxPatchesJson from '@csstools/css-syntax-patches-for-csstree' with { type: 'json' };

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleRegexes } from '../../utils/regexes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import { isDeclaration } from '../../utils/typeGuards.mjs';
import isDescriptorDeclaration from '../../utils/isDescriptorDeclaration.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import { mathFunctions } from '../../reference/functions.mjs';
import mergeSyntaxDefinitions from '../../utils/mergeSyntaxDefinitions.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateObjectWithArrayProps from '../../utils/validateObjectWithArrayProps.mjs';
import validateObjectWithProps from '../../utils/validateObjectWithProps.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const { next: syntaxPatches } = syntaxPatchesJson;

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

const UNSUPPORTED_FUNCTIONS = new Set(['env']);

const HAS_MATH_FUNCTION = new RegExp(`\\b(?:${[...mathFunctions.values()].join('|')})\\(`, 'i');

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

		const languageOptions = result.stylelint.config?.languageOptions;
		const forkedLexer = fork(
			mergeSyntaxDefinitions(
				syntaxPatches,
				{ ...languageOptions?.syntax, atrules: languageOptions?.syntax?.atRules },
				{ properties: propertiesSyntax, types: typesSyntax },
			),
		).lexer;

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

			/** @type {import('css-tree').CssNode} */
			let cssTreeValueNode;

			try {
				cssTreeValueNode = parse(value, { context: 'value', positions: true });

				if (containsUnsupportedFunction(cssTreeValueNode)) return;
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

			// Check if value contains math functions that need validation
			const mathFuncResult = validateMathFunctions(
				value,
				prop,
				forkedLexer,
				typedCustomPropertyNames,
			);

			if (mathFuncResult === 'skip') return;

			if (mathFuncResult === 'invalid') {
				const valueIndex = declarationValueIndex(decl);

				// Find the calc expression for better error reporting
				const { expression, startIndex } = findMathExpression(value);

				report({
					message: messages.rejectedMath,
					messageArgs: [prop, expression],
					node: decl,
					index: valueIndex + startIndex,
					endIndex: valueIndex + startIndex + expression.length,
					result,
					ruleName,
				});

				return;
			}

			const { error } = forkedLexer.matchProperty(
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
 * @param {import('css-tree').CssNode} cssTreeNode
 * @returns {boolean}
 */
function containsUnsupportedFunction(cssTreeNode) {
	return Boolean(
		find(
			cssTreeNode,
			(node) => node.type === 'Function' && UNSUPPORTED_FUNCTIONS.has(node.name.toLowerCase()),
		),
	);
}

/**
 * Find the first math expression in a value and return its text and position
 * @param {string} value
 * @returns {{expression: string, startIndex: number}}
 */
function findMathExpression(value) {
	const tokens = tokenize({ css: value });
	const nodes = parseListOfComponentValues(tokens, {});

	/**
	 * @param {import('@csstools/css-parser-algorithms').ComponentValue} node
	 * @returns {{expression: string, startIndex: number} | null}
	 */
	const findInNode = (node) => {
		if (isFunctionNode(node)) {
			const name = node.getName().toLowerCase();

			if (mathFunctions.has(name)) {
				const allTokens = node.tokens();

				if (allTokens.length === 0) return null;

				const firstToken = allTokens[0];
				const lastToken = allTokens[allTokens.length - 1];

				if (!firstToken || !lastToken) return null;

				const startOffset = firstToken[2];
				// Token structure: [type, value, startOffset, endOffset]
				// endOffset is exclusive, so we use it directly for slice
				const endOffset = lastToken[3];
				const expression = value.slice(startOffset, endOffset + 1);

				return { expression, startIndex: startOffset };
			}

			for (const child of node.value) {
				const result = findInNode(child);

				if (result) return result;
			}
		}

		return null;
	};

	for (const node of nodes) {
		const result = findInNode(node);

		if (result) return result;
	}

	return { expression: value, startIndex: 0 };
}

/**
 * Check if a value contains any math functions
 * @param {string} value
 * @returns {boolean}
 */
function containsMathFunction(value) {
	if (!HAS_MATH_FUNCTION.test(value)) return false;

	const tokens = tokenize({ css: value });
	const nodes = parseListOfComponentValues(tokens, {});

	/**
	 * @param {import('@csstools/css-parser-algorithms').ComponentValue} node
	 * @returns {boolean}
	 */
	const checkNode = (node) => {
		if (isFunctionNode(node)) {
			const name = node.getName().toLowerCase();

			if (mathFunctions.has(name)) {
				return true;
			}

			return node.value.some(checkNode);
		}

		return false;
	};

	return nodes.some(checkNode);
}

/**
 * Validate math functions (calc, min, max, clamp, etc.) in a CSS value.
 * Uses @csstools/css-calc to solve expressions and validate the result.
 *
 * @param {string} value - The CSS property value
 * @param {string} prop - The property name
 * @param {ReturnType<import('css-tree')['fork']>['lexer']} forkedLexer - The csstree lexer
 * @param {Map<string, string>} typedCustomPropertyNames - Map of typed custom property names
 * @returns {'skip' | 'invalid' | 'continue'} - The validation result
 */
function validateMathFunctions(value, prop, forkedLexer, typedCustomPropertyNames) {
	// If the value doesn't contain any math functions, continue with normal validation
	if (!containsMathFunction(value)) {
		return 'continue';
	}

	// Skip validation if the value contains var() as we can't determine the type
	if (/\bvar\s*\(/i.test(value)) {
		return 'skip';
	}

	// Try to solve the math expression
	const solvedValue = calc(value);

	// If the expression was fully solved (no more math functions),
	// validate the result with csstree
	if (!containsMathFunction(solvedValue)) {
		try {
			const solvedCssTreeNode = parse(solvedValue, { context: 'value', positions: true });

			const { error } = forkedLexer.matchProperty(
				typedCustomPropertyNames.get(prop) ?? prop,
				solvedCssTreeNode,
			);

			// If the solved value is valid, skip further validation
			if (!error) {
				return 'skip';
			}

			// If the solved value is invalid, it means the calc result type doesn't match the property
			// e.g., calc(2) for height: results in a number "2", but height expects a length
			if (
				'mismatchLength' in error &&
				error.name === 'SyntaxMatchError' &&
				error.rawMessage === 'Mismatch'
			) {
				return 'invalid';
			}
		} catch {
			// If parsing fails, continue with normal validation
		}

		return 'continue';
	}

	// If the expression couldn't be fully solved, check if it's an invalid type mix
	// The css-calc package returns the original expression when:
	// 1. There's a type mismatch (e.g., 1px + 1) - INVALID
	// 2. Types can't be computed at parse time (e.g., 100% - 10px) - VALID
	//
	// We can detect case 1 by checking if the expression contains a number + dimension
	// pattern in addition/subtraction operations
	if (hasInvalidTypeMix(value)) {
		return 'invalid';
	}

	// For other cases where calc can't be solved (like 100% - 10px),
	// skip validation and let csstree handle it (csstree allows these)
	return 'skip';
}

/**
 * Check if a calc expression has an invalid type mix.
 * This detects patterns like "calc(1px + 1)" or "calc(2 - 3em)"
 * where a unitless number is being added to or subtracted from a dimension.
 *
 * @param {string} value - The CSS value containing calc expression
 * @returns {boolean} - True if invalid type mix is detected
 */
function hasInvalidTypeMix(value) {
	const tokens = tokenize({ css: value });
	const nodes = parseListOfComponentValues(tokens, {});

	/**
	 * Check a function node for invalid type mixes
	 * @param {import('@csstools/css-parser-algorithms').FunctionNode} funcNode
	 * @returns {boolean}
	 */
	const checkFunctionForTypeMix = (funcNode) => {
		const funcName = funcNode.getName().toLowerCase();

		if (!mathFunctions.has(funcName)) {
			return false;
		}

		// Get the operands and operators at the top level of this function
		const children = funcNode.value;

		/** @type {Array<'number' | 'dimension' | 'percentage' | 'other'>} */
		const operands = [];
		/** @type {Array<string>} */
		const operators = [];

		for (const child of children) {
			if (isTokenNode(child)) {
				const token = child.value;

				if (isTokenNumber(token)) {
					operands.push('number');
				} else if (isTokenDimension(token)) {
					operands.push('dimension');
				} else if (isTokenPercentage(token)) {
					operands.push('percentage');
				} else if (isTokenDelim(token)) {
					const op = token[4].value;

					if (op === '+' || op === '-') {
						operators.push(op);
					}
				}
			} else if (isFunctionNode(child)) {
				// Recursively check nested functions
				if (checkFunctionForTypeMix(child)) {
					return true;
				}

				// Nested function results contribute to operands
				operands.push('other');
			}
		}

		// Check for invalid patterns: number +/- dimension or dimension +/- number
		// This is a simplified check - we look for the pattern where we have both
		// a pure number and a dimension/percentage, connected by + or -
		if (operators.length > 0) {
			const hasNumber = operands.includes('number');
			const hasDimensionOrPercentage =
				operands.includes('dimension') || operands.includes('percentage');

			if (hasNumber && hasDimensionOrPercentage) {
				// Found a mix of numbers and dimensions/percentages with +/- operators
				return true;
			}
		}

		return false;
	};

	return nodes.some((node) => isFunctionNode(node) && checkFunctionForTypeMix(node));
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
