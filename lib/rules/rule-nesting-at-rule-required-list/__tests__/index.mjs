import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['layer', '/^s/'],

	accept: [
		{
			code: '@layer { a { color: red; } }',
			description: 'rule within @layer at-rule',
		},
		{
			code: '@supports (color: red) { a { color: red; } }',
			description: 'rule within @supports at-rule (matches regex)',
		},
		{
			code: '@scope (a) { a { color: red; } }',
			description: 'rule within @scope at-rule (matches regex)',
		},
		{
			code: '@media all {}',
			description: 'empty at-rule',
		},
		{
			code: '@layer { @media all { a { color: red; } } }',
			description: 'rule within nested required at-rule',
		},
		{
			code: '@font-face { font-family: "foo"; }',
			description: 'at-rule descriptor',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			description: 'rule without required at-rule',
			message: messages.expected('layer', '/^s/'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '@media all { a { color: red; } }',
			description: 'rule within non-required at-rule',
			message: messages.expected('layer', '/^s/'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { @layer { color: red; } }',
			description: 'rule with nested declarations rule',
			message: messages.expected('layer', '/^s/'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 29,
		},
	],
});
