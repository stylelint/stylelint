import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['context'],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [8, 18],
				text: 'width >=',
			},
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
			fix: {
				range: [19, 29],
				text: 'width >=',
			},
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
			fix: {
				range: [19, 29],
				text: 'width >=',
			},
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
			fix: {
				range: [20, 32],
				text: 'width  >=',
			},
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
				  and (max-width: 2px)
				  and (width: 3px) {}
			`,
			fixed: stripIndent`
				@media (width >= 1px)
				  and (width <= 2px)
				  and (width = 3px) {}
			`,
			description: 'three range type media features in prefix notation',
			warnings: [
				{
					message: messages.expected('context'),
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 24,
					fix: { range: [8, 18], text: 'width >=' },
				},
				{
					message: messages.expected('context'),
					line: 2,
					column: 7,
					endLine: 2,
					endColumn: 23,
					fix: undefined,
				},
				{
					message: messages.expected('context'),
					line: 3,
					column: 7,
					endLine: 3,
					endColumn: 19,
					fix: undefined,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['context', { except: ['exact-value'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@media (width: 1px) {}',
		},
		{
			code: '@media (1px: width) {}',
		},
		{
			code: '@media (width >= 1px) {}',
		},
		{
			code: '@media (1px <= width <= 2px) {}',
		},
	],
	reject: [
		{
			unfixable: true,
			code: '@media (width = 1px) {}',
			message: messages.expected('prefix'),
		},
		{
			unfixable: true,
			code: '@media (1px = width) {}',
			message: messages.expected('prefix'),
		},
		{
			code: '@media (min-width: 1px) {}',
			fixed: '@media (width >= 1px) {}',
			fix: {
				range: [8, 18],
				text: 'width >=',
			},
			message: messages.expected('context'),
			column: 8,
			endColumn: 24,
			endLine: 1,
			line: 1,
		},
		{
			code: stripIndent`
				@media (min-width: 1px)
					and (max-width: 2px)
					and (width: 3px) {}
			`,
			fixed: stripIndent`
				@media (width >= 1px)
					and (width <= 2px)
					and (width: 3px) {}
			`,
			warnings: [
				{
					message: messages.expected('context'),
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 24,
					fix: {
						range: [8, 18],
						text: 'width >=',
					},
				},
				{
					message: messages.expected('context'),
					line: 2,
					column: 6,
					endLine: 2,
					endColumn: 22,
					fix: undefined,
				},
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

testRule({
	ruleName,
	config: ['prefix', { except: ['exact-value'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@media (width = 1px) {}',
		},
		{
			code: '@media (1px = width) {}',
		},
		{
			code: '@media (min-width: 1px) {}',
		},
		{
			code: '@media (pointer: fine) {}',
		},
		{
			code: '@media (color) {}',
		},
	],
	reject: [
		{
			code: '@media (width > 1px) {}',
			unfixable: true,
			message: messages.expected('prefix'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '@media (width: 1px) {}',
			fixed: '@media (width = 1px) {}',
			fix: {
				range: [13, 14],
				text: ' =',
			},
			message: messages.expected('context'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 20,
		},
	],
});
