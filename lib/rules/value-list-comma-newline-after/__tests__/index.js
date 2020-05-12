'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { background-size: 0,\n0; }',
		},
		{
			code: 'a { background-size: 0,\n\n0; }',
		},
		{
			code: 'a { background-size: 0 ,\n  0; }',
		},
		{
			code: 'a { background-size: 0 ,\r\n  0; }',
			description: 'CRLF',
		},
		{
			code: 'a { background-size: 0 ,\r\n\r\n  0; }',
			description: 'Double CRLF',
		},
		{
			code: 'a::before { content: "foo,bar,baz"; }',
			description: 'string',
		},
		{
			code: 'a { transform: translate(1,1); }',
			description: 'ignores function',
		},
		{
			code: '$grid-breakpoints: (\n(xs),\n(sm, 768px)\n) !default;',
			description: 'ignores scss maps',
		},
		{
			code: 'a { background-size: 0, //\n0; }',
			description: 'ignores single line comments',
		},
		{
			code: 'a { background-size: 0, /**/\n0; }',
			description: 'ignores multi line comments',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0, 0; }',
			fixed: 'a { background-size: 0,\n 0; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-size: 0,  0; }',
			fixed: 'a { background-size: 0,\n  0; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-size: 0,\t0; }',
			fixed: 'a { background-size: 0,\n\t0; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-size: 0, /**/0; }',
			fixed: 'a { background-size: 0, /**/\n0; }',
			message: messages.expectedAfter(),
			description: 'ignores multi line comments',
			line: 1,
			column: 28,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a { background-size: 0,\n0,\n0; }',
		},
		{
			code: 'a { background-size: 0, //\n0, /**/\n0; }',
			description: 'with comments',
		},
		{
			code: 'a { background-size: 0 ,\n  0,\n0; }',
		},
		{
			code: 'a { background-size: 0 ,\r\n  0,\r\n0; }',
			description: 'CRLF',
		},
		{
			code: 'a { background-size: 0, 0; }',
			description: 'ignores single-line',
		},
		{
			code: 'a { background-size: 0, 0;\n}',
			description: 'ignores single-line list, multi-line block',
		},
		{
			code: 'a { background-size: 0, 0;\r\n}',
			description: 'ignores single-line list, multi-line block with CRLF',
		},
		{
			code: 'a { background-size: 0, /**/ 0; }',
			description: 'ignores single-line list, multi-line block with comment',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0,\n0, 0; }',
			fixed: 'a { background-size: 0,\n0,\n 0; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
		{
			code: 'a { background-size: 0, //\n0, /**/0; }',
			fixed: 'a { background-size: 0, //\n0, /**/\n0; }',
			description: 'with comments',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 7,
		},
		{
			code: 'a { background-size: 0,\n0,  0; }',
			fixed: 'a { background-size: 0,\n0,\n  0; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
		{
			code: 'a { background-size: 0,\n0,\t0; }',
			fixed: 'a { background-size: 0,\n0,\n\t0; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
		{
			code: 'a { background-size: 0,\r\n0,\t0; }',
			fixed: 'a { background-size: 0,\r\n0,\r\n\t0; }',
			description: 'CRLF',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a { background-size: 0\n,0\n,0; }',
		},
		{
			code: 'a { background-size: 0 //\n,0 /**/\n,0; }',
			description: 'with comments',
		},
		{
			code: 'a { background-size: 0\r\n,0\r\n,0; }',
			description: 'CRLF',
		},
		{
			code: 'a { background-size: 0, 0; }',
			description: 'ignores single-line',
		},
		{
			code: 'a { background-size: 0, 0;\n}',
			description: 'ignores single-line list, multi-line block',
		},
		{
			code: 'a { background-size: 0, 0;\r\n}',
			description: 'ignores single-line list, multi-line block with CRLF',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0\n,0\n, 0; }',
			fixed: 'a { background-size: 0\n,0\n,0; }',
			message: messages.rejectedAfterMultiLine(),
			line: 3,
			column: 1,
		},
		{
			code: 'a { background-size: 0\n,0\n,  0; }',
			fixed: 'a { background-size: 0\n,0\n,0; }',
			message: messages.rejectedAfterMultiLine(),
			line: 3,
			column: 1,
		},
		{
			code: 'a { background-size: 0\r\n,0\r\n,  0; }',
			fixed: 'a { background-size: 0\r\n,0\r\n,0; }',
			description: 'CRLF',
			message: messages.rejectedAfterMultiLine(),
			line: 3,
			column: 1,
		},
		{
			code: 'a { background-size: 0\n,0\n,\t0; }',
			fixed: 'a { background-size: 0\n,0\n,0; }',
			message: messages.rejectedAfterMultiLine(),
			line: 3,
			column: 1,
		},
	],
});
