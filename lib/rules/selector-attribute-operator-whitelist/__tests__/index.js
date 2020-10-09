'use strict';

const standalone = require('../../../standalone');
const { messages, ruleName, meta } = require('..');

it('warns that the rule is deprecated', () => {
	const config = {
		rules: {
			[ruleName]: ['='],
		},
	};

	const code = '';

	return standalone({ code, config }).then((output) => {
		const result = output.results[0];

		expect(result.deprecations).toHaveLength(1);
		expect(result.deprecations[0].text).toEqual(
			`'${ruleName}' has been deprecated. Instead use 'selector-attribute-operator-allowed-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
		);
	});
});

it('also warns that the rule is deprecated via a meta', () => {
	expect(meta).not.toBeUndefined();
	expect(meta).toHaveProperty('deprecated', true);
});

testRule({
	ruleName,

	config: ['=', '|='],

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
			code: '[class^=top] { }',
			message: messages.rejected('^='),
			line: 1,
			column: 7,
		},
		{
			code: '[class$="test"] { }',
			message: messages.rejected('$='),
			line: 1,
			column: 7,
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

	config: ['='],

	accept: [
		{
			code: 'a[target="_blank"] { }',
		},
	],

	reject: [
		{
			code: '[title~="flower"] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 7,
		},
	],
});
