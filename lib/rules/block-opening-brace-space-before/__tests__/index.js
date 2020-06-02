'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: '@import url(x.css)',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: '@media print { a { color: pink; } }',
		},
		{
			code: 'a {{ &:hover { color: pink; }}}',
		},
		{
			code: 'a {\n&:hover { color: pink; }}',
		},
	],

	reject: [
		{
			code: 'a{ color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 1,
		},
		{
			code: 'a  { color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\n{ color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\r\n{ color: pink; }',
			fixed: 'a { color: pink; }',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print\n{ a { color: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print { a\n{ color: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			message: messages.expectedBefore(),
			line: 1,
			column: 17,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignoreAtRules: ['for', '/fo/', /fo/] }],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: '@for ...\n{ color: pink; }',
		},
		{
			code: '@for ...\r\n{ color: pink; }',
		},
	],

	reject: [
		{
			code: 'a{ color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignoreSelectors: ['a', '/a/', /a/] }],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a{ color: pink; }',
		},
		{
			code: 'a\n{ color: pink; }',
		},
		{
			code: 'a\r\n{ color: pink; }',
		},
	],

	reject: [
		{
			code: 'b{ color: pink; }',
			fixed: 'b { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a{ color: pink; }',
		},
		{
			code: '@media print{ a{ color: pink; } }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a{ color: pink; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: 'a  { color: pink; }',
			fixed: 'a{ color: pink; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink; }',
			fixed: 'a{ color: pink; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\n{ color: pink; }',
			fixed: 'a{ color: pink; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\r\n{ color: pink; }',
			fixed: 'a{ color: pink; }',
			description: 'CRLF',
			message: messages.rejectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print { a{ color: pink; } }',
			fixed: '@media print{ a{ color: pink; } }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print{ a { color: pink; } }',
			fixed: '@media print{ a{ color: pink; } }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: '@media print { a { color: pink; } }',
		},
		{
			code: 'a{ color:\npink; }',
		},
		{
			code: '@media print { a{ color:\npink; } }',
		},
		{
			code: '@media print{ a { color:\npink; } }',
		},
		{
			code: '@media print{\na { color: pink; } }',
		},
	],

	reject: [
		{
			code: 'a{ color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 1,
		},
		{
			code: 'a  { color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\n{ color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\r\n{ color: pink; }',
			fixed: 'a { color: pink; }',
			description: 'CRLF',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print\n{ a { color: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print { a\n{ color: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 17,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	fix: true,

	accept: [
		{
			code: 'a{ color: pink; }',
		},
		{
			code: '@media print{ a{ color: pink; } }',
		},
		{
			code: 'a { color:\npink; }',
		},
		{
			code: 'a { color:\r\npink; }',
			description: 'CRLF',
		},
		{
			code: '@media print { a { color:\npink; } }',
		},
		{
			code: '@media print{ a{ color:\npink; } }',
		},
		{
			code: '@media print {\na{ color: pink; } }',
		},
		{
			code: '@media print{\na{ color: pink; } }',
		},
		{
			code: '@media print{\r\na{ color: pink; } }',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a{ color: pink; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a  { color: pink; }',
			fixed: 'a{ color: pink; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink; }',
			fixed: 'a{ color: pink; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\n{ color: pink; }',
			fixed: 'a{ color: pink; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\r\n{ color: pink; }',
			fixed: 'a{ color: pink; }',
			description: 'CRLF',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print { a{ color: pink; } }',
			fixed: '@media print{ a{ color: pink; } }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print{ a { color: pink; } }',
			fixed: '@media print{ a{ color: pink; } }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\nbackground: orange; }',
		},
		{
			code: '@media print {\na { color: pink;\nbackground: orange } }',
		},
		{
			code: '@media print {\r\na { color: pink;\r\nbackground: orange } }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: '@media print { a { color: pink; } }',
		},
		{
			code: 'a{ color: pink; }',
		},
		{
			code: 'a  { color: pink; }',
		},
		{
			code: 'a\t{ color: pink; }',
		},
	],

	reject: [
		{
			code: 'a{ color: pink;\nbackground: orange; }',
			fixed: 'a { color: pink;\nbackground: orange; }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 1,
		},
		{
			code: 'a  { color: pink;\nbackground: orange; }',
			fixed: 'a { color: pink;\nbackground: orange; }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink;\nbackground: orange; }',
			fixed: 'a { color: pink;\nbackground: orange; }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\n{ color: pink;\nbackground: orange; }',
			fixed: 'a { color: pink;\nbackground: orange; }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\r\n{ color: pink;\r\nbackground: orange; }',
			fixed: 'a { color: pink;\r\nbackground: orange; }',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print\n{\na { color: pink;\nbackground: orange; } }',
			fixed: '@media print {\na { color: pink;\nbackground: orange; } }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print { a\n{ color: pink;\nbackground: orange; } }',
			fixed: '@media print { a { color: pink;\nbackground: orange; } }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 17,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a{ color: pink;\nbackground: orange; }',
		},
		{
			code: '@media print{\na{ color: pink;\nbackground: orange } }',
		},
		{
			code: '@media print{\r\na{ color: pink;\r\nbackground: orange } }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: '@media print { a { color: pink; } }',
		},
		{
			code: 'a{ color: pink; }',
		},
		{
			code: 'a  { color: pink; }',
		},
		{
			code: 'a\t{ color: pink; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\nbackground: orange; }',
			fixed: 'a{ color: pink;\nbackground: orange; }',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a  { color: pink;\nbackground: orange; }',
			fixed: 'a{ color: pink;\nbackground: orange; }',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink;\nbackground: orange; }',
			fixed: 'a{ color: pink;\nbackground: orange; }',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a\n{ color: pink;\nbackground: orange; }',
			fixed: 'a{ color: pink;\nbackground: orange; }',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print\n{\na{ color: pink;\nbackground: orange; } }',
			fixed: '@media print{\na{ color: pink;\nbackground: orange; } }',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print{ a\n{ color: pink;\nbackground: orange; } }',
			fixed: '@media print{ a{ color: pink;\nbackground: orange; } }',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 16,
		},
		{
			code: '@media print{ a\r\n{ color: pink;\r\nbackground: orange; } }',
			fixed: '@media print{ a{ color: pink;\r\nbackground: orange; } }',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 16,
		},
	],
});
