'use strict';

const stripIndent = require('common-tags').stripIndent;

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['modern'],
	fix: true,

	accept: [
		{
			code: 'a { color: rgb(0 0 0) }',
		},
		{
			code: 'a { color: rgb(12 122 231 / 0.2) }',
		},
		{
			code: 'a { color: rgb(51 170 51 / 20%) }',
		},
		{
			code: 'a { color: hsl(4.71239rad 60% 70%) }',
		},
		{
			code: 'a { color: hsl(.75turn 60% 70%) }',
		},
		{
			code: 'a { color: hsl(270 60% 50% / .15) }',
		},
		{
			code: 'a { color: hsl(270 60% 50% / 15%) }',
		},
		{
			code: 'a { color: HSL(270 60% 70%) }',
		},
		{
			code: 'a { color: RgB(240 0 0 / 50%) }',
		},
		{
			code: 'a { color: hsl(var(--hue) var(--sat) var(--sat) / var(--alpha)) }',
		},
		{
			code: stripIndent`
				a {
					color: hsl(270 60% 50%
						/ 15%)
				}`,
		},
		{
			code: stripIndent`
				a {
					color: hsl(
						270
						60%
						50%
						/ 15%
					)
				}`,
		},
		{
			code: stripIndent`
				a {
					color: hsl(
						270 /* comment */
						60%
						50%
						/* comment */ / 15%
					)
				}`,
		},
	],

	reject: [
		{
			code: 'a { color: rgb(0, 0, 0) }',
			fixed: 'a { color: rgb(0 0 0) }',
			message: messages.expected('modern'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0) }',
			fixed: 'a { color: rgb(0 0 0 / 0) }',
			message: messages.expected('modern'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 50%) }',
			fixed: 'a { color: rgb(0 0 0 / 50%) }',
			message: messages.expected('modern'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { color: rgba(0 , 0 , 0 , 50%) }',
			fixed: 'a { color: rgb(0 0 0 / 50%) }',
			message: messages.expected('modern'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { color: rgba(0,0,0,50%) }',
			fixed: 'a { color: rgb(0 0 0 / 50%) }',
			message: messages.expected('modern'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { color: rgba(var(--r, 20), var(--g), var(--b), 0.6); }',
			fixed: 'a { color: rgb(var(--r, 20) var(--g) var(--b) / 0.6); }',
			message: messages.expected('modern'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: stripIndent`
				a {
					color: HSLA(
						calc(var(--hue) + 30),
						28%, 50%, 0.2
					);
				}
			`,
			fixed: stripIndent`
				a {
					color: HSL(
						calc(var(--hue) + 30)
						28% 50% / 0.2
					);
				}
			`,
			message: messages.expected('modern'),
			line: 2,
			column: 9,
			endLine: 5,
			endColumn: 3,
		},
		{
			code: stripIndent`
				a {
					color: HSLA(
						calc(var(--hue) + 30),
						28%, 50%,
						0.2
					);
				}
			`,
			fixed: stripIndent`
				a {
					color: HSL(
						calc(var(--hue) + 30)
						28% 50% /
						0.2
					);
				}
			`,
			message: messages.expected('modern'),
			line: 2,
			column: 9,
			endLine: 6,
			endColumn: 3,
		},
		{
			code: stripIndent`
				a {
					color: HSLA(
						calc(var(--hue) + 30),
						28%,
						50%, 0.2
					);
				}
			`,
			fixed: stripIndent`
				a {
					color: HSL(
						calc(var(--hue) + 30)
						28%
						50% / 0.2
					);
				}
			`,
			message: messages.expected('modern'),
			line: 2,
			column: 9,
			endLine: 6,
			endColumn: 3,
		},
		{
			code: stripIndent`
				a {
					color: HSLA(
						calc(var(--hue) + 30) /* comment */,
						28%, 50% /* comment */, 0.2
					);
				}
			`,
			fixed: stripIndent`
				a {
					color: HSL(
						calc(var(--hue) + 30) /* comment */
						28% 50% /* comment */ / 0.2
					);
				}
			`,
			message: messages.expected('modern'),
			line: 2,
			column: 9,
			endLine: 5,
			endColumn: 3,
		},
		{
			code: stripIndent`
				a {
					color: HSLA(
						calc(var(--hue) + 30) /* comment */,
						28%, 50% /* comment */
						, 0.2
					);
				}
			`,
			fixed: stripIndent`
				a {
					color: HSL(
						calc(var(--hue) + 30) /* comment */
						28% 50% /* comment */
						/ 0.2
					);
				}
			`,
			message: messages.expected('modern'),
			line: 2,
			column: 9,
			endLine: 6,
			endColumn: 3,
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						rgba(30, 75, 115, 1),
						hsl(255, 255, 255)
					);
				}
			`,
			fixed: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						rgb(30 75 115 / 1),
						hsl(255 255 255)
					);
				}
			`,
			warnings: [
				{ message: messages.expected('modern'), line: 4, column: 3, endLine: 4, endColumn: 23 },
				{ message: messages.expected('modern'), line: 5, column: 3, endLine: 5, endColumn: 21 },
			],
		},
	],
});

