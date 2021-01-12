'use strict';

const mergeTestDescriptions = require('../../../testUtils/mergeTestDescriptions');

const { messages, ruleName } = require('..');

const sharedTests = {
	accept: [
		{
			code: 'a { border-#$side: 0; }',
			description: 'ignore sass-like interpolation',
		},
		{
			code: 'a { box-sizing: #$type-box; }',
			description: 'ignore sass-like interpolation',
		},
	],
};

testRule(
	mergeTestDescriptions(sharedTests, {
		ruleName,
		config: ['short'],
		fix: true,

		accept: [
			{
				code: 'a { color: pink; }',
			},
			{
				code: 'a { color: #000; }',
			},
			{
				code: 'a { color: #FFF; }',
			},
			{
				code: 'a { color: #fFf; }',
				description: 'mixed case',
			},
			{
				code: 'a { color: #fffa; }',
			},
			{
				code: 'a { something: #000, #fff, #aba; }',
			},
			{
				code: 'a { color: #ff; }',
				description: 'invalid short',
			},
			{
				code: 'a { color: #ffffffa; }',
				description: 'invalid long',
			},
			{
				code: 'a { color: #fffffffffff; }',
				description: 'invalid extra long',
			},
			{
				code: 'a { padding: 000000; }',
			},
			{
				code: 'a::before { content: "#ABABAB"; }',
			},
			{
				code: 'a { color: white /* #FFFFFF */; }',
			},
			{
				code: 'a { background: url(somefile.swvg#abcdef)}',
			},
		],

		reject: [
			{
				code: 'a { color: #FFFFFF; }',
				fixed: 'a { color: #FFF; }',
				message: messages.expected('#FFFFFF', '#FFF'),
				line: 1,
				column: 12,
			},
			{
				code: 'a { color: #FfaAFF; }',
				fixed: 'a { color: #FaF; }',
				message: messages.expected('#FfaAFF', '#FaF'),
				line: 1,
				column: 12,
			},
			{
				code: 'a { color: #00aa00aa; }',
				fixed: 'a { color: #0a0a; }',
				message: messages.expected('#00aa00aa', '#0a0a'),
				line: 1,
				column: 12,
			},
			{
				code: 'a { something: #fff, #aba, #00ffAAaa; }',
				fixed: 'a { something: #fff, #aba, #0fAa; }',
				message: messages.expected('#00ffAAaa', '#0fAa'),
				line: 1,
				column: 28,
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedTests, {
		ruleName,
		config: ['long'],
		fix: true,

		accept: [
			{
				code: 'a { color: pink; }',
			},
			{
				code: 'a { color: #000000; }',
			},
			{
				code: 'a { color: #FFFFFF; }',
			},
			{
				code: 'a { color: #fFfFfF; }',
				description: 'mixed case',
			},
			{
				code: 'a { color: #ffffffaa; }',
			},
			{
				code: 'a { something: #000000, #ffffff, #ababab; }',
			},
			{
				code: 'a { color: #ff; }',
				description: 'invalid short',
			},
			{
				code: 'a { color: #ffffffa; }',
				description: 'invalid long',
			},
			{
				code: 'a { color: #fffffffffff; }',
				description: 'invalid extra long',
			},
			{
				code: 'a { padding: 000; }',
			},
			{
				code: 'a::before { content: "#ABA"; }',
			},
			{
				code: 'a { color: white /* #FFF */; }',
			},
			{
				code: 'a { background: url(somefile.swvg#abc)}',
			},
		],

		reject: [
			{
				code: 'a { color: #FFF; }',
				fixed: 'a { color: #FFFFFF; }',
				message: messages.expected('#FFF', '#FFFFFF'),
				line: 1,
				clumn: 12,
			},
			{
				code: 'a { color: #Ffa; }',
				fixed: 'a { color: #FFffaa; }',
				message: messages.expected('#Ffa', '#FFffaa'),
				line: 1,
				clumn: 12,
			},
			{
				code: 'a { color: #0a0a; }',
				fixed: 'a { color: #00aa00aa; }',
				message: messages.expected('#0a0a', '#00aa00aa'),
				line: 1,
				clumn: 12,
			},
			{
				code: 'a { something: #ffffff, #aabbaa, #0fAa; }',
				fixed: 'a { something: #ffffff, #aabbaa, #00ffAAaa; }',
				message: messages.expected('#0fAa', '#00ffAAaa'),
				line: 1,
				clumn: 34,
			},
		],
	}),
);

testRule({
	ruleName,
	config: ['short'],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
				export const s = styled.a({
					color: "#aaa",
				});
			`,
		},
		{
			code: `
				export const s = styled.a({
					color: "#ababab",
				});
			`,
		},
		{
			code: `
				export const s = styled.a({
					stroke: "url(#aaaaaa)",
				});
			`,
			description: 'href with location',
		},
		{
			code: `
				export const s = styled.a({
					color: "darkred",
				});
			`,
		},
		{
			code: `
				export const s = styled.a({
					background: "linear-gradient(#aaa, #ffff, #01234567)",
				});
			`,
		},
		{
			code: `
				export const s = styled("a::before")({
					content: '"#aabbcc"',
				});
			`,
		},
		{
			code: `
				export const s = styled.a({
					color: "white /* #ffffff */",
				});
			`,
		},
	],

	reject: [
		{
			code: `
				export const s = styled.a({
					color: "#aaaaaa",
				});
			`,
			fixed: `
				export const s = styled.a({
					color: "#aaa",
				});
			`,

			message: messages.expected('#aaaaaa', '#aaa'),
			line: 3,
			column: 13,
		},
		{
			code: `
				export const s = styled.a({
					background: "linear-gradient(#aabbcc, #0000ffcc)",
				});
			`,
			fixed: `
				export const s = styled.a({
					background: "linear-gradient(#abc, #00fc)",
				});
			`,

			warnings: [
				{ message: messages.expected('#aabbcc', '#abc'), line: 3, column: 34 },
				{ message: messages.expected('#0000ffcc', '#00fc'), line: 3, column: 43 },
			],
		},
	],
});

testRule({
	ruleName,
	config: ['long'],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
				export const s = styled.a({
					color: "#aaaaaa",
				});
			`,
		},
		{
			code: `
				export const s = styled.a({
					color: "#abababab",
				});
			`,
		},
		{
			code: `
				export const s = styled.a({
					stroke: "url(#aaa)",
				});
			`,
			description: 'href with location',
		},
		{
			code: `
				export const s = styled.a({
					color: "pink",
				});
			`,
		},
		{
			code: `
				export const s = styled.a({
					background: "linear-gradient(#aaaaaa, #ffffffff, #01234567)",
				});
			`,
		},
		{
			code: `
				export const s = styled("a::before")({
					content: '"#abc"',
				});
			`,
		},
		{
			code: `
				export const s = styled.a({
					color: "white /* #fff */",
				});
			`,
		},
	],

	reject: [
		{
			code: `
				export const s = styled.a({
					color: "#aaa",
				});
			`,
			fixed: `
				export const s = styled.a({
					color: "#aaaaaa",
				});
			`,

			message: messages.expected('#aaa', '#aaaaaa'),
			line: 3,
			column: 13,
		},
		{
			code: `
				export const s = styled.a({
					background: "linear-gradient(#abc, #00fc)",
				});
			`,
			fixed: `
				export const s = styled.a({
					background: "linear-gradient(#aabbcc, #0000ffcc)",
				});
			`,

			warnings: [
				{ message: messages.expected('#abc', '#aabbcc'), line: 3, column: 34 },
				{ message: messages.expected('#00fc', '#0000ffcc'), line: 3, column: 40 },
			],
		},
	],
});
