'use strict';

import stylelint from '../../index.mjs';

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

export default stylelint.createPlugin(ruleName, rule);