testRule({
	ruleName,
	config: ['legacy'],

	accept: [
		{
			code: 'a { color: rgb(0, 0, 0) }',
		},
		{
			code: 'a { color: rgba(12, 122, 231, 0.2) }',
		},
		{
			code: 'a { color: rgba(51,170,51,20%) }',
		},
		{
			code: 'a { color: hsl(4.71239rad, 60%, 70%) }',
		},
		{
			code: 'a { color: hsl(.75turn, 60%, 70%) }',
		},
		{
			code: 'a { color: hsla(270, 60%, 50%, .15) }',
		},
		{
			code: 'a { color: hsla(270, 60%, 50%, 15%) }',
		},
		{
			code: 'a { color: HSL(270, 60%, 70%) }',
		},
		{
			code: 'a { color: RgBA(240, 0, 0, 50%) }',
		},
		{
			code: 'a { color: hsla(var(--hue), var(--sat), var(--sat), var(--alpha)) }',
		},
		{
			code: stripIndent`
				a {
					color: hsla(270, 60%, 50%
						, 15%)
				}`,
		},
		{
			code: stripIndent`
				a {
					color: hsla(
						270,
						60%,
						50%,
						15%
					)
				}`,
		},
		{
			code: stripIndent`
				a {
					color: hsla(
						270, /* comment */
						60%,
						50%,
						/* comment */ 15%
					)
				}`,
		},
	],

	reject: [
		{
			code: 'a { color: rgb(0 0 0) }',
			message: messages.expected('legacy'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { color: rgb(0 0 0 0) }',
			message: messages.expected('legacy'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { color: rgb(0 0 0 / 50%) }',
			message: messages.expected('legacy'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: stripIndent`
				a {
					color: HSL(
						calc(var(--hue) + 30)
						28% 50% / 0.2
					);
				}
			`,
			message: messages.expected('legacy'),
			line: 2,
			column: 9,
			endLine: 5,
			endColumn: 3,
		},
		{
			code: stripIndent`
				a {
					background-image: linear-gradient(
						to right,
						rgb(30 75 115 / 1),
						hsl(255 255 255)
					);
				}
			`,
			warnings: [
				{ message: messages.expected('legacy'), line: 4, column: 3, endLine: 4, endColumn: 21 },
				{ message: messages.expected('legacy'), line: 5, column: 3, endLine: 5, endColumn: 19 },
			],
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['modern'],
	fix: true,

	accept: [
		{
			code: '$a: rgb(0 0 0);',
		},
		{
			code: '$a: rgb(0 0 0 / 0);',
		},
		{
			code: 'a { color: rgb($a $b $c / $d) }',
		},
		{
			code: 'a { color: rgb($a, $b, $c, $d) }',
		},
		{
			code: 'a { color: rgb($color-var, 50%); }',
		},
		{
			code: 'a { color: rgba(color.mix(#000, #fff, 35%), 0.6); }',
		},
		{
			code: 'a { color: rgba(#fff, 0.85) }',
		},
		{
			code: 'a { color: rgba($a, $b, $c, $d) }',
		},
	],

	reject: [
		{
			code: '$a: rgb(0, 0, 0);',
			fixed: '$a: rgb(0 0 0);',
			message: messages.expected('modern'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: '$a: rgb(0, 0, 0, 0);',
			fixed: '$a: rgb(0 0 0 / 0);',
			message: messages.expected('modern'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['legacy'],

	accept: [
		{
			code: '$a: rgb(0, 0, 0);',
		},
		{
			code: '$a: rgba(0, 0, 0, 0);',
		},
		{
			code: 'a { color: rgba($a, $b, $c, $d) }',
		},
		{
			code: 'a { color: rgb($a $b $c / $d) }',
		},
	],

	reject: [
		{
			code: '$a: rgb(0 0 0 / 0);',
			message: messages.expected('legacy'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 19,
		},
	],
});
