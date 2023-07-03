import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: ['rgba', 'scale', 'linear-gradient'],

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { transform: SCALE(1); }',
		},
		{
			code: 'a { transform: sCaLe(1); }',
		},
		{
			code: 'a { transform: rotate(7deg) }',
		},
		{
			code: 'a { transform: rOtAtE(7deg) }',
		},
		{
			code: 'a { transform: ROTATE(7deg) }',
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
			code: '$scale: (value, value2)',
			description: 'Sass list ignored',
		},
	],

	reject: [
		{
			code: 'a { transform: scale(1); }',
			message: messages.rejected('scale'),
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

	config: '/rgb/',

	accept: [
		{
			code: 'a { color: hsl(208, 100%, 97%); }',
		},
	],

	reject: [
		{
			code: 'a { color: rgb(0, 0, 0); }',
			message: messages.rejected('rgb'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { color: rgba(0, 0, 0); }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
	],
});

testRule({
	ruleName,

	config: [/rgb/],

	accept: [
		{
			code: 'a { color: hsl(208, 100%, 97%); }',
		},
	],

	reject: [
		{
			code: 'a { color: rgb(0, 0, 0); }',
			message: messages.rejected('rgb'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { color: rgba(0, 0, 0); }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
	],
});

testRule({
	ruleName,

	config: ['skewx', 'translateX', 'SCALEX', '/rotate/i', '/MATRIX/'],

	accept: [
		{
			code: 'a { transform: stewX(10deg); }',
		},
		{
			code: 'a { transform: translateY(5px); }',
		},
		{
			code: 'a { transform: scaleX(1); }',
		},
		{
			code: 'a { transform: matrix3d(a1); }',
		},
	],

	reject: [
		{
			code: 'a { transform: skewx(10deg); }',
			message: messages.rejected('skewx'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { transform: translateX(5px); }',
			message: messages.rejected('translateX'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { transform: SCALEX(1); }',
			message: messages.rejected('SCALEX'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { transform: rotatex(60deg); }',
			message: messages.rejected('rotatex'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { transform: rotateX(60deg); }',
			message: messages.rejected('rotateX'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { transform: ROTATEX(60deg); }',
			message: messages.rejected('ROTATEX'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { transform: MATRIX3d(a1); }',
			message: messages.rejected('MATRIX3d'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 24,
		},
	],
});
