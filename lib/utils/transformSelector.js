/* @flow */
'use strict';

const selectorParser = require('postcss-selector-parser');

/**
 * @param {import('stylelint').PostcssResult} result
 * @param {import('postcss').Node} node
 * @param {Function} cb
 */
module.exports = function(result /*: Object*/, node /*: Object*/, cb /*: Function*/) {
	try {
		// @ts-ignore
		return selectorParser(cb).processSync(node, { updateSelector: true });
	} catch (e) {
		result.warn('Cannot parse selector', { node, stylelintType: 'parseError' });
	}
};
