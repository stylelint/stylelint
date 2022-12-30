'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: { width: 'em', '/height/': ['em', 'rem'] },

	accept: [
		{
			code: '@media (width: 50em) { }',
		},
		{
			code: '@media (min-width: 50rem) { }',
		},
		{
			code: '@media (max-width: 50rem) { }',
		},
		{
			code: '@media print and (width: 50em) { }',
		},
		{
			code: '@media (height: 50rem) { }',
		},
		{
			code: '@media (min-height: 50rem) { }',
		},
		{
			code: '@media (max-height: 50rem) { }',
		},
	],

	reject: [
		{
			code: '@media (width: 50rem) { }',
			message: messages.rejected('rem', 'width'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '@media (width: 1000px) { }',
			message: messages.rejected('px', 'width'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: '@media (height: 1000px) { }',
			message: messages.rejected('px', 'height'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@media (min-height: 1000px) { }',
			message: messages.rejected('px', 'min-height'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@media (max-height: 1000px) { }',
			message: messages.rejected('px', 'max-height'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 19,
		},
	],
});
