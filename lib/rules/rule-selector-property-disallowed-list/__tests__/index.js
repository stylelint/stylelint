'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: {
		a: ['background-color'],
		html: ['/color/'],
		'/test/': ['/size/'],
	},

	accept: [
		{
			code: 'a { background: red; }',
		},
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { background: red; color: red; }',
		},
		{
			code: 'a[href="#"] { background-color: red; }',
		},
		{
			code: 'html.foo { background-color: red; }',
		},
		{
			code: 'html[data-test] { background-color: red; }',
		},
	],

	reject: [
		{
			code: 'a { background-color: red; }',
			message: messages.rejected('background-color', 'a'),
			line: 1,
			column: 5,
		},
		{
			code: 'html { background-color: red; }',
			message: messages.rejected('background-color', 'html'),
			line: 1,
			column: 8,
		},
		{
			code: '[data-test] { font-size: 1rem; }',
			message: messages.rejected('font-size', '[data-test]'),
			line: 1,
			column: 15,
		},
		{
			code: 'html[data-test] { font-size: 1px; }',
			message: messages.rejected('font-size', 'html[data-test]'),
			line: 1,
			column: 19,
		},
	],
});
