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
			code: '[foo] {}',
			message: messages.expected('[foo]', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'a[rel="external"] {}',
			message: messages.expected('a[rel="external"]', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'a, .foo[type="text"] {}',
			message: messages.expected('.foo[type="text"]', 0),
			line: 1,
			column: 4,
		},
		{
			code: 'a > [foo] {}',
			message: messages.expected('a > [foo]', 0),
			line: 1,
			column: 1,
		},
		{
			code: "a[rel='external'] {}",
			message: messages.expected("a[rel='external']", 0),
			line: 1,
			column: 1,
		},
		{
			code: "@include test { a[rel='external'] {} }",
			message: messages.expected("a[rel='external']", 0),
			description: 'nested in at-rule',
			line: 1,
			column: 17,
		},
	],
});

// Standard tests
testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: '[type="text"] {}',
			description: 'fewer than max classes',
		},
		{
			code: '[type="text"][disabled]:hover {}',
			description: 'pseudo selectors',
		},
		{
			code: '[type="text"][name="message"] {}',
			description: 'exactly max classes',
		},
		{
			code: '[type="text"][disabled] {}',
			description: 'exactly max classes',
		},
		{
			code: '[type="text"] [type="number"] {}',
			description: 'compound selector',
		},
		{
			code: '[type="text"], \n[type="number"] {}',
			description: 'multiple selectors: fewer than max classes',
		},
		{
			code: '[type="text"][name="message"], \n[type="password"][name="password"] {}',
			description: 'multiple selectors: exactly max classes',
		},
		{
			code: '[type="text"][disabled], \n[type="password"][disabled] {}',
			description: 'multiple selectors: exactly max classes',
		},
		{
			code: '[type="text"][name="message"]:not([type="number"][name="quality"]) {}',
			description: ':not(): inside and outside',
		},
		{
			code: '[type="text"] { [name="message"] {} }',
			description: 'nested selectors',
		},
		{
			code: '[type="text"] { [name="message"] > & {} }',
			description: 'nested selectors: parent selector',
		},
		{
			code: '[type="text"], [name="message"] { & > [data-attribute="value"] {} }',
			description: 'nested selectors: superfluous parent selector',
		},
		{
			code: '@media print { [type="text"][name="message"] {} }',
			description: 'media query: parent',
		},
		{
			code: '[type="text"] { @media print { [name="message"] {} } }',
			description: 'media query: nested',
		},
	],

	reject: [
		{
			code: '[type="text"][name="message"][data-attribute="value"] {}',
			description: 'greater than max classes',
			message: messages.expected('[type="text"][name="message"][data-attribute="value"]', 2),
			line: 1,
			column: 1,
		},
		{
			code: '[type="text"][name="message"][disabled] {}',
			description: 'greater than max classes with attribute selector without value',
			message: messages.expected('[type="text"][name="message"][disabled]', 2),
			line: 1,
			column: 1,
		},
		{
			code: '[type="text"] [name="message"] [data-attribute="value"] {}',
			description: 'compound selector: greater than max classes',
			message: messages.expected('[type="text"] [name="message"] [data-attribute="value"]', 2),
			line: 1,
			column: 1,
		},
		{
			code: '[type="text"], \n[type="number"][name="quality"][data-attribute="value"] {}',
			description: 'multiple selectors: greater than max classes',
			message: messages.expected('[type="number"][name="quality"][data-attribute="value"]', 2),
			line: 2,
			column: 1,
		},
		{
			code: '[type="text"], \n[type="number"][name="quality"][disabled] {}',
			description: 'multiple selectors: greater than max classes',
			message: messages.expected('[type="number"][name="quality"][disabled]', 2),
			line: 2,
			column: 1,
		},
		{
			code: ':not([type="text"][name="message"][data-attribute="value"]) {}',
			description: ':not(): greater than max classes, inside',
			message: messages.expected('[type="text"][name="message"][data-attribute="value"]', 2),
			line: 1,
			column: 6,
		},
		{
			code: ':not([type="text"][name="message"][disabled]) {}',
			description: ':not(): greater than max classes, inside',
			message: messages.expected('[type="text"][name="message"][disabled]', 2),
			line: 1,
			column: 6,
		},
		{
			code:
				'[type="text"][name="message"][data-attribute="value"] :not([data-attribute-2="value"]) {}',
			description: ':not(): greater than max classes, outside',
			message: messages.expected(
				'[type="text"][name="message"][data-attribute="value"] :not([data-attribute-2="value"])',
				2,
			),
			line: 1,
			column: 1,
		},
		{
			code: '[type="text"][name="message"][data-attribute="value"]:not([disabled]) {}',
			description: ':not(): greater than max classes, outside',
			message: messages.expected(
				'[type="text"][name="message"][data-attribute="value"]:not([disabled])',
				2,
			),
			line: 1,
			column: 1,
		},
		{
			code: '[type="text"] { &:hover > [data-attribute="value"][data-attribute-2="value"] {} }',
			description: 'nested selectors: greater than max classes',
			message: messages.expected(
				'[type="text"]:hover > [data-attribute="value"][data-attribute-2="value"]',
				2,
			),
			line: 1,
			column: 17,
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
			code: '.[#{$interpolation}] {}',
			description: 'scss: ignore variable interpolation',
		},
		{
			code: '#{$interpolation}[type="text"] {}',
			description: 'scss: ignore variable interpolation',
		},
		{
			code: '[type="text"]#{$interpolation} { margin: { left: 0; top: 0; }; }',
			description: 'scss: nested properties',
		},
	],

	reject: [
		{
			code: '@include test { [type="text"][name="message"] {} }',
			description: 'scss: mixin at-rule',
			message: messages.expected('[type="text"][name="message"]', 0),
			line: 1,
			column: 17,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignoreAttributes: ['dir', 'dir="rtl"', '/^my-/'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '[dir] {}',
		},
		{
			code: '[dir="rtl"] {}',
		},
		{
			code: '[my-attr] {}',
		},
		{
			code: '[my-other-attr] {}',
		},
		{
			code: '[my-attr] { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: '[my-attr] { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
	],

	reject: [
		{
			code: '[foo] {}',
			message: messages.expected('[foo]', 0),
			line: 1,
			column: 1,
		},
		{
			code: '[not-my-attr] {}',
			message: messages.expected('[not-my-attr]', 0),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignoreAttributes: [/^my-/] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '[my-attr] {}',
		},
	],

	reject: [
		{
			code: '[foo] {}',
			message: messages.expected('[foo]', 0),
			line: 1,
			column: 1,
		},
	],
});
