'use strict';

const selectorParser = require('postcss-selector-parser');

/**
 * @param {string} selector
 * @param {import('stylelint').PostcssResult} result
 * @param {import('postcss').Node} node
 * @param {(root: import('postcss-selector-parser').Root) => void} callback
 * @returns {string | undefined}
 */
module.exports = function parseSelector(selector, result, node, callback) {
	try {
		return selectorParser(callback).processSync(selector);
	} catch (err) {
		result.warn(`Cannot parse selector (${err})`, { node, stylelintType: 'parseError' });

		return undefined;
	}
};
