'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,

	accept: [
		{
			code: '.class {}',
		},
		{
			code: '   .class {}   ',
		},
		{
			code: '/* comment */',
		},
		{
			code: '\n.class {}',
		},
		{
			code: '\r\n.class {}',
		},
	],

	reject: [
		{
			code: '',
			description: 'empty source',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '   ',
			description: 'source with spaces',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\t',
			description: 'source with tab',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\n',
			description: 'source with newline',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\r\n',
			description: 'source with newline',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\n\n\n',
			description: 'source with multiple newline',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '\r\n\r\n\r\n',
			description: 'source with multiple newline',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '  \n  ',
			description: 'source with spaces and newline',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '  \r\n  ',
			description: 'source with spaces and newline',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'html',
	skipBasicChecks: true,

	accept: [
		{
			description: 'HTML without CSS',
			code: '<html></html>',
		},
	],

	reject: [
		{
			code: '<style>\n</style>',
			description: 'CSS block in HTML',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
	],
});
