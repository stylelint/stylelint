'use strict';

const naiveCssInJs = require('../../../__tests__/fixtures/postcss-naive-css-in-js');

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0); }',
		},
		{
			code: 'a { something: black, white, gray; }',
		},
		{
			code: 'a { padding: 000; }',
		},
		{
			code: 'a::before { content: "#ababa"; }',
		},
		{
			code: 'a { border-#$side: 0; }',
			description: 'ignore sass-like interpolation',
		},
		{
			code: 'a { box-sizing: #$type-box; }',
			description: 'ignore sass-like interpolation',
		},
		{
			code:
				'@font-face {\n' +
				'font-family: dashicons;\n' +
				'src: url(data:application/font-woff;charset=utf-8;base64, ABCDEF==) format("woff"),\n' +
				'url(../fonts/dashicons.ttf) format("truetype"),\n' +
				'url(../fonts/dashicons.svg#dashicons) format("svg");\n' +
				'font-weight: normal;\n' +
				'font-style: normal;\n' +
				'}',
		},
	],

	reject: [
		{
			code: 'a { color: #12345; }',
			message: messages.rejected('#12345'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { color: #123456a; }',
			message: messages.rejected('#123456a'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { color: #cccccc; }',
			message: messages.rejected('#cccccc'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { something: #00c, red, white; }',
			message: messages.rejected('#00c'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { something: black, #fff1a1, rgb(250, 250, 0); }',
			message: messages.rejected('#fff1a1'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { something:black,white,#12345a; }',
			message: messages.rejected('#12345a'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { color: #ffff; }',
			message: messages.rejected('#ffff'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { color: #ffffffaa; }',
			message: messages.rejected('#ffffffaa'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 21,
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
		{
			code: 'css` color: rgba(0, 0, 0, 0); `;',
		},
		{
			code: 'css` content: "#abcdef"; `;',
		},
		{
			code: 'css` background: url(#aabbcc); `;',
		},
		{
			code: 'css` color: red /* #ff0000 */; `;',
		},
		{
			code: 'css` color: linear-gradient(green, rgb(123, 123, 123), hsl(24, 70%, 80%)); `;',
		},
	],

	reject: [
		{
			code: 'css` color: #abcdef `;',
			message: messages.rejected('#abcdef'),
		},
		{
			code: 'css` background-color: linear-gradient(#aaa, #ffff, #01234567); `;',
			warnings: [
				{ message: messages.rejected('#aaa') },
				{ message: messages.rejected('#ffff') },
				{ message: messages.rejected('#01234567') },
			],
		},
	],
});
