import { TokenType, stringify as stringifyTokens, tokenize } from '@csstools/css-tokenizer';
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
import substituteVarFunctions, {
	getSubstitutedValue,
} from '../../utils/substituteVarFunctions.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getCustomPropertyValues from '../../utils/getCustomPropertyValues.mjs';
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
	rejected: (property, value, /** @type {string[]} */ varFunctions) =>
		`Unknown value "${value}" for property "${property}"${varFunctions.length > 0 ? `, via "${varFunctions.join(', ')}"` : ''}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown',
};

const SYNTAX_DESCRIPTOR = /^syntax$/i;

const FUNCTIONS_UNKNOWN_TO_CSSTREE = new Set([
	'container-progress',
	'env',
	'media-progress',
	'progress',
	'random',
	'sibling-count',
	'sibling-index',
]);

/**
 * Any cache keys let css-calc solve `random()`, whose result only matters for its type
 * see the `randomCaching` option of `@csstools/css-calc`
 */
const randomCaching = { propertyName: '', propertyN: 0, elementID: '', documentID: '' };

/** @type {WeakMap<object, Set<string>>} */
const validMatchesCacheByLexer = new WeakMap();
const MAX_CACHE_SIZE = 10000;

/** @import { CssNode, Lexer } from 'css-tree' */
/** @import { VarFunctionSubstitution } from '../../utils/substituteVarFunctions.mjs' */

/** @typedef {import('stylelint').CoreRules[typeof ruleName]} Rule */
/** @typedef {[startOffset: number, endOffset: number]} OffsetRange */
/** @typedef {{ range: OffsetRange, substitutions: VarFunctionSubstitution[] }} SubstitutedMismatch */

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

		const roots = [...result.stylelint.referenceRoots, root];

		for (const rootNode of roots) {
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

		/**
		 * @param {string} prop
		 * @param {string} value
		 * @returns {OffsetRange | undefined}
		 */
		const findCachedMismatch = (prop, value) => {
			const cacheKey = isCustomProperty(prop) ? null : `${prop}:${value}`;

			if (cacheKey && validMatchesCache.has(cacheKey)) return undefined;

			const mismatch = findMismatch(value, typedCustomPropertyNames.get(prop) ?? prop, lexer);

			if (!mismatch && cacheKey && validMatchesCache.size < MAX_CACHE_SIZE) {
				validMatchesCache.add(cacheKey);
			}

			return mismatch;
		};

		/** @type {Map<string, string[]> | undefined} */
		let customPropertyValues;

		/**
		 * The mismatch of a value with `var()`s, if every combination of their values mismatches
		 *
		 * @param {string} prop
		 * @param {string} value
		 * @returns {SubstitutedMismatch | undefined}
		 */
		const findSubstitutedMismatch = (prop, value) => {
			customPropertyValues ??= getDeclaredValues(roots);

			const substitutedValues = substituteVarFunctions(value, customPropertyValues);

			/** @type {SubstitutedMismatch | undefined} */
			let firstMismatch;

			for (const { tokens, substitutions } of substitutedValues) {
				if (isPropIgnored(prop, getSubstitutedValue(value, substitutions))) return undefined;

				const mismatch = findCachedMismatch(prop, stringifyTokens(...tokens));

				if (!mismatch) return undefined;

				// The last declared value is substituted first, so its mismatch is reported
				firstMismatch ??= {
					range: getSourceRange(tokens, mismatch) ?? [0, value.length],
					substitutions,
				};
			}

			return firstMismatch;
		};

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

			/**
			 * Report the enclosing function, if any, rather than the mismatched fragment within it
			 *
			 * @param {OffsetRange} range
			 * @param {VarFunctionSubstitution[]} [substitutions]
			 */
			const complain = ([startOffset, endOffset], substitutions = []) => {
				const cssTreeValueNode = parseValue(value);
				const functionNode =
					cssTreeValueNode && findEnclosingFunction(cssTreeValueNode, startOffset, endOffset);
				const start = functionNode?.loc?.start.offset ?? startOffset;
				const end = functionNode?.loc?.end.offset ?? endOffset;
				const valueIndex = declarationValueIndex(decl);
				const substitutionsInRange = substitutions.filter((substitution) =>
					isWithinRange(substitution, start, end),
				);
				const unknownValue = getSubstitutedValue(value, substitutionsInRange, start, end);
				const varFunctions = substitutionsInRange.map((substitution) =>
					value.slice(substitution.start, substitution.end),
				);

				report({
					message: messages.rejected,
					messageArgs: [prop, unknownValue, varFunctions],
					node: decl,
					index: valueIndex + start,
					endIndex: valueIndex + end,
					result,
					ruleName,
				});
			};

			if (mayIncludeRegexes.varFunction.test(value)) {
				const mismatch = findSubstitutedMismatch(prop, value);

				if (mismatch) complain(mismatch.range, mismatch.substitutions);

				return;
			}

			const mismatch = findCachedMismatch(prop, value);

			if (mismatch) complain(mismatch);
		});
	};
};

/**
 * @param {string} value
 * @param {string} property - the name the lexer knows the property by
 * @param {Lexer} lexer
 * @returns {OffsetRange | undefined}
 */
function findMismatch(value, property, lexer) {
	const mathFuncResult = validateMathFunctions(value, property, lexer);

	if (mathFuncResult === 'valid' || mathFuncResult === 'skip-validation') return undefined;

	const cssTreeValueNode = parseValue(value);

	if (!cssTreeValueNode) return undefined;

	// The remaining result is the range of an invalid math expression
	if (mathFuncResult !== 'undetermined') return mathFuncResult;

	if (containsFunctionsUnknownToCSSTree(cssTreeValueNode)) return undefined;

	const { error } = lexer.matchProperty(property, cssTreeValueNode);

	if (!isMismatchError(error)) return undefined;

	return [error.loc.start.offset, error.loc.end.offset];
}

/**
 * csstree's generic numeric types accept a fixed list of function names,
 * so its lexer mismatches these functions for every property
 * see https://github.com/csstree/csstree/issues/245
 *
 * @param {CssNode} cssTreeNode
 * @returns {boolean}
 */
function containsFunctionsUnknownToCSSTree(cssTreeNode) {
	return Boolean(
		find(
			cssTreeNode,
			(node) =>
				node.type === 'Function' && FUNCTIONS_UNKNOWN_TO_CSSTREE.has(node.name.toLowerCase()),
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
 * @param {string} property - The name the lexer knows the property by
 * @param {Lexer} lexer - The csstree lexer
 * @returns {'undetermined' | 'valid' | 'skip-validation' | OffsetRange} - The validation result, or the range of the invalid expression
 */
function validateMathFunctions(value, property, lexer) {
	// If the value doesn't contain any math functions, continue with normal validation
	if (!mayIncludeRegexes.mathFunction.test(value)) return 'undetermined';

	const nodes = parseListOfComponentValues(tokenize({ css: value }), {});

	if (containsCalcSizeWithSizeKeyword(nodes)) {
		return 'skip-validation';
	}

	// Try to solve the math expression
	const solvedNodes = calcFromComponentValues([nodes], { randomCaching });

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

		if (containsFunctionsUnknownToCSSTree(solvedCssTreeNode)) {
			return 'skip-validation';
		}

		const { error } = lexer.matchProperty(property, solvedCssTreeNode);

		// If the solved value is valid, skip further validation
		if (!error) return 'valid';

		// If the solved value is invalid, it means the calc result type doesn't match the property
		// e.g., calc(2) for height: results in a number "2", but height expects a length
		if (isMismatchError(error)) {
			// Lookup the original source position of the invalid expression
			// by finding the tokens that correspond to the positions reported by csstree
			const solvedTokens = solvedNodes.flatMap((componentValues) =>
				componentValues.flatMap((node) => node.tokens()),
			);

			const range = getSourceRange(solvedTokens, [error.loc.start.offset, error.loc.end.offset]);

			return range ?? [0, value.length];
		}
	} catch {
		// If parsing fails, continue with normal validation
		return 'undetermined';
	}

	return 'undetermined';
}

/**
 * Map a range of the stringified tokens back to the source
 *
 * @param {import('@csstools/css-tokenizer').CSSToken[]} tokens
 * @param {OffsetRange} range
 * @returns {OffsetRange | undefined} `undefined` when the range doesn't start and end at tokens
 */
function getSourceRange(tokens, [startOffset, endOffset]) {
	let counter = 0;
	let startToken;
	let endToken;

	for (const token of tokens) {
		if (startOffset === counter) {
			startToken = token;
		}

		counter += token[1].length;

		if (endOffset === counter) {
			endToken = token;
		}
	}

	if (!startToken || !endToken) return undefined;

	return [startToken[2], endToken[3] + 1];
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

/**
 * The declared values of each custom property, last declared first
 *
 * @param {import('postcss').Root[]} roots
 * @returns {Map<string, string[]>}
 */
function getDeclaredValues(roots) {
	return new Map(
		[...getCustomPropertyValues(roots)].flatMap(([name, values]) => {
			const uniqueValues = [...new Set(values.toReversed())];

			return uniqueValues.every(isSubstitutableValue) ? [[name, uniqueValues]] : [];
		}),
	);
}

/**
 * Empty values are hooks for overriding, and non-standard values can't be matched
 *
 * @param {string} value
 * @returns {boolean}
 */
function isSubstitutableValue(value) {
	const trimmedValue = value.trim();

	return trimmedValue !== '' && isStandardSyntaxValue(trimmedValue);
}

/**
 * @param {VarFunctionSubstitution} substitution
 * @param {number} start
 * @param {number} end
 * @returns {boolean}
 */
function isWithinRange(substitution, start, end) {
	return start <= substitution.start && substitution.end <= end;
}

/**
 * @param {import('css-tree').LexerMatchResult['error']} error
 * @returns {error is import('css-tree').SyntaxMatchError}
 */
function isMismatchError(error) {
	return (
		error !== null &&
		'mismatchLength' in error &&
		error.name === 'SyntaxMatchError' &&
		error.rawMessage === 'Mismatch'
	);
}

/**
 * @param {string} value
 * @returns {CssNode | undefined}
 */
function parseValue(value) {
	try {
		return parse(value, { context: 'value', positions: true });
	} catch (error) {
		if (error instanceof SyntaxError) return undefined;

		throw error;
	}
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
