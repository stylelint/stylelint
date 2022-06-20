'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	fix: true,

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
			message: messages.rejected('-webkit-keyframes'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@-wEbKiT-kEyFrAmEs { 0% { top: 0; } }',
			fixed: '@kEyFrAmEs { 0% { top: 0; } }',
			message: messages.rejected('-wEbKiT-kEyFrAmEs'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@-WEBKIT-KEYFRAMES { 0% { top: 0; } }',
			fixed: '@KEYFRAMES { 0% { top: 0; } }',
			message: messages.rejected('-WEBKIT-KEYFRAMES'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@-moz-keyframes { 0% { top: 0; } }',
			fixed: '@keyframes { 0% { top: 0; } }',
			message: messages.rejected('-moz-keyframes'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@-ms-viewport { orientation: landscape; }',
			fixed: '@viewport { orientation: landscape; }',
			message: messages.rejected('-ms-viewport'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
	],
});
