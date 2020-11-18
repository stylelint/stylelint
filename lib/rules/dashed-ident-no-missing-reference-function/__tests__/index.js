'use strict';

const stripIndent = require('common-tags').stripIndent;

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { color: var(--foo); }',
		},
		{
			code: 'a { color: env(--foo); }',
		},
		{
			code: 'a { color: color(--foo 0% 0% 0% 0%); }',
		},
		{
			code: 'a { color: calc(var(--foo) + var(--bar)); }',
		},
		{
			code: 'a { color: var(--foo, red); }',
		},
		{
			code: 'a { --foo: var(--bar); }',
		},
		{
			code: ':--foo {}',
		},
		{
			code: '@media(--foo) {}',
		},
		{
			code: stripIndent`
				a {
					color: var(
						--foo
					);
				}`,
		},
	],

	reject: [
		{
			code: 'a { color: --foo; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { --foo: --bar; }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: calc(var(--foo) + --bar)); }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 30,
		},
		{
			code: 'a { color: --foo, red; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: --foo(--bar); }',
			message: messages.rejected('--bar'),
			line: 1,
			column: 18,
		},
		{
			code: stripIndent`
				a {
					--foo: --bar;
					color: --baz;
				}
			`,
			warnings: [
				{ message: messages.rejected('--bar'), line: 2, column: 9 },
				{ message: messages.rejected('--baz'), line: 3, column: 9 },
			],
		},
	],
});
