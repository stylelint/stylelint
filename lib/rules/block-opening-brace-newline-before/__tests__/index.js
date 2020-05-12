'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: '@import url(x.css)',
		},
		{
			code: 'a\n{ color: pink; }',
		},
		{
			code: 'a\r\n{ color: pink; }',
			description: 'CRLF',
		},
		{
			code: 'a\n\n{ color: pink; }',
		},
		{
			code: 'a\r\n\r\n{ color: pink; }',
			description: 'CRLF',
		},
		{
			code: 'a\n{color: pink; }',
		},
		{
			code: '@media print\n{ a\n{ color: pink; } }',
		},
		{
			code: '@media print\r\n{ a\r\n{ color: pink; } }',
			description: 'CRLF',
		},
		{
			code: '@media print\n{a\n{color: pink; } }',
		},
		{
			code: '@media print\n\t{a\n\t\t{color: pink; } }',
			description: 'indentation after the newline before the opening braces',
		},
		{
			code:
				'@media print\n\t{a\n\t\t{color: pink;\n\t\t&:hover\n\t\t\t{\n\t\t\t\tcolor:black;} } }',
			description: '3 level deep indentation after the newline before the opening braces',
		},
		{
			code:
				'@media print\r\n\t{a\r\n\t\t{color: pink;\r\n\t\t&:hover\r\n\t\t\t{\r\n\t\t\t\tcolor:black;} } }',
			description: '3 level deep indentation after the newline before the opening braces and CRLF',
		},
		{
			code: 'a\n{ &:hover\n{ color: pink; }}',
		},
		{
			code: 'a\n{ color: red; &:hover\n{ color: pink; }}',
		},
		{
			code: 'a /* x */\n{ color: pink; }',
			description: 'end-of-line comment after selector',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a\n { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: 'a{ color: pink; }',
			fixed: 'a\n{ color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 1,
		},
		{
			code: 'a  { color: pink; }',
			fixed: 'a\n  { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink; }',
			fixed: 'a\n\t{ color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print { a\n{ color: pink; } }',
			fixed: '@media print\n { a\n{ color: pink; } }',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print { a\r\n{ color: pink; } }',
			fixed: '@media print\r\n { a\r\n{ color: pink; } }',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print\n{ a { color: pink; } }',
			fixed: '@media print\n{ a\n { color: pink; } }',
			message: messages.expectedBefore(),
			line: 2,
			column: 4,
		},
		{
			code: '@media print{ a\n{ color: pink; } }',
			fixed: '@media print\n{ a\n{ color: pink; } }',
			message: messages.expectedBefore(),
			line: 1,
			column: 12,
		},
		{
			code: '@media print{ a\r\n{ color: pink; } }',
			fixed: '@media print\r\n{ a\r\n{ color: pink; } }',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 1,
			column: 12,
		},
		{
			code: '@media print\n{ a{ color: pink; } }',
			fixed: '@media print\n{ a\n{ color: pink; } }',
			message: messages.expectedBefore(),
			line: 2,
			column: 3,
		},
		{
			code: 'a\n/* foo */{ color: pink; }',
			fixed: 'a\n/* foo */\n{ color: pink; }',
			message: messages.expectedBefore(),
			line: 2,
			column: 9,
		},
		{
			code: 'a\r\n/* foo */{ color: pink; }',
			fixed: 'a\r\n/* foo */\r\n{ color: pink; }',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 2,
			column: 9,
		},
		{
			code: '@media print /* foo */ { a /* foo */ { color: pink; } }',
			fixed: '@media print /* foo */\n { a /* foo */\n { color: pink; } }',
			warnings: [
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 37,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 23,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: 'a\n{ color: pink; }',
		},
		{
			code: 'a\n{color: pink; }',
		},
		{
			code: '@media print\n{ a\n{ color: pink; } }',
		},
		{
			code: '@media print\r\n{ a\r\n{ color: pink; } }',
			description: 'CRLF',
		},
		{
			code: '@media print\n{a\n{color: pink; } }',
		},
		{
			code: 'a{ color: pink;\nbackground:orange; }',
		},
		{
			code: '@media print { a{ color: pink;\nbackground:orange; } }',
		},
		{
			code: '@media print{ a { color: pink;\nbackground:orange; } }',
		},
		{
			code: '@media print{\na\n{ color: pink; } }',
		},
		{
			code: '@media print{\r\na\r\n{ color: pink; } }',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a\n { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a{ color: pink; }',
			fixed: 'a\n{ color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 1,
		},
		{
			code: 'a  { color: pink; }',
			fixed: 'a\n  { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink; }',
			fixed: 'a\n\t{ color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print\n{ a { color: pink; } }',
			fixed: '@media print\n{ a\n { color: pink; } }',
			message: messages.expectedBeforeSingleLine(),
			line: 2,
			column: 4,
		},
		{
			code: '@media print\n{ a{ color: pink; } }',
			fixed: '@media print\n{ a\n{ color: pink; } }',
			message: messages.expectedBeforeSingleLine(),
			line: 2,
			column: 3,
		},
		{
			code: '@media print\r\n{ a{ color: pink; } }',
			fixed: '@media print\r\n{ a\r\n{ color: pink; } }',
			description: 'CRLF',
			message: messages.expectedBeforeSingleLine(),
			line: 2,
			column: 3,
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
			code: 'a{color: pink; }',
		},
		{
			code: '@media print{ a{ color: pink; } }',
		},
		{
			code: '@media print{a{color: pink; } }',
		},
		{
			code: 'a\n{ color: pink;\nbackground:orange; }',
		},
		{
			code: 'a\r\n{ color: pink;\r\nbackground:orange; }',
			description: 'CRLF',
		},
		{
			code: '@media print { a\n{ color: pink;\nbackground:orange; } }',
		},
		{
			code: '@media print{ a\n{ color: pink;\nbackground:orange; } }',
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
			code: '@media print\n{ a\n{ color: pink; } }',
			fixed: '@media print{ a{ color: pink; } }',
			message: messages.rejectedBeforeSingleLine(),
			line: 2,
			column: 4,
		},
		{
			code: '@media print\r\n{ a\r\n{ color: pink; } }',
			fixed: '@media print{ a{ color: pink; } }',
			description: 'CRLF',
			message: messages.rejectedBeforeSingleLine(),
			line: 2,
			column: 4,
		},
		{
			code: '@media print { a\n{ color: pink; } }',
			fixed: '@media print{ a{ color: pink; } }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 17,
		},
		{
			code: '@media print/*comment*/ { a/*comment*/\n{ color: pink; } }',
			fixed: '@media print/*comment*/{ a/*comment*/{ color: pink; } }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 39,
		},
		{
			code: '@media print /*comment*/ { a /*comment*/\n{ color: pink; } }',
			fixed: '@media print /*comment*/{ a /*comment*/{ color: pink; } }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 41,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a\n{ color: pink;\nbackground: orange; }',
		},
		{
			code: 'a\r\n{ color: pink;\nbackground: orange; }',
			description: 'CRLF',
		},
		{
			code: '@media print\n{\na\n{ color: pink;\nbackground: orange } }',
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
		{
			code: 'a /* foo */\n  {\n    color: pink;\n  }',
		},
	],

	reject: [
		{
			code: 'a{ color: pink;\nbackground: orange; }',
			fixed: 'a\n{ color: pink;\nbackground: orange; }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 1,
		},
		{
			code: 'a  { color: pink;\nbackground: orange; }',
			fixed: 'a\n  { color: pink;\nbackground: orange; }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\t{ color: pink;\nbackground: orange; }',
			fixed: 'a\n\t{ color: pink;\nbackground: orange; }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a { color: pink;\nbackground: orange; }',
			fixed: 'a\n { color: pink;\nbackground: orange; }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a { color: pink;\r\nbackground: orange; }',
			fixed: 'a\r\n { color: pink;\r\nbackground: orange; }',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: '@media print\n{\na { color: pink;\nbackground: orange; } }',
			fixed: '@media print\n{\na\n { color: pink;\nbackground: orange; } }',
			message: messages.expectedBeforeMultiLine(),
			line: 3,
			column: 2,
		},
		{
			code: '@media print { a\n{ color: pink;\nbackground: orange; } }',
			fixed: '@media print\n { a\n{ color: pink;\nbackground: orange; } }',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 13,
		},
		{
			code: '@media print { a\r\n{ color: pink;\r\nbackground: orange; } }',
			fixed: '@media print\r\n { a\r\n{ color: pink;\r\nbackground: orange; } }',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
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
			code: 'a{ color: pink;\nbackground: orange; }',
		},
		{
			code: 'a{ color: pink;\r\nbackground: orange; }',
			description: 'CRLF',
		},
		{
			code: '@media print{\na{ color: pink;\nbackground: orange } }',
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
			code: 'a { color: pink;\r\nbackground: orange; }',
			fixed: 'a{ color: pink;\r\nbackground: orange; }',
			description: 'CRLF',
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
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 16,
		},
	],
});
