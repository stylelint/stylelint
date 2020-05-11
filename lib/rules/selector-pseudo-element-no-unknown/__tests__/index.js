'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a:before { }',
		},
		{
			code: 'a:Before { }',
		},
		{
			code: 'a:bEfOrE { }',
		},
		{
			code: 'a:BEFORE { }',
		},
		{
			code: 'a:after { }',
		},
		{
			code: 'a:first-letter { }',
		},
		{
			code: 'a:first-line { }',
		},
		{
			code: 'a::before { }',
		},
		{
			code: 'a::Before { }',
		},
		{
			code: 'a::bEfOrE { }',
		},
		{
			code: 'a::BEFORE { }',
		},
		{
			code: 'a::after { }',
		},
		{
			code: 'a::first-letter { }',
		},
		{
			code: 'a::first-line { }',
		},
		{
			code: '::selection { }',
		},
		{
			code: 'a::spelling-error { }',
		},
		{
			code: 'a::grammar-error { }',
		},
		{
			code: 'li::marker { }',
		},
		{
			code: 'div::shadow { }',
		},
		{
			code: 'div::content { }',
		},
		{
			code: 'input::-moz-placeholder { }',
		},
		{
			code: 'input::-moz-test { }',
		},
		{
			code: 'a:hover { }',
		},
		{
			code: 'a:focus { }',
		},
		{
			code: 'a:hover::before { }',
		},
		{
			code: 'a:hover::-moz-placeholder { }',
		},
		{
			code: 'a,\nb > .foo::before { }',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
		{
			code: 'a::part(shadow-part) { }',
		},
	],

	reject: [
		{
			code: 'a::pseudo { }',
			message: messages.rejected('::pseudo'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::Pseudo { }',
			message: messages.rejected('::Pseudo'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::pSeUdO { }',
			message: messages.rejected('::pSeUdO'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::PSEUDO { }',
			message: messages.rejected('::PSEUDO'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::element { }',
			message: messages.rejected('::element'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:hover::element { }',
			message: messages.rejected('::element'),
			line: 1,
			column: 8,
		},
		{
			code: 'a,\nb > .foo::error { }',
			message: messages.rejected('::error'),
			line: 2,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	config: [true],
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

testRule({
	ruleName,
	config: [true, { ignorePseudoElements: ['pseudo', '/^my-/'] }],

	accept: [
		{
			code: 'a:before { }',
		},
		{
			code: 'a::before { }',
		},
		{
			code: 'a::pseudo { }',
		},
		{
			code: 'a::my-pseudo { }',
		},
	],

	reject: [
		{
			code: 'a::element { }',
			message: messages.rejected('::element'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::pSeUdO { }',
			message: messages.rejected('::pSeUdO'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::PSEUDO { }',
			message: messages.rejected('::PSEUDO'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::MY-other-pseudo { }',
			message: messages.rejected('::MY-other-pseudo'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::not-my-pseudo { }',
			message: messages.rejected('::not-my-pseudo'),
			line: 1,
			column: 2,
		},
	],
});
