'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@keyframes foo { 0% {} 100% {} }',
		},
		{
			code: '@keyframes foo { from {} to {} }',
		},
	],

	reject: [
		{
			code: '@keyframes foo { from {} to {} to {} }',
			message: messages.rejected('to'),
		},
		{
			code: '@keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@-webkit-keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@-moz-keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@keyframes foo { 0% {} 0%, 100% {} }',
			message: messages.rejected('0%'),
		},
	],
});
