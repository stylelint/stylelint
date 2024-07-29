import standalone from '../standalone.mjs';

import checkAgainstRule from '../utils/checkAgainstRule.mjs';
import createPlugin from '../createPlugin.mjs';
import report from '../utils/report.mjs';

it('standalone with input css and quiet mode (in config)', async () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': [true, { severity: 'warning' }],
		},
	};

	const { results } = await standalone({ code: 'a {}', config });

	expect(results[0].warnings).toEqual([]);
});

it('standalone with input css and quiet mode (in option)', async () => {
	const config = {
		rules: {
			'block-no-empty': [true, { severity: 'warning' }],
		},
	};

	const { results } = await standalone({
		code: 'a {}',
		config,
		quiet: true,
	});

	expect(results[0].warnings).toEqual([]);
});

it('standalone with custom rule using checkAgainstRule on quiet and reportNeedlessDisables mode', async () => {
	const customRuleName = 'custom/rule';
	const customRule = (primary, secondary, context) => {
		return async (root, result) => {
			await checkAgainstRule(
				{
					ruleName: 'block-no-empty',
					ruleSettings: [primary, secondary],
					root,
					result,
					context,
				},
				(warning) => {
					report({
						ruleName: customRuleName,
						result,
						message: warning.text,
						node: warning.node,
					});
				},
			);
		};
	};

	const { results } = await standalone({
		code: '/* stylelint-disable */ a {}',
		config: {
			plugins: [createPlugin(customRuleName, customRule)],
			rules: { [customRuleName]: true },
			reportNeedlessDisables: true,
		},
		quiet: true,
	});

	expect(results[0].warnings).toEqual([]);
});
