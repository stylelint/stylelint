'use strict';

const stripIndent = require('common-tags').stripIndent;

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['angle'],
	fix: true,

	accept: [
		{
			code: 'a { color: hsl(270deg 60% 50%) }',
		},
		{
			code: 'a { color: hwb(120deg 0% 0%) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 10deg) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86) }',
			description: 'malformed lch',
		},
		{
			code: 'a { color: hsl(170deg 60% 50% / 15%) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 10deg / 100%) }',
		},
		{
			code: 'a { color: hsl(4.71239rad 60% 70%) }',
		},
		{
			code: 'a { color: hsl(.75turn 60% 70%) }',
		},
		{
			code: 'a { color: hsl(270deg, 60%, 50%) }',
		},
		{
			code: 'a { color: hsla(270deg, 60%, 50%, 15%) }',
		},
		{
			code: 'a { color: HSL(270deg 60% 70%) }',
		},
		{
			code: 'a { color: hsl(270DEG 60% 70%) }',
		},
		{
			code: 'a { color: hsl(var(--hue) var(--sat) var(--sat) / var(--alpha)) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 var(--hue) / 100%) }',
		},
		{
			code: 'a { color: hsl(/*comment*/270deg 60% 50%) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 10deg/*comment*/) }',
		},
	],

	reject: [
		{
			code: 'a { color: hsl(120 60% 70%) }',
			fixed: 'a { color: hsl(120deg 60% 70%) }',
			message: messages.expected('120', '120deg'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: HSL(120 60% 70% / 10%) }',
			fixed: 'a { color: HSL(120deg 60% 70% / 10%) }',
			message: messages.expected('120', '120deg'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: hwb(180 0% 0%) }',
			fixed: 'a { color: hwb(180deg 0% 0%) }',
			message: messages.expected('180', '180deg'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: lch(56.29% 19.86 10) }',
			fixed: 'a { color: lch(56.29% 19.86 10deg) }',
			message: messages.expected('10', '10deg'),
			line: 1,
			column: 29,
		},
		{
			code: 'a { color: hsl(/*comment*/120 60% 70%) }',
			fixed: 'a { color: hsl(/*comment*/120deg 60% 70%) }',
			message: messages.expected('120', '120deg'),
			line: 1,
			column: 27,
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						hsl(270 60% 70%)
						lch(56.29% 19.86 236.62)
					);
				}
			`,
			fixed: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						hsl(270deg 60% 70%)
						lch(56.29% 19.86 236.62deg)
					);
				}
			`,
			warnings: [
				{ message: messages.expected('270', '270deg'), line: 4, column: 7 },
				{ message: messages.expected('236.62', '236.62deg'), line: 5, column: 20 },
			],
		},
	],
});

testRule({
	ruleName,
	config: ['number'],
	fix: true,

	accept: [
		{
			code: 'a { color: hsl(270 60% 50%) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 10) }',
		},
		{
			code: 'a { color: hsla(270, 60%, 50%, 15%) }',
		},
	],

	reject: [
		{
			code: 'a { color: hsl(120deg 60% 70%) }',
			fixed: 'a { color: hsl(120 60% 70%) }',
			message: messages.expected('120deg', '120'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: HSL(120deg 60% 70% / 10%) }',
			fixed: 'a { color: HSL(120 60% 70% / 10%) }',
			message: messages.expected('120deg', '120'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: HSLA(120DEG, 60%, 70%, 10%) }',
			fixed: 'a { color: HSLA(120, 60%, 70%, 10%) }',
			message: messages.expected('120DEG', '120'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: lch(56.29% 19.86 10deg) }',
			fixed: 'a { color: lch(56.29% 19.86 10) }',
			message: messages.expected('10deg', '10'),
			line: 1,
			column: 29,
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						hsl(270deg 60% 70%)
						lch(56.29% 19.86 236.62deg)
					);
				}
			`,
			fixed: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						hsl(270 60% 70%)
						lch(56.29% 19.86 236.62)
					);
				}
			`,
			warnings: [
				{ message: messages.expected('270deg', '270'), line: 4, column: 7 },
				{ message: messages.expected('236.62deg', '236.62'), line: 5, column: 20 },
			],
		},
	],
});
