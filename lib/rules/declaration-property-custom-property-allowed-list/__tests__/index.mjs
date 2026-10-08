import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: [
		{
			'/color/': ['/^--foo-/'],
			border: ['/^--foo-/', '--bar'],
		},
	],

	accept: [
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { color: var(); }',
		},
		{
			code: 'a { color: var(--foo-baz); }',
		},
		{
			code: 'a { background-color: var(--foo-baz); }',
		},
		{
			code: 'a { border: var(--foo-baz) solid var(--bar); }',
		},
		{
			code: 'a { top: var(--baz); }',
		},
	],

	reject: [
		{
			code: 'a { color: var(--bar); }',
			message: messages.rejected('color', '--bar'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { background-color: var(--bar); }',
			message: messages.rejected('background-color', '--bar'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { border: var(--baz) solid var(--qux); }',
			warnings: [
				{
					message: messages.rejected('border', '--baz'),
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.rejected('border', '--qux'),
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: 'a { border: calc(var(--baz) * 2) solid; }',
			description: 'custom property inside a function',
			message: messages.rejected('border', '--baz'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { background-color: var(--foo-baz, var(--qux)); }',
			description: 'custom property inside a fallback',
			message: messages.rejected('background-color', '--qux'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 47,
		},
		{
			code: 'a { color: VAR(--baz); }',
			description: 'uppercase function name',
			message: messages.rejected('color', '--baz'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
	],
});
