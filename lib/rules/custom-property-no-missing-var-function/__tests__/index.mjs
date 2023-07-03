import { stripIndent } from 'common-tags';

import rule from '../index.js';
const { messages, ruleName } = rule;

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
			endLine: 1,
			endColumn: 29,
			description: 'declared custom property',
		},
		{
			code: '@property --foo {} a { color: --foo; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 36,
			description: 'declared via at-property custom property',
		},
		{
			code: ':root { --bar: 0; } a { --foo: --bar; }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 37,
			description: 'declared in :root custom property',
		},
		{
			code: ':root { --bar: 0px; } a { color: calc(var(--foo) + --bar)); }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 52,
			endLine: 1,
			endColumn: 57,
			description: 'declared custom property and used inside calc',
		},
		{
			code: ':root { --foo: pink; }  a { color: --foo, red; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
			description: 'declared custom property and used with fall back',
		},
		{
			code: ':root { --bar: 0; } a { color: --foo(--bar); }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 43,
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
				{ message: messages.rejected('--bar'), line: 7, column: 9, endLine: 7, endColumn: 14 },
				{ message: messages.rejected('--baz'), line: 8, column: 9, endLine: 8, endColumn: 14 },
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
				{ message: messages.rejected('--bar'), line: 5, column: 9, endLine: 5, endColumn: 14 },
				{ message: messages.rejected('--baz'), line: 6, column: 9, endLine: 6, endColumn: 14 },
			],
			description: 'two declared via at-property custom properties',
		},
	],
});
