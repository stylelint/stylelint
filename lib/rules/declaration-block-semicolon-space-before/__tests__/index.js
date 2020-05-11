'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'color: pink ;',
			description: 'declaration on root',
		},
		{
			code: 'a { color: pink ; }',
		},
		{
			code: 'a::before { content: ";a" ; }',
		},
		{
			code: 'a { color: pink ; top: 0 ; }',
		},
		{
			code: 'a { color: pink ; top: 0}',
		},
		{
			code: 'a { width: 50% !important ;}',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a { color: pink ; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 15,
		},
		{
			code: 'a { color: pink  ; }',
			fixed: 'a { color: pink ; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink\t; }',
			fixed: 'a { color: pink ; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink\n; }',
			fixed: 'a { color: pink ; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink\r\n; }',
			fixed: 'a { color: pink ; }',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink ; top: 0; }',
			fixed: 'a { color: pink ; top: 0 ; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { color: pink/*comment*/; }',
			fixed: 'a { color: pink/*comment*/ ; }',
			description: 'comment',
			message: messages.expectedBefore(),
			line: 1,
			column: 26,
		},
		{
			code: 'a { color: pink /*comment*/; }',
			fixed: 'a { color: pink /*comment*/ ; }',
			description: 'comment',
			message: messages.expectedBefore(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { width: 50% !important; }',
			fixed: 'a { width: 50% !important ; }',
			description: 'important',
			message: messages.expectedBefore(),
			line: 1,
			column: 25,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'color: pink;',
			description: 'declaration on root',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a::before { content: ";a"; }',
		},
		{
			code: 'a { color: pink; top: 0; }',
		},
		{
			code: 'a { width: 50% !important;}',
		},
	],

	reject: [
		{
			code: 'a { color: pink ; }',
			fixed: 'a { color: pink; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink  ; }',
			fixed: 'a { color: pink; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink\t; }',
			fixed: 'a { color: pink; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink\n; }',
			fixed: 'a { color: pink; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink\r\n; }',
			fixed: 'a { color: pink; }',
			description: 'CRLF',
			message: messages.rejectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; top: 0 ; }',
			fixed: 'a { color: pink; top: 0; }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { color: pink/*comment*/ ; }',
			fixed: 'a { color: pink/*comment*/; }',
			description: 'comment',
			message: messages.rejectedBefore(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { color: pink /*comment*/ ; }',
			fixed: 'a { color: pink /*comment*/; }',
			description: 'comment',
			message: messages.rejectedBefore(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { width: 50% !important ; }',
			fixed: 'a { width: 50% !important; }',
			description: 'important',
			message: messages.rejectedBefore(),
			line: 1,
			column: 26,
		},
		{
			code: 'a { width: 50% !important     ; }',
			fixed: 'a { width: 50% !important; }',
			description: 'important',
			message: messages.rejectedBefore(),
			line: 1,
			column: 30,
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: 'color: pink ;',
			description: 'declaration on root',
		},
		{
			code: 'a { color: pink ; }',
		},
		{
			code: 'a::before { content: ";a" ; }',
		},
		{
			code: 'a { color: pink ; top: 0 ; }',
		},
		{
			code: 'a,\nb { color: pink ; top: 0 ; }',
			description: 'multi-line rule, single-line declaration-block',
		},
		{
			code: 'a {\n  color: pink;\n  top: 0;\n}',
		},
		{
			code: 'a {\r\n  color: pink;\r\n  top: 0;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a { width: 50% !important ; }',
		},
		{
			code: 'a {\n  width: 50% !important;\n}',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a { color: pink ; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 15,
		},
		{
			code: 'a,\nb { color: pink; }',
			fixed: 'a,\nb { color: pink ; }',
			message: messages.expectedBeforeSingleLine(),
			line: 2,
			column: 15,
		},
		{
			code: 'a,\r\nb { color: pink; }',
			fixed: 'a,\r\nb { color: pink ; }',
			description: 'CRLF',
			message: messages.expectedBeforeSingleLine(),
			line: 2,
			column: 15,
		},
		{
			code: 'a { color: pink  ; }',
			fixed: 'a { color: pink ; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink\t; }',
			fixed: 'a { color: pink ; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink ; top: 0; }',
			fixed: 'a { color: pink ; top: 0 ; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { width: 50% !important; }',
			fixed: 'a { width: 50% !important ; }',
			description: 'important',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 25,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	fix: true,

	accept: [
		{
			code: 'color: pink;',
			description: 'declaration on root',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a::before { content: ";a"; }',
		},
		{
			code: 'a { color: pink; top: 0; }',
		},
		{
			code: 'a,\nb { color: pink; top: 0; }',
			description: 'multi-line rule, single-line declaration-block',
		},
		{
			code: 'a {\n  color: pink ;\n  top: 0 ;\n}',
		},
		{
			code: 'a { width: 50% !important; }',
		},
		{
			code: 'a {\n  width: 50% !important ;\n}',
		},
	],

	reject: [
		{
			code: 'a { color: pink ; }',
			fixed: 'a { color: pink; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 16,
		},
		{
			code: 'a,\nb { color: pink ; }',
			fixed: 'a,\nb { color: pink; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 2,
			column: 16,
		},
		{
			code: 'a,\r\nb { color: pink ; }',
			fixed: 'a,\r\nb { color: pink; }',
			description: 'CRLF',
			message: messages.rejectedBeforeSingleLine(),
			line: 2,
			column: 16,
		},
		{
			code: 'a { color: pink  ; }',
			fixed: 'a { color: pink; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink\t; }',
			fixed: 'a { color: pink; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink; top: 0 ; }',
			fixed: 'a { color: pink; top: 0; }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 24,
		},
		{
			code: 'a { width: 50% !important ; }',
			fixed: 'a { width: 50% !important; }',
			description: 'important',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 26,
		},
		{
			code: 'a { width: 50% !important     ; }',
			fixed: 'a { width: 50% !important; }',
			description: 'important',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 30,
		},
	],
});
