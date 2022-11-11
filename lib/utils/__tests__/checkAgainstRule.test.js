'use strict';

const report = require('../report');
const validateOptions = require('../validateOptions');
const checkAgainstRule = require('../checkAgainstRule');
const postcss = require('postcss');

const mockRuleName = 'custom/no-empty-source';
const mockResult = {
	stylelint: {
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
	},
};

describe('checkAgainstRule', () => {
	it('does nothing with no errors', () => {
		const root = postcss.parse('a {} @media {}');

		const warnings = [];

		checkAgainstRule(
			{
				ruleName: 'at-rule-name-case',
				ruleSettings: 'lower',
				root,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(0);
	});

	it('handles non-array rule settings', () => {
		const root = postcss.parse('a {} @media {}');

		const warnings = [];

		checkAgainstRule(
			{
				ruleName: 'at-rule-name-case',
				ruleSettings: 'upper',
				root,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(1);
		expect(warnings[0].rule).toBe('at-rule-name-case');
		expect(warnings[0].line).toBe(1);
		expect(warnings[0].column).toBe(6);
	});

	it('handles array rule settings', () => {
		const root = postcss.parse('@import horse.css\n@media {}\n@import dog.css;');

		const warnings = [];

		checkAgainstRule(
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

	it('outputs fixed code when provided a context object', () => {
		const root = postcss.parse('  a { color: red; }');
		const context = { fix: true };

		const warnings = [];

		checkAgainstRule(
			{
				ruleName: 'indentation',
				ruleSettings: 2,
				root,
				context,
			},
			(warning) => warnings.push(warning),
		);

		expect(warnings).toHaveLength(0);
		expect(root.toString()).toBe('a { color: red; }');
	});

	it('checks against custom rule (passing)', () => {
		const root = postcss.parse('.not-empty {}');

		const warnings = [];

		checkAgainstRule(
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

	it('checks against custom rule (failing)', () => {
		const root = postcss.parse('');

		const warnings = [];

		checkAgainstRule(
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

	test('throws when checking against custom rule without result object', () => {
		expect(() => {
			const root = postcss.parse('');

			const warnings = [];

			checkAgainstRule(
				{
					ruleName: mockRuleName,
					ruleSettings: true,
					root,
				},
				(warning) => warnings.push(warning),
			);
		}).toThrow(`Rule "${mockRuleName}" does not exist`);
	});
});
