'use strict';

const getUnitFromValueNode = require('./getUnitFromValueNode');
const isStandardSyntaxValue = require('./isStandardSyntaxValue');
const isVariable = require('./isVariable');
const keywordSets = require('../reference/keywordSets');
const postcssValueParser = require('postcss-value-parser');

/** @typedef {import('postcss-value-parser').Node} Node */

/**
 * Get the animation name within an `animation` shorthand property value.
 *
 * @param {string} value
 *
 * @returns {Node[]}
 */
module.exports = function findAnimationName(value) {
	/** @type {Node[]} */
	const animationNames = [];

	const valueNodes = postcssValueParser(value);
	const { nodes } = valueNodes;

	// Handle `inherit`, `initial` and etc
	if (
		nodes.length === 1 &&
		nodes[0] &&
		keywordSets.basicKeywords.has(nodes[0].value.toLowerCase())
	) {
		return [nodes[0]];
	}

	valueNodes.walk((valueNode) => {
		if (valueNode.type === 'function') {
			return false;
		}

		if (valueNode.type !== 'word') {
			return;
		}

		const valueLowerCase = valueNode.value.toLowerCase();

		// Ignore non-standard syntax
		if (!isStandardSyntaxValue(valueLowerCase)) {
			return;
		}

		// Ignore variables
		if (isVariable(valueLowerCase)) {
			return;
		}

		// Ignore keywords for other animation parts
		if (keywordSets.animationShorthandKeywords.has(valueLowerCase)) {
			return;
		}

		// Ignore numbers with units
		const unit = getUnitFromValueNode(valueNode);

		if (unit || unit === '') {
			return;
		}

		animationNames.push(valueNode);
	});

	return animationNames;
};
