'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [2],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a,\n' + 'b { color: pink; }',
		},
		{
			code: 'a,\n' + 'b,\n' + 'c { color: pink; }',
		},
		{
			code: '@media print {\n' + '  a,\n' + '  b { color: pink;}\n' + '}',
		},
		{
			code: 'a {\n' + '  @nest b & ,\n' + '  &.foo {\n' + '    color: pink;\n' + '  }\n' + '}',
		},
		{
			code: 'a {\n' + '  @at-root b & ,\n' + '  &.foo {\n' + '    color: pink;\n' + '  }\n' + '}',
		},
		{
			code: 'a,\r\n' + 'b { color: pink; }',
		},
		{
			code: 'a,\r\n' + 'b,\r\n' + 'c { color: pink; }',
		},
		{
			code: '@media print {\r\n' + '  a,\r\n' + '  b { color: pink;}\r\n' + '}',
		},
		{
			code:
				'a {\r\n' +
				'  @nest b & ,\r\n' +
				'  &.foo {\r\n' +
				'    color: pink;\r\n' +
				'  }\r\n' +
				'}',
		},
		{
			code:
				'a {\r\n' +
				'  @at-root b & ,\r\n' +
				'  &.foo {\r\n' +
				'    color: pink;\r\n' +
				'  }\r\n' +
				'}',
		},
	],

	reject: [
		{
			code: 'a,\n' + '  b { color: pink; }',
			fixed: 'a,\n' + 'b { color: pink; }',

			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
		{
			code: 'a,\n' + 'b,\n' + ' c { color: pink; }',
			fixed: 'a,\n' + 'b,\n' + 'c { color: pink; }',

			message: messages.expected('0 spaces'),
			line: 3,
			column: 2,
		},
		{
			code: '@media print {\n' + '  a,\n' + 'b { color: pink;}\n' + '}',
			fixed: '@media print {\n' + '  a,\n' + '  b { color: pink;}\n' + '}',

			message: messages.expected('2 spaces'),
			line: 3,
			column: 1,
		},
		{
			code: '@media print {\n' + '  a,\n' + '   b { color: pink;}\n' + '}',
			fixed: '@media print {\n' + '  a,\n' + '  b { color: pink;}\n' + '}',

			message: messages.expected('2 spaces'),
			line: 3,
			column: 4,
		},
		{
			code: '@media print {\n' + '   a,\n' + '  b { color: pink;}\n' + '}',
			fixed: '@media print {\n' + '  a,\n' + '  b { color: pink;}\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 4,
		},
		{
			code: 'a {\n' + '@nest b & ,\n' + '  &.foo {\n' + '    color: pink;\n' + '  }\n' + '}',
			fixed: 'a {\n' + '  @nest b & ,\n' + '  &.foo {\n' + '    color: pink;\n' + '  }\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
		{
			code: 'a {\n' + '@at-root b & ,\n' + '  &.foo {\n' + '    color: pink;\n' + '  }\n' + '}',
			fixed: 'a {\n' + '  @at-root b & ,\n' + '  &.foo {\n' + '    color: pink;\n' + '  }\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
		{
			code: 'a,\r\n' + '  b { color: pink; }',
			fixed: 'a,\r\n' + 'b { color: pink; }',

			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
		{
			code: 'a,\r\n' + 'b,\r\n' + ' c { color: pink; }',
			fixed: 'a,\r\n' + 'b,\r\n' + 'c { color: pink; }',

			message: messages.expected('0 spaces'),
			line: 3,
			column: 2,
		},
		{
			code: '@media print {\r\n' + '  a,\r\n' + 'b { color: pink;}\r\n' + '}',
			fixed: '@media print {\r\n' + '  a,\r\n' + '  b { color: pink;}\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 3,
			column: 1,
		},
		{
			code: '@media print {\r\n' + '  a,\r\n' + '   b { color: pink;}\r\n' + '}',
			fixed: '@media print {\r\n' + '  a,\r\n' + '  b { color: pink;}\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 3,
			column: 4,
		},
		{
			code: '@media print {\r\n' + '   a,\r\n' + '  b { color: pink;}\r\n' + '}',
			fixed: '@media print {\r\n' + '  a,\r\n' + '  b { color: pink;}\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 4,
		},
		{
			code:
				'a {\r\n' + '@nest b & ,\r\n' + '  &.foo {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',
			fixed:
				'a {\r\n' +
				'  @nest b & ,\r\n' +
				'  &.foo {\r\n' +
				'    color: pink;\r\n' +
				'  }\r\n' +
				'}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
		{
			code:
				'a {\r\n' +
				'@at-root b & ,\r\n' +
				'  &.foo {\r\n' +
				'    color: pink;\r\n' +
				'  }\r\n' +
				'}',
			fixed:
				'a {\r\n' +
				'  @at-root b & ,\r\n' +
				'  &.foo {\r\n' +
				'    color: pink;\r\n' +
				'  }\r\n' +
				'}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
	],
});
