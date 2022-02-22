'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [
		{
			border: 1,
			'/^margin/': 2,
		},
	],

	accept: [
		{
			code: 'a { margin: 0; }',
		},
		{
			code: 'a { margin: 1px 2px; }',
		},
		{
			code: 'a { margin: var(--foo) var(--bar); }',
			description: 'deals with CSS variables',
		},
		{
			code: 'a { margin: 1px 2px /* 3px */; }',
			description: 'ignore values in comments',
		},
		{
			code: 'a { margin-inline: 1px 2px; }',
		},
		{
			code: 'a { margin: ; }',
		},
		{
			code: 'a { border: 1px; }',
		},
		{
			code: 'a { transition: margin-right 2s ease-in-out; }',
			description: 'irrelevant shorthand',
		},
	],

	reject: [
		{
			code: 'a { margin: 1px 2px 3px; }',
			message: messages.rejected('margin', 2),
			line: 1,
			column: 5,
		},
		{
			code: 'a { margin: var(--foo) var(--bar) var(--baz); }',
			message: messages.rejected('margin', 2),
			line: 1,
			column: 5,
			description: 'deals with CSS variables',
		},
		{
			code: 'a { margin: 1px 2px 3px 4px; }',
			message: messages.rejected('margin', 2),
			line: 1,
			column: 5,
		},
		{
			code: 'a { margin: 0 0 0 0; }',
			message: messages.rejected('margin', 2),
			line: 1,
			column: 5,
		},
		{
			code: 'a { border: 1px solid blue; }',
			message: messages.rejected('border', 1),
			line: 1,
			column: 5,
		},
	],
});
