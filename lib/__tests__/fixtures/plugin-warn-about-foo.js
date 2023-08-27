'use strict';

const stylelint = require('stylelint');

const ruleName = 'plugin/warn-about-foo';

const warnAboutFooMessages = stylelint.utils.ruleMessages(ruleName, {
	found: 'found .foo',
});

const meta = {
	url: 'https://github.com/stylelint/stylelint-foo-plugin/warn-about-foo',
};

const warnAboutFoo = (expectation) => {
	return (root, result) => {
		root.walkRules((rule) => {
			if (rule.selector === '.foo' && expectation === 'always') {
				stylelint.utils.report({
					result,
					ruleName,
					message: warnAboutFooMessages.found,
					node: rule,
				});
			}
		});
	};
};

warnAboutFoo.ruleName = ruleName;
warnAboutFoo.messages = warnAboutFooMessages;
warnAboutFoo.meta = meta;

module.exports = stylelint.createPlugin(ruleName, warnAboutFoo);
