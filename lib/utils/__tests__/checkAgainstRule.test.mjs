import postcss from 'postcss';

import checkAgainstRule from '../checkAgainstRule.mjs';
import customRuleAsync from './fixtures/custom-rule-async.mjs';
import report from '../report.mjs';
import validateOptions from '../validateOptions.mjs';

const resultStylelint = (props) => ({
	ruleSeverities: {},
	ruleMetadata: {},
	customMessages: {},
	customUrls: {},
	disabledRanges: {},
	fixersData: {},
	rangesOfComputedEditInfos: [],
	...props,
});

const mockRuleName = 'custom/no-empty-source';
const mockResult = {
	stylelint: resultStylelint({
		config: {
			pluginFunctions: {
				[mockRuleName]: (primary) => (root, result) => {
					const validOptions = validateOptions(result, mockRuleName, {
						actual: primary,
					});

					if (!validOptions || root.source.input.css) return;

					report({
						result,
						message: 'Unexpected empty source',
						ruleName: mockRuleName,
						node: root,
					});
				},
			},
		},
	}),
};

describe('checkAgainstRule', () => {
	it('does nothing with no errors', async () => {
		const root = postcss.parse('a { color: black }');

		const warnings = [];

		await checkAgainstRule(
			{
				ruleName: 'color-named',
				ruleSettings: 'always-where-possible',
				root,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(0);
	});

	it('handles non-array rule settings', async () => {
		const root = postcss.parse('a { color: black }');

		const warnings = [];

		await checkAgainstRule(
			{
				ruleName: 'color-named',
				ruleSettings: 'never',
				root,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(1);
		expect(warnings[0].rule).toBe('color-named');
		expect(warnings[0].line).toBe(1);
		expect(warnings[0].column).toBe(12);
	});

	it('handles array rule settings', async () => {
		const root = postcss.parse('@import horse.css\n@media {}\n@import dog.css;');

		const warnings = [];

		await checkAgainstRule(
			{
				ruleName: 'at-rule-empty-line-before',
				ruleSettings: ['always', { ignoreAtRules: ['media'] }],
				root,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(1);
		expect(warnings[0].rule).toBe('at-rule-empty-line-before');
		expect(warnings[0].line).toBe(3);
		expect(warnings[0].column).toBe(1);
	});

	it('outputs fixed code when autofix is enabled', async () => {
		const root = postcss.parse('@import url(foo.css);');
		const ruleName = 'function-url-quotes';
		const result = {
			stylelint: resultStylelint({
				ruleMetadata: { [ruleName]: { fixable: true } },
				config: { fix: true },
			}),
		};
		const warnings = [];

		await checkAgainstRule(
			{
				ruleName,
				ruleSettings: 'always',
				root,
				result,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(0);
		expect(root.toString()).toBe('@import url("foo.css");');
	});

	it('checks against custom rule (passing)', async () => {
		const root = postcss.parse('.not-empty {}');

		const warnings = [];

		await checkAgainstRule(
			{
				ruleName: mockRuleName,
				result: mockResult,
				ruleSettings: true,
				root,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(0);
	});

	it('checks against custom rule (failing)', async () => {
		const root = postcss.parse('');

		const warnings = [];

		await checkAgainstRule(
			{
				ruleName: mockRuleName,
				result: mockResult,
				ruleSettings: true,
				root,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(1);
		expect(warnings[0].rule).toBe(mockRuleName);
		expect(warnings[0].line).toBe(1);
		expect(warnings[0].column).toBe(1);
	});

	it('checks against promise-based rules', async () => {
		const root = postcss.parse('@media invalid() {}');

		const warnings = [];

		await checkAgainstRule(
			{
				ruleName: customRuleAsync.ruleName,
				result: {
					stylelint: resultStylelint({
						config: {
							pluginFunctions: {
								[customRuleAsync.ruleName]: customRuleAsync.rule,
							},
						},
					}),
				},
				ruleSettings: true,
				root,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(1);
		expect(warnings[0].rule).toBe(customRuleAsync.ruleName);
		expect(warnings[0].line).toBe(1);
		expect(warnings[0].column).toBe(1);
	});

	test('throws when checking against custom rule without result object', async () => {
		await expect(async () => {
			const root = postcss.parse('');

			const warnings = [];

			await checkAgainstRule(
				{
					ruleName: mockRuleName,
					ruleSettings: true,
					root,
				},
				(warning) => warnings.push(warning),
			);
		}).rejects.toThrow(`Rule "${mockRuleName}" does not exist`);
	});
});
