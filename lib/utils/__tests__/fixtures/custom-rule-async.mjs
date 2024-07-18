import stylelint from 'stylelint';

const { createPlugin, utils } = stylelint;

const ruleName = 'custom/rule-async';

const rule = (ruleSettings) => async (root, result) => {
	await utils.checkAgainstRule(
		{
			ruleName: 'media-query-no-invalid',
			ruleSettings,
			root,
			result,
		},
		(warning) => {
			utils.report({
				ruleName,
				result,
				node: warning.node,
				message: warning.text,
			});
		},
	);
};

rule.ruleName = ruleName;

export default createPlugin(ruleName, rule);
