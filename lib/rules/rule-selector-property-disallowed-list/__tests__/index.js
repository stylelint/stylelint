'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: {
		a: ['color', '/margin/'],
		'/foo/': '/size/',
	},

	accept: [
		{
			code: 'a { background: red; }',
		},
		{
			code: 'a { padding-top: 0px; }',
		},
		{
			code: 'a { background-color: red; }',
		},
		{
			code: 'a[href="#"] { color: red; }',
		},
		{
			code: 'html.foo { color: red; }',
		},
		{
			code: 'html[data-foo] { color: red; }',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			message: messages.rejected('a', 'color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { background: red; color: red; }',
			message: messages.rejected('a', 'color'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { margin-top: 0px; }',
			message: messages.rejected('a', 'margin-top'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { color: red; margin-top: 0px; }',
			warnings: [
				{
					message: messages.rejected('a', 'color'),
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 10,
				},
				{
					message: messages.rejected('a', 'margin-top'),
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: '[data-foo] { font-size: 1rem; }',
			message: messages.rejected('[data-foo]', 'font-size'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'html[data-foo] { font-size: 1px; }',
			message: messages.rejected('html[data-foo]', 'font-size'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: [{ a: 'color' }, { message: 'foo' }],

	reject: [
		{
			code: 'a { color: red; }',
			message: 'foo',
			description: 'custom message',
		},
	],
});
