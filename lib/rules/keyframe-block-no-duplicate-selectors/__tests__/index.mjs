import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@keyframes foo { 0% {} 100% {} }',
		},
		{
			code: '@keyframes foo { from {} to {} }',
		},
		{
			code: stripIndent`
				@keyframes foo {
					from {}
					/* stylelint-disable-next-line keyframe-block-no-duplicate-selectors */
					from, /* stylelint-disable-next-line keyframe-block-no-duplicate-selectors */
					from,
					/* stylelint-disable-next-line keyframe-block-no-duplicate-selectors */
					from
					{}
				}
			`,
		},
	],

	reject: [
		{
			code: '@keyframes foo { from {} from {} }',
			message: messages.rejected('from'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: '@keyframes foo { 0% {} 0% {} }',
			message: messages.rejected('0%'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '@keyframes foo { from {} FROM {} }',
			message: messages.rejected('FROM'),
		},
		{
			code: '@keyframes foo { from {} to {} to {} }',
			message: messages.rejected('to'),
		},
		{
			code: '@keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@-webkit-keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@-moz-keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@keyframes foo { 0% {} 0%, 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: stripIndent`
				@keyframes foo {
					from {}
					/* a comment */
					from, /* a comment */
					from,
					/* a comment */
					from
					{}
				}
			`,
			warnings: [
				{
					message: messages.rejected('from', 0),
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 6,
				},
				{
					message: messages.rejected('from', 0),
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 6,
				},
				{
					message: messages.rejected('from', 0),
					line: 7,
					column: 2,
					endLine: 7,
					endColumn: 6,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '@keyframes foo { #{$bar} {} #{$bar} {} }',
			description: 'SCSS interpolation in selector',
		},
	],
});
