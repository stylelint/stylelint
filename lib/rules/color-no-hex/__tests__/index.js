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
		},
		{
			code: 'a { color: #123456a; }',
			message: messages.rejected('#123456a'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: #cccccc; }',
			message: messages.rejected('#cccccc'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { something: #00c, red, white; }',
			message: messages.rejected('#00c'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { something: black, #fff1a1, rgb(250, 250, 0); }',
			message: messages.rejected('#fff1a1'),
			line: 1,
			column: 23,
		},
		{
			code: 'a { something:black,white,#12345a; }',
			message: messages.rejected('#12345a'),
			line: 1,
			column: 27,
		},
		{
			code: 'a { color: #ffff; }',
			message: messages.rejected('#ffff'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: #ffffffaa; }',
			message: messages.rejected('#ffffffaa'),
			line: 1,
			column: 12,
		},
	],
});

// testRule({
// 	ruleName,
// 	config: [true],
// 	syntax: 'css-in-js',

// 	accept: [
// 		{
// 			code: `
// 				export const s = styled.a({
// 					color: "pink",
// 				});
// 			`,
// 		},
// 		{
// 			code: `
// 				export const s = styled.a({
// 					color: "rgba(0, 0, 0, 0)",
// 				});
// 			`,
// 		},
// 		{
// 			code: `
// 				export const s = styled.a({
// 					content: '"#abcdef"',
// 				});
// 			`,
// 		},
// 		{
// 			code: `
// 				export const s = styled.a({
// 					background: 'url(#aabbcc)',
// 				});
// 			`,
// 		},
// 		{
// 			code: `
// 				export const s = styled.a({
// 					color: "red /* #ff0000 */",
// 				});
// 			`,
// 		},
// 		{
// 			code: `
// 				export const s = styled.a({
// 					color: "linear-gradient(green, rgb(123, 123, 123), hsl(24, 70%, 80%))",
// 				});
// 			`,
// 		},
// 	],

// 	reject: [
// 		{
// 			code: `
// 				export const s = styled.a({
// 					color: "#abcdef",
// 				});
// 			`,

// 			message: messages.rejected('#abcdef'),
// 			line: 3,
// 			column: 13,
// 		},
// 		{
// 			code: `
// 				export const s = styled.a({
// 					backgroundColor: "linear-gradient(#aaa, #ffff, #01234567)",
// 				});
// 			`,

// 			warnings: [
// 				{ message: messages.rejected('#aaa'), line: 3, column: 39 },
// 				{ message: messages.rejected('#ffff'), line: 3, column: 45 },
// 				{ message: messages.rejected('#01234567'), line: 3, column: 52 },
// 			],
// 		},
// 	],
// });
