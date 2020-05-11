'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a\n,b {}',
		},
		{
			code: 'a\n\n,b {}',
		},
		{
			code: 'a\n,b\n,c {}',
		},
		{
			code: 'a\r\n,b\r\n,c {}',
			description: 'CRLF',
		},
		{
			code: 'a\r\n\r\n,b\r\n,c {}',
			description: 'Double CRLF',
		},
		{
			code: 'a\n, b {}',
		},
		{
			code: 'a\n,\nb {}',
		},
		{
			code: 'a\r\n,\r\nb {}',
			description: 'CRLF',
		},
		{
			code: 'a\n,b[data-foo="tr,tr"] {}',
		},
		{
			code: 'a\n    ,b {}',
			description: 'indentation after the newline before the comma',
		},
		{
			code: 'a\r\n    ,b {}',
			description: 'indentation after the CRLF before the comma',
		},
		{
			code: 'a\n\t\t,b {}',
			description: 'indentation after the newline before the comma',
		},
		{
			code: '\ta\n\t, b {}',
			description: 'indented statement',
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
			code: 'a/*comment,comment*/\n,/*comment*/b {}',
			description: 'comment',
		},
	],

	reject: [
		{
			code: 'a,b {}',
			fixed: 'a\n,b {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 2,
		},
		{
			code: 'a ,b {}',
			fixed: 'a\n ,b {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 3,
		},
		{
			code: 'a  ,b {}',
			fixed: 'a\n  ,b {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 4,
		},
		{
			code: 'a\t,b {}',
			fixed: 'a\n\t,b {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 3,
		},
		{
			code: 'a\n,b,c {}',
			fixed: 'a\n,b\n,c {}',
			message: messages.expectedBefore(),
			line: 2,
			column: 3,
		},
		{
			code: 'a\r\n,b,c {}',
			fixed: 'a\r\n,b\r\n,c {}',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 2,
			column: 3,
		},
		{
			code: 'a/*comment*/,/*comment*/b {}',
			fixed: 'a/*comment*/\n,/*comment*/b {}',
			description: 'comment',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: 'a,b,c,d,e,f,g {}',
			fixed: 'a\n,b\n,c\n,d\n,e\n,f\n,g {}',
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
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a\n,b {}',
		},
		{
			code: 'a\r\n,b {}',
			description: 'CRLF',
		},
		{
			code: 'a, b {}',
			description: 'ignores single-line',
		},
		{
			code: 'a, b {\n}',
			description: 'ignores single-line selector list, multi-line block',
		},
		{
			code: '\ta\n\t, b {\n}',
			description: 'indented statement',
		},
	],

	reject: [
		{
			code: 'a\n,b, c {}',
			fixed: 'a\n,b\n, c {}',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 3,
		},
		{
			code: 'a\r\n,b, c {}',
			fixed: 'a\r\n,b\r\n, c {}',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 3,
		},
		{
			code: 'a\n,b, c {\n}',
			fixed: 'a\n,b\n, c {\n}',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 3,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a,\nb {}',
		},
		{
			code: 'a ,b {}',
			description: 'ignores single-line',
		},
		{
			code: 'a ,b {\n}',
			description: 'ignores single-line selector list, multi-line block',
		},
		{
			code: 'a ,b {\r\n}',
			description: 'ignores single-line selector list, multi-line block with CRLF',
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
			code: 'a/*comment\n,comment*/,/*comment*/b {\n}',
			description: 'comment',
		},
	],

	reject: [
		{
			code: 'a,\nb , c {}',
			fixed: 'a,\nb, c {}',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 3,
		},
		{
			code: 'a,\nb , c {\n}',
			fixed: 'a,\nb, c {\n}',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 3,
		},
		{
			code: 'a,\r\nb , c {\r\n}',
			fixed: 'a,\r\nb, c {\r\n}',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 3,
		},
		{
			code: 'a/*comment*/\n,/*comment*/b {\n}',
			fixed: 'a/*comment*/,/*comment*/b {\n}',
			description: 'comment',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 1,
		},
	],
});
