import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['simple'],
	fix: true,

	accept: [
		{
			code: ':not() {}',
		},
		{
			code: ':not( a ) {}',
		},
		{
			code: ':nOt(a) {}',
		},
		{
			code: ':not(*) {}',
		},
		{
			code: ':not(:link) {}',
		},
		{
			code: ':not(.foo) {}',
		},
		{
			code: ':not([title]) {}',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-not-notation */
				:not(::before), /* stylelint-disable-next-line selector-not-notation */
				:not(::before),
				/* stylelint-disable-next-line selector-not-notation */
				:not(::before)
				{}
			`,
		},
	],

	reject: [
		{
			code: ':not(:not()) {}',
			unfixable: true,
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: ':not(::before) {}',
			unfixable: true,
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: ':not(:first-line) {}',
			unfixable: true,
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: ':not(a, div) {}',
			fixed: ':not(a):not(div) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'p, :not(a, div) {}',
			fixed: 'p, :not(a):not(div) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: `p, img:not(a
, div) {}`,
			fixed: 'p, img:not(a):not(div) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 7,
			endLine: 2,
			endColumn: 7,
		},
		{
			code: ':not(.bar, .baz, .foo) {}',
			fixed: ':not(.bar):not(.baz):not(.foo) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: ':not(.bar, .baz, .foo) .qux {}',
			fixed: ':not(.bar):not(.baz):not(.foo) .qux {}',
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: ':not(.bar, .baz) .qux :not(.foo) {}',
			fixed: ':not(.bar):not(.baz) .qux :not(.foo) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: ':not(.foo) .qux :not(.bar, .baz) {}',
			fixed: ':not(.foo) .qux :not(.bar):not(.baz) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: ':not(a ,) {}',
			fixed: ':not(a) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: ':not(a.foo) {}',
			unfixable: true,
			message: messages.expected('simple'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: stripIndent`
				/* a comment */
				:not(::before), /* a comment */
				:not(::before),
				/* a comment */
				:not(::before)
				{}
			`,
			unfixable: true,
			warnings: [
				{
					message: messages.expected('simple'),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 15,
				},
				{
					message: messages.expected('simple'),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 15,
				},
				{
					message: messages.expected('simple'),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 15,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['complex'],
	fix: true,

	accept: [
		{
			code: ':not()::after {}',
		},
		{
			code: ':not(a, div) {}',
		},
		{
			code: ':not(a.foo) {}',
		},
		{
			code: ':not(a).foo:not(:empty) {}',
		},
	],

	reject: [
		{
			code: ':not( .foo ,:hover ):not(a,div) {}',
			fixed: ':not(.foo, :hover, a, div) {}',
			message: messages.expected('complex'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: ':not():not(a) {}',
			fixed: ':not(a) {}',
			message: messages.expected('complex'),
			skip: true,
		},
	],
});
