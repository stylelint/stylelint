'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [
		{
			transform: ['/scale/'],
			whitespace: ['nowrap'],
			'/color/': ['/^green/'],
		},
	],

	accept: [
		{
			code: 'div { whitespace: nowrap; }',
		},
		{
			code: 'a { transform: scale(1, 1); }',
		},
		{
			code: 'a { -webkit-transform: scale(1, 1); }',
		},
		{
			code: 'a { color: green; }',
		},
		{
			code: 'a { background-color: green; }',
		},
	],

	reject: [
		{
			code: 'div { whitespace: pre; }',
			message: messages.rejected('whitespace', 'pre'),
			line: 1,
			column: 7,
		},
		{
			code: 'a { transform: translate(1, 1); }',
			message: messages.rejected('transform', 'translate(1, 1)'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { -webkit-transform: translate(1, 1); }',
			message: messages.rejected('-webkit-transform', 'translate(1, 1)'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color', 'pink'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { background-color: pink; }',
			message: messages.rejected('background-color', 'pink'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,
	config: { position: ['static'] },
	skipBasicChecks: true,
	accept: [
		{
			code: 'a { font-size: 1em; }',
			description: 'irrelevant CSS',
		},
	],
});
