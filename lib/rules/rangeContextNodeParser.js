'use strict';

const styleSearch = require('style-search');

const rangeOperators = ['>=', '<=', '>', '<', '='];

/**
 * @param {import('postcss-media-query-parser').Node} node
 */
function getRangeContextOperators(node) {
	/** @type {string[]} */
	const operators = [];

	const source = node.value;

	styleSearch({ source, target: rangeOperators }, (match) => {
		const before = source[match.startIndex - 1];

		if (before === '>' || before === '<') {
			return;
		}

		operators.push(match.target);
	});

	// Sorting helps when using the operators to split
	// E.g. for "(10em < width <= 50em)" this returns ["<=", "<"]
	return operators.sort((a, b) => b.length - a.length);
}

/**
 * @param {string[]} parsedNode
 */
function getRangeContextName(parsedNode) {
	// When the node is like "(10em < width < 50em)"
	// The parsedNode is ["10em", "width", "50em"] - the name is always in the second position
	if (parsedNode.length === 3) {
		return parsedNode[1];
	}

	// When the node is like "(width > 10em)" or "(10em < width)"
	// Regex is needed because the name can either be in the first or second position
	return parsedNode.find((value) => value.match(/^(?!--)\D+/) || value.match(/^(--).+/));
}

/**
 * @param {import('postcss-media-query-parser').Node} node
 * @returns {{ name: { value: string, sourceIndex: number }, values: Array<{ value: string, sourceIndex: number }> }}
 */
module.exports = function rangeContextNodeParser(node) {
	const nodeValue = node.value;

	const operators = getRangeContextOperators(node);

	// Remove spaces and parentheses and split by the operators
	const parsedMedia = nodeValue.replace(/[()\s]/g, '').split(new RegExp(operators.join('|')));

	const name = getRangeContextName(parsedMedia);

	if (name == null) throw new Error('The context name must be present');

	const nameObj = {
		value: name,
		sourceIndex: node.sourceIndex + nodeValue.indexOf(name),
	};

	const values = parsedMedia
		.filter((parsedValue) => parsedValue !== name)
		.map((value) => {
			return {
				value,
				sourceIndex: node.sourceIndex + nodeValue.indexOf(value),
			};
		});

	return {
		name: nameObj,
		values,
	};
};
