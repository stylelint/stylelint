'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['before', 'selection', /^my/i],
	skipBasicChecks: true,

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
			message: messages.rejected('before'),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\nb::before {}',
			message: messages.rejected('before'),
			line: 2,
			column: 2,
		},
		{
			code: '::selection {}',
			message: messages.rejected('selection'),
			line: 1,
			column: 1,
		},
		{
			code: '::-webkit-selection {}',
			message: messages.rejected('-webkit-selection'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:not(::selection) {}',
			message: messages.rejected('selection'),
			line: 1,
			column: 7,
		},
		{
			code: 'a::my-pseudo-element {}',
			message: messages.rejected('my-pseudo-element'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::MY-OTHER-pseudo-element {}',
			message: messages.rejected('MY-OTHER-pseudo-element'),
			line: 1,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['before'],
	skipBasicChecks: true,
	syntax: 'scss',

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
