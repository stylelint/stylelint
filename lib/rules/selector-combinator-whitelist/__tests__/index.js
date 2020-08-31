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
			`'${ruleName}' has been deprecated. Instead use 'selector-combinator-allowed-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
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
			code: 'a > b {}',
		},
		{
			code: 'a:not(b > c) {}',
		},
		{
			code: 'a b {}',
		},
		{
			code: 'a\tb {}',
		},
		{
			code: 'a\nb {}',
		},
	],

	reject: [
		{
			code: 'a ~ b {}',
			message: messages.rejected('~'),
			line: 1,
			column: 3,
		},
		{
			code: 'a:not(b ~ c) {}',
			message: messages.rejected('~'),
			line: 1,
			column: 9,
		},
		{
			code: 'a,\nb + c {}',
			message: messages.rejected('+'),
			line: 2,
			column: 3,
		},
	],
});

testRule({
	ruleName,
	config: ['~'],
	skipBasicChecks: true,

	accept: [
		{
			code: 'a ~ b {}',
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
	],
});
