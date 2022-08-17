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
			code: 'a::before {}',
		},
		{
			code: '::selection {}',
		},
		{
			code: '::-webkit-selection {}',
		},
		{
			code: 'a:not(::selection) {}',
		},
		{
			code: 'a::my-pseudo-element {}',
		},
		{
			code: 'a::MY-other-pseudo-element {}',
		},
	],

	reject: [
		{
			code: 'a::BEFORE {}',
			message: messages.rejected('::BEFORE'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a::after {}',
			message: messages.rejected('::after'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a::AFTER {}',
			message: messages.rejected('::AFTER'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a,\nb::after {}',
			message: messages.rejected('::after'),
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 9,
		},
		{
			code: 'a::not-my-pseudo-element {}',
			message: messages.rejected('::not-my-pseudo-element'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 25,
		},
	],
});

testRule({
	ruleName,
	config: /^before/,

	accept: [
		{
			code: '::before {}',
		},
		{
			code: '::before-custom {}',
		},
	],
	reject: [
		{
			code: 'a::after {}',
			message: messages.rejected('::after'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::not-before {}',
			message: messages.rejected('::not-before'),
			line: 1,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['before'],
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
	reject: [
		{
			code: 'a::after {}',
			message: messages.rejected('::after'),
			line: 1,
			column: 2,
		},
	],
});
