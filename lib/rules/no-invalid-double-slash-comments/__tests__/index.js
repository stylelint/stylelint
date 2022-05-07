'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { /* color: pink; */ }',
			description: 'regular comment around declaration',
		},
		{
			code: '/* a { color: pink; } */',
			description: 'regular comment around rule',
		},
		{
			code: 'a { background: url(//foo.com/bar.png) }',
			description: 'url with double slash',
		},
	],

	reject: [
		{
			code: '// Invalid comment {}\na {}',
			description: 'line before',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a {\n//color: pink;\n}',
			description: 'before declaration',
			message: messages.rejected,
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 14,
		},
		{
			code: '//a { color: pink; }',
			description: 'before rule',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a, //div { color: pink; }',
			description: 'between rules',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '//@media { }',
			description: 'before media rule',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '// a { color: pink }',
			description: 'single-line comment ignored',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: 'a { \n// color: pink;\n }',
			description: 'single-line comment ignored',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '// a { color: pink }',
			description: 'single-line comment ignored',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: 'a { \n// color: pink;\n }',
			description: 'single-line comment ignored',
		},
	],
});
