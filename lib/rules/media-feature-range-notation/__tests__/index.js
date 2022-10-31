'use strict';

const { messages, ruleName } = require('..');
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
			code: '@media (1px <= width >= 2px) {}',
			description: 'range type media feature in context notation with two values',
		},
	],

	reject: [
		{
			code: '@media (min-width: 1px) {}',
			description: 'range type media feature in prefix notation',
			message: messages.expected('context'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media screen and (min-width: 1px) {}',
			description: 'range type media feature in prefix notation with keyword',
			message: messages.expected('context'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media not print, (min-width: 1px) {}',
			description: 'range type media feature in prefix notation in media query list',
			message: messages.expected('context'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 33,
		},
	],
});

testRule({
	ruleName,
	config: ['prefix'],
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
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media screen and (width >= 1px) {}',
			description: 'range type media feature in context notation with keyword',
			message: messages.expected('prefix'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},

		{
			code: '@media not print, (width >= 1px) {}',
			description: 'range type media feature in context notation in media query list',
			message: messages.expected('prefix'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 33,
		},

		{
			code: '@media (1px < width >= 2px) {}',
			description: 'range type media feature in context notation with two values',
			message: messages.expected('prefix'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
	],
});
