'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['before', 'selection', /^my/i],

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a:hover {}',
		},
		{
			code: 'a::BEFORE {}',
		},
		{
			code: 'a::after {}',
		},
		{
			code: '::first-line {}',
		},
		{
			code: '::-webkit-first-line {}',
		},
		{
			code: 'a:not(::first-line) {}',
		},
		{
			code: 'a::their-pseudo-element {}',
		},
		{
			code: 'a::THEIR-other-pseudo-element {}',
		},
	],

	reject: [
		{
			code: 'a::before {}',
			message: messages.rejected('::before'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a,\nb::before {}',
			message: messages.rejected('::before'),
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 10,
		},
		{
			code: '::selection {}',
			message: messages.rejected('::selection'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '::-webkit-selection {}',
			message: messages.rejected('::-webkit-selection'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a:not(::selection) {}',
			message: messages.rejected('::selection'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a::my-pseudo-element {}',
			message: messages.rejected('::my-pseudo-element'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a::MY-OTHER-pseudo-element {}',
			message: messages.rejected('::MY-OTHER-pseudo-element'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: 'before',
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '::#{$variable} {}',
		},
		{
			code: '::#{$VARIABLE} {}',
		},
		{
			code: 'a::#{$variable} {}',
		},
	],
});
