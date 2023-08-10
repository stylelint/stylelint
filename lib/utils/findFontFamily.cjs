'use strict';

const valueParser = require('postcss-value-parser');
const keywords = require('../reference/keywords.cjs');
const validateTypes = require('./validateTypes.cjs');
const isNumbery = require('./isNumbery.cjs');
const isStandardSyntaxValue = require('./isStandardSyntaxValue.cjs');
const isValidFontSize = require('./isValidFontSize.cjs');
const isVariable = require('./isVariable.cjs');

const nodeTypesToCheck = new Set(['word', 'string', 'space', 'div']);

/** @typedef {import('postcss-value-parser').Node} Node */

/**
 *
 * @param {Node} firstNode
 * @param {Node} secondNode
 * @param {string | null} charactersBetween
 *
 * @returns {Node}
 */
function joinValueNodes(firstNode, secondNode, charactersBetween) {
	firstNode.value = firstNode.value + charactersBetween + secondNode.value;

	return firstNode;
}

/**
 * Get the font-families within a `font` shorthand property value.
 *
 * @param {string} value
 * @returns {Node[]} Collection font-family nodes
 */
function findFontFamily(value) {
	/** @type {Node[]} */
	const fontFamilies = [];

	const valueNodes = valueParser(value);
	const { nodes: children } = valueNodes;

	// Handle `inherit`, `initial` and etc
	if (children.length === 1 && children[0] && keywords.basicKeywords.has(children[0].value.toLowerCase())) {
		return [children[0]];
	}

	let needMergeNodesByValue = false;
	/** @type {string | null} */
	let mergeCharacters = null;

	valueNodes.walk((valueNode, index, nodes) => {
		if (valueNode.type === 'function') {
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

		// Ignore keywords for other font parts
		if (keywords.fontShorthandKeywords.has(valueLowerCase) && !keywords.fontFamilyKeywords.has(valueLowerCase)) {
			return;
		}

		// Ignore font-sizes
		if (isValidFontSize(valueNode.value)) {
			return;
		}

		const prevNode = nodes[index - 1];
		const prevPrevNode = nodes[index - 2];

		// Ignore anything come after a <font-size>/, because it's a line-height
		if (prevNode && prevNode.value === '/' && prevPrevNode && isValidFontSize(prevPrevNode.value)) {
			return;
		}

		// Ignore number values
		if (isNumbery(valueLowerCase)) {
			return;
		}

		// Detect when a space or comma is dividing a list of font-families, and save the joining character.
		if (
			(valueNode.type === 'space' || (valueNode.type === 'div' && valueNode.value !== ',')) &&
			fontFamilies.length !== 0
		) {
			needMergeNodesByValue = true;
			mergeCharacters = valueNode.value;

			return;
		}

		if (valueNode.type === 'space' || valueNode.type === 'div') {
			return;
		}

		const fontFamily = valueNode;

		if (needMergeNodesByValue) {
			const lastFontFamily = fontFamilies[fontFamilies.length - 1];

			validateTypes.assert(lastFontFamily);
			joinValueNodes(lastFontFamily, fontFamily, mergeCharacters);
			needMergeNodesByValue = false;
			mergeCharacters = null;
		} else {
			fontFamilies.push(fontFamily);
		}
	});

	return fontFamilies;
}

module.exports = findFontFamily;
