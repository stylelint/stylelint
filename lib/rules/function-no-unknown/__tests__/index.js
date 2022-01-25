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
			code: 'a { transform: badfunction(4); }',
			message: messages.rejected('badfunction'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: color(rgba(0, 0, 0, 0) lightness(50%)); }',
			message: messages.rejected('lightness'),
			line: 1,
			column: 35,
		},
	],
});

testRule({
	ruleName,
	config: false,
	skipBasicChecks: true,

	accept: [
		{
			code: 'a { transform: shouldskip(4); }',
		},
	],
});
