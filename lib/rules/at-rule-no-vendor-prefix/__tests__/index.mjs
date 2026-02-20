import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@keyframes { 0% { top: 0; } }',
		},
		{
			code: '@viewport { orientation: landscape; }',
		},
	],

	reject: [
		{
			code: '@-webkit-keyframes { 0% { top: 0; } }',
			fixed: '@keyframes { 0% { top: 0; } }',
			message: messages.rejected('@-webkit-keyframes'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
			fix: {
				range: [1, 9],
				text: '',
			},
		},
		{
			code: '@-wEbKiT-kEyFrAmEs { 0% { top: 0; } }',
			fixed: '@kEyFrAmEs { 0% { top: 0; } }',
			message: messages.rejected('@-wEbKiT-kEyFrAmEs'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
			fix: {
				range: [1, 9],
				text: '',
			},
		},
		{
			code: '@-WEBKIT-KEYFRAMES { 0% { top: 0; } }',
			fixed: '@KEYFRAMES { 0% { top: 0; } }',
			message: messages.rejected('@-WEBKIT-KEYFRAMES'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
			fix: {
				range: [1, 9],
				text: '',
			},
		},
		{
			code: '@-moz-keyframes { 0% { top: 0; } }',
			fixed: '@keyframes { 0% { top: 0; } }',
			message: messages.rejected('@-moz-keyframes'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
			fix: {
				range: [1, 6],
				text: '',
			},
		},
		{
			code: '@-ms-viewport { orientation: landscape; }',
			fixed: '@viewport { orientation: landscape; }',
			message: messages.rejected('@-ms-viewport'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
			fix: {
				range: [1, 5],
				text: '',
			},
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: ['-webkit-keyframes', '/-viewport/i'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@keyframes {}',
		},
		{
			code: '@-webkit-keyframes {}',
		},
		{
			code: '@viewport {}',
		},
		{
			code: '@-MS-VIEWPORT {}',
		}
		{
			code: '@-moz-document url("https://example.com") {}',
		},
	],

	reject: [
		{
			code: '@-MOZ-DOCUMENT url("https://example.com/") {}',
			fixed: '@DOCUMENT url("https://example.com/") {}',
			message: messages.rejected('@-MOZ-DOCUMENT'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
			fix: {
				range: [1, 6],
				text: '',
			},
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: [/^-moz-font/i] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@-moz-font-feature-values Example Font { font-display: swap; }',
		},
		{
			code: '@-moz-FONT-palette-VALUES --Example { font-family: "Example Font"; }',
		},
	],
	reject: [
		{
			code: '@-moz-document url("https://stylelint.io/") {}',
			fixed: '@document url("https://stylelint.io/") {}',
			message: messages.rejected('@-moz-document'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
			fix: {
				range: [1, 6],
				text: '',
			},
		},
	],
});
