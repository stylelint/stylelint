import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['foo-.+'],

	accept: [
		{
			code: '@keyframes foo-bar {}',
			description: 'Normal',
		},
		{
			code: ' @keyframes   foo-bar   {}',
			description: 'Whitespace',
		},
		{
			code: ' @KeyFrames foo-bar {}',
			description: '@keyframes case',
		},
		{
			code: '@-webkit-keyframes foo-bar {}',
			description: 'Webkit prefix',
		},
	],

	reject: [
		{
			code: '@keyframes foo {}',
			message: messages.expected('foo', 'foo-.+'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@keyframes bar {}',
			message: messages.expected('bar', 'foo-.+'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@keyframes FOO-bar {}',
			message: messages.expected('FOO-bar', 'foo-.+'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@-webkit-keyframes bar {}',
			description: 'Webkit prefix',
			message: messages.expected('bar', 'foo-.+'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 23,
		},
	],
});

testRule({
	ruleName,
	config: [/^foo-bar$/],

	accept: [
		{
			code: '@keyframes foo-bar {}',
			description: 'Accepts pattern in RegExp notation',
		},
	],

	reject: [
		{
			code: '@keyframes foo-baz {}',
			description: 'Accepts pattern in RegExp notation',
			message: messages.expected('foo-baz', /^foo-bar$/),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
	],
});

testRule({
	ruleName,
	config: ['^([a-z][a-z0-9]*)(-[a-z0-9]+)*$'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '@keyframes foo-#{$bar} {}',
			description: 'Scss interpolation',
		},
	],
});
