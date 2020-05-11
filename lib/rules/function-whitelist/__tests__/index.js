'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: ['rotate', 'rgb', 'radial-gradient', 'lightness', 'color'],

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { transform: rotate(7deg) }',
		},
		{
			code: 'a { background: -webkit-radial-gradient(red, green, blue); }',
		},
		{
			code: 'a { color: color(rgb(0, 0, 0) lightness(50%)); }',
		},
		{
			code: '@media (max-width: 10px) { a { color: color(rgb(0, 0, 0) lightness(50%)); } }',
		},
		{
			code: '$list: (value, value2)',
			description: 'Sass list ignored',
		},
	],

	reject: [
		{
			code: 'a { transform: rOtAtE(7deg) }',
			message: messages.rejected('rOtAtE'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: ROTATE(7deg) }',
			message: messages.rejected('ROTATE'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: scale(1); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: sCaLe(1); }',
			message: messages.rejected('sCaLe'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: SCALE(1); }',
			message: messages.rejected('SCALE'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform : scale(1); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 17,
		},
		{
			code: 'a\n{ transform: scale(1); }',
			message: messages.rejected('scale'),
			line: 2,
			column: 14,
		},
		{
			code: 'a { transform:    scale(1); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 19,
		},
		{
			code: '  a { transform: scale(1); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0) }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: color(rgba(0, 0, 0, 0) lightness(50%)); }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { background: red, -moz-linear-gradient(45deg, blue, red); }',
			message: messages.rejected('-moz-linear-gradient'),
			line: 1,
			column: 22,
		},
		{
			code: '@media (max-width: 10px) { a { color: color(rgba(0, 0, 0) lightness(50%)); } }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 45,
		},
	],
});

testRule({
	ruleName,
	config: ['translate'],
	skipBasicChecks: true,

	accept: [
		{
			code: 'a { transform: translate(1px); }',
		},
	],

	reject: [
		{
			code: 'a { transform: scale(4); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 16,
		},
	],
});

testRule({
	ruleName,

	config: ['/rgb/'],

	accept: [
		{
			code: 'a { color: rgb(0, 0, 0); }',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0); }',
		},
	],

	reject: [
		{
			code: 'a { color: hsl(208, 100%, 97%); }',
			message: messages.rejected('hsl'),
			line: 1,
			column: 12,
		},
	],
});

testRule({
	ruleName,

	config: [/rgb/],

	accept: [
		{
			code: 'a { color: rgb(0, 0, 0); }',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0); }',
		},
	],

	reject: [
		{
			code: 'a { color: hsl(208, 100%, 97%); }',
			message: messages.rejected('hsl'),
			line: 1,
			column: 12,
		},
	],
});
