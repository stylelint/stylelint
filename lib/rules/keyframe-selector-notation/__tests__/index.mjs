import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

const ACCEPT_TIMELINE_RANGE_NAME_TEST_CASES = [
	{
		code: '@keyframes foo { cover 0% {} cover 100% {} }',
		description: 'timeline-range-name cover',
	},
	{
		code: '@keyframes foo { contain 0% {} contain 100% {} }',
		description: 'timeline-range-name contain',
	},
	{
		code: '@keyframes foo { entry 0% {} entry 100% {} }',
		description: 'timeline-range-name entry',
	},
	{
		code: '@keyframes foo { exit 0% {} exit 100% {} }',
		description: 'timeline-range-name exit',
	},
	{
		code: '@keyframes foo { entry-crossing 0% {} entry-crossing 100% {} }',
		description: 'timeline-range-name entry-crossing',
	},
	{
		code: '@keyframes foo { exit-crossing 0% {} exit-crossing 100% {} }',
		description: 'timeline-range-name exit-crossing',
	},
	{
		code: '@keyframes foo { cover {} }',
		description:
			'timeline-range-name without percentage, although incorrect syntax this is not unlikely',
	},
];

testRule({
	ruleName,
	config: ['keyword'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@keyframes foo { from {} }',
		},
		{
			code: '@keyframes foo { to {} }',
		},
		{
			code: '@keyframes foo { from {} to {} }',
		},
		{
			code: '@keyframes foo { from {} from {} to {} }',
			description: 'duplicate selectors',
		},
		{
			code: '@keyframes foo { from {} 50% {} to {} }',
			description: 'mixed notation',
		},
		{
			code: '@keyframes foo { from, to {} }',
			description: 'selector lists',
		},
		{
			code: '@keyframes foo { {} }',
			description: 'no selector',
		},
		{
			code: '@keyframes foo { .from {} }',
			description: 'not a keyframes selector',
		},
		...ACCEPT_TIMELINE_RANGE_NAME_TEST_CASES,
	],

	reject: [
		{
			code: '@keyframes foo { 0% {} }',
			fixed: '@keyframes foo { from {} }',
			fix: {
				range: [17, 19],
				text: 'from',
			},
			message: messages.expected('0%', 'from'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '@keyframes foo { 100% {} }',
			fixed: '@keyframes foo { to {} }',
			fix: {
				range: [17, 21],
				text: 'to',
			},
			message: messages.expected('100%', 'to'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@keyframes foo { 0% {} 100% {} }',
			fixed: '@keyframes foo { from {} to {} }',
			warnings: [
				{
					message: messages.expected('0%', 'from'),
					fix: {
						range: [17, 19],
						text: 'from',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.expected('100%', 'to'),
					fix: {
						range: [23, 27],
						text: 'to',
					},
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: '@keyframes foo { 0%, 0% {} }',
			fixed: '@keyframes foo { from, from {} }',
			warnings: [
				{
					message: messages.expected('0%', 'from'),
					fix: {
						range: [17, 19],
						text: 'from',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.expected('0%', 'from'),
					fix: undefined,
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: '@keyframes foo { 100%, 0% {} }',
			fixed: '@keyframes foo { to, from {} }',
			warnings: [
				{
					message: messages.expected('100%', 'to'),
					fix: {
						range: [17, 21],
						text: 'to',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.expected('0%', 'from'),
					fix: undefined,
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: '@keyframes foo { 0% {} 0% {} 100% {} }',
			fixed: '@keyframes foo { from {} from {} to {} }',
			description: 'duplicate selectors',
			warnings: [
				{
					message: messages.expected('0%', 'from'),
					fix: {
						range: [17, 19],
						text: 'from',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.expected('0%', 'from'),
					fix: {
						range: [23, 25],
						text: 'from',
					},
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 26,
				},
				{
					message: messages.expected('100%', 'to'),
					fix: {
						range: [29, 33],
						text: 'to',
					},
					line: 1,
					column: 30,
					endLine: 1,
					endColumn: 34,
				},
			],
		},
		{
			code: '@keyframes foo { 0% {} 50% {} 100% {} }',
			fixed: '@keyframes foo { from {} 50% {} to {} }',
			description: 'mixed notation - note that the middle is untouched',
			warnings: [
				{
					message: messages.expected('0%', 'from'),
					fix: {
						range: [17, 19],
						text: 'from',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.expected('100%', 'to'),
					fix: {
						range: [30, 34],
						text: 'to',
					},
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: '@keyframes foo { 0%, 100% {} }',
			fixed: '@keyframes foo { from, to {} }',
			description: 'selector lists',
			warnings: [
				{
					message: messages.expected('0%', 'from'),
					fix: {
						range: [17, 19],
						text: 'from',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.expected('100%', 'to'),
					fix: undefined,
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['percentage'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@keyframes foo { 0% {} }',
		},
		{
			code: '@keyframes foo { 100% {} }',
		},
		{
			code: '@keyframes foo { 0% {} 100% {} }',
		},
		{
			code: '@keyframes foo { 0% {} 0% {} 100% {} }',
			description: 'duplicate selectors',
		},
		{
			code: '@keyframes foo { 0%, 100% {} }',
			description: 'selector lists',
		},
		{
			code: stripIndent`
				@keyframes foo {
					/* stylelint-disable-next-line keyframe-selector-notation */
					from, /* stylelint-disable-next-line keyframe-selector-notation */
					from,
					/* stylelint-disable-next-line keyframe-selector-notation */
					from
					{}
				}
			`,
		},
		...ACCEPT_TIMELINE_RANGE_NAME_TEST_CASES,
	],

	reject: [
		{
			code: '@keyframes foo { from {} }',
			fixed: '@keyframes foo { 0% {} }',
			fix: {
				range: [17, 21],
				text: '0%',
			},
			message: messages.expected('from', '0%'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@keyframes foo { to {} }',
			fixed: '@keyframes foo { 100% {} }',
			fix: {
				range: [17, 19],
				text: '100%',
			},
			message: messages.expected('to', '100%'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '@keyframes foo { from {} to {} }',
			fixed: '@keyframes foo { 0% {} 100% {} }',
			warnings: [
				{
					message: messages.expected('from', '0%'),
					fix: {
						range: [17, 21],
						text: '0%',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.expected('to', '100%'),
					fix: {
						range: [25, 27],
						text: '100%',
					},
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: '@keyframes foo { from {} from {} to {} }',
			fixed: '@keyframes foo { 0% {} 0% {} 100% {} }',
			description: 'duplicate selectors',
			warnings: [
				{
					message: messages.expected('from', '0%'),
					fix: {
						range: [17, 21],
						text: '0%',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.expected('from', '0%'),
					fix: {
						range: [25, 29],
						text: '0%',
					},
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 30,
				},
				{
					message: messages.expected('to', '100%'),
					fix: {
						range: [33, 35],
						text: '100%',
					},
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 36,
				},
			],
		},
		{
			code: '@keyframes foo { from {} 50% {} to {} }',
			fixed: '@keyframes foo { 0% {} 50% {} 100% {} }',
			description: 'mixed notation - note that the middle is untouched',
			warnings: [
				{
					message: messages.expected('from', '0%'),
					fix: {
						range: [17, 21],
						text: '0%',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.expected('to', '100%'),
					fix: {
						range: [32, 34],
						text: '100%',
					},
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: '@keyframes foo { from, to {} }',
			fixed: '@keyframes foo { 0%, 100% {} }',
			description: 'selector lists',
			warnings: [
				{
					message: messages.expected('from', '0%'),
					fix: {
						range: [17, 21],
						text: '0%',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.expected('to', '100%'),
					fix: undefined,
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: stripIndent`
				@keyframes foo {
					/* a comment */
					from, /* a comment */
					from,
					/* a comment */
					from
					{}
				}
			`,
			fixed: stripIndent`
				@keyframes foo {
					/* a comment */
					0%, /* a comment */
					0%,
					/* a comment */
					0%
					{}
				}
			`,
			warnings: [
				{
					message: messages.expected('from', '0%'),
					fix: {
						range: [35, 39],
						text: '0%',
					},
					line: 3,
					column: 2,
					endLine: 3,
					endColumn: 6,
				},
				{
					message: messages.expected('from', '0%'),
					fix: undefined,
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 6,
				},
				{
					message: messages.expected('from', '0%'),
					fix: undefined,
					line: 6,
					column: 2,
					endLine: 6,
					endColumn: 6,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['percentage-unless-within-keyword-only-block'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@keyframes foo { 0% {} 100% {} }',
		},
		{
			code: '@keyframes foo { 0% {} 20%,80% {} 100% {} }',
		},
		{
			code: '@keyframes foo { 0%,100% {} }',
		},
		{
			code: '@keyframes foo { from {} to {} }',
		},
		{
			code: '@keyframes foo { from,to {} }',
		},
		{
			code: '@keyframes foo { from {} TO {} }',
		},
		{
			code: '@keyframes foo { from,TO {} }',
		},
		...ACCEPT_TIMELINE_RANGE_NAME_TEST_CASES,
	],

	reject: [
		{
			code: '@keyframes foo { from {} 100% {} }',
			fixed: '@keyframes foo { 0% {} 100% {} }',
			fix: {
				range: [17, 21],
				text: '0%',
			},
			message: messages.expected('from', '0%'),
		},
		{
			code: '@keyframes foo { 0% {} to {} }',
			fixed: '@keyframes foo { 0% {} 100% {} }',
			fix: {
				range: [23, 25],
				text: '100%',
			},
			message: messages.expected('to', '100%'),
		},
		{
			code: '@keyframes foo { from {} 20%,80% {} to {} }',
			fixed: '@keyframes foo { 0% {} 20%,80% {} 100% {} }',
			warnings: [
				{
					message: messages.expected('from', '0%'),
					fix: {
						range: [17, 21],
						text: '0%',
					},
				},
				{
					message: messages.expected('to', '100%'),
					fix: {
						range: [36, 38],
						text: '100%',
					},
				},
			],
		},
		{
			code: '@keyframes foo { from,100% {} }',
			fixed: '@keyframes foo { 0%,100% {} }',
			fix: {
				range: [17, 21],
				text: '0%',
			},
			message: messages.expected('from', '0%'),
		},
		{
			code: '@keyframes foo { 0%,to {} }',
			fixed: '@keyframes foo { 0%,100% {} }',
			fix: {
				range: [20, 22],
				text: '100%',
			},
			message: messages.expected('to', '100%'),
		},
		{
			code: '@keyframes foo { 0%,TO {} }',
			fixed: '@keyframes foo { 0%,100% {} }',
			fix: {
				range: [20, 22],
				text: '100%',
			},
			message: messages.expected('TO', '100%'),
		},
	],
});
