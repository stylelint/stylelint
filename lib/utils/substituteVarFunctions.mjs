import { TokenType, isTokenEOF, isTokenIdent, tokenize } from '@csstools/css-tokenizer';
import {
	isFunctionNode,
	isTokenNode,
	isWhiteSpaceOrCommentNode,
	parseListOfComponentValues,
	sourceIndices,
	walk,
} from '@csstools/css-parser-algorithms';

import { basicKeywords } from '../reference/keywords.mjs';
import getOrInsertComputed from './getOrInsertComputed.mjs';
import isCustomProperty from './isCustomProperty.mjs';

/** @import { ComponentValue, FunctionNode, TokenNode } from '@csstools/css-parser-algorithms' */
/** @import { CSSToken, TokenIdent } from '@csstools/css-tokenizer' */

/**
 * @typedef {object} VarFunctionSubstitution
 * @property {number} start - the index of the `var()` in the value
 * @property {number} end - the index after the `var()`
 * @property {string} name - the custom property substituted
 * @property {string} value - the substituted text, with its own `var()`s substituted
 * @property {CSSToken[]} tokens - the substituted tokens
 *
 * @typedef {object} SubstitutedValue
 * @property {CSSToken[]} tokens - the value's tokens, with substituted ones at the `var()`'s source indices
 * @property {VarFunctionSubstitution[]} substitutions
 */

/** The most combinations for a value, or for a custom property within it */
const MAX_SUBSTITUTED_VALUES = 1000;

/**
 * Memo per map of custom property values.
 *
 * @type {WeakMap<Map<string, string[]>, Map<string, SubstitutedValue[]>>}
 */
const substitutedValuesByCustomPropertyValues = new WeakMap();

/**
 * Substitute the values of custom properties for the `var()`s in a value, one result per
 * combination, in the order the values are given.
 *
 * @param {string} value
 * @param {Map<string, string[]>} customPropertyValues
 * @returns {SubstitutedValue[]}
 */
export default function substituteVarFunctions(value, customPropertyValues) {
	return substituteVarFunctionsRecursive(value, customPropertyValues, []);
}

/**
 * Get the text of a value, or a range of it, with its `var()`s substituted
 *
 * @param {string} value
 * @param {VarFunctionSubstitution[]} substitutions - those within the range
 * @param {number} [start]
 * @param {number} [end]
 * @returns {string}
 */
export function getSubstitutedValue(value, substitutions, start = 0, end = value.length) {
	let substitutedValue = '';
	let index = start;

	for (const substitution of substitutions) {
		substitutedValue += value.slice(index, substitution.start) + substitution.value;
		index = substitution.end;
	}

	return substitutedValue + value.slice(index, end);
}

/**
 * @param {string} value
 * @param {Map<string, string[]>} customPropertyValues
 * @param {string[]} substitutingNames - the custom properties up the chain
 * @returns {SubstitutedValue[]}
 */
function substituteVarFunctionsRecursive(value, customPropertyValues, substitutingNames) {
	let substitutedValuesByValue = substitutedValuesByCustomPropertyValues.get(customPropertyValues);

	if (!substitutedValuesByValue) {
		substitutedValuesByValue = new Map();
		substitutedValuesByCustomPropertyValues.set(customPropertyValues, substitutedValuesByValue);
	}

	return getOrInsertComputed(substitutedValuesByValue, value, () => {
		const tokens = tokenize({ css: value }).filter((token) => !isTokenEOF(token));
		const substitutionsOfVarFunctions = findVarFunctions(parseListOfComponentValues(tokens)).map(
			(varFunction) => substituteVarFunction(varFunction, customPropertyValues, substitutingNames),
		);
		const combinationCount = substitutionsOfVarFunctions.reduce(
			(count, substitutions) => count * substitutions.length,
			1,
		);

		if (combinationCount > MAX_SUBSTITUTED_VALUES) return [];

		return getCombinations(substitutionsOfVarFunctions).map((substitutions) => ({
			tokens: spliceTokens(tokens, substitutions),
			substitutions,
		}));
	});
}

/**
 * @param {FunctionNode} varFunction
 * @param {Map<string, string[]>} customPropertyValues
 * @param {string[]} substitutingNames
 * @returns {VarFunctionSubstitution[]} none when the `var()` can't be substituted
 */
