'use strict';

const valueParser = require('postcss-value-parser');
const keywords = require('../reference/keywords.cjs');
const getDimension = require('./getDimension.cjs');
const isStandardSyntaxValue = require('./isStandardSyntaxValue.cjs');
const isVariable = require('./isVariable.cjs');

/** @typedef {import('postcss-value-parser').Node} Node */

/**
 * Get the animation name within an `animation` shorthand property value.
 *
 * @param {string} value
 *
 * @returns {Node[]}
 */
function findAnimationName(value) {
	/** @type {Node[]} */
	const animationNames = [];

	const valueNodes = valueParser(value);
	const { nodes } = valueNodes;

	// Handle `inherit`, `initial` and etc
	if (nodes.length === 1 && nodes[0] && keywords.basicKeywords.has(nodes[0].value.toLowerCase())) {
		return [nodes[0]];
	}

	let shouldBeIgnored = false;

	valueNodes.walk((valueNode) => {
		if (shouldBeIgnored) return;

		if (valueNode.type === 'function') {
			return false;
		}

		if (valueNode.type !== 'word') {
			return;
		}

		const valueLowerCase = valueNode.value.toLowerCase();

		// Ignore non-standard syntax
		if (!isStandardSyntaxValue(valueLowerCase)) {
			// Cannot find animation name if shorthand has non-standard syntax value (#5532)
			shouldBeIgnored = true;
			animationNames.length = 0; // clears animationNames

			return;
		}

		// Ignore variables
		if (isVariable(valueLowerCase)) {
			return;
		}

		// Ignore keywords for other animation parts
		if (keywords.animationShorthandKeywords.has(valueLowerCase)) {
			return;
		}

		// Ignore numbers with units
		const { unit } = getDimension(valueNode);

		if (unit || unit === '') {
			return;
		}

		animationNames.push(valueNode);
	});

	return animationNames;
}

module.exports = findAnimationName;