'use strict';

const stylelint = require('../..');

const ruleName = 'slashless-warn-about-foo';

const warnAboutFooMessages = stylelint.utils.ruleMessages('slashless-warn-about-foo', {
	found: 'found .foo',
});

module.exports = stylelint.createPlugin(ruleName, (expectation) => {
	return (root, result) => {
		root.walkRules((rule) => {
			if (rule.selector === '.foo') {
				if (expectation === 'always') {
					stylelint.utils.report({
						result,
						ruleName,
						message: warnAboutFooMessages.found,
						node: rule,
					});
				}
			}
		});
	};
});
