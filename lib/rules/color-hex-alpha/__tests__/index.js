'use strict';

const postcssScss = require('postcss-scss');

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: 'always',
	accept: [
		{
			code: 'a { color: #ffff; }',
		},
		{
			code: 'a { color: #ffffffff; }',
		},
		{
			code: 'a { background: linear-gradient(to left, #fffa, #000000aa 100%); }',
		},
		{
			code: 'a { background: url(#fff); }',
		},
	],
	reject: [
		{
			code: 'a { color: #fff; }',
			message: messages.expected('#fff'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: #ffffff; }',
			message: messages.expected('#ffffff'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { background: linear-gradient(to left, #fff, #000000 100%); }',
			warnings: [
				{ message: messages.expected('#fff'), line: 1, column: 42 },
				{ message: messages.expected('#000000'), line: 1, column: 48 },
			],
		},
	],
});

testRule({
	ruleName,
	config: 'never',
	accept: [
		{
			code: 'a { color: #fff; }',
		},
		{
			code: 'a { color: #ffffff; }',
		},
	],
	reject: [
		{
			code: 'a { color: #ffff; }',
			message: messages.unexpected('#ffff'),
			line: 1,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: postcssScss,

	accept: [
		{
			code: 'a { color: #{f}; }',
			description: 'scss interpolation of 3 characters',
		},
		{
			code: '$var: #ffff;',
			description: 'alpha channel scss variable',
		},
	],
	reject: [
		{
			code: '$var: #fff',
			message: messages.expected('#fff'),
			line: 1,
			column: 7,
			description: 'no alpha channel scss variable',
		},
	],
});
