'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: ['class', 'disabled', 'id', '/^data-/'],

	accept: [
		{
			code: 'a[title] { }',
		},
		{
			code: 'a[target="_blank"] { }',
		},
		{
			code: 'a[href$=".pdf"] { }',
		},
		{
			code: 'div[lang~="en-us"] { }',
		},
	],

	reject: [
		{
			code: '[class*="foo"] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '[ class*="foo" ] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: '[class *= "foo"] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '[disabled] { }',
			message: messages.rejected('disabled'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '[id~="bar"] { }',
			message: messages.rejected('id'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: '[data-foo*="bar"] { }',
			message: messages.rejected('data-foo'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '[ data-foo *= "bar" ] { }',
			message: messages.rejected('data-foo'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 11,
		},
	],
});

testRule({
	ruleName,
	config: /^data-/,

	accept: [
		{
			code: 'a[title] { }',
		},
	],

	reject: [
		{
			code: 'a[data-foo="bar"] { }',
			message: messages.rejected('data-foo'),
		},
	],
});
