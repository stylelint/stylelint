'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; background: orange; }',
		},
		{
			code: 'a { color: pink; { &:hover { color: orange; } } }',
			description: 'spec nested',
		},
		{
			code: 'a { color: pink; @media { color: orange; } }',
			description: 'nested',
		},
		{
			code: 'a { color: pink; @media { color: orange; &::before { color: black; } } }',
			description: 'double nested',
		},
		{
			code: 'a { $scss: 0; $scss: $scss + 1; }',
		},
		{
			code: 'a { @less: 0; @less: @less + 1; }',
		},
		{
			code: 'a { --custom-property: 0; --custom-property: 1; }',
		},
		{
			code: '@fontface { src: url(font.eof); src: url(font.woff) }',
		},
		{
			code: '@fontface { sRc: url(font.eof); sRc: url(font.woff) }',
		},
		{
			code: '@fontface { SRC: url(font.eof); SRC: url(font.woff) }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; color: orange }',
			message: messages.rejected('color'),
		},
		{
			code: 'a { cOlOr: pink; color: orange }',
			message: messages.rejected('color'),
		},
		{
			code: 'a { color: pink; cOlOr: orange }',
			message: messages.rejected('cOlOr'),
		},
		{
			code: 'a { cOlOr: pink; cOlOr: orange }',
			message: messages.rejected('cOlOr'),
		},
		{
			code: 'a { COLOR: pink; color: orange }',
			message: messages.rejected('color'),
		},
		{
			code: 'a { color: pink; COLOR: orange }',
			message: messages.rejected('COLOR'),
		},
		{
			code: 'a { color: pink; background: orange; color: orange }',
			message: messages.rejected('color'),
		},
		{
			code: 'a { color: pink; background: orange; background: pink; }',
			message: messages.rejected('background'),
		},
		{
			code: 'a { color: pink; { &:hover { color: orange; color: black; } } }',
			description: 'spec nested',
			message: messages.rejected('color'),
		},
		{
			code: 'a { color: pink; @media { color: orange; color: black; } }',
			description: 'nested',
			message: messages.rejected('color'),
		},
		{
			code: '@media { color: orange; .foo { color: black; color: white; } }',
			description: 'nested',
			message: messages.rejected('color'),
		},
		{
			code:
				'a { color: pink; @media { color: orange; &::before { color: black; color: white; } } }',
			description: 'double nested',
			message: messages.rejected('color'),
		},
		{
			code: 'a { color: pink; @media { color: orange; .foo { color: black; color: white; } } }',
			description: 'double nested again',
			message: messages.rejected('color'),
		},
		{
			code: 'a { -webkit-border-radius: 12px; -webkit-border-radius: 10px; }',
			message: messages.rejected('-webkit-border-radius'),
		},
		{
			code: 'a { -WEBKIT-border-radius: 12px; -webkit-BORDER-radius: 10px; }',
			message: messages.rejected('-webkit-BORDER-radius'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['consecutive-duplicates'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'p { font-size: 16px; font-size: 1rem; }',
		},
		{
			code: 'p { display: inline-block; font-size: 16px; font-size: 1rem; }',
		},
		{
			code: 'p { font-size: 16px; font-size: 1rem; color: red; }',
		},
		{
			code: 'p { display: inline-block; font-size: 16px; font-size: 1rem; color: red; }',
		},
	],

	reject: [
		{
			code: 'p { font-size: 16px; font-weight: 400; font-size: 1rem; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { display: inline-block; font-size: 16px; font-weight: 400; font-size: 1rem; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { font-size: 16px; font-weight: 400; font-size: 1rem; color: red; }',
			message: messages.rejected('font-size'),
		},
		{
			code:
				'p { display: inline-block; font-size: 16px; font-weight: 400; font-size: 1rem; color: red; }',
			message: messages.rejected('font-size'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['consecutive-duplicates-with-different-values'] }],
	skipBasicChecks: true,

	accept: [{ code: 'p { font-size: 16px; font-size: 1rem; font-weight: 400; }' }],

	reject: [
		{
			code: 'p { font-size: 16px; font-weight: 400; font-size: 1rem; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { font-size: 16px; font-size: 16px; font-weight: 400; }',
			message: messages.rejected('16px'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreProperties: ['color'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'p { color: pink; color: orange; }',
		},
		{
			code: 'p { COLOR: pink; color: orange; }',
		},
		{
			code: 'p { color: pink; background: orange; color: orange }',
		},
	],

	reject: [
		{
			code: 'p { color: pink; background: orange; background: white; }',
			message: messages.rejected('background'),
		},
		{
			code: 'p { background: orange; color: pink; background: white; }',
			message: messages.rejected('background'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreProperties: ['/background-/'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'p { background-color: pink; background-color: orange; }',
		},
		{
			code: 'p { background-color: pink; color: orange; background-color: orange }',
		},
	],

	reject: [
		{
			code: 'p { color: pink; background: orange; background: white; }',
			message: messages.rejected('background'),
		},
		{
			code: 'p { background: orange; color: pink; background: white; }',
			message: messages.rejected('background'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'html',

	accept: [
		{
			code: '<style>a { color: pink; }</style>',
		},
		{
			code: '<a style="color: pink;"></a>',
		},
		{
			code: '<style>a { color: pink; }</style><style>a { color: pink; }</style>',
		},
		{
			code: '<a style="color: pink;"></a><a style="color: pink;"></a>',
		},
	],

	reject: [
		{
			code: '<a style="color: pink; color: orange"></a>',
			message: messages.rejected('color'),
		},
		{
			code: '<style>p { color: pink; background: orange; background: white; }</style>',
			message: messages.rejected('background'),
		},
		{
			code: '<a style="background: orange; color: pink; background: white;"></a>',
			message: messages.rejected('background'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'css-in-js',

	accept: [
		{
			code: "import styled from 'react-emotion'\nexport default styled.div` color: pink; `;",
		},
	],
	reject: [
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` color: pink; color: orange; `;",
			message: messages.rejected('color'),
		},
		{
			code:
				"import styled from 'react-emotion'\nexport default styled.div` color: pink; color: orange; `;",
			message: messages.rejected('color'),
		},
	],
});
