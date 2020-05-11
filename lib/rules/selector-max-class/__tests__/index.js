'use strict';

const { messages, ruleName } = require('..');

// Sanity checks
testRule({
	ruleName,
	config: [0],

	accept: [
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
			code: '.foo {}',
			description: 'disallow classes',
			message: messages.expected('.foo', 0),
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
			code: '.ab {}',
			description: 'fewer than max classes',
		},
		{
			code: '.ab.cd {}',
			description: 'exactly max classes',
		},
		{
			code: '.ab .cd {}',
			description: 'compound selector',
		},
		{
			code: '.ab, \n.cd {}',
			description: 'multiple selectors: fewer than max classes',
		},
		{
			code: '.ab.cd, \n.ef.gh {}',
			description: 'multiple selectors: exactly max classes',
		},
		{
			code: '.ab.cd :not(.ef.gh) {}',
			description: ':not(): inside and outside',
		},
		{
			code: '.ab.cd[disabled]:hover {}',
			description: 'pseudo selectors, attribute selectors',
		},
		{
			code: '.ab { .cd {} }',
			description: 'nested selectors',
		},
		{
			code: '.ab { .cd > & {} }',
			description: 'nested selectors: parent selector',
		},
		{
			code: '.ab, .cd { & > .ef {} }',
			description: 'nested selectors: superfluous parent selector',
		},
		{
			code: '@media print { .ab.cd {} }',
			description: 'media query: parent',
		},
		{
			code: '.ab { @media print { .cd {} } }',
			description: 'media query: nested',
		},
	],

	reject: [
		{
			code: '.ab.cd.ef {}',
			description: 'greater than max classes',
			message: messages.expected('.ab.cd.ef', 2),
			line: 1,
			column: 1,
		},
		{
			code: '.ab .cd .ef {}',
			description: 'compound selector: greater than max classes',
			message: messages.expected('.ab .cd .ef', 2),
			line: 1,
			column: 1,
		},
		{
			code: '.ab, \n.cd.ef.gh {}',
			description: 'multiple selectors: greater than max classes',
			message: messages.expected('.cd.ef.gh', 2),
			line: 2,
			column: 1,
		},
		{
			code: ':not(.ab.cd.ef) {}',
			description: ':not(): greater than max classes, inside',
			message: messages.expected('.ab.cd.ef', 2),
			line: 1,
			column: 6,
		},
		{
			code: '.ab.cd.ef :not(.gh) {}',
			description: ':not(): greater than max classes, outside',
			message: messages.expected('.ab.cd.ef :not(.gh)', 2),
			line: 1,
			column: 1,
		},
		{
			code: '.ab { &:hover > .ef.gh {} }',
			description: 'nested selectors: greater than max classes',
			message: messages.expected('.ab:hover > .ef.gh', 2),
			line: 1,
			column: 7,
		},
		{
			code: '.ab { @include test { .ef { &:hover .gh {} } } }',
			description: 'nested selectors: inside at-rule',
			message: messages.expected('.ab .ef:hover .gh', 2),
			line: 1,
			column: 29,
		},
	],
});

// SCSS tests
testRule({
	ruleName,
	config: [0],
	syntax: 'scss',

	accept: [
		{
			code: '.foo #{$test} {}',
			description: 'scss: ignore variable interpolation',
		},
		{
			code: '.foo.bar #{$test} {}',
			description: 'scss: ignore variable interpolation',
		},
	],

	reject: [
		{
			code: '.foo { margin: { left: 0; top: 0; }; }',
			description: 'scss: nested properties',
			message: messages.expected('.foo', 0),
			line: 1,
			column: 1,
		},
		{
			code: '@include test { .foo {} }',
			description: 'scss: mixin @include',
			message: messages.expected('.foo', 0),
			line: 1,
			column: 17,
		},
	],
});

// LESS tests
testRule({
	ruleName,
	config: [0],
	syntax: 'less',

	accept: [
		{
			code: '.foo @{test} {}',
			description: 'less: ignore variable interpolation',
		},
		{
			code: '.setFont(@size) { font-size: @size; }',
			description: 'less: ignore mixins',
		},
	],

	reject: [
		{
			code: '.foo { .setFont(12px) }',
			description: 'less: ignore called mixins',
			message: messages.expected('.foo', 0),
			line: 1,
			column: 1,
		},
	],
});
