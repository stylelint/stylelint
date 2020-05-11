'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['max-width', '--wide-viewport', 'width', '/^my-/', 'color'],

	accept: [
		{
			code: '@media (min-width: 50em) { }',
		},
		{
			code: '@media (MaX-wIdTh: 50em) { }',
		},
		{
			code: '@media (MiN-wIdTh: 50em) { }',
		},
		{
			code: '@media (height <= 50em) { }',
		},
		{
			code: '@media (400px < height < 1000px) { }',
		},
		{
			code: '@media (--wide-viewport) { }',
			description: 'ignore custom media query',
		},
		{
			code: '@media (/* max-width: 50em */ min-width: 50em) { }',
			description: 'ignore comments',
		},
		{
			code: '@media (monochrome) { }',
			description: 'boolean feature name',
		},
	],

	reject: [
		{
			code: '@media (max-width: 50em) { }',
			message: messages.rejected('max-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media print and (max-width: 50em) { }',
			message: messages.rejected('max-width'),
			line: 1,
			column: 19,
		},
		{
			code: '@media handheld and (min-width: 20em), screen and (max-width: 20em) { }',
			message: messages.rejected('max-width'),
			line: 1,
			column: 52,
		},
		{
			code: '@media (my-width: 50em) { }',
			message: messages.rejected('my-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (color) { }',
			message: messages.rejected('color'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (width: 50em) { }',
			message: messages.rejected('width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (20em < width <= 50em) { }',
			message: messages.rejected('width'),
			line: 1,
			column: 16,
		},
		{
			code: '@media (10em < max-width <= 50em) and (width > 50em) { }',
			warnings: [
				{
					message: messages.rejected('max-width'),
					line: 1,
					column: 16,
				},
				{
					message: messages.rejected('width'),
					line: 1,
					column: 40,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [/^my-/],

	accept: [
		{
			code: '@media (min-width: 50em) { }',
		},
	],

	reject: [
		{
			code: '@media (my-width: 50em) { }',
			message: messages.rejected('my-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (my-width >= 50em) { }',
			message: messages.rejected('my-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (10em < my-width <= 50em) { }',
			message: messages.rejected('my-width'),
			line: 1,
			column: 16,
		},
		{
			code: '@media (50em < my-width) { }',
			message: messages.rejected('my-width'),
			line: 1,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['feature-name'],
	syntax: 'less',

	accept: [
		{
			code: '@media @feature-name and (orientation: landscape) { }',
		},
		{
			code: '@media @feature-name { }',
		},
	],
});

testRule({
	ruleName,
	config: ['feature-name', 'width'],
	syntax: 'scss',

	accept: [
		{
			code: '@media not all and ($feature-name) { }',
		},
		{
			code: '@media not all and ($FEATURE-NAME) { }',
		},
		{
			code: '@media not all and (#{feature-name}) { }',
		},
		{
			code: '@media not all and (#{FEATURE-NAME}) { }',
		},
		{
			code: '@media ($feature-name: $value) { }',
		},
		{
			code: '@media ($FEATURE-NAME: $value) { }',
		},
		{
			code: '@media (#{$feature-name}: $value) { }',
		},
		{
			code: '@media (#{$FEATURE-NAME}: $value) { }',
		},
		{
			code: "@media ('min-' + $width: $value) { }",
		},
		{
			code: "@media ('MIN-' + $WIDTH: $value) { }",
		},
		{
			code: "@media ($value + 'width': $value) { }",
		},
		{
			code: "@media ($VALUE + 'WIDTH': $value) { }",
		},
		{
			code: '@media (#{$width}: $value) { }',
		},
		{
			code: '@media (#{$WIDTH}: $value) { }',
		},
		{
			code: '@media #{$feature-name} { }',
		},
	],
});
