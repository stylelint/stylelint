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
	],

	reject: [
		{
			code: 'a {color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {  color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\tcolor: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\ncolor: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\r\ncolor: pink; }',
			fixed: 'a { color: pink; }',
			description: 'CRLF',
			message: messages.expectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: '@media print {\na { color: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			message: messages.expectedAfter(),
			line: 1,
			column: 15,
		},
		{
			code: '@media print { a {\ncolor: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: '@media print { a {\r\ncolor: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			description: 'CRLF',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a {/*comment*/ color: pink; }',
			fixed: 'a { /*comment*/ color: pink; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 4,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a {color: pink; }',
		},
		{
			code: '@media print {a {color: pink; } }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a {color: pink; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {  color: pink; }',
			fixed: 'a {color: pink; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\tcolor: pink; }',
			fixed: 'a {color: pink; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\ncolor: pink; }',
			fixed: 'a {color: pink; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\r\ncolor: pink; }',
			fixed: 'a {color: pink; }',
			description: 'CRLF',
			message: messages.rejectedAfter(),
			line: 1,
			column: 4,
		},
		{
			code: '@media print {\na {color: pink; } }',
			fixed: '@media print {a {color: pink; } }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 15,
		},
		{
			code: '@media print {a {\ncolor: pink; } }',
			fixed: '@media print {a {color: pink; } }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 18,
		},
		{
			code: 'a { /*comment*/ color: pink; }',
			fixed: 'a {/*comment*/ color: pink; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 4,
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
			code: 'a {\ncolor: pink; }',
		},
		{
			code: 'a {\r\ncolor: pink; }',
			description: 'CRLF',
		},
		{
			code: 'a {color:\npink; }',
		},
		{
			code: '@media print {a {color:\npink; } }',
		},
		{
			code: '@media print{a {color:\npink; } }',
		},
	],

	reject: [
		{
			code: 'a {color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {  color: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\tcolor: pink; }',
			fixed: 'a { color: pink; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 4,
		},
		{
			code: '@media print {\ta { color: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 15,
		},
		{
			code: '@media print { a {\tcolor: pink; } }',
			fixed: '@media print { a { color: pink; } }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	fix: true,

	accept: [
		{
			code: 'a {color: pink; }',
		},
		{
			code: '@media print {a {color: pink; } }',
		},
		{
			code: 'a { color:\npink; }',
		},
		{
			code: '@media print { a { color:\npink; } }',
		},
		{
			code: '@media print { a\n{color: pink; } }',
		},
		{
			code: '@media print { a\r\n{color: pink; } }',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a {color: pink; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {  color: pink; }',
			fixed: 'a {color: pink; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\tcolor: pink; }',
			fixed: 'a {color: pink; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 4,
		},
		{
			code: '@media print { a {color: pink; } }',
			fixed: '@media print {a {color: pink; } }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 15,
		},
		{
			code: '@media print {a { color: pink; } }',
			fixed: '@media print {a {color: pink; } }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 18,
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
			code: '@media print { a { color: pink;\nbackground: orange } }',
		},
		{
			code: 'a {color: pink; }',
		},
		{
			code: '@media print {a {color: pink; } }',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a {  color: pink; }',
		},
		{
			code: 'a {\tcolor: pink; }',
		},
	],

	reject: [
		{
			code: 'a {color: pink;\nbackground: orange; }',
			fixed: 'a { color: pink;\nbackground: orange; }',
			message: messages.expectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {  color: pink;\nbackground: orange; }',
			fixed: 'a { color: pink;\nbackground: orange; }',
			message: messages.expectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\tcolor: pink;\nbackground: orange; }',
			fixed: 'a { color: pink;\nbackground: orange; }',
			message: messages.expectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\ncolor: pink;\nbackground: orange; }',
			fixed: 'a { color: pink;\nbackground: orange; }',
			message: messages.expectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\r\ncolor: pink;\r\nbackground: orange; }',
			fixed: 'a { color: pink;\r\nbackground: orange; }',
			description: 'CRLF',
			message: messages.expectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: '@media print\n{a { color: pink;\nbackground: orange; } }',
			fixed: '@media print\n{ a { color: pink;\nbackground: orange; } }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
		{
			code: '@media print { a\n{color: pink;\nbackground: orange; } }',
			fixed: '@media print { a\n{ color: pink;\nbackground: orange; } }',
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
			code: 'a {color: pink;\nbackground: orange; }',
		},
		{
			code: '@media print {a\n{color: pink;\nbackground: orange } }',
		},
		{
			code: '@media print {a\r\n{color: pink;\r\nbackground: orange } }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: '@media print { a { color: pink; } }',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a {  color: pink; }',
		},
		{
			code: 'a {\tcolor: pink; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\nbackground: orange; }',
			fixed: 'a {color: pink;\nbackground: orange; }',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {  color: pink;\nbackground: orange; }',
			fixed: 'a {color: pink;\nbackground: orange; }',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\tcolor: pink;\nbackground: orange; }',
			fixed: 'a {color: pink;\nbackground: orange; }',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\tcolor: pink;\r\nbackground: orange; }',
			fixed: 'a {color: pink;\r\nbackground: orange; }',
			description: 'CRLF',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: 'a {\ncolor: pink;\nbackground: orange; }',
			fixed: 'a {color: pink;\nbackground: orange; }',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 4,
		},
		{
			code: '@media print\n{ a {color: pink;\nbackground: orange; } }',
			fixed: '@media print\n{a {color: pink;\nbackground: orange; } }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
		{
			code: '@media print{a\n{ color: pink;\nbackground: orange; } }',
			fixed: '@media print{a\n{color: pink;\nbackground: orange; } }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
	],
});
