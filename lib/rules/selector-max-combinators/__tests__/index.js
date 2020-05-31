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
			code: 'foo bar {}',
			message: messages.expected('foo bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo + bar {}',
			message: messages.expected('foo + bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo > bar {}',
			message: messages.expected('foo > bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo ~ bar {}',
			message: messages.expected('foo ~ bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo bar, .baz {}',
			message: messages.expected('foo bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, bar baz {}',
			message: messages.expected('bar baz', 0),
			line: 1,
			column: 7,
		},
		{
			code: '\t.foo,\n\tbar baz {}',
			message: messages.expected('bar baz', 0),
			line: 2,
			column: 2,
		},
		{
			code: 'foo#bar ~ baz {}',
			message: messages.expected('foo#bar ~ baz', 0),
			line: 1,
			column: 1,
		},
	],
});

// Standard tests
testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: 'foo bar {}',
			description: 'fewer than max combinators',
		},
		{
			code: 'foo bar:hover {}',
			description: 'pseudo selectors',
		},
		{
			code: 'foo bar, \nbaz quux {}',
			description: 'multiple selectors: fewer than max combinators',
		},
		{
			code: 'foo bar:not(baz) {}',
			description: ':not(): outside',
		},
		{
			code: 'foo { bar {} }',
			description: 'nested selectors',
		},
		{
			code: 'foo { bar { baz {} } }',
			description: 'nested selectors',
		},
		{
			code: 'foo { bar > & {} }',
			description: 'nested selectors: parent selector',
		},
		{
			code: 'foo, bar { & > quux {} }',
			description: 'nested selectors: superfluous parent selector',
		},
		{
			code: '@media print { foo bar {} }',
			description: 'media query: parent',
		},
		{
			code: 'foo { @media print { bar {} } }',
			description: 'media query: nested',
		},
	],

	reject: [
		{
			code: 'foo bar baz quux {}',
			description: 'compound selector: greater than max combinators',
			message: messages.expected('foo bar baz quux', 2),
			line: 1,
			column: 1,
		},
		{
			code: 'foo, \nbar baz quux bat {}',
			description: 'multiple selectors: greater than max classes',
			message: messages.expected('bar baz quux bat', 2),
			line: 2,
			column: 1,
		},
		{
			code: 'foo bar baz quux:not(bat) {}',
			description: ':not(): greater than max combinators, outside',
			message: messages.expected('foo bar baz quux:not(bat)', 2),
			line: 1,
			column: 1,
		},
		{
			code: 'foo { bar { baz { quux {} } } }',
			description: 'nested selectors: greater than max combinators',
			message: messages.expected('foo bar baz quux', 2),
			line: 1,
			column: 19,
		},
		{
			code: 'foo { bar > & baz ~ quux {} }',
			description: 'nested selectors: parent selector',
			message: messages.expected('bar > foo baz ~ quux', 2),
			line: 1,
			column: 7,
		},
		{
			code: 'foo, bar { & > baz ~ quux + bat {} }',
			description: 'nested selectors: superfluous parent selector',
			warnings: [
				{
					message: messages.expected('foo > baz ~ quux + bat', 2),
					line: 1,
					column: 12,
				},
				{
					message: messages.expected('bar > baz ~ quux + bat', 2),
					line: 1,
					column: 12,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [0],
	skipBasicChecks: true,
	syntax: 'scss',

	accept: [
		{
			code: '@keyframes spin { #{50% - $n} {} }',
		},
		{
			code: '@for $n from 1 through 10 { .n-#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore sass interpolation inside @for',
		},
		{
			code: '@for $n from 1 through 10 { .n#{$n}-#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore multiple sass interpolations in a selector inside @for',
		},
		{
			code: '@for $n from 1 through 10 { .n#{$n}n#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore multiple sass interpolations in a selector inside @for',
		},
		{
			code: '@each $n in $vals { .n-#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore sass interpolation inside @each',
		},
		{
			code: '@while $n < 10 { .n-#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore sass interpolation inside @while',
		},
		{
			code: 'div:nth-child(#{map-get($foo, bar)}) {}',
			description: 'ignore sass map-get interpolation',
		},
	],

	reject: [
		{
			code: 'foo bar { @include test {} }',
			message: messages.expected('foo bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo + bar { @include test { .aa {} } }',
			warnings: [
				{
					message: messages.expected('foo + bar', 0),
					line: 1,
					column: 1,
				},
				{
					message: messages.expected('foo + bar .aa', 0),
					line: 1,
					column: 29,
				},
			],
		},
		{
			code: 'foo > bar { @include test {} }',
			description: 'compound selector 3: nested at-rule',
			message: messages.expected('foo > bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo ~ bar { @include test {} }',
			message: messages.expected('foo ~ bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo bar, .baz { @include test {} }',
			message: messages.expected('foo bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, bar baz { @include test {} }',
			message: messages.expected('bar baz', 0),
			line: 1,
			column: 7,
		},
		{
			code: '\t.foo,\n\tbar baz { @include test {} }',
			message: messages.expected('bar baz', 0),
			line: 2,
			column: 2,
		},
		{
			code: 'foo#bar ~ baz { @include test {} }',
			message: messages.expected('foo#bar ~ baz', 0),
			line: 1,
			column: 1,
		},
		{
			code: '@include test { foo bar {} }',
			message: messages.expected('foo bar', 0),
			line: 1,
			column: 17,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'less',

	accept: [
		{
			code: '.for(@n: 1) when (@n <= 10) { .n-@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
			description: 'ignore Less interpolation inside .for',
		},
		{
			code:
				'.for(@n: 1) when (@n <= 10) { .n-@{n}-@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
			description: 'ignore multiple Less interpolations in a selector inside .for',
		},
		{
			code:
				'.for(@n: 1) when (@n <= 10) { .n-@{n}n@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
			description: 'ignore multiple Less interpolations in a selector inside .for',
		},
		{
			code:
				'.each(@vals, @n: 1) when (@n <= length(@vals)) { @val: extract(@vals, @n); .n-@{val} { content: %("n: %d", 1 + 1); } .each(@vals, @n + 1); }',
			description: 'ignore Less interpolation inside .each',
		},
		{
			code:
				'.while(@n: 0) when (@n < 10) { .n-@{n} { content: %("n: %d", 1 + 1); } .while(@n + 1) }',
			description: 'ignore Less interpolation inside .while',
		},
	],
});
