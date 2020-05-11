'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: '',
		},
		{
			code: '  ',
		},
		{
			code: '\n',
		},
		{
			code: '\n\n',
		},
		{
			code: '.class {}',
		},
		{
			code: '\t.class {}   ',
		},
		{
			code: '   .class {}   ',
		},
		{
			code: '/* comment */',
		},
	],
	reject: [
		{
			code: '\n.class {} \n',
			fixed: '.class {} \n',
			description: 'empty first line',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\r\n.class {}',
			fixed: '.class {}',
			description: 'empty first line',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\n/*some comment*/\n',
			fixed: '/*some comment*/\n',
			description: 'empty first line with comment',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\n/*some comment*/.class {}\na {}\n',
			fixed: '/*some comment*/.class {}\na {}\n',
			description: 'empty first line with comment and css content',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\r\n\r\n\r\n\r\n.class {}',
			fixed: '.class {}',
			description: 'multiple empty first lines',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ' \r\n\r\n\r\n\r\n.class {}',
			fixed: '.class {}',
			description: 'multiple empty first lines with initial whitespace',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '               \n.class {}',
			fixed: '.class {}',
			description: 'empty first line with multiple initial whitespaces',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
	],
});
