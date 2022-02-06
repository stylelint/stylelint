'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: true,
	skipBasicChecks: true,

	accept: [
		{
			code: 'a { transform: translate(1px); }',
		},
		{
			code: 'a { transform: --custom-function(1px); }',
		},
		{
			code: 'a { transform: scale(0.5) translate(-100%, -100%); }',
		},
	],

	reject: [
		{
			code: 'a { transform: unknown(4); }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { width: calc(10% * unknown(1)); }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 23,
		},
	],
});

testRule({
	ruleName,
	config: true,
	skipBasicChecks: true,

	accept: [
		{
			code: 'a { $list: (list) }',
		},
	],
});
