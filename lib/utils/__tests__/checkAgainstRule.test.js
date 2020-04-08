'use strict';

const checkAgainstRule = require('../checkAgainstRule');
const postcss = require('postcss');

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
});
