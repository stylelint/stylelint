'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [/foo-.+/],

	accept: [
		{
			code: ':root { --foo-bar: 0; }',
		},
		{
			code: ':root { --boo-foo-bar: 0; }',
		},
		{
			code: ':root { --foo-color: #f00; } a { color: var(--foo-color); }',
		},
		{
			code: ':root { --foo-sub-color: #f00; } a { color: var(--foo-color, var(--foo-sub-color)); }',
		},
	],

	reject: [
		{
			code: ':root { --boo-bar: 0; }',
			message: messages.expected(/foo-.+/),
			line: 1,
			column: 9,
		},
		{
			code: ':root { --foo-: 0; }',
			message: messages.expected(/foo-.+/),
			line: 1,
			column: 9,
		},
		{
			code: ':root { --foo-color: #f00; } a { color: var(--boo-color); }',
			message: messages.expected(/foo-.+/),
			line: 1,
			column: 41,
		},
		{
			code: ':root { --foo-sub-color: #f00; } a { color: var(--foo-color, var(--boo-sub-color)); }',
			message: messages.expected(/foo-.+/),
			line: 1,
			column: 62,
		},
		{
			code: ':root { --foo-color: #f00; } a { color: VAR(--boo-color)); }',
			message: messages.expected(/foo-.+/),
			line: 1,
			column: 41,
		},
		{
			code: ':root { --foo-color: #f00; } a { color: var(--boo-color), var(--boo-sub-color)); }',
			warnings: [
				{ message: messages.expected(/foo-.+/), line: 1, column: 41 },
				{ message: messages.expected(/foo-.+/), line: 1, column: 59 },
			],
		},
	],
});

testRule({
	ruleName,
	config: ['foo-.+'],

	accept: [
		{
			code: ':root { --foo-bar: 0; }',
		},
		{
			code: ':root { --boo-foo-bar: 0; }',
		},
	],

	reject: [
		{
			code: ':root { --boo-bar: 0; }',
			message: messages.expected('foo-.+'),
			line: 1,
			column: 9,
		},
		{
			code: ':root { --foo-: 0; }',
			message: messages.expected('foo-.+'),
			line: 1,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/],

	accept: [
		{
			code: ':root { --Foo-bar: 0; }',
		},
		{
			code: ':root { --Foo-barBaz: 0; }',
		},
	],

	reject: [
		{
			code: ':root { --boo-Foo-bar: 0; }',
			message: messages.expected(/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/),
			line: 1,
			column: 9,
		},
		{
			code: ':root { --foo-bar: 0; }',
			message: messages.expected(/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/),
			line: 1,
			column: 9,
		},
		{
			code: ':root { --Foo-Bar: 0; }',
			message: messages.expected(/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/),
			line: 1,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['$foo-color'],

	accept: [
		{
			code: 'a { color: var($foo-color); }',
		},
		{
			code: 'a { color: var(tokens.$foo-color); }',
		},
	],
});
