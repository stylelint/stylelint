'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [
		{
			border: 1,
			'/^margin/': 2,
			padding: 3,
		},
	],

	accept: [
		{
			code: 'div { margin: 0; }',
		},
		{
			code: 'div { margin: 1px 2px; }',
		},
		{
			code: 'div { margin: 1px 2px /* 3px */; }',
			description: 'ignore values in comments',
		},
		{
			code: 'div { margin-inline: 1px 2px; }',
		},
		{
			code: 'div { margin: ; }',
		},
		{
			code: 'div { padding: 1px 2px 3px; }',
		},
		{
			code: 'div { border: 1px; }',
		},
		{
			code: 'div { transition: margin-right 2s ease-in-out; }',
			description: 'irrelevant shorthand',
		},
	],

	reject: [
		{
			code: 'div { margin: 1px 2px 3px; }',
			message: messages.rejected('margin', 2),
			line: 1,
			column: 7,
		},
		{
			code: 'div { margin-inline: 1px 2px 3px; }',
			message: messages.rejected('margin-inline', 2),
			line: 1,
			column: 7,
		},
		{
			code: 'div { margin: 1px 2px 3px 4px; }',
			message: messages.rejected('margin', 2),
			line: 1,
			column: 7,
		},
		{
			code: 'div { margin: 0 0 0 0; }',
			message: messages.rejected('margin', 2),
			line: 1,
			column: 7,
		},
		{
			code: 'div { border: 1px solid blue; }',
			message: messages.rejected('border', 1),
			line: 1,
			column: 7,
		},
		{
			code: 'div { padding: 1px 2px 3px 4px; }',
			message: messages.rejected('padding', 3),
			line: 1,
			column: 7,
		},
	],
});
