'use strict';

const standalone = require('../../../standalone');
const { messages, ruleName } = require('..');

it('warns that the rule is deprecated', () => {
	const config = {
		rules: {
			[ruleName]: ['~='],
		},
	};

	const code = '';

	return standalone({ code, config }).then((output) => {
		const result = output.results[0];

		expect(result.deprecations).toHaveLength(1);
		expect(result.deprecations[0].text).toEqual(
			`'${ruleName}' has been deprecated. Instead use 'selector-attribute-operator-disallowed-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
		);
	});
});

testRule({
	ruleName,

	config: ['*=', '~='],

	accept: [
		{
			code: 'a[target] { }',
		},
		{
			code: 'a[target="_blank"] { }',
		},
		{
			code: '[class|="top"] { }',
		},
		{
			code: '[class^=top] { }',
		},
		{
			code: '[class$="test"] { }',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
	],

	reject: [
		{
			code: '[title~="flower"] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 7,
		},
		{
			code: '[ title~="flower" ] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 8,
		},
		{
			code: '[title ~= "flower"] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 8,
		},
		{
			code: '[class*=te] { }',
			message: messages.rejected('*='),
			line: 1,
			column: 7,
		},
	],
});

testRule({
	ruleName,

	config: ['*='],

	accept: [
		{
			code: 'a[target="_blank"] { }',
		},
	],

	reject: [
		{
			code: '[title*="foo"] { }',
			message: messages.rejected('*='),
			line: 1,
			column: 7,
		},
	],
});
