import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

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
			endLine: 1,
			endColumn: 2,
		},
		{
			code: '   ',
			description: 'source with spaces',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: '\t',
			description: 'source with tab',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: '\n',
			description: 'source with newline',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 2,
			endColumn: 2,
		},
		{
			code: '\r\n',
			description: 'source with newline',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 2,
			endColumn: 2,
		},
		{
			code: '\n\n\n',
			description: 'source with multiple newline',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 4,
			endColumn: 2,
		},
		{
			code: '\r\n\r\n\r\n',
			description: 'source with multiple newline',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 4,
			endColumn: 2,
		},
		{
			code: '  \n  ',
			description: 'source with spaces and newline',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 2,
			endColumn: 4,
		},
		{
			code: '  \r\n  ',
			description: 'source with spaces and newline',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 2,
			endColumn: 4,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-html',

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
			endLine: 2,
			endColumn: 2,
		},
	],
});
