'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
			description: 'no !important',
		},
		{
			code: 'a { color: pink !important; }',
			description: 'space only before',
		},
		{
			code: 'a { color: pink ! important; }',
			description: 'space before and after',
		},
		{
			code: 'a { color: pink !\noptional; }',
			description: 'space before and newline after',
		},
		{
			code: 'a { color: pink !\r\nimportant; }',
			description: 'space before and CRLF after',
		},
		{
			code: 'a::before { content: "!!!" !default; }',
			description: 'ignores string',
		},
		{
			code: 'a { color: pink/*!important */;}',
			description: 'violating comment',
		},
	],

	reject: [
		{
			code: 'a { color: pink  !important; }',
			fixed: 'a { color: pink !important; }',
			description: 'two spaces before',
			message: messages.expectedBefore(),
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink!default; }',
			fixed: 'a { color: pink !default; }',
			description: 'no space before',
			message: messages.expectedBefore(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink\n!important; }',
			fixed: 'a { color: pink !important; }',
			description: 'newline before',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: pink\r\n!something; }',
			fixed: 'a { color: pink !something; }',
			description: 'CRLF before',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: pink/*comment*/!important; }',
			fixed: 'a { color: pink/*comment*/ !important; }',
			description: 'comment before',
			message: messages.expectedBefore(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { color: pink/*comment*/!something; }',
			fixed: 'a { color: pink/*comment*/ !something; }',
			description: 'comment before',
			message: messages.expectedBefore(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { color: pink\n/*comment*/!important; }',
			fixed: 'a { color: pink\n/*comment*/ !important; }',
			description: 'comment before',
			message: messages.expectedBefore(),
			line: 2,
			column: 12,
		},
		{
			code: 'a { color: pink\n/*comment*/!something; }',
			fixed: 'a { color: pink\n/*comment*/ !something; }',
			description: 'comment before',
			message: messages.expectedBefore(),
			line: 2,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
			description: 'no !important',
		},
		{
			code: 'a { color: pink!important; }',
			description: 'no spaces',
		},
		{
			code: 'a { color: pink! important; }',
			description: 'no space before and after',
		},
		{
			code: 'a { color: pink!\nimportant; }',
			description: 'no space before and newline after',
		},
		{
			code: 'a { color: pink!\r\nimportant; }',
			description: 'no space before and CRLF after',
		},
	],

	reject: [
		{
			code: 'a { color: pink !important; }',
			fixed: 'a { color: pink!important; }',
			description: 'space before',
			message: messages.rejectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink\n!important; }',
			fixed: 'a { color: pink!important; }',
			description: 'newline before',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: pink\r\n!important; }',
			fixed: 'a { color: pink!important; }',
			description: 'CRLF before',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: pink/*comment*/ !important; }',
			fixed: 'a { color: pink/*comment*/!important; }',
			description: 'comment before',
			message: messages.rejectedBefore(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { color: pink/*comment*/ !something; }',
			fixed: 'a { color: pink/*comment*/!something; }',
			description: 'comment before',
			message: messages.rejectedBefore(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { color: pink\n/*comment*/\n!important; }',
			fixed: 'a { color: pink\n/*comment*/!important; }',
			description: 'comment before',
			message: messages.rejectedBefore(),
			line: 3,
			column: 1,
		},
		{
			code: 'a { color: pink\n/*comment*/\n!something; }',
			fixed: 'a { color: pink\n/*comment*/!something; }',
			description: 'comment before',
			message: messages.rejectedBefore(),
			line: 3,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'sass',
	skipBasicChecks: true,
	fix: true,

	reject: [
		{
			code: '$color: pink!default',
			fixed: '$color: pink !default',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	syntax: 'sass',
	skipBasicChecks: true,
	fix: true,

	reject: [
		{
			code: '$color: pink !default',
			fixed: '$color: pink!default',
			message: messages.rejectedBefore(),
			line: 1,
			column: 14,
		},
	],
});
