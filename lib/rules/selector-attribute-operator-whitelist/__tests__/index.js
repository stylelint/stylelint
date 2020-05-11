'use strict';

const { messages, ruleName } = require('..');

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
