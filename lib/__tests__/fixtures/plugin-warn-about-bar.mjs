'use strict';

import stylelint from '../../index.mjs';

const ruleName = 'plugin/warn-about-bar';

const warnAboutBarMessages = stylelint.utils.ruleMessages('plugin/warn-about-bar', {
	found: 'found .bar',
});

export default stylelint.createPlugin(ruleName, (expectation) => {
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
