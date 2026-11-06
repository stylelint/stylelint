import postcssValueParser from 'postcss-value-parser';

import {
	basicKeywords,
	fontFamilyKeywords,
	fontShorthandKeywords,
	fontSizeKeywords,
} from '../reference/keywords.mjs';
import { isValueComment, isValueDiv, isValueFunction, isValueSpace } from './typeGuards.mjs';
import isComma from './isComma.mjs';
import isNumbery from './isNumbery.mjs';
import isStandardSyntaxValue from './isStandardSyntaxValue.mjs';
import isValidFontSize from './isValidFontSize.mjs';
import isVariable from './isVariable.mjs';

const nodeTypesToCheck = new Set(['word', 'string', 'space', 'div']);

/** @import { Node } from 'postcss-value-parser' */

/**
 * @param {Node} firstNode
 * @param {Node} secondNode
 * @param {string} charactersBetween
 * @returns {Node}
 */
function joinValueNodes(firstNode, secondNode, charactersBetween) {
	firstNode.value = firstNode.value + charactersBetween + secondNode.value;
	firstNode.sourceEndIndex = secondNode.sourceEndIndex;

	return firstNode;
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function isValueSpaceOrComment(node) {
	return isValueSpace(node) || isValueComment(node);
}

/**
 * Get the font-families within a `font` shorthand property value.
 *
 * @param {string} value
 * @returns {Node[]} Collection font-family nodes
 */
export default function findFontFamily(value) {
	/** @type {Node[]} */
	const fontFamilies = [];

	const valueNodes = postcssValueParser(value);
	const { nodes: children } = valueNodes;

	// Handle `inherit`, `initial` and etc
	if (children.length === 1 && children[0] && basicKeywords.has(children[0].value.toLowerCase())) {
		return [children[0]];
	}

	/** @type {Node | undefined} */
	let lastFontFamily;
	/** @type {string | null} */
	let mergeCharacters = null;

	valueNodes.walk((valueNode, index, nodes) => {
		if (isValueFunction(valueNode)) {
			return false;
		}

		if (!nodeTypesToCheck.has(valueNode.type)) {
			return;
		}

		const valueLowerCase = valueNode.value.toLowerCase();

		// Ignore non standard syntax
		if (!isStandardSyntaxValue(valueLowerCase)) {
			return;
		}

		// Ignore variables
		if (isVariable(valueLowerCase)) {
			return;
		}

		const isFontFamilyKeyword = fontFamilyKeywords.has(valueLowerCase);

		// Ignore keywords for other font parts
		if (!isFontFamilyKeyword && fontShorthandKeywords.has(valueLowerCase)) {
			return;
		}

		// Ignore font-sizes
		// NOTE: `math` is a keyword for both `font-family` and `font-size`.
		if (!isFontFamilyKeyword && isValidFontSize(valueNode.value)) {
			return;
		}

		const nextNode = nodes.slice(index + 1).find((node) => !isValueSpaceOrComment(node));
		const prevNode = nodes[index - 1];
		const prevPrevNode = nodes[index - 2];
		const allPrevNodes = nodes.slice(0, index);

		// When the value is a keyword for both `font-family` and `font-size` (e.g. `math`),
		// if its next node is a comma, or if it is already the last node, or if there is any comma before it,
		// then treat it as a `font-family` keyword, otherwise treat it as a `font-size` keyword.
		if (
			isFontFamilyKeyword &&
			fontSizeKeywords.has(valueLowerCase) &&
			!(!nextNode || isComma(nextNode) || allPrevNodes.find(isComma))
		)
			return;

		// Ignore anything come after a <font-size>/, because it's a line-height
		if (prevNode && prevNode.value === '/' && prevPrevNode && isValidFontSize(prevPrevNode.value)) {
			return;
		}

		// Ignore number values
		if (isNumbery(valueLowerCase)) {
			return;
		}

		if (isComma(valueNode)) {
			lastFontFamily = undefined;
			mergeCharacters = null;

			return;
		}

		// A family name may span several nodes, e.g. `Lucida Grande` or `Red/Black`
		if (isValueSpace(valueNode) || isValueDiv(valueNode)) {
			if (lastFontFamily) mergeCharacters = valueNode.value;

			return;
		}

		if (lastFontFamily && mergeCharacters !== null) {
			joinValueNodes(lastFontFamily, valueNode, mergeCharacters);
			mergeCharacters = null;
		} else {
			lastFontFamily = valueNode;
			fontFamilies.push(valueNode);
		}
	});

	return fontFamilies;
}
