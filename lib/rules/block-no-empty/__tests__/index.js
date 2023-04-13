'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '',
		},
		{
			code: '@import "foo.css";',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { /* foo */ }',
		},
		{
			code: 'a {\n/* foo */\n}',
		},
		{
			code: 'a {\n/* foo */\n/* bar */\n}',
		},
		{
			code: 'a {\n/*\nfoo\nbar\n*/\n}',
		},
		{
			code: 'a { ; }',
		},
		{
			code: '@media print { a { color: pink; } }',
		},
		{
			code: '@media print { a { /* foo */ } }',
		},
		{
			code: '@media print { a { ; } }',
		},
		{
			code: '@media print { ; }',
		},
		{
			code: '@import url(x.css)',
		},
		{
			code: 'a { /* stylelint-disable */ }',
		},
		{
			code: 'a { /* stylelint-disable block-no-empty */ }',
		},
		{
			code: 'a { /* stylelint-disable-line block-no-empty */ }',
		},
	],

	reject: [
		{
			code: 'a {}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: 'a { }',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: 'a {\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 2,
			endColumn: 2,
		},
		{
			code: 'a {\r\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 2,
			endColumn: 2,
		},
		{
			code: 'a {\n\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 3,
			endColumn: 2,
		},
		{
			code: 'a {\t}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: 'a {\t\t}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '@media print {}',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@media print {\n}',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 2,
			endColumn: 2,
		},
		{
			code: '@media print {\r\n}',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 2,
			endColumn: 2,
		},
		{
			code: '@media print {\t}',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: '@media print { a {} }',
			message: messages.rejected,
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { /* stylelint-disable foo */ }',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 34,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['comments'] }],

	accept: [
		{
			code: 'a { /* foo */ color: pink; }',
		},
		{
			code: 'a {\n/* foo */\ncolor: pink;\n}',
		},
		{
			code: '@import "foo.css";',
		},
		{
			code: 'a { /* stylelint-disable */ }',
		},
	],

	reject: [
		{
			code: 'a { /* foo */ }',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a {\n/* foo */\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 3,
			endColumn: 2,
		},
		{
			code: 'a {\n/* foo */\n/* bar */\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 4,
			endColumn: 2,
		},
		{
			code: 'a {\n/*\nfoo\nbar\n*/\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 6,
			endColumn: 2,
		},
		{
			code: '@media print { a { /* foo */ } }',
			message: messages.rejected,
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { /* stylelint-disable foo */ }',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 34,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'sugarss',

	reject: [
		{
			code: '.a',
			message: messages.rejected,
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: '.a\n  padding: 25px\n  .a\n',
			message: messages.rejected,
			line: 3,
			column: 4,
			endLine: 3,
			endColumn: 5,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: 'a {\n// foo\n}',
		},
		{
			code: 'a {\n// foo\n// bar\n}',
		},
		{
			code: '@media print { a {\n// foo\n} }',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['comments'] }],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: 'a {\n// foo\ncolor: pink;\n}',
		},
	],

	reject: [
		{
			code: 'a {\n// foo\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 3,
			endColumn: 2,
		},
		{
			code: 'a {\n// foo\n// bar\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
			endLine: 4,
			endColumn: 2,
		},
		{
			code: '@media print { a {\n// foo\n} }',
			message: messages.rejected,
			line: 1,
			column: 18,
			endLine: 3,
			endColumn: 2,
		},
	],
});
