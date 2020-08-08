'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['max-width', '/^my-/', 'color'],

	accept: [
		{
			code: '@media (max-width: 50em) { }',
		},
		{
			code: '@media (--wide-viewport) { }',
			description: 'ignore custom media query',
		},
		{
			code: '@media (/* min-width: 50em */ max-width: 50em) { }',
			description: 'ignore comments',
		},
		{
			code: '@media (max-width <= 50em) { }',
		},
		{
			code: '@media (400px < my-width < 1000px) { }',
		},
		{
			code: '@media (my-width: 50em) { }',
		},
		{
			code: '@media (my-max-width: 50em) { }',
		},
		{
			code: '@media print and (max-width: 50em) { }',
		},
		{
			code: '@media (color) { }',
		},
	],

	reject: [
		{
			code: '@media (MaX-wIdTh: 50em) { }',
			message: messages.rejected('MaX-wIdTh'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: 50em) { }',
			message: messages.rejected('min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (-webkit-min-device-pixel-ratio: 2) { }',
			message: messages.rejected('-webkit-min-device-pixel-ratio'),
			line: 1,
			column: 9,
		},
		{
			code: '@media handheld and (max-width: 20em), screen and (min-width: 20em) { }',
			message: messages.rejected('min-width'),
			line: 1,
			column: 52,
		},
		{
			code: '@media (monochrome) { }',
			message: messages.rejected('monochrome'),
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
			code: '@media (50em < width) { }',
			message: messages.rejected('width'),
			line: 1,
			column: 16,
		},
		{
			code: '@media (10em < width <= 50em) { }',
			message: messages.rejected('width'),
			line: 1,
			column: 16,
		},
		{
			code: '@media (max-width <= 50em) and (10em < min-width < 50em) { }',
			message: messages.rejected('min-width'),
			line: 1,
			column: 40,
		},
	],
});

testRule({
	ruleName,
	config: [/^my-/],

	accept: [
		{
			code: '@media (my-width: 50em) { }',
		},
		{
			code: '@media (my-max-width: 50em) { }',
		},
		{
			code: '@media (my-width >= 50em) { }',
		},
		{
			code: '@media (10em < my-max-width <= 50em) { }',
		},
	],

	reject: [
		{
			code: '@media (MaX-wIdTh: 50em) { }',
			message: messages.rejected('MaX-wIdTh'),
			line: 1,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	config: ['max-width', 'orientation'],
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
	config: ['max-width'],
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
