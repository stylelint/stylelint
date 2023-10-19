import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.js';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { padding: 10px; }',
		},
		{
			code: 'a { padding: 10px; padding-left: 20px; }',
		},
		{
			code: '@media (color) { padding: 10px; padding-left: 20px; }',
		},
		{
			code: 'a { @media (color) { padding: 10px; padding-left: 20px; }}',
		},
		{
			code: 'a { padding-left: 10px; { b { padding: 20px; }}}',
			description: 'nested related properties',
		},
		{
			code: 'a { border-top-width: 1px; top: 0; bottom: 3px; border-bottom: 2px solid blue; }',
		},
		{
			code: 'a { transition-property: opacity; } a { transition: opacity 1s linear; }',
		},
		{
			code: 'a { -webkit-transition-property: opacity; transition: opacity 1s linear; }',
		},
		{
			code: 'a { transition-property: opacity; -webkit-transition: opacity 1s linear; }',
		},
	],

	reject: [
		{
			code: 'a { padding-left: 10px; padding: 20px; }',
			message: messages.rejected('padding', 'padding-left'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { pAdDiNg-lEfT: 10Px; pAdDiNg: 20Px; }',
			message: messages.rejected('pAdDiNg', 'pAdDiNg-lEfT'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { PADDING-LEFT: 10PX; PADDING: 20PX; }',
			message: messages.rejected('PADDING', 'PADDING-LEFT'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { padding-left: 10px; { b { padding-top: 10px; padding: 20px; }}}',
			description: 'override within nested rule',
			message: messages.rejected('padding', 'padding-top'),
			line: 1,
			column: 50,
			endLine: 1,
			endColumn: 57,
		},
		{
			code: 'a { border-top-width: 1px; top: 0; bottom: 3px; border: 2px solid blue; }',
			message: messages.rejected('border', 'border-top-width'),
			line: 1,
			column: 49,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: 'a { transition-property: opacity; transition: opacity 1s linear; }',
			message: messages.rejected('transition', 'transition-property'),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: 'a { background-repeat: no-repeat; background: url(lion.png); }',
			message: messages.rejected('background', 'background-repeat'),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: '@media (color) { background-repeat: no-repeat; background: url(lion.png); }',
			message: messages.rejected('background', 'background-repeat'),
			line: 1,
			column: 48,
			endLine: 1,
			endColumn: 58,
		},
		{
			code: 'a { @media (color) { background-repeat: no-repeat; background: url(lion.png); }}',
			message: messages.rejected('background', 'background-repeat'),
			line: 1,
			column: 52,
			endLine: 1,
			endColumn: 62,
		},
		{
			code: 'a { -webkit-transition-property: opacity; -webkit-transition: opacity 1s linear; }',
			message: messages.rejected('-webkit-transition', '-webkit-transition-property'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 61,
		},
		{
			code: 'a { -WEBKIT-transition-property: opacity; -webKIT-transition: opacity 1s linear; }',
			message: messages.rejected('-webKIT-transition', '-WEBKIT-transition-property'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 61,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-html',

	accept: [
		{
			code: '<style>a { padding: 10px; }</style>',
		},
		{
			code: '<style>a { padding-left: 10px; }</style><style>a { padding: 10px; }</style>',
		},
		{
			code: '<a style="padding: 10px;"></a>',
		},
		{
			code: '<a style="padding-left: 10px;"></a><a style="padding: 10px;"></a>',
		},
	],

	reject: [
		{
			code: '<style>p { padding-left: 10px; padding: 20px; }</style>',
			message: messages.rejected('padding', 'padding-left'),
		},
		{
			code: '<a style="padding-left: 10px; padding: 20px;"></a>',
			message: messages.rejected('padding', 'padding-left'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: naiveCssInJs,

	accept: [
		{
			code: 'css` padding: 10px; `;',
		},
	],

	reject: [
		{
			code: 'css` padding-left: 10px; padding: 20px; `;',
			message: messages.rejected('padding', 'padding-left'),
		},
		{
			code: 'css` padding-left: 10px; padding: 20px; `;',
			message: messages.rejected('padding', 'padding-left'),
		},
	],
});
