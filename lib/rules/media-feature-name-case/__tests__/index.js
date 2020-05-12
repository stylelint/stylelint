'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['lower'],
	fix: true,

	accept: [
		{
			code: '@media not all and (monochrome) { }',
		},
		{
			code: '@media (min-width: 700px) { }',
		},
		{
			code: '@media (min-width: 700PX) { }',
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
			code: '@media (10px <= width <= 100px) { }',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape) { }',
		},
		{
			code: '@media (min-width: 700px) /* comments */ and (orientation: landscape) {}',
		},
		{
			code: '@media /* comments */ (min-width: 700px) and (orientation: landscape) {}',
		},
		{
			code: '@media (min-width: 700px), print and (orientation: landscape) { }',
		},
		{
			code: '@media (min-width: 700px), PRINT and (orientation: landscape) { }',
		},
		{
			code: '@media (-webkit-min-device-pixel-ratio: 2) { }',
		},
		{
			code: '@not-media (MIN-WIDTH: 700px) { }',
			description: 'ignore non media at-rule',
		},
		{
			code: '@media (--viewport-medium) { }',
			description: 'ignore css variables',
		},
		{
			code: '@media (--VIEWPORT-MEDIUM) { }',
			description: 'ignore css variables',
		},
	],

	reject: [
		{
			code: '@media not all and (MONOCHROME) { }',
			fixed: '@media not all and (monochrome) { }',
			message: messages.expected('MONOCHROME', 'monochrome'),
			line: 1,
			column: 21,
		},
		{
			code: '@media not all and (mOnOcHrOmE) { }',
			fixed: '@media not all and (monochrome) { }',
			message: messages.expected('mOnOcHrOmE', 'monochrome'),
			line: 1,
			column: 21,
		},
		{
			code: '@media (MIN-WIDTH: 700px) { }',
			fixed: '@media (min-width: 700px) { }',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (mIn-WiDtH: 700px) { }',
			fixed: '@media (min-width: 700px) { }',
			message: messages.expected('mIn-WiDtH', 'min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (MIN-WIDTH: 700px) and (orientation: landscape) { }',
			fixed: '@media (min-width: 700px) and (orientation: landscape) { }',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: 700px) and (ORIENTATION: landscape) { }',
			fixed: '@media (min-width: 700px) and (orientation: landscape) { }',
			message: messages.expected('ORIENTATION', 'orientation'),
			line: 1,
			column: 32,
		},
		{
			code: '@media (min-width: 700px) /* comments */ and (ORIENTATION: landscape) {}',
			fixed: '@media (min-width: 700px) /* comments */ and (orientation: landscape) {}',
			message: messages.expected('ORIENTATION', 'orientation'),
			line: 1,
			column: 47,
		},
		{
			code: '@media /* comments */ (MIN-WIDTH: 700px) and (orientation: landscape) {}',
			fixed: '@media /* comments */ (min-width: 700px) and (orientation: landscape) {}',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 24,
		},
		{
			code: '@media (-WEBKIT-MIN-DEVICE-PIXEL-RATION: 2) { }',
			fixed: '@media (-webkit-min-device-pixel-ration: 2) { }',
			message: messages.expected(
				'-WEBKIT-MIN-DEVICE-PIXEL-RATION',
				'-webkit-min-device-pixel-ration',
			),
			line: 1,
			column: 9,
		},
		{
			code: '@media (height: 50em) and (orientation: landscape) and (WIDTH: 25em) {}',
			fixed: '@media (height: 50em) and (orientation: landscape) and (width: 25em) {}',
			message: messages.expected('WIDTH', 'width'),
			line: 1,
			column: 57,
		},
		{
			code: '@media (WIDTH > 50em) {}',
			fixed: '@media (width > 50em) {}',
			message: messages.expected('WIDTH', 'width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (10em < WIDTH <= 50em) {}',
			fixed: '@media (10em < width <= 50em) {}',
			message: messages.expected('WIDTH', 'width'),
			line: 1,
			column: 16,
		},
		{
			code: '@media (width > 10em) and (WIDTH < 50em) {}',
			fixed: '@media (width > 10em) and (width < 50em) {}',
			message: messages.expected('WIDTH', 'width'),
			line: 1,
			column: 28,
		},
		{
			code: '@media (10em < WIDTH) {}',
			fixed: '@media (10em < width) {}',
			message: messages.expected('WIDTH', 'width'),
			line: 1,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['lower'],
	syntax: 'less',
	fix: true,

	accept: [
		{
			code: '@media (min-width: @tablet) { }',
		},
		{
			code: '@media (min-width: (@value + 10px)) { }',
		},
		{
			code: '@media @smartphones and (orientation: landscape) { }',
		},
		{
			code: '@media @smartphones { }',
		},
		{
			code: '@media @smartphones /* comments */ and (orientation: landscape) {}',
		},
	],

	reject: [
		{
			code: '@media (MIN-WIDTH: @tablet) { }',
			fixed: '@media (min-width: @tablet) { }',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (MIN-WIDTH: (@value + 10px)) { }',
			fixed: '@media (min-width: (@value + 10px)) { }',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media @smartphones and (ORIENTATION: landscape) { }',
			fixed: '@media @smartphones and (orientation: landscape) { }',
			message: messages.expected('ORIENTATION', 'orientation'),
			line: 1,
			column: 26,
		},
		{
			code: '@media @smartphones /* comments */ and (ORIENTATION: landscape) {}',
			fixed: '@media @smartphones /* comments */ and (orientation: landscape) {}',
			message: messages.expected('ORIENTATION', 'orientation'),
			line: 1,
			column: 41,
		},
	],
});

testRule({
	ruleName,
	config: ['lower'],
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: '@media not all and ($monochrome) { }',
		},
		{
			code: '@media not all and ($MONOCHROME) { }',
		},
		{
			code: '@media not all and (#{$monochrome}) { }',
		},
		{
			code: '@media not all and (#{$MONOCHROME}) { }',
		},
		{
			code: '@media not all /* comments */ and (#{$MONOCHROME}) { }',
		},
		{
			code: '@media (min-width: $var) { }',
		},
		{
			code: '@media (min-width: $var + 10px) { }',
		},
		{
			code: '@media (min-width: ($var + 10px)) { }',
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

	reject: [
		{
			code: '@media (MIN-WIDTH: $var) { }',
			fixed: '@media (min-width: $var) { }',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (MIN-WIDTH: $var + 10px) { }',
			fixed: '@media (min-width: $var + 10px) { }',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (MIN-WIDTH: ($var + 10px)) { }',
			fixed: '@media (min-width: ($var + 10px)) { }',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (MIN-WIDTH: ($var + 10px)) and /* comments */ (#{$MONOCHROME}) { }',
			fixed: '@media (min-width: ($var + 10px)) and /* comments */ (#{$MONOCHROME}) { }',
			message: messages.expected('MIN-WIDTH', 'min-width'),
			line: 1,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	fix: true,

	accept: [
		{
			code: '@media not all and (MONOCHROME) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700px) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700PX) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700px), print and (ORIENTATION: landscape) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700px), PRINT and (ORIENTATION: landscape) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700px), PRINT and /* comments */ (ORIENTATION: landscape) { }',
		},
		{
			code: '@media (MIN-WIDTH: 700px), /* comments */ PRINT and (ORIENTATION: landscape) { }',
		},
		{
			code: '@media (-WEBKIT-MIN-DEVICE-PIXEL-RATION: 2) { }',
		},
		{
			code: '@not-media (min-width: 700px) { }',
			description: 'ignore non media at-rule',
		},
		{
			code: '@media (--viewport-medium) { }',
			description: 'ignore css variables',
		},
		{
			code: '@media (--VIEWPORT-MEDIUM) { }',
			description: 'ignore css variables',
		},
	],

	reject: [
		{
			code: '@media not all and (monochrome) { }',
			fixed: '@media not all and (MONOCHROME) { }',
			message: messages.expected('monochrome', 'MONOCHROME'),
			line: 1,
			column: 21,
		},
		{
			code: '@media not all and (mOnOcHrOmE) { }',
			fixed: '@media not all and (MONOCHROME) { }',
			message: messages.expected('mOnOcHrOmE', 'MONOCHROME'),
			line: 1,
			column: 21,
		},
		{
			code: '@media (min-width: 700px) { }',
			fixed: '@media (MIN-WIDTH: 700px) { }',
			message: messages.expected('min-width', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (mIn-WiDtH: 700px) { }',
			fixed: '@media (MIN-WIDTH: 700px) { }',
			message: messages.expected('mIn-WiDtH', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: 700px) and (ORIENTATION: landscape) { }',
			fixed: '@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) { }',
			message: messages.expected('min-width', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: 700px), PRINT and /* comments */ (ORIENTATION: landscape) { }',
			fixed: '@media (MIN-WIDTH: 700px), PRINT and /* comments */ (ORIENTATION: landscape) { }',
			message: messages.expected('min-width', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (MIN-WIDTH: 700px), /* comments */ PRINT and (orientation: landscape) { }',
			fixed: '@media (MIN-WIDTH: 700px), /* comments */ PRINT and (ORIENTATION: landscape) { }',
			message: messages.expected('orientation', 'ORIENTATION'),
			line: 1,
			column: 54,
		},
		{
			code: '@media (MIN-WIDTH: 700px) and (orientation: landscape) { }',
			fixed: '@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) { }',
			message: messages.expected('orientation', 'ORIENTATION'),
			line: 1,
			column: 32,
		},
		{
			code: '@media (-webkit-min-device-pixel-ration: 2) { }',
			fixed: '@media (-WEBKIT-MIN-DEVICE-PIXEL-RATION: 2) { }',
			message: messages.expected(
				'-webkit-min-device-pixel-ration',
				'-WEBKIT-MIN-DEVICE-PIXEL-RATION',
			),
			line: 1,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	syntax: 'less',
	fix: true,

	accept: [
		{
			code: '@media (MIN-WIDTH: @tablet) { }',
		},
		{
			code: '@media (MIN-WIDTH: (@value + 10px)) { }',
		},
		{
			code: '@media @smartphones and (ORIENTATION: landscape) { }',
		},
		{
			code: '@media @smartphones /* comments */ and (ORIENTATION: landscape) { }',
		},
		{
			code: '@media @smartphones { }',
		},
	],

	reject: [
		{
			code: '@media (min-width: @tablet) { }',
			fixed: '@media (MIN-WIDTH: @tablet) { }',
			message: messages.expected('min-width', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: (@value + 10px)) { }',
			fixed: '@media (MIN-WIDTH: (@value + 10px)) { }',
			message: messages.expected('min-width', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media @smartphones and (orientation: landscape) { }',
			fixed: '@media @smartphones and (ORIENTATION: landscape) { }',
			message: messages.expected('orientation', 'ORIENTATION'),
			line: 1,
			column: 26,
		},
		{
			code: '@media @smartphones /* comments */ and (orientation: landscape) { }',
			fixed: '@media @smartphones /* comments */ and (ORIENTATION: landscape) { }',
			message: messages.expected('orientation', 'ORIENTATION'),
			line: 1,
			column: 41,
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: '@media not all and ($monochrome) { }',
		},
		{
			code: '@media not all and ($MONOCHROME) { }',
		},
		{
			code: '@media not all and (#{$monochrome}) { }',
		},
		{
			code: '@media not all and (#{$MONOCHROME}) { }',
		},
		{
			code: '@media not all and /* comments */ (#{$MONOCHROME}) { }',
		},
		{
			code: '@media (MIN-WIDTH: $var) { }',
		},
		{
			code: '@media (MIN-WIDTH: $var + 10px) { }',
		},
		{
			code: '@media (MIN-WIDTH: ($var + 10px)) { }',
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

	reject: [
		{
			code: '@media (min-width: $var) { }',
			fixed: '@media (MIN-WIDTH: $var) { }',
			message: messages.expected('min-width', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: $var + 10px) { }',
			fixed: '@media (MIN-WIDTH: $var + 10px) { }',
			message: messages.expected('min-width', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: ($var + 10px)) { }',
			fixed: '@media (MIN-WIDTH: ($var + 10px)) { }',
			message: messages.expected('min-width', 'MIN-WIDTH'),
			line: 1,
			column: 9,
		},
		{
			code: '@media (MIN-WIDTH: ($var + 10px)) and /* comments */ (orientation: landscape){ }',
			fixed: '@media (MIN-WIDTH: ($var + 10px)) and /* comments */ (ORIENTATION: landscape){ }',
			message: messages.expected('orientation', 'ORIENTATION'),
			line: 1,
			column: 55,
		},
	],
});
