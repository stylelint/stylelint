'use strict';

const selectorParser = require('postcss-selector-parser');

/**
 * @param {string} selector
 * @param {import('stylelint').PostcssResult} result
 * @param {import('postcss').Node} node
 * @param {(root: import('postcss-selector-parser').Root) => void} callback
 */
module.exports = function parseSelector(selector, result, node, callback) {
	try {
		return selectorParser(callback).processSync(selector);
	} catch {
		result.warn('Cannot parse selector', { node, stylelintType: 'parseError' });
	}
};
