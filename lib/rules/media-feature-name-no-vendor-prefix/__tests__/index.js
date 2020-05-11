'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@media (min-resolution: 96dpi) {}',
		},
		{
			code: '@media (device-pixel-ratio: 2) {}',
		},
	],

	reject: [
		{
			code: '@media (-webkit-min-device-pixel-ratio: 1) {}',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media (-wEbKiT-mIn-DeViCe-PiXeL-rAtIo: 1) {}',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media (-WEBKIT-MIN-DEVICE-PIXEL-RATIO: 1) {}',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media\n\t(min--moz-device-pixel-ratio: 1) {}',
			message: messages.rejected,
			line: 2,
			column: 3,
		},
		{
			code: '@media   (-o-max-device-pixel-ratio: 1/1) {}',
			message: messages.rejected,
			line: 1,
			column: 11,
		},
		{
			code: '@media (-o-max-device-pixel-ratio > 1) {}',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media (1 < -o-max-device-pixel-ratio < 2) {}',
			message: messages.rejected,
			line: 1,
			column: 13,
		},
	],
});
