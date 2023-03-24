'use strict';

const { stripIndent } = require('common-tags');

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { --foo: #f00; color: var(--foo); }',
			description: 'declared custom property',
		},
		{
			code: 'a { --foo: #f00; border: solid var(--foo); }',
			description: 'declared custom property in multi-value property',
		},
		{
			code: 'a { color: var(--foo, #f00); }',
			description: 'undeclared custom property with fallback',
		},
		{
			code: 'a { --foo: #f00; color: var(--bar, var(--foo)); }',
			description: 'undeclared custom property with declared custom property fallback',
		},
		{
			code: stripIndent`
				@property --foo { syntax: "<color>"; inherits: false; initial-value: #f00; }
				a { color: var(--foo); }
			`,
			description: 'declared custom property via at-property',
		},
		{
			code: 'a { color: var(); }',
			description: 'empty function',
		},
	],

	reject: [
		{
			code: 'a { color: var(--foo); }',
			description: 'undeclared custom property',
			message: messages.rejected('--foo'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { border: solid var(--foo); }',
			description: 'undeclared custom property in multi-value property',
			message: messages.rejected('--foo'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { color: var(--foo, var(--bar)); }',
			description: 'undeclared custom property with undeclared custom property fallback',
			message: messages.rejected('--bar'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 32,
		},
	],
});
