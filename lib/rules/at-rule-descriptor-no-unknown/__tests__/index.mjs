import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { unknown: 0; }',
			description: 'ignore normal properties',
		},
		{
			code: '@counter-style foo { system: cyclic; symbols: url(bar.svg); suffix: " "; }',
		},
		{
			code: '@property --foo { syntax: "<integer>"; inherits: false; initial-value: 0; }',
		},
		{
			code: '@view-transition { navigation: auto; }',
		},
		{
			code: '@foo { bar: 0 }',
		},
		{
			code: '@media (width > 400px) { a { color: red; } }',
		},
		{
			code: 'a { @media (width > 400px) { color: red; } }',
		},
	],

	reject: [
		{
			code: '@counter-style foo { bar: 0; }',
			message: messages.rejected('@counter-style', 'bar'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '@property --foo { bar: 0; }',
			message: messages.rejected('@property', 'bar'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@property --foo { bar: 0; baz: 0; }',
			warnings: [
				{
					message: messages.rejected('@property', 'bar'),
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.rejected('@property', 'baz'),
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 30,
				},
			],
			description: 'multiple unknown descriptors in @property',
		},
		{
			code: '@property --foo { system: cyclic; }',
			message: messages.rejected('@property', 'system'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 25,
			description: 'a descriptor known for another at-rule but not @property',
		},
		{
			code: '@position-try --foo { @supports (bar: 0) { bar: 0 } }',
			message: messages.rejected('@position-try', 'bar'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 47,
			description: 'an unknown descriptor in a nested at-rule',
		},
	],
});