function substituteVarFunction(varFunction, customPropertyValues, substitutingNames) {
	const name = getCustomPropertyName(varFunction);

	if (!name) return [];

	const [start, end] = sourceIndices(varFunction);

	/** @type {VarFunctionSubstitution[]} */
	const substitutions = [];

	for (const value of getSubstitutableValues(name, customPropertyValues, substitutingNames)) {
		const substitutedValues = substituteVarFunctionsRecursive(value, customPropertyValues, [
			...substitutingNames,
			name,
		]);

		if (substitutedValues.length === 0) return [];

		for (const { tokens, substitutions: nestedSubstitutions } of substitutedValues) {
			substitutions.push({
				start,
				end: end + 1,
				name,
				value: getSubstitutedValue(value, nestedSubstitutions),
				tokens,
			});
		}
	}

	return substitutions;
}

/**
 * @param {string} name
 * @param {Map<string, string[]>} customPropertyValues
 * @param {string[]} substitutingNames
 * @returns {string[]} none when the custom property can't be substituted
 */
function getSubstitutableValues(name, customPropertyValues, substitutingNames) {
	if (substitutingNames.includes(name)) return [];

	const values = customPropertyValues.get(name) ?? [];

	if (values.some(isCssWideKeyword)) return [];

	return values;
}

/**
 * One item from each list, in every combination
 *
 * @template T
 * @param {T[][]} lists
 * @returns {T[][]}
 */
function getCombinations(lists) {
	return lists.reduce(
		(combinations, list) =>
			combinations.flatMap((combination) => list.map((item) => [...combination, item])),
		/** @type {T[][]} */ ([[]]),
	);
}

/**
 * The `var()`s, not looking within their arguments so fallbacks are ignored
 *
 * @param {ComponentValue[]} componentValues
 * @returns {FunctionNode[]}
 */
function findVarFunctions(componentValues) {
	/** @type {FunctionNode[]} */
	const varFunctions = [];

	walk(
		componentValues,
		({ node, state }) => {
			if (!state || state.isWithinVarFunction || !isVarFunctionNode(node)) return;

			varFunctions.push(node);
			state.isWithinVarFunction = true;
		},
		{ isWithinVarFunction: false },
	);

	return varFunctions;
}

/**
 * Replace each `var()`'s tokens with its substituted tokens, at the `var()`'s source indices
 *
 * @param {CSSToken[]} tokens
 * @param {VarFunctionSubstitution[]} substitutions
 * @returns {CSSToken[]}
 */
function spliceTokens(tokens, substitutions) {
	return tokens.flatMap((token) => {
		const substitution = substitutions.find((varFunction) =>
			isWithinVarFunction(token, varFunction),
		);

		if (!substitution) return [token];

		// The var()'s other tokens are replaced along with its first
		if (token[2] !== substitution.start) return [];

		const { start, end } = substitution;
		// Keep the substituted tokens from merging with their neighbours when stringified, e.g. `var(--foo)px`
		/** @type {CSSToken} */
		const whitespace = [TokenType.Whitespace, ' ', start, end - 1, undefined];

		return [
			whitespace,
			...substitution.tokens.map((substitutedToken) =>
				withSourceIndices(substitutedToken, start, end),
			),
			whitespace,
		];
	});
}

/**
 * @param {CSSToken} token
 * @param {number} start
 * @param {number} end
 * @returns {CSSToken}
 */
function withSourceIndices(token, start, end) {
	return /** @type {CSSToken} */ ([token[0], token[1], start, end - 1, token[4]]);
}

/**
 * @param {FunctionNode} varFunction
 * @returns {string | undefined}
 */
function getCustomPropertyName(varFunction) {
	const firstNode = varFunction.value.find((node) => !isWhiteSpaceOrCommentNode(node));

	if (!isIdentNode(firstNode)) return undefined;

	const name = firstNode.value[4].value;

	return isCustomProperty(name) ? name : undefined;
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isCssWideKeyword(value) {
	return basicKeywords.has(value.trim().toLowerCase());
}

/**
 * @param {ComponentValue} node
 * @returns {node is FunctionNode}
 */
function isVarFunctionNode(node) {
	return isFunctionNode(node) && node.getName().toLowerCase() === 'var';
}

/**
 * @param {ComponentValue | undefined} node
 * @returns {node is TokenNode & { value: TokenIdent }}
 */
function isIdentNode(node) {
	return isTokenNode(node) && isTokenIdent(node.value);
}

/**
 * @param {CSSToken} token
 * @param {{ start: number, end: number }} varFunction
 * @returns {boolean}
 */
function isWithinVarFunction(token, { start, end }) {
	return start <= token[2] && token[2] < end;
}
