'use strict';

const stylelint = require('../../index.cjs');

const ruleName = 'plugin/warn-about-bar';

const warnAboutBarMessages = stylelint.utils.ruleMessages('plugin/warn-about-bar', {
	found: 'found .bar',
});

module.exports = stylelint.createPlugin(ruleName, (expectation) => {
	return (root, result) => {
		root.walkRules((rule) => {
			if (rule.selector === '.bar' && expectation === 'always') {
				stylelint.utils.report({
					result,
					ruleName,
					message: warnAboutBarMessages.found,
					node: rule,
				});
			}
		});
	};
});
