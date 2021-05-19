'use strict';

const stripIndent = require('common-tags').stripIndent;

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { color: --foo; }',
			description: 'undeclared dashed-ident',
		},
		{
			code: 'a { color: var(--foo); }',
			description: 'undeclared dashed-ident in var',
		},
		{
			code: 'a { color: env(--foo); }',
			description: 'undeclared dashed-ident in env',
		},
		{
			code: 'a { color: color(--foo 0% 0% 0% 0%); }',
			description: 'undeclared dashed-ident in color',
		},
		{
			code: 'a { color: calc(var(--foo) + var(--bar)); }',
			description: 'undeclared dashed-idents in vars in calc',
		},
		{
			code: 'a { color: var(--foo, red); }',
			description: 'undeclared dashed-idents in var with fallback',
		},
		{
			code: 'a { --foo: var(--bar); }',
			description: 'undeclared dashed-idents in vars assigned to custom property',
		},
		{
			code: ':root { --foo: red; } a { color: var(--foo); }',
			description: 'declared custom property in var',
		},
		{
			code: '@property --foo {} a { color: var(--foo); }',
			description: 'declared via at-property custom property in var',
		},
		{
			code: ':--foo {}',
			description: 'custom selector',
		},
		{
			code: '@media(--foo) {}',
			description: 'custom media query',
		},
	],

	reject: [
		{
			code: 'a { --foo: red; color: --foo; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 24,
			description: 'declared custom property',
		},
		{
			code: '@property --foo {} a { color: --foo; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 31,
			description: 'declared via at-property custom property',
		},
		{
			code: ':root { --bar: 0; } a { --foo: --bar; }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 32,
			description: 'declared in :root custom property',
		},
		{
			code: ':root { --bar: 0px; } a { color: calc(var(--foo) + --bar)); }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 52,
			description: 'declared custom property and used inside calc',
		},
		{
			code: ':root { --foo: pink; }  a { color: --foo, red; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 36,
			description: 'declared custom property and used with fall back',
		},
		{
			code: ':root { --bar: 0; } a { color: --foo(--bar); }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 38,
			description: 'declared custom property used inside custom function',
		},
		{
			code: stripIndent`
				:root {
					--bar: 0;
					--baz: 0;
				}

				a {
					--foo: --bar;
					color: --baz;
				}
			`,
			warnings: [
				{ message: messages.rejected('--bar'), line: 7, column: 9 },
				{ message: messages.rejected('--baz'), line: 8, column: 9 },
			],
			description: 'two declared custom properties',
		},
		{
			code: stripIndent`
				@property --bar {}
				@property --baz {}

				a {
					--foo: --bar;
					color: --baz;
				}
			`,
			warnings: [
				{ message: messages.rejected('--bar'), line: 5, column: 9 },
				{ message: messages.rejected('--baz'), line: 6, column: 9 },
			],
			description: 'two declared via at-property custom properties',
		},
	],
});
