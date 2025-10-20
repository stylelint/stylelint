import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
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
			code: 'a { color: var(--foo, var(--bar)); }',
			description: 'nested var() with fallback using declared custom properties',
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
		{
			code: '@property --foo {} a { transition: --foo; }',
			description: 'ignore a property that can receive a custom-ident',
		},
		{
			code: '@property --foo {} a { position: running(--foo); }',
			description: 'ignore a function that can receive a custom-ident',
		},
		{
			code: '@property --foo {} a { view-transition-name: --foo; }',
		},
		{
			code: '@property --qux {} a { container-name: --qux; }',
		},
		{
			code: 'a { color: calc(var(--foo) + 100px); }',
			description: 'valid var() usage in calc with additional value',
		},
		{
			code: 'a { color: var(--foo, calc(var(--bar) + 20px)); }',
			description: 'nested var() with fallback using calc',
		},
		{
			code: 'a { color: calc(100px + var(--foo)); }',
			description: 'valid var() usage in calc with leading value',
		},
		{
			code: 'a { color: var(--foo, var(--bar, var(--foobar, #000))); }',
			description: 'nested fallbacks in var() with recursive fallback values',
		},
		{
			code: 'button { --state: normal; background-color: if(style(--state: hover): gray; else: white;); }',
			description: 'custom property in style() query within if() function',
		},
		{
			code: '@property --state {} button { background-color: if(style(--state: hover): gray; else: white;); }',
			description: 'declared custom property in style() query within if() function',
		},
		{
			code: ':root { --theme: dark; } a { color: if(style(--theme: light): black; else: white;); }',
			description: 'declared custom property in style() query condition',
		},
		{
			code: 'a { --foo: 1; --bar: 2; color: if(style(--foo: 1): if(style(--bar: 2): red; else: blue;); else: green;); }',
			description: 'nested if() with multiple style() queries',
		},
		{
			code: 'a { --foo: 1; --bar: 2; color: if(style(--foo: var(--bar)): red; else: green;); }',
			description: 'nested if() with multiple style() queries',
		},
		{
			code: 'a { --foo: 1; --color: red; color: if(style(--foo: 1): var(--color); else: green;); }',
			description: 'nested if() with multiple style() queries',
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
			code: ':root { --bar: 0px; } a { color: calc(var(--foo) + --bar); }',
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
			description: 'declared custom property and used with fallback',
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
		{
			code: stripIndent`
				a {
					--foo: red;
					--bar: blue;

					color: var(--foo, --bar);
				}
			`,
			message: messages.rejected('--bar'),
			line: 5,
			column: 20,
			endLine: 5,
			endColumn: 25,
			description: 'var() with missing var() syntax on fallback',
		},
		{
			code: stripIndent`
				a {
					--foo: qux;
					--bar: baz;

					position: running(var(--foo, --bar));
				}
			`,
			message: messages.rejected('--bar'),
			line: 5,
			column: 31,
			endLine: 5,
			endColumn: 36,
			description: 'nested var() with missing var() syntax on fallback',
		},
		{
			code: stripIndent`
				a {
					--foo: red;
					--bar: blue;
					--baz: green;

					color: var(--foo, var(--bar, --baz));
				}
			`,
			warnings: [
				{ message: messages.rejected('--baz'), line: 6, column: 31, endLine: 6, endColumn: 36 },
			],
			description: 'nested var() with second-level fallback missing var() syntax',
		},
		{
			code: 'a { --foo: 1; --bar: 2; color: if(style(--foo: --bar): red; else: green;); }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 48,
			endLine: 1,
			endColumn: 53,
			description: 'custom property in style() query value missing var() syntax',
		},
		{
			code: 'a { --foo: 1; --color: red; color: if( style(--foo: 1): --color; else: green; ); }',
			message: messages.rejected('--color'),
			line: 1,
			column: 57,
			endLine: 1,
			endColumn: 64,
			description: 'custom property in if() consequent branch missing var() syntax',
		},
	],
});
