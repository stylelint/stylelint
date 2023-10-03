import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@media all and (monochrome) { }',
		},
		{
			code: '@media all and (MONOCHROME) { }',
		},
		{
			code: '@media (min-width: 700px) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700px) { }',
		},
		{
			code: '@media (width < 100px) { }',
		},
		{
			code: '@media (width = 100px) { }',
		},
		{
			code: '@media (width <= 100px) { }',
		},
		{
			code: '@media (10px >= width <= 100px) { }',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) { }',
		},
		{
			code: '@media (-webkit-min-device-pixel-ratio: 2) { }',
		},
		{
			code: '@media (--viewport-medium) { }',
			description: 'ignore css variables',
		},
		{
			code: '@media (forced-colors: active) { }',
		},
		{
			code: '@media not (width) { }',
		},
		{
			code: '@media (not (width)) { }',
		},
		{
			code: '@media (width) or (height) { }',
		},
		{
			code: '@media ((width) or (height)) { }',
		},
		{
			code: '@media () { }',
		},
		{
			code: '@media (grid: 1) {}',
		},
		{
			code: '@media (environment-blending: additive) {}',
		},
		{
			code: '@media (nav-controls: none) {}',
		},
		{
			code: '@media (prefers-reduced-data: reduce) {}',
		},
		{
			code: '@media (video-color-gamut: p3) {}',
		},
	],

	reject: [
		{
			code: '@media screen and (unknown) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@media screen and (/* a comment */unknown) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '@media screen and /* a comment */(unknown) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '@media screen and (UNKNOWN) { }',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@media screen and (unknown: 2) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@media screen and (UNKNOWN: 2) { }',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@media (min-width: 700px) and (unknown: landscape) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: '@media (min-width: 700px) and (UNKNOWN: landscape) { }',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: '@media (UNKNOWN >= 50em) { }',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@media (10em < unknown <= 50em) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@media (10em < width < 50em) and (50em < unknown) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 49,
		},
		{
			code: '@media (min-grid: 1) { }',
			message: messages.rejected('min-grid'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 17,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '@media (min-width: @tablet) { }',
		},
		{
			code: '@media (@feature: @tablet) { }',
		},
		{
			code: '@media (@feature: 100px) { }',
		},
		{
			code: '@media (@feature = @tablet) { }',
		},
		{
			code: '@media (@feature = 100px) { }',
		},
		{
			code: '@media (@feature < @tablet) { }',
		},
		{
			code: '@media (@mobile < @feature < @tablet) { }',
		},
		{
			code: '@media (10px < @feature < 100px) { }',
		},
		{
			code: '@media @smartphones and (orientation: landscape) { }',
		},
		{
			code: '@media @smartphones { }',
		},
		{
			code: '@media (@smartphones) { }',
		},
	],

	reject: [
		{
			code: '@media (unknown: @tablet) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@media (unknown < @tablet) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@media (unknown = @tablet) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@media (@tablet = unknown) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '@media (@mobile <= unknown < @tablet) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '@media not all and ($monochrome) { }',
		},
		{
			code: '@media not all and (#{$monochrome}) { }',
		},
		{
			code: '@media (min-width: $var) { }',
		},
		{
			code: '@media ($feature-name: $value) { }',
		},
		{
			code: '@media (#{$feature-name}: $value) { }',
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
		{
			code: '@media ($feature: 100px) { }',
		},
		{
			code: '@media ($feature = $tablet) { }',
		},
		{
			code: '@media ($feature = 100px) { }',
		},
		{
			code: '@media ($feature < $tablet) { }',
		},
		{
			code: '@media ($mobile < $feature < $tablet) { }',
		},
		{
			code: '@media (10px < $feature < 100px) { }',
		},
	],

	reject: [
		{
			code: '@media (unknown: $var) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@media (unknown < $tablet) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@media (unknown = $tablet) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@media ($tablet = unknown) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '@media ($mobile <= unknown < $tablet) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreMediaFeatureNames: ['/^my-/', 'custom', '/^YOUR-/i'] }],

	accept: [
		{
			code: '@media screen and (my-media-feature-name) { }',
		},
		{
			code: '@media screen and (custom: 10px) { }',
		},
		{
			code: '@media screen and (YOUR-custom: 10px) { }',
		},
		{
			code: '@media screen and (your-custom: 10px) { }',
		},
	],

	reject: [
		{
			code: '@media screen and (unknown) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@media screen and (MY-MEDIA-FEATURE-NAME) { }',
			message: messages.rejected('MY-MEDIA-FEATURE-NAME'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: '@media screen and (CUSTOM: 10px) { }',
			message: messages.rejected('CUSTOM'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '@media screen and (UNKNOWN) { }',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreMediaFeatureNames: [/^my-/] }],

	accept: [
		{
			code: '@media screen and (my-media-feature-name) { }',
		},
	],

	reject: [
		{
			code: '@media screen and (unknown) { }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
		},
	],
});
