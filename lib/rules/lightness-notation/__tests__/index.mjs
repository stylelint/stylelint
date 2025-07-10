import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['percentage'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: oklch(70% 0.1 241) }',
		},
		{
			code: 'a { color: lch(70% 0.1 241) }',
		},
		{
			code: 'a { color: oklab(70% 0.1 241) }',
		},
		{
			code: 'a { color: lab(70% 0.1 241) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 200) }',
		},
		{
			code: 'a { color: lch(_ 19.86 200) }',
			description: 'malformed lch',
		},
		{
			code: 'a { color: oklch(56.29% 0.1 241) }',
		},
		{
			code: 'a { color: hsl(170deg 60% 50% / 15%) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 200/ 100%) }',
		},
		{
			code: 'a { color: oklch(var(--lightness) var(--chroma) var(--hue) / var(--alpha)) }',
		},
		{
			code: 'a { color: lch(var(--lightness) 19.86 200 / 100%) }',
		},
		{
			code: 'a { color: oklch(/*comment*/56.29% 0.1 241) }',
		},
		{
			code: 'a { color: lch(56.29% 0.1 241/*comment*/) }',
		},
		{
			code: 'a { color: hsl(170deg 60% 0.5 / 15%) }',
		},
	],

	reject: [
		{
			code: 'a { color: oklch(0.7 0.1 241) }',
			fixed: 'a { color: oklch(70% 0.1 241) }',
			fix: {
				range: [17, 20],
				text: '70%',
			},
			message: messages.expected('0.7', '70%'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { color: lch(70 0.1 241) }',
			fixed: 'a { color: lch(70% 0.1 241) }',
			fix: {
				range: [16, 17],
				text: '0%',
			},
			message: messages.expected('70', '70%'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { color: oklab(0.7 0.1 241) }',
			fixed: 'a { color: oklab(70% 0.1 241) }',
			fix: {
				range: [17, 20],
				text: '70%',
			},
			message: messages.expected('0.7', '70%'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { color: lab(70 0.1 241) }',
			fixed: 'a { color: lab(70% 0.1 241) }',
			fix: {
				range: [16, 17],
				text: '0%',
			},
			message: messages.expected('70', '70%'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { color: lch(56.29 19.86 200) }',
			fixed: 'a { color: lch(56.29% 19.86 200) }',
			fix: {
				range: [19, 20],
				text: '9%',
			},
			message: messages.expected('56.29', '56.29%'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { color: oklch(0.5629 0.1 241) }',
			fixed: 'a { color: oklch(56.29% 0.1 241) }',
			fix: {
				range: [17, 23],
				text: '56.29%',
			},
			message: messages.expected('0.5629', '56.29%'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { color: lch(56.29 19.86 200/ 100%) }',
			fixed: 'a { color: lch(56.29% 19.86 200/ 100%) }',
			fix: {
				range: [19, 20],
				text: '9%',
			},
			message: messages.expected('56.29', '56.29%'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { color: oklch(/*comment*/0.5629 0.1 241) }',
			fixed: 'a { color: oklch(/*comment*/56.29% 0.1 241) }',
			fix: {
				range: [28, 34],
				text: '56.29%',
			},
			message: messages.expected('0.5629', '56.29%'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: 'a { color: lch(52.9 0.1 241/*comment*/) }',
			fixed: 'a { color: lch(52.9% 0.1 241/*comment*/) }',
			fix: {
				range: [18, 19],
				text: '9%',
			},
			message: messages.expected('52.9', '52.9%'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						lab(29.2345 39.3825 20.0664);
						lch(56.29 19.86 236.62)
					);
				}
			`,
			fixed: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						lab(29.2345% 39.3825 20.0664);
						lch(56.29% 19.86 236.62)
					);
				}
			`,
			warnings: [
				{
					message: messages.expected('29.2345', '29.2345%'),
					fix: {
						range: [64, 65],
						text: '5%',
					},
					line: 4,
					column: 7,
					endLine: 4,
					endColumn: 14,
				},
				{
					message: messages.expected('56.29', '56.29%'),
					fix: undefined,
					line: 5,
					column: 7,
					endLine: 5,
					endColumn: 12,
				},
			],
		},
		{
			code: 'a { color: oklab(0 0.1 241) }',
			fixed: 'a { color: oklab(0% 0.1 241) }',
			fix: {
				range: [17, 18],
				text: '0%',
			},
			message: messages.expected('0', '0%'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
	],
});

testRule({
	ruleName,
	config: ['number'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: oklch(0.7 0.1 241) }',
		},
		{
			code: 'a { color: lch(0.7 0.1 241) }',
		},
		{
			code: 'a { color: oklab(0.7 0.1 241) }',
		},
		{
			code: 'a { color: lab(0.7 0.1 241) }',
		},
		{
			code: 'a { color: lch(0.5629 19.86 200) }',
		},
		{
			code: 'a { color: oklch(0.5629 0.1 241) }',
		},
		{
			code: 'a { color: lch(0.5629 19.86 200/ 100%) }',
		},
		{
			code: 'a { color: oklch(/*comment*/0.5629 0.1 241) }',
		},
		{
			code: 'a { color: lch(0.529 0.1 241/*comment*/) }',
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						lab(0.292345 39.3825 20.0664);
						lch(0.5629 19.86 236.62)
					);
				}
			`,
		},
	],

	reject: [
		{
			code: 'a { color: oklch(70% 0.1 241) }',
			fixed: 'a { color: oklch(0.7 0.1 241) }',
			fix: {
				range: [17, 20],
				text: '0.7',
			},
			message: messages.expected('70%', '0.7'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { color: lch(70% 0.1 241) }',
			fixed: 'a { color: lch(70 0.1 241) }',
			fix: {
				range: [17, 18],
				text: '',
			},
			message: messages.expected('70%', '70'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { color: oklab(70% 0.1 241) }',
			fixed: 'a { color: oklab(0.7 0.1 241) }',
			fix: {
				range: [17, 20],
				text: '0.7',
			},
			message: messages.expected('70%', '0.7'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { color: lab(70% 0.1 241) }',
			fixed: 'a { color: lab(70 0.1 241) }',
			fix: {
				range: [17, 18],
				text: '',
			},
			message: messages.expected('70%', '70'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { color: lch(56.29% 19.86 200) }',
			fixed: 'a { color: lch(56.29 19.86 200) }',
			fix: {
				range: [20, 21],
				text: '',
			},
			message: messages.expected('56.29%', '56.29'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { color: oklch(56.29% 0.1 241) }',
			fixed: 'a { color: oklch(0.5629 0.1 241) }',
			fix: {
				range: [17, 23],
				text: '0.5629',
			},
			message: messages.expected('56.29%', '0.5629'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { color: lch(56.29% 19.86 200/ 100%) }',
			fixed: 'a { color: lch(56.29 19.86 200/ 100%) }',
			fix: {
				range: [20, 21],
				text: '',
			},
			message: messages.expected('56.29%', '56.29'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { color: oklch(/*comment*/56.29% 0.1 241) }',
			fixed: 'a { color: oklch(/*comment*/0.5629 0.1 241) }',
			fix: {
				range: [28, 34],
				text: '0.5629',
			},
			message: messages.expected('56.29%', '0.5629'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: 'a { color: lch(52.9% 0.1 241/*comment*/) }',
			fixed: 'a { color: lch(52.9 0.1 241/*comment*/) }',
			fix: {
				range: [19, 20],
				text: '',
			},
			message: messages.expected('52.9%', '52.9'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						lab(29.2345% 39.3825 20.0664);
						lch(56.29% 19.86 236.62deg)
					);
				}
			`,
			fixed: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						lab(29.2345 39.3825 20.0664);
						lch(56.29 19.86 236.62deg)
					);
				}
			`,
			warnings: [
				{
					message: messages.expected('29.2345%', '29.2345'),
					fix: {
						range: [65, 66],
						text: '',
					},
					line: 4,
					column: 7,
					endLine: 4,
					endColumn: 15,
				},
				{
					message: messages.expected('56.29%', '56.29'),
					fix: undefined,
					line: 5,
					column: 7,
					endLine: 5,
					endColumn: 13,
				},
			],
		},
		{
			code: 'a { color: oklab(5% -100% 0.4) }',
			fixed: 'a { color: oklab(0.05 -100% 0.4) }',
			fix: {
				range: [17, 19],
				text: '0.05',
			},
			message: messages.expected('5%', '0.05'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { color: oklab(0% -100% 0.4) }',
			fixed: 'a { color: oklab(0 -100% 0.4) }',
			fix: {
				range: [18, 19],
				text: '',
			},
			message: messages.expected('0%', '0'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
	],
});
