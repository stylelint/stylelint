'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a:nth-child(1)',
		},
		{
			code: 'a:nth-child(0n+1)',
		},
		{
			code: 'a:nth-child(0n-1)',
		},
		{
			code: 'a:nth-child(2n+0)',
		},
		{
			code: 'a:nth-child(2n-0)',
		},
		{
			code: 'a:nth-child(1 of a) {}',
		},
		{
			code: 'a:nth-last-child(1)',
		},
		{
			code: 'a:nth-of-type(1)',
		},
		{
			code: 'a:nth-last-of-type(1)',
		},
	],

	reject: [
		{
			code: 'a:nth-child(0) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a:nth-child(0n) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a:nth-child(+0n) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a:nth-child(-0n) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a:nth-child(0n+0) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a:nth-child(0n + 0) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a:nth-child(0n-0) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a:nth-child(-0n-0) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a:nth-child(0 of a) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a:nth-child(0), a:nth-child(1) {}',
			message: messages.rejected('nth-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a:nth-last-child(0) {}',
			message: messages.rejected('nth-last-child'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a:nth-of-type(0) {}',
			message: messages.rejected('nth-of-type'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a:nth-last-of-type(0) {}',
			message: messages.rejected('nth-last-of-type'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a:nth-child(3n + - 6) {}',
			message: messages.rejectedParseError('a:nth-child(3n + - 6)'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a:nth-child(3 n) {}',
			message: messages.rejectedParseError('a:nth-child(3 n)'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a:nth-child(+ 2) {}',
			message: messages.rejectedParseError('a:nth-child(+ 2)'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a:nth-child(+ 2n) {}',
			message: messages.rejectedParseError('a:nth-child(+ 2n)'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a:nth-child(2), a:nth-child(+ 2n) {}',
			message: messages.rejectedParseError('a:nth-child(+ 2n)'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 32,
		},
	],
});
