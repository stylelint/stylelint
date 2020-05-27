'use strict';

const stripIndent = require('common-tags').stripIndent;

const { messages, ruleName } = require('..');

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
			code: 'a { color: lch(56.29% 19.86 10 / var(--alpha)) }',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0.5/*comment*/) }',
		},
		{
			code: 'a { color: rgb(0 0 0 / /*comment*/0.5) }',
		},
	],

	reject: [
		{
			code: 'a { opacity: 10% }',
			fixed: 'a { opacity: 0.1 }',
			message: messages.expected('10%', '0.1'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { shape-image-threshold: 50% }',
			fixed: 'a { shape-image-threshold: 0.5 }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 50%) }',
			fixed: 'a { color: rgba(0, 0, 0, 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { color: rgb(0 0 0 / 50%) }',
			fixed: 'a { color: rgb(0 0 0 / 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { color: HSL(198DEG 28% 50% / 10%) }',
			fixed: 'a { color: HSL(198DEG 28% 50% / 0.1) }',
			message: messages.expected('10%', '0.1'),
			line: 1,
			column: 33,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 50%/*comment*/) }',
			fixed: 'a { color: rgba(0, 0, 0, 0.5/*comment*/) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 26,
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
				{ message: messages.expected('10%', '0.1'), line: 4, column: 21 },
				{ message: messages.expected('40%', '0.4'), line: 5, column: 29 },
			],
		},
		{
			code: 'a { opacity: 14% }',
			fixed: 'a { opacity: 0.14 }',
			message: messages.expected('14%', '0.14'),
			line: 1,
			column: 14,
			description: 'properly deals with floating-point conversions',
		},
		{
			code: 'a { opacity: 0.3% }',
			fixed: 'a { opacity: 0.003 }',
			message: messages.expected('0.3%', '0.003'),
			line: 1,
			column: 14,
			description: 'properly deals with floating-point conversions',
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
	],

	reject: [
		{
			code: 'a { opacity: 0.1 }',
			fixed: 'a { opacity: 10% }',
			message: messages.expected('0.1', '10%'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { color: rgba(0, 0, 0, .5) }',
			fixed: 'a { color: rgba(0, 0, 0, 50%) }',
			message: messages.expected('.5', '50%'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { color: HSL(198DEG 28% 50% / 0.1) }',
			fixed: 'a { color: HSL(198DEG 28% 50% / 10%) }',
			message: messages.expected('0.1', '10%'),
			line: 1,
			column: 33,
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
				{ message: messages.expected('0.1', '10%'), line: 4, column: 21 },
				{ message: messages.expected('0.40', '40%'), line: 5, column: 29 },
			],
		},
		{
			code: 'a { opacity: 0.14 }',
			fixed: 'a { opacity: 14% }',
			message: messages.expected('0.14', '14%'),
			line: 1,
			column: 14,
			description: 'properly deals with floating-point conversions',
		},
		{
			code: 'a { opacity: 0.003 }',
			fixed: 'a { opacity: 0.3% }',
			message: messages.expected('0.003', '0.3%'),
			line: 1,
			column: 14,
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
		},
		{
			code: 'a { color: rgba(0, 0, 0, 50%) }',
			fixed: 'a { color: rgba(0, 0, 0, 0.5) }',
			message: messages.expected('50%', '0.5'),
			line: 1,
			column: 26,
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
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0.5) }',
			fixed: 'a { color: rgba(0, 0, 0, 50%) }',
			message: messages.expected('0.5', '50%'),
			line: 1,
			column: 26,
		},
	],
});
