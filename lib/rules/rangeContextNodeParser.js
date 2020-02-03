'use strict';

const rangeOperators = ['>=', '<=', '>', '<', '='];
const styleSearch = require('style-search');

function getRangeContextOperators(node) {
	const operators = [];

	styleSearch({ source: node.value, target: rangeOperators }, (match) => {
		const before = node[match.startIndex - 1];

		if (before === '>' || before === '<') {
			return;
		}

		operators.push(match.target);
	});

	// Sorting helps when using the operators to split
	// E.g. for "10em < width <= 50em" this returns ["<=", "<"]
	return operators.sort((a, b) => b.length - a.length);
}

function getRangeContextName(parsedNode) {
	if (parsedNode.length === 3) {
		return parsedNode[1];
	}

	return parsedNode.find((value) => value.match(/^(?!--)\D+/) || value.match(/^(--).+/));
}

module.exports = function(node) {
	const nodeValue = node.value;

	const operators = getRangeContextOperators(node);

	// Remove spaces and parentheses and split by the operators
	const parsedMedia = nodeValue.replace(/[()\s]/g, '').split(new RegExp(operators.join('|')));

	const name = getRangeContextName(parsedMedia);
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
