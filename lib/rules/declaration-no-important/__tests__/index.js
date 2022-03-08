'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { color: pink; }',
			description: 'without !important',
		},
	],

	reject: [
		{
			code: 'a { color: pink !important; }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink ! important; }',
			description: 'with ! important',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink!important; }',
			description: 'with value!important',
			message: messages.rejected,
			line: 1,
			column: 16,
		},
	],
});
