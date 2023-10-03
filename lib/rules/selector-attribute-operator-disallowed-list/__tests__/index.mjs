import rule from '../index.mjs';
const { messages, ruleName } = rule;

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
			endLine: 1,
			endColumn: 9,
		},
		{
			code: '[ title~="flower" ] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '[title ~= "flower"] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '[class*=test] { }',
			message: messages.rejected('*='),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 9,
		},
	],
});

testRule({
	ruleName,

	config: '*=',

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
