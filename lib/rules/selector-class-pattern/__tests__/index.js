'use strict';

const mergeTestDescriptions = require('../../../testUtils/mergeTestDescriptions');

const { messages, ruleName } = require('..');

const basicAZTests = {
	accept: [
		{
			code: 'a {}',
		},
		{
			code: '#foo {}',
		},
		{
			code: "[foo='bar'] {}",
		},
		{
			code: '.FOO {}',
		},
		{
			code: "a #foo > [foo='bar'], .FOO {}",
		},
		{
			code: 'a /* .foo */ {}',
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
			code: '@keyframes a { 0%, 48.59% {} }',
			message: 'Keyframes with decimal percentages',
		},
	],

	reject: [
		{
			code: 'a .foo {}',
			message: messages.expected('foo'),
			line: 1,
			column: 3,
		},
		{
			code: '.ABABA > .bar {}',
			message: messages.expected('bar'),
			line: 1,
			column: 10,
		},
	],
};

const nestedAZTestsDefault = {
	accept: [
		{
			code: '.AB { }',
		},
		{
			code: '.A { &__B { }}',
		},
	],
};

const nestedAZTests = {
	accept: [
		{
			code: '.AB { }',
		},
		{
			code: '.A { &B {}}',
		},
		{
			code: '.A { & > B {}}',
		},
		{
			code: '.A { &B {}, .C {}, &D {} }',
		},
		{
			code: '.A, .B { &C {} &D, &E {} }',
		},
	],

	reject: [
		{
			code: '.A { &__B { }}',
			message: messages.expected('A__B'),
			line: 1,
			column: 6,
		},
	],
};

testRule(
	mergeTestDescriptions(basicAZTests, {
		ruleName,
		config: [/^[A-Z]+$/],
	}),
);

testRule(
	mergeTestDescriptions(basicAZTests, {
		ruleName,
		config: ['^[A-Z]+$'],
	}),
);

testRule(
	mergeTestDescriptions(nestedAZTestsDefault, {
		ruleName,
		config: [/^[A-Z]+$/],
	}),
);

testRule(
	mergeTestDescriptions(nestedAZTestsDefault, {
		ruleName,
		config: ['^[A-Z]+$'],
	}),
);

testRule(
	mergeTestDescriptions(nestedAZTests, {
		ruleName,
		config: [/^[A-Z]+$/, { resolveNestedSelectors: true }],
	}),
);

testRule(
	mergeTestDescriptions(nestedAZTests, {
		ruleName,
		config: ['^[A-Z]+$', { resolveNestedSelectors: true }],
	}),
);

testRule({
	ruleName,
	config: [/^B+$/, { resolveNestedSelectors: true }],

	reject: [
		{
			code: '.A { .B {} }',
			message: messages.expected('A'),
		},
		{
			code: '.A { & .B {} }',
			message: messages.expected('A'),
		},
		{
			code: '.A { &>.B {} }',
			message: messages.expected('A'),
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: [/^[A-Z]+$/, { resolveNestedSelectors: true }],

	accept: [
		{
			code: '@for $n from 1 through 5 { .A#{$n} {} }',
			description: 'ignore sass interpolation inside @for',
		},
		{
			code: '@for $n from 1 through 5 { .A { &B#{$n} {} }}',
			description: 'ignore sass interpolation of nested selector inside @for',
		},
		{
			code: '.#{$a} {}',
			description: 'ignore sass var interpolation',
		},
		{
			code: '.A#{$B} { &C {} &D, &E {} }',
			description: 'ignore sass var interpolation for parents of nested selectors',
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: [/^[A-Z]+$/],

	accept: [
		{
			code: '.mixin-name() { }',
			description: 'ignore non-outputting Less class mixin definition',
		},
		{
			code: '.A { .mixin-name; }',
			description: 'ignore called Less class mixin',
		},
		{
			code: '.A { .mixin-name(@var); }',
			description: 'ignore called Less class parametric mixin',
		},
		{
			code: '#mixin-name() { }',
			description: 'ignore non-outputting Less ID mixin definition',
		},
		{
			code: '.A { #mixin-name; }',
			description: 'ignore called Less ID mixin',
		},
		{
			code: '#namespace { .mixin-name() {} }',
			description: 'ignore namespaced non-outputting Less class mixin definition',
		},
		{
			code: '.A { #namespace > .mixin-name; }',
			description: 'ignore called namespaced Less mixin (child)',
		},
		{
			code: '.A { #namespace .mixin-name; }',
			description: 'ignore called namespaced Less mixin (descendant)',
		},
		{
			code: '.A { #namespace.mixin-name; }',
			description: 'ignore called namespaced Less mixin (compounded)',
		},
	],
});
