'use strict';

const { messages, ruleName } = require('..');

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

	config: ['/rgb/'],

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
		},
		{
			code: 'a { color: rgba(0, 0, 0); }',
			message: messages.rejected('rgba'),
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
			code: 'a { color: hsl(208, 100%, 97%); }',
		},
	],

	reject: [
		{
			code: 'a { color: rgb(0, 0, 0); }',
			message: messages.rejected('rgb'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: rgba(0, 0, 0); }',
			message: messages.rejected('rgba'),
			line: 1,
			column: 12,
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
		},
		{
			code: 'a { transform: translateX(5px); }',
			message: messages.rejected('translateX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: SCALEX(1); }',
			message: messages.rejected('SCALEX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: rotatex(60deg); }',
			message: messages.rejected('rotatex'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: rotateX(60deg); }',
			message: messages.rejected('rotateX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: ROTATEX(60deg); }',
			message: messages.rejected('ROTATEX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: MATRIX3d(a1); }',
			message: messages.rejected('MATRIX3d'),
			line: 1,
			column: 16,
		},
	],
});
