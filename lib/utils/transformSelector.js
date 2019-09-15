/* @flow */
'use strict';

const selectorParser = require('postcss-selector-parser');

module.exports = function(result /*: Object*/, node /*: Object*/, cb /*: Function*/) {
	try {
		return selectorParser(cb).processSync(node, { updateSelector: true });
	} catch (e) {
		result.warn('Cannot parse selector', { node, stylelintType: 'parseError' });
	}
};
