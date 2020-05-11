'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

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
			message: messages.rejected('-webkit-keyframes'),
		},
		{
			code: '@-wEbKiT-kEyFrAmEs { 0% { top: 0; } }',
			message: messages.rejected('-wEbKiT-kEyFrAmEs'),
		},
		{
			code: '@-WEBKIT-KEYFRAMES { 0% { top: 0; } }',
			message: messages.rejected('-WEBKIT-KEYFRAMES'),
		},
		{
			code: '@-moz-keyframes { 0% { top: 0; } }',
			message: messages.rejected('-moz-keyframes'),
		},
		{
			code: '@-ms-viewport { orientation: landscape; }',
			message: messages.rejected('-ms-viewport'),
		},
	],
});
