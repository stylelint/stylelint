'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a ,b {}',
		},
		{
			code: 'a ,b ,c {}',
		},
		{
			code: 'a , b {}',
		},
		{
			code: 'a ,\nb {}',
		},
		{
			code: 'a ,\r\nb {}',
			description: 'CRLF',
		},
		{
			code: 'a ,b[data-foo="tr,tr"] {}',
			description: 'string',
		},
		{
			code: 'a:matches(:hover, :focus) {}',
			description: 'comma inside :matches()',
		},
		{
			code: ':not(:hover, :focus) {}',
			description: 'comma inside :not()',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
		{
			code: 'a/*comment,comment*/ ,/*comment*/b {}',
			description: 'comment',
		},
	],

	reject: [
		{
			code: 'a,b {}',
			fixed: 'a ,b {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: 'a  ,b {}',
			fixed: 'a ,b {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 4,
		},
		{
			code: 'a\n,b {}',
			fixed: 'a ,b {}',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a\r\n,b {}',
			fixed: 'a ,b {}',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a\t,b {}',
			fixed: 'a ,b {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 3,
		},
		{
			code: 'a ,b,c {}',
			fixed: 'a ,b ,c {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 5,
		},
		{
			code: 'a ,b  ,c {}',
			fixed: 'a ,b ,c {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 7,
		},
		{
			code: 'a,b,c {}',
			fixed: 'a ,b ,c {}',
			warnings: [
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 2,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 4,
				},
			],
		},
		{
			code: 'a/*comment*/,/*comment*/b {}',
			fixed: 'a/*comment*/ ,/*comment*/b {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: 'a,b,c,d,e,f,g {}',
			fixed: 'a ,b ,c ,d ,e ,f ,g {}',
			warnings: [
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 2,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 4,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 6,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 8,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 10,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 12,
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
			code: 'a,b {}',
		},
		{
			code: 'a,b,c {}',
		},
		{
			code: 'a, b {}',
		},
		{
			code: 'a,\nb {}',
		},
		{
			code: 'a,\r\nb {}',
			description: 'CRLF',
		},
		{
			code: 'a,b[data-foo="tr ,tr"] {}',
			description: 'string',
		},
		{
			code: 'a:matches(:hover , :focus) {}',
			description: 'comma inside :matches()',
		},
		{
			code: ':not(:hover , :focus) {}',
			description: 'comma inside :not()',
		},
		{
			code: 'a/*comment ,comment*/,/*comment*/b {}',
			description: 'comment',
		},
	],

	reject: [
		{
			code: 'a ,b {}',
			fixed: 'a,b {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 3,
		},
		{
			code: 'a  ,b {}',
			fixed: 'a,b {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 4,
		},
		{
			code: 'a\n,b {}',
			fixed: 'a,b {}',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a\r\n,b {}',
			fixed: 'a,b {}',
			description: 'CRLF',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a\t,b {}',
			fixed: 'a,b {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 3,
		},
		{
			code: 'a,b ,c {}',
			fixed: 'a,b,c {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 5,
		},
		{
			code: 'a,b  ,c {}',
			fixed: 'a,b,c {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 6,
		},
		{
			code: 'a/*comment*/ ,/*comment*/b {}',
			fixed: 'a/*comment*/,/*comment*/b {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 14,
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: 'a ,b {}',
		},
		{
			code: 'a ,b {\n}',
			description: 'single-line selector list, multi-line block',
		},
		{
			code: 'a ,b {\r\n}',
			description: 'single-line selector list, multi-line block with CRLF',
		},
	],

	reject: [
		{
			code: 'a,b {}',
			fixed: 'a ,b {}',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,b {\n}',
			fixed: 'a ,b {\n}',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,b {\r\n}',
			fixed: 'a ,b {\r\n}',
			description: 'CRLF',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a/*comment*/,/*comment*/b {\n}',
			fixed: 'a/*comment*/ ,/*comment*/b {\n}',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	fix: true,

	accept: [
		{
			code: 'a,b {}',
		},
		{
			code: 'a,b {\n}',
			description: 'single-line selector list, multi-line block',
		},
		{
			code: 'a,b {\r\n}',
			description: 'single-line selector list, multi-line block with CRLF',
		},
	],

	reject: [
		{
			code: 'a ,b {}',
			fixed: 'a,b {}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a ,b {\n}',
			fixed: 'a,b {\n}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a ,b {\r\n}',
			fixed: 'a,b {\r\n}',
			description: 'CRLF',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 3,
		},
		{
			code: 'a/*comment*/ ,/*comment*/b {\n}',
			fixed: 'a/*comment*/,/*comment*/b {\n}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 14,
		},
	],
});
