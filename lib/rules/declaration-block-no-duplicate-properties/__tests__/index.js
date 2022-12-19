'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	fix: true,

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
			fixed: 'a { color: orange }',
			message: messages.rejected('color'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { cOlOr: pink; color: orange }',
			fixed: 'a { color: orange }',
			message: messages.rejected('color'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { color: pink; cOlOr: orange }',
			fixed: 'a { cOlOr: orange }',
			message: messages.rejected('cOlOr'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { cOlOr: pink; cOlOr: orange }',
			fixed: 'a { cOlOr: orange }',
			message: messages.rejected('cOlOr'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { COLOR: pink; color: orange }',
			fixed: 'a { color: orange }',
			message: messages.rejected('color'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { color: pink; COLOR: orange }',
			fixed: 'a { COLOR: orange }',
			message: messages.rejected('COLOR'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { color: pink; background: orange; color: orange }',
			fixed: 'a { background: orange; color: orange }',
			message: messages.rejected('color'),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 43,
		},
		{
			code: 'a { color: pink; background: orange; background: pink; }',
			fixed: 'a { color: pink; background: pink; }',
			message: messages.rejected('background'),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 48,
		},
		{
			code: 'a { color: pink; { &:hover { color: orange; color: black; } } }',
			fixed: 'a { color: pink; { &:hover { color: black; } } }',
			description: 'spec nested',
			message: messages.rejected('color'),
			line: 1,
			column: 45,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: 'a { color: pink; @media { color: orange; color: black; } }',
			fixed: 'a { color: pink; @media { color: black; } }',
			description: 'nested',
			message: messages.rejected('color'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 47,
		},
		{
			code: '@media { color: orange; .foo { color: black; color: white; } }',
			fixed: '@media { color: orange; .foo { color: white; } }',
			description: 'nested',
			message: messages.rejected('color'),
			line: 1,
			column: 46,
			endLine: 1,
			endColumn: 51,
		},
		{
			code: 'a { color: pink; @media { color: orange; &::before { color: black; color: white; } } }',
			fixed: 'a { color: pink; @media { color: orange; &::before { color: white; } } }',
			description: 'double nested',
			message: messages.rejected('color'),
			line: 1,
			column: 68,
			endLine: 1,
			endColumn: 73,
		},
		{
			code: 'a { color: pink; @media { color: orange; .foo { color: black; color: white; } } }',
			fixed: 'a { color: pink; @media { color: orange; .foo { color: white; } } }',
			description: 'double nested again',
			message: messages.rejected('color'),
			line: 1,
			column: 63,
			endLine: 1,
			endColumn: 68,
		},
		{
			code: 'a { -webkit-border-radius: 12px; -webkit-border-radius: 10px; }',
			fixed: 'a { -webkit-border-radius: 10px; }',
			message: messages.rejected('-webkit-border-radius'),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: 'a { -WEBKIT-border-radius: 12px; -webkit-BORDER-radius: 10px; }',
			fixed: 'a { -webkit-BORDER-radius: 10px; }',
			message: messages.rejected('-webkit-BORDER-radius'),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: 'a { color: red !important; color: blue; }',
			fixed: 'a { color: red !important; }',
			message: messages.rejected('color'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { color: red !important; color: blue !important; }',
			fixed: 'a { color: blue !important; }',
			message: messages.rejected('color'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 33,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['consecutive-duplicates'] }],
	fix: true,

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
			fixed: 'p { font-weight: 400; font-size: 1rem; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { display: inline-block; font-size: 16px; font-weight: 400; font-size: 1rem; }',
			fixed: 'p { display: inline-block; font-weight: 400; font-size: 1rem; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { font-size: 16px; font-weight: 400; font-size: 1rem; color: red; }',
			fixed: 'p { font-weight: 400; font-size: 1rem; color: red; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { display: inline-block; font-size: 16px; font-weight: 400; font-size: 1rem; color: red; }',
			fixed: 'p { display: inline-block; font-weight: 400; font-size: 1rem; color: red; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { font-size: 16px !important; font-weight: 400; font-size: 1rem; }',
			fixed: 'p { font-size: 16px !important; font-weight: 400; }',
			message: messages.rejected('font-size'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['consecutive-duplicates-with-different-values'] }],
	fix: true,

	accept: [{ code: 'p { font-size: 16px; font-size: 1rem; font-weight: 400; }' }],

	reject: [
		{
			code: 'p { font-size: 16px; font-weight: 400; font-size: 1rem; }',
			fixed: 'p { font-weight: 400; font-size: 1rem; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { font-size: 16px; font-size: 16px; font-weight: 400; }',
			fixed: 'p { font-size: 16px; font-weight: 400; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { font-size: 16px !important; font-weight: 400; font-size: 1rem; }',
			fixed: 'p { font-size: 16px !important; font-weight: 400; }',
			message: messages.rejected('font-size'),
		},
		{
			code: 'p { font-size: 16px; font-size: 16px !important; font-weight: 400; }',
			fixed: 'p { font-size: 16px !important; font-weight: 400; }',
			message: messages.rejected('font-size'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['consecutive-duplicates-with-same-prefixless-values'] }],
	fix: true,

	accept: [
		{
			code: 'p { width: -moz-fit-content; width: fit-content; }',
		},
		{
			code: 'p { width: fit-content; width: -moz-fit-content; }',
		},
		{
			code: 'p { width: -MOZ-fit-content; width: fit-content; }',
		},
		{
			code: 'p { width: -webkit-fit-content; width: -moz-fit-content; width: fit-content; }',
		},
	],

	reject: [
		{
			code: 'p { width: fit-content; height: 32px; width: -moz-fit-content; }',
			fixed: 'p { height: 32px; width: -moz-fit-content; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: 100%; width: -moz-fit-content; height: 32px; }',
			fixed: 'p { width: -moz-fit-content; height: 32px; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: -moz-fit-content; width: -moz-fit-content; }',
			fixed: 'p { width: -moz-fit-content; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: -moz-fit-content; width: -moz-fit-content !important; }',
			fixed: 'p { width: -moz-fit-content !important; }',
			message: messages.rejected('width'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreProperties: ['color'] }],
	fix: true,

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
		{
			code: 'p { color: pink; color: orange !important; }',
		},
	],

	reject: [
		{
			code: 'p { color: pink; background: orange; background: white; }',
			fixed: 'p { color: pink; background: white; }',
			message: messages.rejected('background'),
		},
		{
			code: 'p { background: orange; color: pink; background: white; }',
			fixed: 'p { color: pink; background: white; }',
			message: messages.rejected('background'),
		},
		{
			code: 'p { background: orange; color: pink; background: white !important; }',
			fixed: 'p { color: pink; background: white !important; }',
			message: messages.rejected('background'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreProperties: ['/background-/'] }],
	fix: true,

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
			fixed: 'p { color: pink; background: white; }',
			message: messages.rejected('background'),
		},
		{
			code: 'p { background: orange; color: pink; background: white; }',
			fixed: 'p { color: pink; background: white; }',
			message: messages.rejected('background'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-html',
	fix: true,

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
			fixed: '<a style="color: orange"></a>',
			message: messages.rejected('color'),
		},
		{
			code: '<style>p { color: pink; background: orange; background: white; }</style>',
			fixed: '<style>p { color: pink; background: white; }</style>',
			message: messages.rejected('background'),
		},
		{
			code: '<a style="background: orange; color: pink; background: white;"></a>',
			fixed: '<a style="color: pink; background: white;"></a>',
			message: messages.rejected('background'),
		},
	],
});

testRule({
	skip: true,
	ruleName,
	config: [true],
	customSyntax: 'postcss-css-in-js',

	accept: [
		{
			code: "import styled from 'react-emotion'\nexport default styled.div` color: pink; `;",
		},
	],
	reject: [
		{
			code: "import styled from 'styled-components';\nexport default styled.div` color: pink; color: orange; `;",
			message: messages.rejected('color'),
		},
		{
			code: "import styled from 'react-emotion'\nexport default styled.div` color: pink; color: orange; `;",
			message: messages.rejected('color'),
		},
	],
});
