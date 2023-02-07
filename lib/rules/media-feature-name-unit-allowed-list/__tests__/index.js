'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: { width: 'em', '/height/': ['em', 'rem'] },

	accept: [
		{
			code: '@media (width: 50em) {}',
		},
		{
			code: '@media (width <= 50em) {}',
			description: 'media queries level 4 - inequality',
		},
		{
			code: '@media (min-width: 50rem) {}',
		},
		{
			code: '@media (max-width: 50rem) {}',
		},
		{
			code: '@media (30em <= width <= 50em) {}',
			description: 'media queries level 4 - range',
		},
		{
			code: '@media print and (width: 50em) {}',
			description: 'compound selector',
		},
		{
			code: '@media (height: 50rem) {}',
		},
		{
			code: '@media (min-height: 50rem) {}',
		},
		{
			code: '@media (max-height: 50rem) {}',
		},
		{
			code: '@media (30rem <= height <= 50rem) {}',
			description: 'media queries level 4 - range',
		},
	],

	reject: [
		{
			code: '@media (width: 50rem) {}',
			message: messages.rejected('rem', 'width'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '@media (width <= 50rem) {}',
			message: messages.rejected('rem', 'width'),
			description: 'media queries level 4 - inequality',
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@media (30rem <= width <= 50rem)  {}',
			description: 'media queries level 4 - range',
			warnings: [
				{
					message: messages.rejected('rem', 'width'),
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 14,
				},
				{
					message: messages.rejected('rem', 'width'),
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: '@media (width: 1000px) {}',
			message: messages.rejected('px', 'width'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@media (height: 1000px) {}',
			message: messages.rejected('px', 'height'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@media (height <= 1000px) {}',
			message: messages.rejected('px', 'height'),
			description: 'media queries level 4 - inequality',
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '@media (100px <= height <= 1000px)  {}',
			description: 'media queries level 4 - range',
			warnings: [
				{
					message: messages.rejected('px', 'height'),
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 14,
				},
				{
					message: messages.rejected('px', 'height'),
					line: 1,
					column: 28,
					endLine: 1,
					endColumn: 34,
				},
			],
		},
		{
			code: '@media (min-height: 1000px) {}',
			message: messages.rejected('px', 'min-height'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@media (max-height: 1000px) {}',
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
			code: '@media (prefers-reduced-motion) {}',
			description: 'name-only value',
		},
		{
			code: '@media (color) {}',
			description: 'name-only value',
		},
		{
			code: '@media (grid: 0) {}',
			description: 'unitless value, number',
		},
		{
			code: '@media (video-dynamic-range: high) {}',
			description: 'unitless value, keyword',
		},
	],
});
