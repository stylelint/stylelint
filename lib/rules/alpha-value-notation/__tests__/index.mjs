import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['number'],
	fix: true,

	accept: [
		{
			code: 'a { opacity: 0.1 }',
		},
		{
			code: 'a { shape-image-threshold: .5 }',
		},
		{
			code: 'a { OPACITY: /*comment*/0.1 }',
		},
		{
			code: 'a { opacity: var(--alpha) }',
		},
		{
			code: 'a { color: rgb(0, 0, 0) }',
		},
		{
			code: 'a { color: rgb(0 0 0) }',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0.5) }',
		},
		{
			code: 'a { color: rgb(0 0 0 / 0.5) }',
		},
		{
			code: 'a { color: hsl(198deg 28% 50% / .50) }',
		},
		{
			code: 'a { color: hsla(30, 100%, 50%, .6) }',
		},
		{
			code: 'a { color: RGB(0 0 0 / 0.5) }',
		},
		{
			code: 'a { color: hsla(var(--hue), var(--sat), var(--sat), var(--alpha)) }',
		},
		{
			code: 'a { color: hsl(var(--hsl) / 0.5) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 10 / var(--alpha)) }',
		},
		{
			code: 'a { color: oklch(56.29% 19.86 10 / var(--alpha)) }',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0.5/*comment*/) }',
		},
		{
			code: 'a { color: rgb(0 0 0 / /*comment*/0.5) }',
		},
		{
			code: 'a { color: color(display-p3 0 0 0 / 0.5) }',
		},
		{
			code: 'a { color: color(display-p3 0 0 0) }',
		},

		// Relative color syntax
		{
			code: 'a { color: rgb(from blue 0 0 0 / 0.5) }',
		},
		{
			code: 'a { color: hsl(from blue 198deg 28% 50% / .50) }',
		},
		{
			code: 'a { color: RGB(from blue 0 0 0 / 0.5) }',
		},
		{
			code: 'a { color: hsl(from blue var(--hsl) / 0.5) }',
		},
		{
			code: 'a { color: lch(from rgb(0 0 0) 56.29% 19.86 10 / var(--alpha)) }',
		},
		{
			code: 'a { color: oklch(from #fff 56.29% 19.86 10 / var(--alpha)) }',
		},
		{
			code: 'a { color: rgb(from blue 0 0 0 / /*comment*/0.5) }',
		},
		{
			code: 'a { color: color(from blue display-p3 0 0 0 / 0.5) }',
		},
	],

	reject: [
		{
			code: 'a { opacity: 10% }',
			fixed: 'a { opacity: 0.1 }',
			message: messages.expected('10%', '0.1'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { shape-image-threshold: 50% }',
			fixed: 'a { shape-image-threshold: 0.5 }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'feDropShadow { flood-opacity: 50% }',
			fixed: 'feDropShadow { flood-opacity: 0.5 }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 50%) }',
			fixed: 'a { color: rgba(0, 0, 0, 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { color: rgb(0 0 0 / 50%) }',
			fixed: 'a { color: rgb(0 0 0 / 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { color: HSL(198DEG 28% 50% / 10%) }',
			fixed: 'a { color: HSL(198DEG 28% 50% / 0.1) }',
			message: messages.expected('10%', '0.1'),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 50%/*comment*/) }',
			fixed: 'a { color: rgba(0, 0, 0, 0.5/*comment*/) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { color: hsl(var(--hsl) / 50%) }',
			fixed: 'a { color: hsl(var(--hsl) / 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { color: hsl(var(--hsl) / /* comment*/ 50%) }',
			fixed: 'a { color: hsl(var(--hsl) / /* comment*/ 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						hwb(270 60% 70% / 10%)
						lch(56.29% 19.86 236.62 / 40%)
					);
				}
			`,
			fixed: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						hwb(270 60% 70% / 0.1)
						lch(56.29% 19.86 236.62 / 0.4)
					);
				}
			`,
			warnings: [
				{
					message: messages.expected('10%', '0.1'),
					line: 4,
					column: 21,
					endLine: 4,
					endColumn: 24,
				},
				{
					message: messages.expected('40%', '0.4'),
					line: 5,
					column: 29,
					endLine: 5,
					endColumn: 32,
				},
			],
		},
		{
			code: 'a { opacity: 14% }',
			fixed: 'a { opacity: 0.14 }',
			message: messages.expected('14%', '0.14'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 17,
			description: 'properly deals with floating-point conversions',
		},
		{
			code: 'a { opacity: 0.3% }',
			fixed: 'a { opacity: 0.003 }',
			message: messages.expected('0.3%', '0.003'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 18,
			description: 'properly deals with floating-point conversions',
		},
		{
			code: 'a { color: rgb(from rgb(127 127 127 / 25%) 0 0 0 / 50%) }',
			fixed: 'a { color: rgb(from rgb(127 127 127 / 0.25) 0 0 0 / 0.5) }',
			warnings: [
				{
					message: messages.expected('50%', '0.5'),
					line: 1,
					column: 52,
					endLine: 1,
					endColumn: 55,
				},
				{
					message: messages.expected('25%', '0.25'),
					line: 1,
					column: 39,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
		{
			code: 'a { color: color(display-p3 0 0 0 / 50%) }',
			fixed: 'a { color: color(display-p3 0 0 0 / 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 40,
		},
	],
});

testRule({
	ruleName,
	config: ['percentage'],
	fix: true,

	accept: [
		{
			code: 'a { opacity: 10% }',
		},
		{
			code: 'a { shape-image-threshold: 50% }',
		},
		{
			code: 'a { OPACITY: /*comment*/10% }',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 50%) }',
		},
		{
			code: 'a { color: RGB(0 0 0 / 50%) }',
		},
		{
			code: 'a { color: lch(56.29% 19.86 10 / var(--alpha)) }',
		},
		{
			code: 'a { color: color(display-p3 0 0 0) }',
		},
		{
			code: 'a { color: color(display-p3 0 0 0 / 50%) }',
		},
	],

	reject: [
		{
			code: 'a { opacity: 0.1 }',
			fixed: 'a { opacity: 10% }',
			message: messages.expected('0.1', '10%'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { color: rgba(0, 0, 0, .5) }',
			fixed: 'a { color: rgba(0, 0, 0, 50%) }',
			message: messages.expected('.5', '50%'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { color: HSL(198DEG 28% 50% / 0.1) }',
			fixed: 'a { color: HSL(198DEG 28% 50% / 10%) }',
			message: messages.expected('0.1', '10%'),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						hwb(270 60% 70% / 0.1)
						lch(56.29% 19.86 236.62 / 0.40)
					);
				}
			`,
			fixed: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						hwb(270 60% 70% / 10%)
						lch(56.29% 19.86 236.62 / 40%)
					);
				}
			`,
			warnings: [
				{
					message: messages.expected('0.1', '10%'),
					line: 4,
					column: 21,
					endLine: 4,
					endColumn: 24,
				},
				{
					message: messages.expected('0.40', '40%'),
					line: 5,
					column: 29,
					endLine: 5,
					endColumn: 33,
				},
			],
		},
		{
			code: 'a { opacity: 0.14 }',
			fixed: 'a { opacity: 14% }',
			message: messages.expected('0.14', '14%'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 18,
			description: 'properly deals with floating-point conversions',
		},
		{
			code: 'a { opacity: 0.003 }',
			fixed: 'a { opacity: 0.3% }',
			message: messages.expected('0.003', '0.3%'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 19,
			description: 'properly deals with floating-point conversions',
		},
	],
});

testRule({
	ruleName,
	config: ['number', { exceptProperties: ['opacity'] }],
	fix: true,

	accept: [
		{
			code: 'a { opacity: 50% }',
		},
		{
			code: 'a { shape-image-threshold: .5 }',
		},
		{
			code: 'a { color: rgb(0 0 0 / 0.5) }',
		},
	],

	reject: [
		{
			code: 'a { opacity: 0.1 }',
			fixed: 'a { opacity: 10% }',
			message: messages.expected('0.1', '10%'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 50%) }',
			fixed: 'a { color: rgba(0, 0, 0, 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 29,
		},
	],
});

testRule({
	ruleName,
	config: ['percentage', { exceptProperties: ['opacity'] }],
	fix: true,

	accept: [
		{
			code: 'a { opacity: 0.5 }',
		},
		{
			code: 'a { shape-image-threshold: 50% }',
		},
		{
			code: 'a { color: rgb(0 0 0 / 50%) }',
		},
	],

	reject: [
		{
			code: 'a { opacity: 10% }',
			fixed: 'a { opacity: 0.1 }',
			message: messages.expected('10%', '0.1'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0.5) }',
			fixed: 'a { color: rgba(0, 0, 0, 50%) }',
			message: messages.expected('0.5', '50%'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 29,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['number'],
	fix: true,

	accept: [
		{
			code: '$a: rgb(0, 0, 0);',
		},
		{
			code: '$a: rgb(0 0 0);',
		},
		{
			code: '$a: rgba(0, 0, 0, 0.5);',
		},
		{
			code: '$a: rgb(0 0 0 / 0.5);',
		},
		{
			code: 'a { color: rgb(0 0 0 / $a) }',
		},
	],

	reject: [
		{
			code: '$a: rgb(0 0 0 / 50%);',
			fixed: '$a: rgb(0 0 0 / 0.5);',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 20,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['percentage'],
	fix: true,

	accept: [
		{
			code: '$a: rgba(0, 0, 0, 50%);',
		},
		{
			code: '$a: rgb(0 0 0 / 50%);',
		},
		{
			code: '$a: 50%; a { color: rgb(0 0 0 / $a) }',
		},
		{
			code: '$a: 0.5; a { color: rgb(0 0 0 / $a) }',
		},
	],

	reject: [
		{
			code: '$a: rgb(0 0 0 / 0.5);',
			fixed: '$a: rgb(0 0 0 / 50%);',
			message: messages.expected('0.5', '50%'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 20,
		},
	],
});

testRuleConfigs({
	ruleName,

	reject: [
		{
			config: ['invalid'],
		},
	],
});
