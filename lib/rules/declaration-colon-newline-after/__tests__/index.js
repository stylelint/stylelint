'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a {\n' + '  color:\n' + '    pink\n' + '}',

			description: 'newline and spaces after',
		},
		{
			code: 'a { color :\npink }',
			description: 'space before and newline after',
		},
		{
			code: 'a { color\n:\npink }',
			description: 'newline before after',
		},
		{
			code: 'a { color\r\n:\r\npink }',
			description: 'CRLF before and after',
		},
		{
			code: 'a { color\n\n:\n\npink }',
			description: 'double newline before after',
		},
		{
			code: 'a { color\r\n\r\n:\r\n\r\npink }',
			description: 'double CRLF before and after',
		},
		{
			code: '$map: (key: value)',
			description: 'SCSS map with no newlines',
		},
		{
			code: 'a { background:\n  url(data:application/font-woff;...); }',
			description: 'data URI',
		},
	],

	reject: [
		{
			code: 'a { color :pink; }',
			fixed: 'a { color :\npink; }',
			description: 'no newline after',
			message: messages.expectedAfter(),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color :  pink; }',
			fixed: 'a { color :\n  pink; }',
			description: 'two spaces after',
			message: messages.expectedAfter(),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color :\tpink; }',
			fixed: 'a { color :\n\tpink; }',
			description: 'tab after',
			message: messages.expectedAfter(),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color : pink; }',
			fixed: 'a { color :\n pink; }',
			description: 'space after',
			message: messages.expectedAfter(),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color : \npink; }',
			fixed: 'a { color :\npink; }',
			description: 'space and newline after',
			message: messages.expectedAfter(),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color : \r\npink; }',
			fixed: 'a { color :\r\npink; }',
			description: 'space and CRLF after',
			message: messages.expectedAfter(),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color : \t\n\t\npink; }',
			fixed: 'a { color :\n\t\npink; }',
			description: 'space and newline tab after',
			message: messages.expectedAfter(),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color :/*comment*/pink; }',
			fixed: 'a { color :/*comment*/\npink; }',
			description: 'comment',
			message: messages.expectedAfter(),
			line: 1,
			column: 22,
		},
		{
			code: 'a { color : /*comment*/ pink; }',
			fixed: 'a { color : /*comment*/\n pink; }',
			description: 'comment',
			message: messages.expectedAfter(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { color : \n/*comment*/ pink; }',
			fixed: 'a { color :\n/*comment*/ pink; }',
			description: 'comment before newline',
			message: messages.expectedAfter(),
			line: 1,
			column: 11,
		},
		{
			code: 'a { color        :    pink; }',
			fixed: 'a { color        :\n    pink; }',
			description: 'multi space',
			message: messages.expectedAfter(),
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
			code: 'a {\n' + '  color: pink\n' + '}',
		},
		{
			code:
				'a {\n' +
				'  box-shadow:\n' +
				'    0 0 0 1px #5b9dd9\n' +
				'    0 0 2px 1px rgba(30, 140, 190, 0.8);\n' +
				'}',
		},
		{
			code: '$map\n: (\nkey: value,\nkey2 :value2)',
			description: 'SCSS map with newlines',
		},
		{
			code: "$list: (\n'value1',\n'value2',\n)",
			description: 'SCSS list with newlines',
		},
		{
			code: 'a { color:pink }',
		},
		{
			code: 'a { color :\tpink }',
		},
		{
			code: 'a { color\n: pink }',
		},
		{
			code: 'a { color\r\n:  pink }',
		},
	],

	reject: [
		{
			code:
				'a {\n' +
				'  box-shadow: 0 0 0 1px #5b9dd9\n' +
				'    0 0 2px 1px rgba(30, 140, 190, 0.8);\n' +
				'}',
			fixed:
				'a {\n' +
				'  box-shadow:\n' +
				' 0 0 0 1px #5b9dd9\n' +
				'    0 0 2px 1px rgba(30, 140, 190, 0.8);\n' +
				'}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
		{
			code:
				'a {\n' +
				'  box-shadow:0 0 0 1px #5b9dd9\n' +
				'    0 0 2px 1px rgba(30, 140, 190, 0.8);\n' +
				'}',
			fixed:
				'a {\n' +
				'  box-shadow:\n' +
				'0 0 0 1px #5b9dd9\n' +
				'    0 0 2px 1px rgba(30, 140, 190, 0.8);\n' +
				'}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 13,
		},
	],
});
