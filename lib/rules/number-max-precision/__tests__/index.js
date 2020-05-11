'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: 'a { top: 3px /* 3.12345px */; }',
		},
		{
			code: 'a::before { content: "3.12345px"; }',
		},
		{
			code: 'a::before { cOnTeNt: "3.12345px"; }',
		},
		{
			code: 'a::before { CONTENT: "3.12345px"; }',
		},
		{
			code: 'a { top: 3%; }',
		},
		{
			code: 'a { top: 3.1%; }',
		},
		{
			code: 'a { top: 3.12%; }',
		},
		{
			code: 'a { padding: 6.1% 3.12%; }',
		},
		{
			code: '@media (min-width: 5.12em) {}',
		},
		{
			code: "@import '1.123.css'",
		},
		{
			code: "@IMPORT '1.123.css'",
		},
		{
			code: 'a { background: url(1.123.jpg) }',
		},
		{
			code: 'a { my-string: "1.2345"; }',
			description: "ignore all strings rather than only in 'content'",
		},
	],

	reject: [
		{
			code: 'a { top: 3.123%; }',
			message: messages.expected(3.123, 2),
			line: 1,
			column: 10,
		},
		{
			code: 'a { padding: 6.123% 3.1%; }',
			message: messages.expected(6.123, 2),
			line: 1,
			column: 14,
		},
		{
			code: '@media (min-width: 5.123em) {}',
			message: messages.expected(5.123, 2),
			line: 1,
			column: 20,
		},
	],
});

testRule({
	ruleName,
	config: [4],

	accept: [
		{
			code: 'a { top: 3px /* 3.12345px */; }',
		},
		{
			code: 'a::before { content: "3.12345px"; }',
		},
		{
			code: 'a { top: 3%; }',
		},
		{
			code: 'a { top: 3.1%; }',
		},
		{
			code: 'a { top: 3.12%; }',
		},
		{
			code: 'a { top: 3.123%; }',
		},
		{
			code: 'a { top: 3.1234%; }',
		},
		{
			code: 'a { padding: 6.123% 3.1234%; }',
		},
		{
			code: '@media (min-width: 5.1234em) {}',
		},
	],

	reject: [
		{
			code: 'a { top: 3.12345%; }',
			message: messages.expected(3.12345, 4),
			line: 1,
			column: 10,
		},
		{
			code: 'a { padding: 6.12345% 3.1234%; }',
			message: messages.expected(6.12345, 4),
			line: 1,
			column: 14,
		},
		{
			code: '@media (min-width: 5.12345em) {}',
			message: messages.expected(5.12345, 4),
			line: 1,
			column: 20,
		},
	],
});

testRule({
	ruleName,
	config: [0],

	accept: [
		{
			code: 'a { top: 3%; }',
		},
	],

	reject: [
		{
			code: 'a { top: 3.1%; }',
			message: messages.expected(3.1, 0),
			line: 1,
			column: 10,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignoreUnits: ['%', '/^my-/'] }],

	accept: [
		{
			code: 'a { top: 3%; }',
		},
		{
			code: 'a { top: 3.1%; }',
		},
		{
			code: 'a { top: 3.123456%; }',
		},
		{
			code: 'a { top: 3px; }',
		},
		{
			code: 'a { color: #ff00; }',
		},
		{
			code: 'a { padding: 6.123% 3.1234%; }',
		},
		{
			code: 'a { top: 3.245my-unit; }',
		},
	],

	reject: [
		{
			code: 'a { top: 3.1px; }',
			message: messages.expected(3.1, 0),
			line: 1,
			column: 10,
		},
		{
			code: 'a { top: 3.123em; }',
			message: messages.expected(3.123, 0),
			line: 1,
			column: 10,
		},
		{
			code: 'a { padding: 6.123px 3.1234px; }',
			warnings: [
				{
					message: messages.expected(6.123, 0),
					line: 1,
					column: 14,
				},
				{
					message: messages.expected(3.1234, 0),
					line: 1,
					column: 22,
				},
			],
		},
		{
			code: 'a { top: 6.123other-unit; }',
			message: messages.expected(6.123, 0),
			line: 1,
			column: 10,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignoreUnits: [/^my-/] }],

	accept: [
		{
			code: 'a { top: 3.245my-unit; }',
		},
	],

	reject: [
		{
			code: 'a { top: 6.123other-unit; }',
			message: messages.expected(6.123, 0),
			line: 1,
			column: 10,
		},
	],
});
