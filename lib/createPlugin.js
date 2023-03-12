'use strict';

/**
 * @type {import('stylelint')['createPlugin']}
 */
module.exports = function createPlugin(ruleName, rule) {
	return {
		ruleName,
		rule,
	};
};
