'use strict';

const { messages, ruleName } = require('..');

// Sanity checks
testRule({
	ruleName,
	config: [0],

	accept: [
		{
			code: 'foo {}',
		},
		{
			code: '.bar {}',
		},
		{
			code: 'foo .bar {}',
		},
		{
			code: '.foo,/* .class, */.bar {}',
		},
		{
			code: '#foo {}',
		},
		{
			code: '[foo] {}',
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
	],

	reject: [
		{
			code: '* {}',
			message: messages.expected('*', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.bar * {}',
			message: messages.expected('.bar *', 0),
			line: 1,
			column: 1,
		},
		{
			code: '*.bar {}',
			message: messages.expected('*.bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: '* [lang^=en] {}',
			message: messages.expected('* [lang^=en]', 0),
			line: 1,
			column: 1,
		},
		{
			code: '*[lang^=en] {}',
			message: messages.expected('*[lang^=en]', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, .bar, *.baz {}',
			message: messages.expected('*.baz', 0),
			line: 1,
			column: 13,
		},
		{
			code: '* #id {}',
			message: messages.expected('* #id', 0),
			line: 1,
			column: 1,
		},
		{
			code: '*#id {}',
			message: messages.expected('*#id', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo* {}',
			message: messages.expected('.foo*', 0),
			line: 1,
			column: 1,
		},
		{
			code: '*:hover {}',
			message: messages.expected('*:hover', 0),
			line: 1,
			column: 1,
		},
		{
			code: ':not(*) {}',
			message: messages.expected('*', 0),
			line: 1,
			column: 6,
		},
	],
});

// Standard tests
testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: '* {}',
			description: 'fewer than max universal selectors',
		},
		{
			code: '*:hover {}',
			description: 'pseudo selectors',
		},
		{
			code: '* * {}',
			description: 'compound selector',
		},
		{
			code: '*, \n* {}',
			description: 'multiple selectors: fewer than max universal selectors',
		},
		{
			code: '* *, \n* * {}',
			description: 'multiple selectors: exactly max universal selectors',
		},
		{
			code: '* *:not(*) {}',
			description: ':not(): outside and inside',
		},
		{
			code: '* { * {} }',
			description: 'nested selectors',
		},
		{
			code: '* { * > & {} }',
			description: 'nested selectors: parent selector',
		},
		{
			code: '*, * { & > * {} }',
			description: 'nested selectors: superfluous parent selector',
		},
		{
			code: '@media print { * * {} }',
			description: 'media query: parent',
		},
		{
			code: '* { @media print { * {} } }',
			description: 'media query: nested',
		},
	],

	reject: [
		{
			code: '* * * {}',
			description: 'compound selector: greater than max universal selectors',
			message: messages.expected('* * *', 2),
			line: 1,
			column: 1,
		},
		{
			code: '*, \n* * * {}',
			description: 'multiple selectors: greater than max universal selectors',
			message: messages.expected('* * *', 2),
			line: 2,
			column: 1,
		},
		{
			code: '* * *:not(*) {}',
			description: ':not(): greater than max universal selectors, outside',
			message: messages.expected('* * *:not(*)', 2),
			line: 1,
			column: 1,
		},
		{
			code: '* { &:hover > * * {} }',
			description: 'nested selectors: greater than max universal selectors',
			message: messages.expected('*:hover > * *', 2),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,
	config: [0],
	skipBasicChecks: true,
	syntax: 'scss',

	reject: [
		{
			code: '* { @include test {} }',
			message: messages.expected('*', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.bar * { @include test {} }',
			message: messages.expected('.bar *', 0),
			line: 1,
			column: 1,
		},
		{
			code: '*.bar { @include test {} }',
			message: messages.expected('*.bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: '* [lang^=en] { @include test {} }',
			message: messages.expected('* [lang^=en]', 0),
			line: 1,
			column: 1,
		},
		{
			code: '*[lang^=en] { @include test {} }',
			message: messages.expected('*[lang^=en]', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, .bar, *.baz { @include test {} }',
			message: messages.expected('*.baz', 0),
			line: 1,
			column: 13,
		},
		{
			code: '* #id { @include test {} }',
			message: messages.expected('* #id', 0),
			line: 1,
			column: 1,
		},
		{
			code: '*#id { @include test {} }',
			message: messages.expected('*#id', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo* { @include test {} }',
			message: messages.expected('.foo*', 0),
			line: 1,
			column: 1,
		},
		{
			code: '*:hover { @include test {} }',
			message: messages.expected('*:hover', 0),
			line: 1,
			column: 1,
		},
		{
			code: ':not(*) { @include test {} }',
			message: messages.expected('*', 0),
			line: 1,
			column: 6,
		},
		{
			code: '@include test { * {} }',
			message: messages.expected('*', 0),
			line: 1,
			column: 17,
		},
	],
});
