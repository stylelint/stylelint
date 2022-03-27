'use strict';

const { messages, ruleName } = require('..');

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
	],

	reject: [
		{
			code: ':not(:not()) {}',
			unfixable: true,
			message: messages.expected('simple'),
			line: 1,
			column: 1,
		},
		{
			code: ':not(::before) {}',
			unfixable: true,
			message: messages.expected('simple'),
			line: 1,
			column: 1,
		},
		{
			code: ':not(:first-line) {}',
			unfixable: true,
			message: messages.expected('simple'),
			line: 1,
			column: 1,
		},
		{
			code: ':not(a, div) {}',
			fixed: ':not(a):not(div) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 1,
		},
		{
			code: ':not(a ,) {}',
			fixed: ':not(a) {}',
			message: messages.expected('simple'),
			line: 1,
			column: 1,
		},
		{
			code: ':not(a.foo) {}',
			unfixable: true,
			message: messages.expected('simple'),
			line: 1,
			column: 1,
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
		},
		{
			code: ':not():not(a) {}',
			fixed: ':not(a) {}',
			message: messages.expected('complex'),
			line: 1,
			column: 7,
			skip: true,
		},
	],
});
