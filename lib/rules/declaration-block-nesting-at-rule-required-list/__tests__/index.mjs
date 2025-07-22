import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['layer', '/^s/'],

	accept: [
		{
			code: '@layer { a { color: red; } }',
			description: 'declaration within @layer at-rule',
		},
		{
			code: 'a { @layer { color: red; } }',
			description: 'declaration within nested @layer at-rule',
		},
		{
			code: '@supports (color: red) { a { color: red; } }',
			description: 'declaration within @supports at-rule (matches regex)',
		},
		{
			code: '@scope (a) { a { color: red; } }',
			description: 'declaration within @scope at-rule (matches regex)',
		},
		{
			code: '@media all {}',
			description: 'empty at-rule',
		},
		{
			code: '@layer { @media all { a { color: red; } } }',
			description: 'declaration within nested required at-rule',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			description: 'declaration without required at-rule',
			message: messages.expected('layer, /^s/'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { color: red; color: blue; }',
			description: 'multiple declarations without required at-rule',
			warnings: [
				{
					message: messages.expected('layer, /^s/'),
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					message: messages.expected('layer, /^s/'),
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: '@media all { a { color: red; } }',
			description: 'declaration within non-required at-rule',
			message: messages.expected('layer, /^s/'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { @media all { color: red; } }',
			description: 'declaration within nested non-required at-rule',
			message: messages.expected('layer, /^s/'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 29,
		},
	],
});

testRule({
	ruleName,
	config: ['layer'],

	accept: [
		{
			code: '@layer { a { color: red; } }',
			description: 'declaration within @layer at-rule',
		},
		{
			code: 'a { @layer { color: red; } }',
			description: 'declaration within nested @layer at-rule',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			description: 'declaration without required at-rule',
			message: messages.expected('layer'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@supports (color: red) { a { color: red; } }',
			description: 'declaration within non-required at-rule',
			message: messages.expected('layer'),
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 41,
		},
	],
});

testRule({
	ruleName,
	config: ['/^s/'],

	accept: [
		{
			code: '@supports (color: red) { a { color: red; } }',
			description: 'declaration within @supports at-rule (matches regex)',
		},
		{
			code: '@scope (a) { a { color: red; } }',
			description: 'declaration within @scope at-rule (matches regex)',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			description: 'declaration without required at-rule',
			message: messages.expected('/^s/'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@layer { a { color: red; } }',
			description: 'declaration within non-matching at-rule',
			message: messages.expected('/^s/'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 25,
		},
	],
});
