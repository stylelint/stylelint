'use strict';

/**
 * @type {import('stylelint').default['createPlugin']}
 */
module.exports = function createPlugin(ruleName, rule) {
	return {
		ruleName,
		rule,
	};
};
