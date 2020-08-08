'use strict';

const standalone = require('../../../standalone');
const { messages, ruleName } = require('..');

it('warns that the rule is deprecated', () => {
	const config = {
		rules: {
			[ruleName]: ['>'],
		},
	};

	const code = '';

	return standalone({ code, config }).then((output) => {
		const result = output.results[0];

		expect(result.deprecations).toHaveLength(1);
		expect(result.deprecations[0].text).toEqual(
			`'${ruleName}' has been deprecated. Instead use 'selector-combinator-disallowed-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://stylelint.io/user-guide/rules/${ruleName}/`,
		);
	});
});
testRule({
	ruleName,
	config: ['>', ' '],
	skipBasicChecks: true,

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a, b {}',
		},
		{
			code: 'a /for/ b {}',
		},
		{
			code: 'a + b {}',
		},
		{
			code: 'a:not(b ~ c) {}',
		},
	],

	reject: [
		{
			code: 'a b {}',
			message: messages.rejected(' '),
			line: 1,
			column: 2,
		},
		{
			code: 'a\tb {}',
			message: messages.rejected(' '),
			line: 1,
			column: 2,
		},
		{
			code: 'a\n\tb {}',
			message: messages.rejected(' '),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\nb c {}',
			message: messages.rejected(' '),
			line: 2,
			column: 2,
		},
		{
			code: 'a:not(b > c) {}',
			message: messages.rejected('>'),
			line: 1,
			column: 9,
		},
		{
			code: 'a > b {}',
			message: messages.rejected('>'),
			line: 1,
			column: 3,
		},
	],
});
