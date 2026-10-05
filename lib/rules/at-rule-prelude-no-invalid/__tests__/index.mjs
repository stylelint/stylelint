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

// The `@when` and `@else` preludes from CSS Conditional 5 reference the
// `<boolean-condition>` type, which the lexer can't resolve. The custom
// syntax below mirrors the patches for these at-rules in
// `@csstools/css-syntax-patches-for-csstree`. The rule should skip these
// at-rules rather than throw.
testRule({
	ruleName,
	config: true,
	languageOptions: {
		syntax: {
			atRules: {
				when: { prelude: '<boolean-condition>' },
				else: { prelude: '<boolean-condition>?' },
			},
		},
	},

	accept: [
		{
			code: '@when media(width >= 400px) {} @else supports(caret-color: pink) {}',
			description: 'Preludes referencing the unresolvable <boolean-condition> type',
		},
	],
});

testRule({
	ruleName,
	config: true,
	customSyntax: 'postcss-scss',
	languageOptions: {
		syntax: {
			atRules: {
				when: { prelude: '<boolean-condition>' },
				else: { prelude: '<boolean-condition>?' },
			},
		},
	},

	accept: [
		{
			code: '@if true {\n  @media (min-width: 1em) and (max-width: 2em) { color: red; }\n} @else if true {\n  @media (min-width: 1em) { color: red; }\n}',
			description: 'SCSS @if and @else with an unresolvable prelude',
		},
	],

	reject: [
		{
			code: '@if true {\n  @media (min-width: 1em) and { color: red; }\n} @else {}',
			message: messages.rejected('@media', '(min-width: 1em) and'),
			line: 2,
			column: 10,
			endLine: 2,
			endColumn: 30,
			description: 'Invalid prelude inside an SCSS @if body alongside an unresolvable @else',
		},
	],
});
