import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { color: 0; }',
			description: 'ignore normal values',
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
			code: '@counter-style foo { system: bar; }',
			message: messages.rejected('system', 'bar'),
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: '@property --foo { syntax: bar; }',
			message: messages.rejected('syntax', 'bar'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: '@property --foo { syntax: bar; inherits: baz; }',
			warnings: [
				{
					message: messages.rejected('syntax', 'bar'),
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 30,
				},
				{
					message: messages.rejected('inherits', 'baz'),
					line: 1,
					column: 42,
					endLine: 1,
					endColumn: 45,
				},
			],
			description: 'multiple invalid value in @property',
		},
		{
			code: '@property --foo { syntax: cyclic; }',
			message: messages.rejected('syntax', 'cyclic'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 33,
			description: 'a value known to a descriptor of another at-rule but not @property',
		},
		{
			code: '@font-face { @supports (foo: 0) { ascent-override: baz } }',
			message: messages.rejected('ascent-override', 'baz'),
			line: 1,
			column: 52,
			endLine: 1,
			endColumn: 55,
			description: 'an unknown value in a nested at-rule',
		},
	],
});
