'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { background-size: 0 , 0; }',
		},
		{
			code: 'a { background-size: 0 ,0; }',
		},
		{
			code: 'a::before { content: "foo,bar,baz"; }',
			description: 'strings',
		},
		{
			code: 'a { transform: translate(1,1); }',
			description: 'function arguments',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0, 0; }',
			fixed: 'a { background-size: 0 , 0; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-size: 0  , 0; }',
			fixed: 'a { background-size: 0 , 0; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 25,
		},
		{
			code: 'a { background-size: 0\n, 0; }',
			fixed: 'a { background-size: 0 , 0; }',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { background-size: 0\r\n, 0; }',
			fixed: 'a { background-size: 0 , 0; }',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { background-size: 0\t, 0; }',
			fixed: 'a { background-size: 0 , 0; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { background-size: 0/*comment*/, 0; }',
			fixed: 'a { background-size: 0/*comment*/ , 0; }',
			description: 'comment',
			message: messages.expectedBefore(),
			line: 1,
			column: 34,
		},
		{
			code: 'a{b: 0,0,0,0,0,0,0,0; }',
			fixed: 'a{b: 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0; }',
			warnings: [
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 7,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 9,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 11,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 13,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 15,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 17,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 19,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a { background-size: 0, 0; }',
		},
		{
			code: 'a { background-size: 0,0; }',
		},
		{
			code: 'a::before { content: "foo ,bar ,baz"; }',
			description: 'strings',
		},
		{
			code: 'a { transform: translate(1 ,1); }',
			description: 'function arguments',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0 , 0; }',
			fixed: 'a { background-size: 0, 0; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { background-size: 0  , 0; }',
			fixed: 'a { background-size: 0, 0; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 25,
		},
		{
			code: 'a { background-size: 0\n, 0; }',
			fixed: 'a { background-size: 0, 0; }',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { background-size: 0\r\n, 0; }',
			fixed: 'a { background-size: 0, 0; }',
			description: 'CRLF',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { background-size: 0\t, 0; }',
			fixed: 'a { background-size: 0, 0; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { background-size: 0 /*comment*/ , 0; }',
			fixed: 'a { background-size: 0 /*comment*/, 0; }',
			description: 'comment',
			message: messages.rejectedBefore(),
			line: 1,
			column: 36,
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: 'a { background-size: 0 , 0; }',
		},
		{
			code: 'a { background-size: 0 ,0; }',
		},
		{
			code: 'a { background-size: 0 ,0;\n}',
			description: 'single-line list, multi-line block',
		},
		{
			code: 'a { background-size: 0 ,0;\r\n}',
			description: 'single-line list, multi-line block with CRLF',
		},
		{
			code: 'a { background-size: 0,\n0; }',
			description: 'ignores multi-line list',
		},
		{
			code: 'a { background-size: 0,\r\n0; }',
			description: 'ignores multi-line list with CRLF',
		},
		{
			code: 'a::before { content: "foo,bar,baz"; }',
			description: 'strings',
		},
		{
			code: 'a { transform: translate(1,1); }',
			description: 'function arguments',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0, 0; }',
			fixed: 'a { background-size: 0 , 0; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-size: 0, 0;\n}',
			fixed: 'a { background-size: 0 , 0;\n}',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-size: 0, 0;\r\n}',
			fixed: 'a { background-size: 0 , 0;\r\n}',
			description: 'CRLF',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-size: 0  , 0; }',
			fixed: 'a { background-size: 0 , 0; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 25,
		},
		{
			code: 'a { background-size: 0\t, 0; }',
			fixed: 'a { background-size: 0 , 0; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 24,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	fix: true,

	accept: [
		{
			code: 'a { background-size: 0, 0; }',
		},
		{
			code: 'a { background-size: 0,0; }',
		},
		{
			code: 'a { background-size: 0,0;\n}',
			description: 'single-line list, multi-line block',
		},
		{
			code: 'a { background-size: 0,0;\r\n}',
			description: 'single-line list, multi-line block with CRLF',
		},
		{
			code: 'a { background-size: 0 ,\n0; }',
			description: 'ignores multi-line list',
		},
		{
			code: 'a { background-size: 0 ,\r\n0; }',
			description: 'ignores multi-line list with CRLF',
		},
		{
			code: 'a::before { content: "foo ,bar ,baz"; }',
			description: 'strings',
		},
		{
			code: 'a { transform: translate(1 ,1); }',
			description: 'function arguments',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0 , 0; }',
			fixed: 'a { background-size: 0, 0; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { background-size: 0 , 0;\n}',
			fixed: 'a { background-size: 0, 0;\n}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { background-size: 0 , 0;\r\n}',
			fixed: 'a { background-size: 0, 0;\r\n}',
			description: 'CRLF',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { background-size: 0  , 0; }',
			fixed: 'a { background-size: 0, 0; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 25,
		},
		{
			code: 'a { background-size: 0\t, 0; }',
			fixed: 'a { background-size: 0, 0; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 24,
		},
	],
});
