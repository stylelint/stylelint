import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.js';

import rule from '../index.js';
const { messages, ruleName } = rule;

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
			code: 'a { color: pink; color: pink; color: pink }',
			fixed: 'a { color: pink }',
			description: 'multiple duplicates - same',
			warnings: [
				{
					message: messages.rejected('color'),
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 23,
				},
				{
					message: messages.rejected('color'),
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 36,
				},
			],
		},
		{
			code: 'a { color: pink; color: pink; color: orange }',
			fixed: 'a { color: orange }',
			description: 'multiple duplicates - diff',
			warnings: [
				{
					message: messages.rejected('color'),
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 23,
				},
				{
					message: messages.rejected('color'),
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 36,
				},
			],
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

	accept: [
		{ code: 'p { font-size: 16px; font-size: 1rem; font-weight: 400; }' },
		{ code: 'p { font-size: 16px; font-size: 18px; font-weight: 400; }' },
	],

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
	config: [true, { ignore: ['consecutive-duplicates-with-different-syntaxes'] }],
	fix: true,

	accept: [
		{ code: 'p { width: 100vw; height: 100vh; }' },
		{ code: 'p { width: 100vw; width: 100dvw; height: 100vh; }' },
		{ code: 'p { margin: 10dvw 10dvw; margin: 10vw 10vw; padding: 0; }' },
		{ code: 'p { margin: 10dvh 10dvw 10dvh; margin: 10vw 10vw; padding: 0; }' },
		{ code: 'p { width: 100%; width: fit-content; }' },
		{ code: 'p { width: min-content; width: max-content; }' },
		{ code: 'p { width: calc(10px + 2px); width: calc(10px + 2rem); }' },
		{ code: 'p { width: calc(10px + 2px); width: calc(10rem + 2rem); }' },
		{ code: 'p { width: min(10px, 11px); width: max(10px, 11px); }' },
		{ code: 'p { width: calc((10px + 2px)); width: calc((10rem + 2rem)); }' },
		{ code: 'p { width: calc((10px + 2px) + 10px); width: calc((10rem + 2rem) + 10px); }' },
		{ code: 'p { width: $a; width: calc(1 + $a); }', description: 'using SCSS variables' },
		{ code: 'p { width: _$a; width: _$a2; }', description: 'using invalid value' },
		{ code: 'p { width: env(foo); width: env(--bar); }' },
		{ code: 'p { width: env(--foo); width: env(bar); }' },
	],

	reject: [
		{
			code: 'p { width: 100vw ; width: 100vw; }',
			fixed: 'p { width: 100vw; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: calc(100vw /* a comment */  + 10vw); width: calc(100vw + 10vw); }',
			fixed: 'p { width: calc(100vw + 10vw); }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: 100vw; height: 100vh; width: 100dvw; }',
			fixed: 'p { height: 100vh; width: 100dvw; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: 100vw; width: 100vw; height: 100vh; }',
			fixed: 'p { width: 100vw; height: 100vh; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { margin: 10vw 10vw; margin: 10vw 10vw; padding: 0; }',
			fixed: 'p { margin: 10vw 10vw; padding: 0; }',
			message: messages.rejected('margin'),
		},
		{
			code: 'p { width: 100vw; width: 50vw; height: 100vh; }',
			fixed: 'p { width: 50vw; height: 100vh; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: 100vw !important; height: 100vh; width: 100dvw; }',
			fixed: 'p { width: 100vw !important; height: 100vh; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: 100vw; height: 100vh; width: 100dvw !important; }',
			fixed: 'p { height: 100vh; width: 100dvw !important; }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: calc(10px + 4rem); width: calc(10px + 2rem); }',
			fixed: 'p { width: calc(10px + 2rem); }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: CaLC(10px + 4rem); width: calc(10px + 2rem); }',
			fixed: 'p { width: calc(10px + 2rem); }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { width: var(--foo); width: var(--bar); }',
			fixed: 'p { width: var(--bar); }',
			message: messages.rejected('width'),
		},
		{
			code: 'p { content: "foo"; content: "bar"; }',
			fixed: 'p { content: "bar"; }',
			message: messages.rejected('content'),
		},
		{
			code: 'p { image: url(#foo); image: url(#bar); }',
			fixed: 'p { image: url(#bar); }',
			message: messages.rejected('image'),
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
		{
			code: 'p { width: 100% !important; width: -moz-fit-content; }',
			fixed: 'p { width: 100% !important; }',
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
	config: [true, { ignoreProperties: ['/background-/', /padding-/] }],
	fix: true,

	accept: [
		{
			code: 'p { background-color: pink; background-color: orange; }',
		},
		{
			code: 'p { background-color: pink; color: orange; background-color: orange }',
		},
		{
			code: 'p { padding-left: auto; padding-left: 1rem; }',
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
	ruleName,
	config: [true],
	customSyntax: naiveCssInJs,

	accept: [
		{
			code: 'css` color: pink; `;',
		},
	],
	reject: [
		{
			code: 'css` color: pink; color: orange; `;',
			message: messages.rejected('color'),
		},
		{
			code: 'css` color: pink; color: orange; `;',
			message: messages.rejected('color'),
		},
	],
});
