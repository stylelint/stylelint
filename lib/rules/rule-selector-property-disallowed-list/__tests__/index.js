'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: {
		a: ['color', '/margin/'],
		'/foo/': ['/size/'],
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
			message: messages.rejected('color', 'a'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { background: red; color: red; }',
			message: messages.rejected('color', 'a'),
			line: 1,
			column: 22,
		},
		{
			code: 'a { margin-top: 0px; }',
			message: messages.rejected('margin-top', 'a'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { color: red; margin-top: 0px; }',
			warnings: [
				{ message: messages.rejected('color', 'a'), line: 1, column: 5 },
				{ message: messages.rejected('margin-top', 'a'), line: 1, column: 17 },
			],
			line: 1,
			column: 5,
		},
		{
			code: '[data-foo] { font-size: 1rem; }',
			message: messages.rejected('font-size', '[data-foo]'),
			line: 1,
			column: 14,
		},
		{
			code: 'html[data-foo] { font-size: 1px; }',
			message: messages.rejected('font-size', 'html[data-foo]'),
			line: 1,
			column: 18,
		},
	],
});
