'use strict';

import stylelint from '../../index.mjs';

const ruleName = 'slashless-warn-about-foo';

const warnAboutFooMessages = stylelint.utils.ruleMessages('slashless-warn-about-foo', {
	found: 'found .foo',
});

export default stylelint.createPlugin(ruleName, (expectation) => {
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
});
