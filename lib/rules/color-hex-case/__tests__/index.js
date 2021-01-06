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
		{
			code: 'a { stroke: url(#gradiantA) }',
			description: 'SVG reference interaction',
		},
	],
};

testRule(
	mergeTestDescriptions(sharedTests, {
		ruleName,
		config: ['lower'],
		fix: true,

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
				code: 'a { color: #00fc; }',
				description: 'four digits',
			},
			{
				code: 'a { padding: 000; }',
			},
			{
				code: 'a::before { content: "#ABABA"; }',
			},
			{
				code: 'a { color: white /* #FFF */; }',
			},
		],

		reject: [
			{
				code: 'a { color: #Ababa; }',
				fixed: 'a { color: #ababa; }',

				message: messages.expected('#Ababa', '#ababa'),
				line: 1,
				column: 12,
			},
			{
				code: 'a { something: #000F, #fff, #ababab; }',
				fixed: 'a { something: #000f, #fff, #ababab; }',

				message: messages.expected('#000F', '#000f'),
				line: 1,
				column: 16,
			},
			{
				code: 'a { something: #000, #FFFFAZ, #ababab; }',
				fixed: 'a { something: #000, #ffffaz, #ababab; }',

				message: messages.expected('#FFFFAZ', '#ffffaz'),
				line: 1,
				column: 22,
			},
			{
				code: 'a { something: #000, #fff, #12345AA; }',
				fixed: 'a { something: #000, #fff, #12345aa; }',

				message: messages.expected('#12345AA', '#12345aa'),
				line: 1,
				column: 28,
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(sharedTests, {
		ruleName,
		config: ['upper'],
		fix: true,

		accept: [
			{
				code: 'a { color: pink; }',
			},
			{
				code: 'a { color: #000; }',
			},
			{
				code: 'a { something: #000, #FFF, #ABABAB; }',
			},
			{
				code: 'a { color: #0000FFCC; }',
				description: 'eight digits',
			},
			{
				code: 'a { color: #00FC; }',
				description: 'four digits',
			},
			{
				code: 'a { padding: 000; }',
			},
			{
				code: 'a::before { content: "#ababa"; }',
			},
			{
				code: 'a { color: white /* #fff */; }',
			},
		],

		reject: [
			{
				code: 'a { color: #aBABA; }',
				fixed: 'a { color: #ABABA; }',

				message: messages.expected('#aBABA', '#ABABA'),
				line: 1,
				column: 12,
			},
			{
				code: 'a { something: #000f, #FFF, #ABABAB; }',
				fixed: 'a { something: #000F, #FFF, #ABABAB; }',

				message: messages.expected('#000f', '#000F'),
				line: 1,
				column: 16,
			},
			{
				code: 'a { something: #000, #ffffaz, #ABABAB; }',
				fixed: 'a { something: #000, #FFFFAZ, #ABABAB; }',

				message: messages.expected('#ffffaz', '#FFFFAZ'),
				line: 1,
				column: 22,
			},
			{
				code: 'a { something: #000, #FFF, #12345aa; }',
				fixed: 'a { something: #000, #FFF, #12345AA; }',

				message: messages.expected('#12345aa', '#12345AA'),
				line: 1,
				column: 28,
			},
		],
	}),
);

testRule({
	ruleName,
	config: ['lower'],
	syntax: 'css-in-js',
	fix: true,
	accept: [
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "#aaa",
						});
			`,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							stroke: "url(#AAA)",
						});
			`,
			description: 'href with location',
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "PINK",
						});
			`,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							background: "linear-gradient(#aaa, #ffff, #0000ffcc)",
						});
			`,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled("a::before")({
							content: '"#ABABAB"',
						});
			`,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "white /* #FFF */",
						});
			`,
		},
	],

	reject: [
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "#aBABAA",
						});
			`,
			fixed: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "#ababaa",
						});
			`,

			message: messages.expected('#aBABAA', '#ababaa'),
			line: 4,
			column: 15,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							background: "linear-gradient(#AAA, #FaFa, #0000FFcc)",
						});
			`,
			fixed: `
						import styled from 'styled-components';
						export const s = styled.a({
							background: "linear-gradient(#aaa, #fafa, #0000ffcc)",
						});
			`,

			warnings: [
				{ message: messages.expected('#AAA', '#aaa'), line: 4, column: 36 },
				{ message: messages.expected('#FaFa', '#fafa'), line: 4, column: 42 },
				{ message: messages.expected('#0000FFcc', '#0000ffcc'), line: 4, column: 49 },
			],
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	syntax: 'css-in-js',
	fix: true,
	accept: [
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "#AAA",
						});
			`,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							stroke: "url(#aaa)",
						});
			`,
			description: 'href with location',
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "pink",
						});
			`,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							background: "linear-gradient(#AAA, #FFFF, #0000FFCC)",
						});
			`,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled("a::before")({
							content: '"#ababab"',
						});
			`,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "white /* #fff */",
						});
			`,
		},
	],

	reject: [
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "#aBABAB",
						});
			`,
			fixed: `
						import styled from 'styled-components';
						export const s = styled.a({
							color: "#ABABAB",
						});
			`,

			message: messages.expected('#aBABAB', '#ABABAB'),
			line: 4,
			column: 15,
		},
		{
			code: `
						import styled from 'styled-components';
						export const s = styled.a({
							background: "linear-gradient(#aaa, #FaFa, #0000FFcc)",
						});
			`,
			fixed: `
						import styled from 'styled-components';
						export const s = styled.a({
							background: "linear-gradient(#AAA, #FAFA, #0000FFCC)",
						});
			`,

			warnings: [
				{ message: messages.expected('#aaa', '#AAA'), line: 4, column: 36 },
				{ message: messages.expected('#FaFa', '#FAFA'), line: 4, column: 42 },
				{ message: messages.expected('#0000FFcc', '#0000FFCC'), line: 4, column: 49 },
			],
		},
	],
});
