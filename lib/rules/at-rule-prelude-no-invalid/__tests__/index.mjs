import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: '@layer;',
		},
		{
			code: '@layer foo;',
		},
		{
			code: '@media (min-width: 100px) {}',
		},
		{
			code: '@counter-style foo {}',
		},
		{
			code: '@property --foo {}',
		},
		{
			code: '@foo bar;',
			description: 'Custom at-rule with an any prelude',
		},
	],

	reject: [
		{
			code: '@layer "foo";',
			message: messages.rejected('@layer', '"foo"'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 13,
			description: 'Invalid prelude for @layer (string instead of ident)',
		},
		{
			code: '@property  foo {}',
			message: messages.rejected('@property', 'foo'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
			description: 'Invalid prelude for @property (missing leading --)',
		},
		{
			code: '@scope .foo {}',
			message: messages.rejected('@scope', '.foo'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 12,
			description: 'Invalid prelude for @scope (missing parentheses)',
		},
		{
			code: '@font-palette-values foo {}',
			message: messages.rejected('@font-palette-values', 'foo'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 25,
			description: 'Invalid prelude for @font-palette-values (missing leading --)',
		},
		{
			code: '@font-feature-values #foo {}',
			message: messages.rejected('@font-feature-values', '#foo'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 26,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: ['property', /^font-/] }],

	accept: [
		{
			code: '@property foo;',
		},
		{
			code: '@font-palette-values foo {}',
		},
		{
			code: '@font-feature-values #foo {}',
		},
	],
});
