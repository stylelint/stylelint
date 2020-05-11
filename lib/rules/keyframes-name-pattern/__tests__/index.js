'use strict';

const { messages, ruleName } = require('..');

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
			message: messages.expected('foo'),
			line: 1,
			column: 12,
		},
		{
			code: '@keyframes bar {}',
			message: messages.expected('bar'),
			line: 1,
			column: 12,
		},
		{
			code: '@keyframes FOO-bar {}',
			message: messages.expected('FOO-bar'),
			line: 1,
			column: 12,
		},
		{
			code: '@-webkit-keyframes bar {}',
			description: 'Webkit prefix',
			message: messages.expected('bar'),
			line: 1,
			column: 20,
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
			message: messages.expected('foo-baz'),
			line: 1,
			column: 12,
		},
	],
});
