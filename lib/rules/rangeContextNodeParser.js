'use strict';

const valueParser = require('postcss-value-parser');

const { assert } = require('../utils/validateTypes');

const rangeOperators = new Set(['>=', '<=', '>', '<', '=']);

/**
 * @param {string} name
 * @returns {boolean}
 */
function isRangeContextName(name) {
	// When the node is like "(width > 10em)" or "(10em < width)"
	// Regex is needed because the name can either be in the first or second position
	return /^(?!--)\D/.test(name) || /^--./.test(name);
}

/**
 * @typedef {{ value: string, sourceIndex: number }} RangeContextNode
 *
 * @param {import('postcss-media-query-parser').Node} node
 * @returns {{ name: RangeContextNode, values: RangeContextNode[] }}
 */
module.exports = function rangeContextNodeParser(node) {
	/** @type {import('postcss-value-parser').WordNode | undefined} */
	let nameNode;

	/** @type {import('postcss-value-parser').WordNode[]} */
	const valueNodes = [];

	valueParser(node.value).walk((valueNode) => {
		if (valueNode.type !== 'word') return;

		if (rangeOperators.has(valueNode.value)) return;

		if (nameNode == null && isRangeContextName(valueNode.value)) {
			nameNode = valueNode;

			return;
		}

		valueNodes.push(valueNode);
	});

	assert(nameNode);

	return {
		name: {
			value: nameNode.value,
			sourceIndex: node.sourceIndex + nameNode.sourceIndex,
		},

		values: valueNodes.map((valueNode) => ({
			value: valueNode.value,
			sourceIndex: node.sourceIndex + valueNode.sourceIndex,
		})),
	};
};
