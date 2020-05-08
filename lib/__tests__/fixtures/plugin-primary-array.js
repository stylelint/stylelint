'use strict';

const stylelint = require('../..');

const ruleName = 'plugin/primary-array';

function rule(primary) {
	return (root, result) => {
		if (!Array.isArray(primary)) {
			stylelint.utils.report({
				result,
				ruleName,
				message: 'Gimme array',
				node: root,
			});
		}
	};
}

rule.primaryOptionArray = true;

module.exports = stylelint.createPlugin(ruleName, rule);
