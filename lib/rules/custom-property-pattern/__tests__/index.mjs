import rule from '../index.mjs';
const { messages, ruleName } = rule;

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
		{
			code: 'a { --foo-color: var(); }',
			description: 'empty function',
		},
	],

	reject: [
		{
			code: ':root { --boo-bar: 0; }',
			message: messages.expected('--boo-bar', /foo-.+/),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: ':root { --foo-: 0; }',
			message: messages.expected('--foo-', /foo-.+/),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: ':root { --foo-color: #f00; } a { color: var(--boo-color); }',
			message: messages.expected('--boo-color', /foo-.+/),
			line: 1,
			column: 45,
			endLine: 1,
			endColumn: 56,
		},
		{
			code: ':root { --foo-sub-color: #f00; } a { color: var(--foo-color, var(--boo-sub-color)); }',
			message: messages.expected('--boo-sub-color', /foo-.+/),
			line: 1,
			column: 66,
			endLine: 1,
			endColumn: 81,
		},
		{
			code: ':root { --foo-color: #f00; } a { color: VAR(--boo-color)); }',
			message: messages.expected('--boo-color', /foo-.+/),
			line: 1,
			column: 45,
			endLine: 1,
			endColumn: 56,
		},
		{
			code: ':root { --foo-color: #f00; } a { color: var(--boo-color), var(--boo-sub-color)); }',
			warnings: [
				{
					message: messages.expected('--boo-color', /foo-.+/),
					line: 1,
					column: 45,
					endLine: 1,
					endColumn: 56,
				},
				{
					message: messages.expected('--boo-sub-color', /foo-.+/),
					line: 1,
					column: 63,
					endLine: 1,
					endColumn: 78,
				},
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
			message: messages.expected('--boo-bar', 'foo-.+'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: ':root { --foo-: 0; }',
			message: messages.expected('--foo-', 'foo-.+'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 15,
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
			message: messages.expected('--boo-Foo-bar', /^[A-Z][a-z]+-[a-z][a-zA-Z]+$/),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: ':root { --foo-bar: 0; }',
			message: messages.expected('--foo-bar', /^[A-Z][a-z]+-[a-z][a-zA-Z]+$/),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: ':root { --Foo-Bar: 0; }',
			message: messages.expected('--Foo-Bar', /^[A-Z][a-z]+-[a-z][a-zA-Z]+$/),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: [/foo-.+/],

	accept: [
		{
			code: 'a { color: var($foo-color); }',
		},
		{
			code: 'a { color: var(bar.$baz); }',
		},
		{
			code: 'a { --#{$bar}: 0; }',
		},
		{
			code: 'a { color: var( #{$bar} ); }',
		},
		{
			code: 'a { color: var( --#{$bar} ); }',
		},
	],
});
