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
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '@media (width: 1000px) { }',
			message: messages.rejected('px', 'width'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@media (height: 1000px) { }',
			message: messages.rejected('px', 'height'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@media (min-height: 1000px) { }',
			message: messages.rejected('px', 'min-height'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@media (max-height: 1000px) { }',
			message: messages.rejected('px', 'max-height'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: { grid: [], 'prefers-reduced-motion': [], 'video-dynamic-range': [] },

	accept: [
		{
			code: '@media (prefers-reduced-motion) { }',
			description: 'name-only value',
		},
		{
			code: '@media (grid: 0) { }',
			description: 'unitless value, number',
		},
		{
			code: '@media (video-dynamic-range: high) { }',
			description: 'unitless value, keyword',
		},
	],
});
