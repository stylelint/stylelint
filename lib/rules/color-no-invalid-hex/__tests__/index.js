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
			code: 'a { color: #000; }',
		},
		{
			code: 'a { something: #000, #fff, #ababab; }',
		},
		{
			code: 'a { color: #0000ffcc; }',
			description: 'eight digits',
		},
		{
			code: 'a { color:#00fc; }',
			description: 'four digits',
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
			code: "a { background-image: svg-load('x.svg', fill=url(#a)); }",
			description: 'svg-load url with fill',
		},
		{
			code: 'a { background-image: url(#a); }',
			description: 'url standalone hash',
		},
		{
			code: 'a { background-image: url(x.svg#a); }',
			description: 'url with hash',
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
			code: 'a { color: #ababa; }',
			message: messages.rejected('#ababa'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { something: #00, #fff, #ababab; }',
			message: messages.rejected('#00'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { something: #000, #fff1az, #ababab; }',
			message: messages.rejected('#fff1az'),
			line: 1,
			column: 22,
		},
		{
			code: 'a { something:#000,#fff,#12345aa; }',
			message: messages.rejected('#12345aa'),
			line: 1,
			column: 25,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'css-in-js',

	accept: [
		{
			code: 'export default <h1 style={{ color: "#ffff" }}>Test</h1>;',
		},
	],

	reject: [
		{
			code: 'export default <h1 style={{ color: "#fffff" }}>Test</h1>;',
			message: messages.rejected('#fffff'),
			line: 1,
			column: 36,
		},
	],
});
