'use strict';

/**
 * @type {import('stylelint')['createPlugin']}
 */
function createPlugin(ruleName, rule) {
	return {
		ruleName,
		rule,
	};
}

module.exports = createPlugin;
