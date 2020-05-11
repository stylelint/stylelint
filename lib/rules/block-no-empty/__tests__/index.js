'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,

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
			code: '@media print { a { color: pink; } }',
		},
		{
			code: '@media print { a { /* foo */ } }',
		},
		{
			code: '@import url(x.css)',
		},
	],

	reject: [
		{
			code: 'a {}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a { }',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a {\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a {\r\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a {\n\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a {\t}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a {\t\t}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: '@media print {}',
			message: messages.rejected,
			line: 1,
			column: 14,
		},
		{
			code: '@media print {\n}',
			message: messages.rejected,
			line: 1,
			column: 14,
		},
		{
			code: '@media print {\r\n}',
			message: messages.rejected,
			line: 1,
			column: 14,
		},
		{
			code: '@media print {\t}',
			message: messages.rejected,
			line: 1,
			column: 14,
		},
		{
			code: '@media print { a {} }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
	],
});

testRule({
	ruleName,
	config: [
		true,
		{
			ignore: ['comments'],
		},
	],
	skipBasicChecks: true,

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
	],

	reject: [
		{
			code: 'a { /* foo */ }',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a {\n/* foo */\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a {\n/* foo */\n/* bar */\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a {\n/*\nfoo\nbar\n*/\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: '@media print { a { /* foo */ } }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'sugarss',

	reject: [
		{
			code: '.a',
			message: messages.rejected,
			line: 1,
			column: 2,
		},
		{
			code: '.a\n  padding: 25px\n  .a\n',
			message: messages.rejected,
			line: 3,
			column: 4,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'scss',

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
	config: [
		true,
		{
			ignore: ['comments'],
		},
	],
	skipBasicChecks: true,
	syntax: 'scss',

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
		},
		{
			code: 'a {\n// foo\n// bar\n}',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: '@media print { a {\n// foo\n} }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
	],
});
