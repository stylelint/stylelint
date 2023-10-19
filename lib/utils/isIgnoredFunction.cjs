'use strict';

const IGNORED_FUNCTIONS = new Set(['url']);

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean}
 */
function isIgnoredFunction({ type, value }) {
	return type === 'function' && IGNORED_FUNCTIONS.has(value.toLowerCase());
}

module.exports = isIgnoredFunction;
