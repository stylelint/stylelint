'use strict';

const { messages, ruleName } = require('..');

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
			column: 11,
		},
	],
});

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
			code: 'a { background: linear-gradient(to left, #fffa, red 100%); }',
		},
		{
			code: 'a { background: url(#fff); }',
		},
	],
	reject: [
		{
			code: 'a { color:#fff; }',
			message: messages.expected('#fff'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color:#ffffff; }',
			message: messages.expected('#ffffff'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { background: linear-gradient(to left, #fff, red 100%); }',
			message: messages.expected('#fff'),
			line: 1,
			column: 42,
		},
	],
});
testRule({
	ruleName,
	config: ['never'],
	syntax: 'scss',

	accept: [
		{
			code: 'a { color: #{ff}; }',
			description: 'scss interpolation',
		},
	],
});
