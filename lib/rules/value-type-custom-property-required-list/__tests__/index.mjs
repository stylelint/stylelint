import stripIndent from '../../../testUtils/stripIndent.mjs';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['color', 'length'],

	accept: [
		{
			code: 'a { color: var(--foo); }',
		},
		{
			code: 'a { color: var(); }',
		},
		{
			code: 'a { --foo: red; color: var(--foo); }',
		},
		{
			code: 'a { --foo: 1px; margin: var(--foo); }',
		},
		{
			code: stripIndent`
				@property --foo { syntax: "<color>"; inherits: false; initial-value: red; }
				a { color: var(--foo); }
			`,
		},
		{
			code: 'a { --foo: 1px; --foo: red; color: var(--foo); }',
			description: 'redeclared custom property',
		},
		{
			code: 'a { --foo: 1px; width: calc(100% - var(--foo)); }',
		},
		{
			code: 'a { color: inherit; }',
		},
		{
			code: 'a { color: 1px; }',
			description: 'unknown value',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			message: messages.expected('red', 'color'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { margin: 1px; }',
			message: messages.expected('1px', 'length'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { border: 1px solid red; }',
			warnings: [
				{
					message: messages.expected('1px', 'length'),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 16,
				},
				{
					message: messages.expected('red', 'color'),
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: 'a { --foo: red; border: 1px solid var(--foo); }',
			message: messages.expected('1px', 'length'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { color: rgb(0 0 0 / 50%); }',
			message: messages.expected('rgb(0 0 0 / 50%)', 'color'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { width: calc(1px + 2px); }',
			warnings: [
				{
					message: messages.expected('1px', 'length'),
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.expected('2px', 'length'),
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: 'a { --foo: 1px; width: calc(var(--foo) + 2rem); }',
			message: messages.expected('2rem', 'length'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 46,
			description: 'math function with a custom property argument',
		},
		{
			code: 'a { background: linear-gradient(red, blue); }',
			warnings: [
				{
					message: messages.expected('red', 'color'),
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 36,
				},
				{
					message: messages.expected('blue', 'color'),
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [
		['color', 'length'],
		{ ignoreProperties: { '/.+/': ['transparent'], transform: ['/.+/'] } },
	],

	accept: [
		{
			code: 'a { color: transparent; }',
		},
		{
			code: 'a { transform: translateX(1px); }',
		},
	],

	reject: [
		{
			code: 'a { border: 1px solid transparent; }',
			message: messages.expected('1px', 'length'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { color: color-mix(in srgb, transparent, red); }',
			message: messages.expected('red', 'color'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 47,
			description: 'color function with an ignored argument',
		},
	],
});

testRuleConfigs({
	ruleName,

	accept: [
		{
			config: 'color',
		},
		{
			config: [['color'], { ignoreProperties: { color: ['transparent', /^calc\(/] } }],
		},
	],

	reject: [
		{
			config: 'foo',
			description: 'unknown type',
		},
		{
			config: 1,
			description: 'invalid primary option type',
		},
		{
			config: [['color'], { ignoreProperties: 1 }],
			description: 'invalid ignoreProperties option type',
		},
	],
});
