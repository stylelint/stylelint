'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: 'never',
	accept: [
		{
			code: 'a{color:#888; }',
		},
		{
			code: 'a{color:#888888; }',
		},
	],
	reject: [
		{
			code: 'a{color:#8888;}',
			message: messages.unexpected('#8888'),
			line: 1,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	config: 'always',
	accept: [
		{
			code: 'a { color: #8888; }',
		},
		{
			code: 'a { color: #88888888; }',
		},
	],
	reject: [
		{
			code: 'a{color:#888;}',
			message: messages.expected('#888'),
			line: 1,
			column: 9,
		},
	],
});
