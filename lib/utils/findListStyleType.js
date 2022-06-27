'use strict';

const isStandardSyntaxValue = require('./isStandardSyntaxValue');
const isVariable = require('./isVariable');
const {
	listStyleImageKeywords,
	listStylePositionKeywords,
	listStyleTypeKeywords,
} = require('../reference/keywords');
const postcssValueParser = require('postcss-value-parser');

/**
 * Get the list-style-type within a `list-style` shorthand property value.
 *
 * @param {string} value
 */
module.exports = function findListStyleType(value) {
	/** @type {Array<import('postcss-value-parser').WordNode>} */
	const listStyleTypes = [];

	const valueNodes = postcssValueParser(value);
	const { nodes } = valueNodes;

	// Handle `inherit`, `initial` and etc
	if (nodes.length === 1 && nodes[0] && listStyleTypeKeywords.has(nodes[0].value.toLowerCase())) {
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

		// Ignore non standard syntax
		if (!isStandardSyntaxValue(valueLowerCase)) {
			return;
		}

		// Ignore variables
		if (isVariable(valueLowerCase)) {
			return;
		}

		// Ignore keywords for other font parts
		if (
			listStylePositionKeywords.has(valueLowerCase) ||
			listStyleImageKeywords.has(valueLowerCase)
		) {
			return;
		}

		listStyleTypes.push(valueNode);
	});

	return listStyleTypes;
};
