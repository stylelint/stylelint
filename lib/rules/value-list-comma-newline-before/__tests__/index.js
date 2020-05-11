'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],

	accept: [
		{
			code: 'a { background-size: 0\n,0\n,0; }',
		},
		{
			code: 'a { background-size: 0\n\n,0\n\n,0; }',
		},
		{
			code: 'a { background-size: 0\n,  0\n,\t0; }',
		},
		{
			code: 'a { background-size: 0\r\n,  0\r\n,\t0; }',
			description: 'CRLF',
		},
		{
			code: 'a { background-size: 0\r\n\r\n,  0\r\n,\t0; }',
			description: 'Double CRLF',
		},
		{
			code: 'a { background-size: 0\n    ,0\n,0; }',
			description: 'indentation after the newline before the comma',
		},
		{
			code: 'a { background-size: 0\n\t\t,0\n,0; }',
			description: 'indentation after the newline before the comma',
		},
		{
			code: 'a { background-size: 0\r\n\t\t,0\r\n,0; }',
			description: 'indentation after the CRLF before the comma',
		},
		{
			code: 'a::before { content: "foo,bar,baz"; }',
			description: 'string',
		},
		{
			code: 'a { transform: translate(1,1); }',
			description: 'function arguments',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0, 0; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-size: 0 , 0; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { background-size: 0  , 0; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 25,
		},
		{
			code: 'a { background-size: 0\t, 0; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 24,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],

	accept: [
		{
			code: 'a { background-size: 0\n,0\n,0; }',
		},
		{
			code: 'a { background-size: 0\n,  0\n,\t0; }',
		},
		{
			code: 'a { background-size: 0\r\n,  0\r\n,\t0; }',
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
			code: 'a { background-size: 0\n, 0, 0; }',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 4,
		},
		{
			code: 'a { background-size: 0\n, 0 , 0; }',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 5,
		},
		{
			code: 'a { background-size: 0\r\n, 0 , 0; }',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 5,
		},
		{
			code: 'a { background-size: 0\n, 0\t, 0; }',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 5,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],

	accept: [
		{
			code: 'a { background-size: 0,\n0,\n0; }',
		},
		{
			code: 'a { background-size: 0 ,0; }',
			description: 'ignores single-line',
		},
		{
			code: 'a { background-size: 0 ,0;\n}',
			description: 'ignores single-line list, multi-line block',
		},
	],

	reject: [
		{
			code: 'a { background-size: 0,\n0\n, 0; }',
			message: messages.rejectedBeforeMultiLine(),
			line: 3,
			column: 1,
		},
		{
			code: 'a { background-size: 0,\r\n0\r\n, 0; }',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine(),
			line: 3,
			column: 1,
		},
		{
			code: 'a { background-size: 0\n,\t0,\n0; }',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { background-size: 0\r\n,\t0,\r\n0; }',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 1,
		},
	],
});
