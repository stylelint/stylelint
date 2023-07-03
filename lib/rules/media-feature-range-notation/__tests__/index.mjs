import { stripIndent } from 'common-tags';

import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['context'],
	fix: true,

	accept: [
		{
			code: '@media {}',
			description: 'empty media query',
		},
		{
			code: '@media () {}',
			description: 'empty media feature',
		},
		{
			code: '@media screen {}',
			description: 'keyword',
		},
		{
			code: '@media (color) {}',
			description: 'range type media feature in boolean context',
		},
		{
			code: '@media (color > 0) {}',
			description: 'range type media feature in non-boolean context',
		},
		{
			code: '@media (pointer: fine) {}',
			description: 'discrete type media feature',
		},
		{
			code: '@media (width >= 1px) {}',
			description: 'range type media feature in context notation',
		},
		{
			code: '@media screen and (width >= 1px) {}',
			description: 'range type media feature in context notation with keyword',
		},
		{
			code: '@media not print, (width >= 1px) {}',
			description: 'range type media feature in context notation in media query list',
		},
		{
			code: '@media (1px <= width <= 2px) {}',
			description: 'range type media feature in context notation with two values',
		},
	],

	reject: [
		{
			code: '@media (min-width: 1px) {}',
			fixed: '@media (width >= 1px) {}',
			description: 'range type media feature in prefix notation',
			message: messages.expected('context'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media screen and (min-width: 1px) {}',
			fixed: '@media screen and (width >= 1px) {}',
			description: 'range type media feature in prefix notation with keyword',
			message: messages.expected('context'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '@media not print, (min-width: 1px) {}',
			fixed: '@media not print, (width >= 1px) {}',
			description: 'range type media feature in prefix notation in media query list',
			message: messages.expected('context'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '@media not print, ( min-width  : 1px ) {}',
			fixed: '@media not print, ( width  >= 1px ) {}',
			description: 'whitespace in and around media features',
			message: messages.expected('context'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: stripIndent`
				@media (min-width: 1px)
				  and (max-width: 2px) {}
			`,
			fixed: stripIndent`
				@media (width >= 1px)
				  and (width <= 2px) {}
			`,
			description: 'two range type media features in prefix notation',
			warnings: [
				{ message: messages.expected('context'), line: 1, column: 8, endLine: 1, endColumn: 24 },
				{ message: messages.expected('context'), line: 2, column: 7, endLine: 2, endColumn: 23 },
			],
		},
	],
});

testRule({
	ruleName,
	config: ['prefix'],

	accept: [
		{
			code: '@media {}',
			description: 'empty media query',
		},
		{
			code: '@media () {}',
			description: 'empty media feature',
		},
		{
			code: '@media screen {}',
			description: 'keyword',
		},
		{
			code: '@media (color) {}',
			description: 'range type media feature in boolean context',
		},
		{
			code: '@media (min-color: 1) {}',
			description: 'range type media feature in non-boolean context',
		},
		{
			code: '@media (pointer: fine) {}',
			description: 'discrete type media query',
		},
		{
			code: '@media (min-width: 1px) {}',
			description: 'range type media feature in prefix notation',
		},
		{
			code: '@media screen and (min-width: 1px) {}',
			description: 'range type media feature in prefix notation with keyword',
		},
		{
			code: '@media not print, (min-width: 1px) {}',
			description: 'range type media feature in prefix notation in media query list',
		},
	],

	reject: [
		{
			code: '@media (width >= 1px) {}',
			description: 'range type media feature in context notation',
			message: messages.expected('prefix'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@media screen and (width >= 1px) {}',
			description: 'range type media feature in context notation with keyword',
			message: messages.expected('prefix'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: '@media not print, (width >= 1px) {}',
			description: 'range type media feature in context notation in media query list',
			message: messages.expected('prefix'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: '@media (1px < width <= 2px) {}',
			description: 'range type media feature in context notation with two values',
			message: messages.expected('prefix'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 28,
		},
	],
});
