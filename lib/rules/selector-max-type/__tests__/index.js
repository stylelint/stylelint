'use strict';

const { messages, ruleName } = require('..');

// Sanity checks
testRule({
	ruleName,
	config: [0],
	skipBasicChecks: true,

	accept: [
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
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: '@import "foo.css";',
		},
		{
			code: '.foo { & {} }',
		},
		{
			code: '.foo { &.bar {} }',
		},
		{
			code: '.foo { &-bar {} }',
		},
		{
			code: '.foo { &__bar {} }',
		},
		{
			code: '.foo { [&] {} }',
		},
		{
			code: '.foo { & [class*=bar] {} }',
		},
		{
			code: '.foo { @nest & {} }',
		},
		{
			code: '.foo:nth-child(3n + 1) {}',
		},
		{
			code: '.foo:nth-child(n) {}',
		},
		{
			code: '.foo:nth-child(odd) {}',
		},
		{
			code: '.foo:nth-child(even) {}',
		},
		{
			code: '.foo:nth-child(-n) {}',
		},
		{
			code: '.foo { &:nth-child(3n + 1) {} }',
		},
		{
			code: '@keyframes spin { 0% {} }',
		},
		{
			code: '@keyframes spin { to {} from {} }',
		},
		{
			code: '@include keyframes(identifier) { to, 50.0% {} 50.01% {} 100% {} }',
			description: 'non-standard usage of keyframe selectors',
		},
	],

	reject: [
		{
			code: 'foo {}',
			message: messages.expected('foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.bar > foo {}',
			message: messages.expected('.bar > foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo.bar {}',
			message: messages.expected('foo.bar', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, .bar, foo.baz {}',
			message: messages.expected('foo.baz', 0),
			line: 1,
			column: 13,
		},
		{
			code: '.foo { div {} }',
			description: 'nested descendant',
			message: messages.expected('.foo div', 0),
			line: 1,
			column: 8,
		},
		{
			code: '.foo { .baz, div {} }',
			description: 'nested selector list of descendants',
			message: messages.expected('.foo div', 0),
			line: 1,
			column: 8,
		},
		{
			code: '@supports (display: grid) { @media (min-width: 10rem) { div {} } }',
			description: 'nested rules within nested at-rule',
			message: messages.expected('div', 0),
			line: 1,
			column: 57,
		},
	],
});

// Standard tests
testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: 'foo {}',
			description: 'fewer than max type selectors',
		},
		{
			code: 'foo:hover {}',
			description: 'pseudo selector',
		},
		{
			code: 'foo bar {}',
			description: 'compound selector',
		},
		{
			code: 'foo, \nbar {}',
			description: 'multiple selectors: fewer than max type selectors',
		},
		{
			code: 'foo bar, \nbaz quux {}',
			description: 'multiple selectors: exactly max type selectors',
		},
		{
			code: 'foo bar:not(baz) {}',
			description: ':not(): outside and inside',
		},
		{
			code: 'foo { bar {} }',
			description: 'nested selectors',
		},
		{
			code: 'foo { bar > & {} }',
			description: 'nested selectors: parent selector',
		},
		{
			code: 'foo, bar { & > foo {} }',
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
			code: 'foo bar baz {}',
			description: 'compound selector: greater than max type selectors',
			message: messages.expected('foo bar baz', 2),
			line: 1,
			column: 1,
		},
		{
			code: 'foo, \nbar baz foo {}',
			description: 'multiple selectors: greater than max classes',
			message: messages.expected('bar baz foo', 2),
			line: 2,
			column: 1,
		},
		{
			code: 'foo bar baz:not(quux) {}',
			description: ':not(): greater than max type selectors, outside',
			message: messages.expected('foo bar baz:not(quux)', 2),
			line: 1,
			column: 1,
		},
		{
			code: 'foo { &:hover > bar baz {} }',
			description: 'nested selectors: greater than max type selectors',
			message: messages.expected('foo:hover > bar baz', 2),
			line: 1,
			column: 7,
		},
		{
			code: 'a { b { c { d { } } } }',
			description: 'nested rule',
			warnings: [
				{
					message: messages.expected('a b c', 2),
					line: 1,
					column: 9,
				},
				{
					message: messages.expected('a b c d', 2),
					line: 1,
					column: 13,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignore: ['descendant'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '.foo div {}',
		},
		{
			code: '#bar div.foo {}',
			description: 'compounded and descendant',
		},
		{
			code: '.foo { div {} }',
			description: 'nested descendant',
		},
		{
			code: '.foo { div, a {} }',
			description: 'nested selector list of descendants',
		},
		{
			code: '.foo { @include test { div {} } }',
			description: 'nested at-rule in descendants',
		},
	],

	reject: [
		{
			code: 'div {}',
			message: messages.expected('div', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, div {}',
			message: messages.expected('div', 0),
			line: 1,
			column: 7,
		},
		{
			code: 'div.foo {}',
			message: messages.expected('div.foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'div .foo {}',
			message: messages.expected('div .foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo > div {}',
			description: 'child',
			message: messages.expected('.foo > div', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo + div {}',
			description: 'next-sibling',
			message: messages.expected('.foo + div', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo ~ div {}',
			description: 'following-sibling',
			message: messages.expected('.foo ~ div', 0),
			line: 1,
			column: 1,
		},
		{
			code: '@media(min-width: 10rem) { div {} }',
			description: 'inside at-rule',
			message: messages.expected('div', 0),
			line: 1,
			column: 28,
		},
		{
			code: '@include placeholder { div {} }',
			description: 'inside scss at-rule',
			message: messages.expected('div', 0),
			line: 1,
			column: 24,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignore: ['compounded'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'div.foo {}',
		},
		{
			code: 'div#foo {}',
		},
		{
			code: 'div[something] {}',
		},
		{
			code: '#bar div.foo {}',
			description: 'compounded and descendant',
		},
	],

	reject: [
		{
			code: 'div {}',
			message: messages.expected('div', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, div {}',
			message: messages.expected('div', 0),
			line: 1,
			column: 7,
		},
		{
			code: '.foo div {}',
			message: messages.expected('.foo div', 0),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignore: ['child'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '.foo > div {}',
			description: 'class, child and type',
		},
		{
			code: '#bar > div.foo {}',
			description: 'id, child and compounded',
		},
		{
			code: '.foo, #bar > div {}',
			description: 'selector list with class, ID, child and type',
		},
	],

	reject: [
		{
			code: 'div {}',
			message: messages.expected('div', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, div {}',
			message: messages.expected('div', 0),
			line: 1,
			column: 7,
		},
		{
			code: 'div.foo {}',
			message: messages.expected('div.foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo div {}',
			description: 'descendant',
			message: messages.expected('.foo div', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo + div {}',
			description: 'next-sibling',
			message: messages.expected('.foo + div', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo ~ div {}',
			description: 'following-sibling',
			message: messages.expected('.foo ~ div', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'div > foo {}',
			description: 'type and child type',
			message: messages.expected('div > foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'div > a {}',
			description: 'type and child type',
			message: messages.expected('div > a', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'div > #foo {}',
			description: 'type, child and id',
			message: messages.expected('div > #foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'div > [something] {}',
			description: 'type, child and attribute',
			message: messages.expected('div > [something]', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'a > .foo {}',
			description: 'type and child',
			message: messages.expected('a > .foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: '#bar > div, div {}',
			description: 'selector list with ID, child, type and type',
			message: messages.expected('div', 0),
			line: 1,
			column: 8,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignore: ['compounded', 'descendant'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '#bar div.foo {}',
			description: 'compounded descendant',
		},
	],

	reject: [
		{
			code: 'bar div.foo {}',
			message: messages.expected('bar div.foo', 0),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignore: ['child', 'descendant'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '#bar > div foo {}',
			description: 'child and descendant',
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignore: ['child', 'compounded'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '#bar > div.foo {}',
			description: 'child and compounded',
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
			code: '// Comment\n.c {}',
		},
		{
			code: '@for $n from 1 through 5 { .foo-#{$n} { div { content: "#{$n}"; } } }',
		},
	],

	reject: [
		{
			code: '.foo { div { @include test-mixin {} } }',
			description: 'nested at-rule for valid SCSS syntax',
			message: messages.expected('.foo div', 0),
			line: 1,
			column: 8,
		},
		{
			code: '.foo { .baz, div { @include test-mixin {} } }',
			description: 'nested selector list of descendants with at-rule for valid SCSS syntax',
			message: messages.expected('.foo div', 0),
			line: 1,
			column: 8,
		},
		{
			code: '.foo { .baz { @include test-mixin {} .nested { div {} } } }',
			description: 'nested at-rule in parent',
			message: messages.expected('.foo .baz .nested div', 0),
			line: 1,
			column: 48,
		},
		{
			code: '@include test-mixin { div {} }',
			description: 'at-rule at top level',
			message: messages.expected('div', 0),
			line: 1,
			column: 23,
		},
		{
			code: '.foo { @include test-mixin { div {} } }',
			description: 'at-rule inside class',
			message: messages.expected('.foo div', 0),
			line: 1,
			column: 30,
		},
		{
			code: 'a { @extend placeholder; }',
			description: 'at-rule inside type',
			message: messages.expected('a', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'a { &:hover { } }',
			description: 'nested rule',
			warnings: [
				{
					message: messages.expected('a', 0),
					line: 1,
					column: 1,
				},
				{
					message: messages.expected('a:hover', 0),
					line: 1,
					column: 5,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [0],
	skipBasicChecks: true,
	syntax: 'less',

	accept: [
		{
			code: '// Comment\n.c {}',
		},
		{
			code: '.for(@n: 1) when (@n <= 5) { .foo-@{n} { div { content: "@{n}"; } } .for (@n + 1); }',
		},
	],

	reject: [
		{
			code: '@foo: { div {} };',
			description: 'non-standard at-rule less',
			message: messages.expected('div', 0),
			line: 1,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignoreTypes: ['fieldset', '/^my-/'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'fieldset {}',
		},
		{
			code: 'my-type {}',
		},
		{
			code: 'my-other-type {}',
		},
		{
			code: 'my-type { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: 'my-type { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
	],

	reject: [
		{
			code: 'a {}',
			message: messages.expected('a', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'not-my-type {}',
			message: messages.expected('not-my-type', 0),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignore: ['next-sibling'] }],
	skipBasicChecks: true,
	accept: [
		{
			code: '.foo + a {}',
		},
		{
			code: '.foo, .bar + a {}',
		},
		{
			code: '.foo + a + b {}',
		},
		{
			code: '.foo { & .bar + a {} }',
		},
		{
			code: '.foo + .baz, .bar + baz {}',
		},
		{
			code: '.foo \n+\n a {}',
		},
	],

	reject: [
		{
			code: 'foo {}',
			message: messages.expected('foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'bar baz {}',
			message: messages.expected('bar baz', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'bar + baz {}',
			message: messages.expected('bar + baz', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo + bar + baz {}',
			message: messages.expected('foo + bar + baz', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'foo, .bar + baz {}',
			message: messages.expected('foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo + bar, baz {}',
			message: messages.expected('baz', 0),
			line: 1,
			column: 13,
		},
		{
			code: '.foo + .bar { & baz {} }',
			message: messages.expected('.foo + .bar baz', 0),
			line: 1,
			column: 15,
		},
		{
			code: '.foo + .bar { & .baz + .foo { & foo + bar {} } }',
			message: messages.expected('.foo + .bar .baz + .foo foo + bar', 0),
			line: 1,
		},
	],
});
