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
		// TODO: The following test can be supported once mdn/data, is updated and the css-tree is updated.
		// see: https://github.com/mdn/data/blob/6b4cae7c0aa96c199a982f2b6efeda7ce67eb515/css/at-rules.json
		{
			code: '@view-transition { navigation: auto; }',
			skip: true,
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
			endColumn: 29,
		},
		{
			code: '@property --foo { bar: 0; }',
			message: messages.rejected('@property', 'bar'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '@property --foo { bar: 0; baz: 0; }',
			warnings: [
				{
					message: messages.rejected('@property', 'bar'),
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 26,
				},
				{
					message: messages.rejected('@property', 'baz'),
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 34,
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
			endColumn: 34,
			description: 'a descriptor known for another at-rule but not @property',
		},
	],
});
