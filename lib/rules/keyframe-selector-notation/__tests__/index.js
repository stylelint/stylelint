'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['keyword'],
	fix: true,

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
	],

	reject: [
		{
			code: '@keyframes foo { 0% {} }',
			fixed: '@keyframes foo { from {} }',
			message: messages.expected('0%', 'from'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '@keyframes foo { 100% {} }',
			fixed: '@keyframes foo { to {} }',
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
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.expected('100%', 'to'),
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['percentage'],
	fix: true,

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
	],

	reject: [
		{
			code: '@keyframes foo { from {} }',
			fixed: '@keyframes foo { 0% {} }',
			message: messages.expected('from', '0%'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@keyframes foo { to {} }',
			fixed: '@keyframes foo { 100% {} }',
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
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.expected('to', '100%'),
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
	],
});
