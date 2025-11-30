import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@media (-ms-min-resolution: 96dpi) {}',
		},
		{
			code: '@media (-ms-device-pixel-ratio: 2) {}',
		},
		{
			code: '@media (device-pixel-ratio: 2) {}',
		},
		{
			code: '@media (min-device-pixel-ratio: 2) {}',
		},
	],

	reject: [
		{
			code: '@media (-webkit-min-device-pixel-ratio: 1) {}',
			fixed: '@media (min-device-pixel-ratio: 1) {}',
			fix: {
				range: [8, 16],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media (-wEbKiT-mIn-DeViCe-PiXeL-rAtIo: 1) {}',
			fixed: '@media (mIn-DeViCe-PiXeL-rAtIo: 1) {}',
			fix: {
				range: [8, 16],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media (-WEBKIT-MIN-DEVICE-PIXEL-RATIO: 1) {}',
			fixed: '@media (MIN-DEVICE-PIXEL-RATIO: 1) {}',
			fix: {
				range: [8, 16],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media (min--moz-device-pixel-ratio: 1) {}',
			fixed: '@media (min-device-pixel-ratio: 1) {}',
			fix: {
				range: [12, 17],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media ( max--moz-device-pixel-ratio: 1) {}',
			fixed: '@media ( max-device-pixel-ratio: 1) {}',
			fix: {
				range: [13, 18],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 10,
		},
		{
			code: '@media (/* a comment */MIN--moz-device-pixel-ratio: 1) {}',
			fixed: '@media (/* a comment */MIN-device-pixel-ratio: 1) {}',
			fix: {
				range: [27, 32],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 24,
		},
		{
			code: '@media\n\t(min--moz-device-pixel-ratio: 1) {}',
			fixed: '@media\n\t(min-device-pixel-ratio: 1) {}',
			fix: {
				range: [13, 18],
				text: '',
			},
			message: messages.rejected,
			line: 2,
			column: 3,
		},
		{
			code: '@media   (-o-max-device-pixel-ratio: 1/1) {}',
			fixed: '@media   (max-device-pixel-ratio: 1/1) {}',
			fix: {
				range: [10, 13],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 11,
		},
		{
			code: '@media (-o-device-pixel-ratio > 1) {}',
			fixed: '@media (device-pixel-ratio > 1) {}',
			fix: {
				range: [8, 11],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: '@media (0 < -webkit-device-pixel-ratio < 2) {}',
			fixed: '@media (0 < device-pixel-ratio < 2) {}',
			fix: {
				range: [12, 20],
				text: '',
			},
			message: messages.rejected,
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: '@media (-webkit-min-device-pixel-ratio: 0) and (-webkit-max-device-pixel-ratio: 2) {}',
			fixed: '@media (min-device-pixel-ratio: 0) and (max-device-pixel-ratio: 2) {}',
			warnings: [
				{
					message: messages.rejected,
					fix: {
						range: [8, 16],
						text: '',
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 39,
				},
				{
					message: messages.rejected,
					fix: undefined,
					line: 1,
					column: 49,
					endLine: 1,
					endColumn: 79,
				},
			],
		},
	],
});
