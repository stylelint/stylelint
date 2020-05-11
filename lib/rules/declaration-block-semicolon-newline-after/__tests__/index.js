'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\n}',
		},
		{
			code: 'a { color: pink;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\n\n}',
		},
		{
			code: 'a { color: pink;\r\n\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a::before { content: ";a";\n}',
		},
		{
			code: 'a {\ncolor: pink;\n top:0;\n}',
		},
		{
			code: 'a {\ncolor: pink;\n  top:0;\n}',
		},
		{
			code: 'a {\ncolor: pink;\n\ttop:0;\n}',
		},
		{
			code: 'a {\r\ncolor: pink;\r\n\ttop:0;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0; }',
			description: 'space between trailing semicolon and closing brace',
		},
		{
			code: 'a { color: pink;\ntop: 0;}',
			description: 'no space between trailing semicolon and closing brace',
		},
		{
			code: 'a { color: pink;\r\ntop: 0;}',
			description: 'no space between trailing semicolon and closing brace and CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0}',
		},
		{
			code: 'a {\n  color: pink; /* 1 */\n  top: 0\n}',
			description: 'end-of-line comment',
		},
		{
			code: 'a {\n  color: pink;    /* 1 */\n  top: 0\n}',
			description: 'end-of-line comment a few spaces after',
		},
		{
			code: 'a {\r\n  color: pink;\t/* 1 */\r\n  top: 0\r\n}',
			description: 'end-of-line comment and CRLF',
		},
		{
			code: 'a {\n  color: pink;\n  /* 1 */\n  top: 0\n}',
			description: 'next-line comment',
		},
		{
			code: 'a,\nb { color: pink;\ntop: 0}',
			description: 'multi-line rule, multi-line declaration-block',
		},
		{
			code: 'a,\r\nb { color: pink;\r\ntop: 0}',
			description: 'multi-line rule, multi-line declaration-block and CRLF',
		},
	],

	reject: [
		{
			code: 'a { color: pink;top: 0; }',
			fixed: 'a { color: pink;\ntop: 0; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; top: 0; }',
			fixed: 'a { color: pink;\n top: 0; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; top: 0; }',
			fixed: 'a { color: pink;\n top: 0; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;\ttop: 0; }',
			fixed: 'a { color: pink;\n\ttop: 0; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 17,
		},
		{
			code: 'a {\n  color: pink; /* 1 */ top: 0\n}',
			fixed: 'a {\n  color: pink; /* 1 */\n top: 0\n}',
			description: 'next node is comment without newline after',
			message: messages.expectedAfter(),
			line: 2,
			column: 15,
		},
		{
			code: 'a {\r\n  color: pink; /* 1 */ top: 0\r\n}',
			fixed: 'a {\r\n  color: pink; /* 1 */\r\n top: 0\r\n}',
			description: 'CRLF and next node is comment without newline after',
			message: messages.expectedAfter(),
			line: 2,
			column: 15,
		},
		{
			code: 'a { color: pink; \n top: 0; }',
			fixed: 'a { color: pink;\n top: 0; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 17,
		},
		{
			code: 'a {\n  color: pink; /* 1 */ /* 2 */ top: 0\n}',
			fixed: 'a {\n  color: pink; /* 1 */ /* 2 */\n top: 0\n}',
			description: 'next*2 node is comment',
			message: messages.expectedAfter(),
			line: 2,
			column: 15,
		},
		{
			code: 'a {\n  color: pink; /* 1 */ \n top: 0\n}',
			fixed: 'a {\n  color: pink; /* 1 */\n top: 0\n}',
			message: messages.expectedAfter(),
			line: 2,
			column: 15,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a {\ncolor: pink;\n}',
		},
		{
			code: 'a::before {\ncontent: ";a";\n}',
		},
		{
			code: 'a::before {\r\ncontent: ";a";\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a {\ncolor: pink;\n top:0;\n}',
		},
		{
			code: 'a {\ncolor: pink;\n  top:0;\n}',
		},
		{
			code: 'a {\r\ncolor: pink;\r\n  top:0;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a {\ncolor: pink;\n\ttop:0;\n}',
		},
		{
			code: 'a {\ncolor: pink;\ntop: 0; }',
			description: 'space between trailing semicolon and closing brace',
		},
		{
			code: 'a {\ncolor: pink;\ntop: 0;}',
			description: 'no space between trailing semicolon and closing brace',
		},
		{
			code: 'a { color: pink; top: 0; }',
		},
		{
			code: 'a { color: pink; /* 1 */ top: 0; }',
		},
		{
			code: 'a,\nb { color: pink; top: 0}',
			description: 'multi-line rule, single-line declaration-block',
		},
		{
			code: 'a,\r\nb { color: pink; top: 0}',
			description: 'multi-line rule, single-line declaration-block and CRLF',
		},
	],

	reject: [
		{
			code: 'a {\ncolor: pink;top: 0;\n}',
			fixed: 'a {\ncolor: pink;\ntop: 0;\n}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\ncolor: pink; top: 0;\n}',
			fixed: 'a {\ncolor: pink;\n top: 0;\n}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\r\ncolor: pink; top: 0;\r\n}',
			fixed: 'a {\r\ncolor: pink;\r\n top: 0;\r\n}',
			description: 'CRLF',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\ncolor: pink; top: 0;\n}',
			fixed: 'a {\ncolor: pink;\n top: 0;\n}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\ncolor: pink;\ttop: 0;\n}',
			fixed: 'a {\ncolor: pink;\n\ttop: 0;\n}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\r\ncolor: pink;\ttop: 0;\r\n}',
			fixed: 'a {\r\ncolor: pink;\r\n\ttop: 0;\r\n}',
			description: 'CRLF',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a {\ncolor: pink;\n}',
		},
		{
			code: 'a {\r\ncolor: pink;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a::before {\ncontent: ";\na";\n}',
		},
		{
			code: 'a {\ncolor: pink;top: 0; }',
			description: 'space between trailing semicolon and closing brace',
		},
		{
			code: 'a {\ncolor: pink;top: 0;}',
			description: 'no space between trailing semicolon and closing brace',
		},
		{
			code: 'a { color: pink; top: 0; }',
		},
		{
			code: 'a,\nb { color: pink; top: 0}',
			description: 'multi-line rule, single-line declaration-block',
		},
	],

	reject: [
		{
			code: 'a {\ncolor: pink; top: 0;\n}',
			fixed: 'a {\ncolor: pink;top: 0;\n}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\ncolor: pink;  top: 0;\n}',
			fixed: 'a {\ncolor: pink;top: 0;\n}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\ncolor: pink;\ntop: 0;\n}',
			fixed: 'a {\ncolor: pink;top: 0;\n}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\r\ncolor: pink;\r\ntop: 0;\r\n}',
			fixed: 'a {\r\ncolor: pink;top: 0;\r\n}',
			description: 'CRLF',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\ncolor: pink;\ttop: 0;\n}',
			fixed: 'a {\ncolor: pink;top: 0;\n}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\ncolor: pink; /*comment*/ top: 0;\n}',
			fixed: 'a {\ncolor: pink; /*comment*/top: 0;\n}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code: 'a {\n  color: pink; /* 1 */ /* 2 */\ntop: 0\n}',
			fixed: 'a {\n  color: pink; /* 1 */ /* 2 */top: 0\n}',
			description: 'next*2 node is comment',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 15,
		},
		{
			code: 'a {\n  color: pink; /* 1 */ \n top: 0\n}',
			fixed: 'a {\n  color: pink; /* 1 */top: 0\n}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 15,
		},
	],
});
