'use strict';

const hasBlock = require('../utils/hasBlock');

/**
 * Check whether a Node is a custom property set
 *
 * @param {import('postcss').Rule} node
 * @returns {boolean}
 */
module.exports = function (node) {
	// Casting this to any because 'selector' does not exist on type 'NodeRaws'
	/** @type {any} */
	const raws = node.raws;

	const selector = (raws.selector && raws.selector.raw) || node.selector;

	return (
		node.type === 'rule' && hasBlock(node) && selector.startsWith('--') && selector.endsWith(':')
	);
};
