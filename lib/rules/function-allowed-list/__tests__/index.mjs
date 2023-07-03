import rule from '../index.js';
const { messages, ruleName } = rule;

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
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { transform: ROTATE(7deg) }',
			message: messages.rejected('ROTATE'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { transform: scale(1); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { transform: sCaLe(1); }',
			message: messages.rejected('sCaLe'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { transform: SCALE(1); }',
			message: messages.rejected('SCALE'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { transform : scale(1); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a\n{ transform: scale(1); }',
			message: messages.rejected('scale'),
			line: 2,
			column: 14,
			endLine: 2,
			endColumn: 19,
		},
		{
			code: 'a { transform:    scale(1); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '  a { transform: scale(1); }',
			message: messages.rejected('scale'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0) }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { color: color(rgba(0, 0, 0, 0) lightness(50%)); }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { background: red, -moz-linear-gradient(45deg, blue, red); }',
			message: messages.rejected('-moz-linear-gradient'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '@media (max-width: 10px) { a { color: color(rgba(0, 0, 0) lightness(50%)); } }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 45,
			endLine: 1,
			endColumn: 49,
		},
	],
});

testRule({
	ruleName,
	config: ['translate'],

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
			endLine: 1,
			endColumn: 21,
		},
	],
});

testRule({
	ruleName,

	config: '/rgb/',

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
			endLine: 1,
			endColumn: 15,
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
			endLine: 1,
			endColumn: 15,
		},
	],
});
