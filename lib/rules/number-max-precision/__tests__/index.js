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
			message: messages.expected(3.123, 3.12),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { padding: 6.123% 3.1%; }',
			message: messages.expected(6.123, 6.12),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@media (min-width: 5.123em) {}',
			message: messages.expected(5.123, 5.12),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 25,
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
			message: messages.expected(3.12345, 3.1235),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { padding: 6.12345% 3.1234%; }',
			message: messages.expected(6.12345, 6.1235),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '@media (min-width: 5.12345em) {}',
			message: messages.expected(5.12345, 5.1235),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 27,
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
			message: messages.expected(3.1, 3),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 13,
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
			message: messages.expected(3.1, 3),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { top: 3.123em; }',
			message: messages.expected(3.123, 3),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { padding: 6.123px 3.1234px; }',
			warnings: [
				{
					message: messages.expected(6.123, 6),
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 19,
				},
				{
					message: messages.expected(3.1234, 3),
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: 'a { top: 6.123other-unit; }',
			message: messages.expected(6.123, 6),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 15,
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
			message: messages.expected(6.123, 6),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 15,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignoreProperties: ['letter-spacing', '/^my-/'] }],

	accept: [
		{
			code: 'a { letter-spacing: 1.2px; }',
		},
		{
			code: 'a { my-prop: 3.1%; }',
		},
	],

	reject: [
		{
			code: 'a { top: 3.1px; }',
			message: messages.expected(3.1, 3),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { top: 3.123em; }',
			message: messages.expected(3.123, 3),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { myprop: 6.123px 3.1234px; }',
			warnings: [
				{
					message: messages.expected(6.123, 6),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
				{
					message: messages.expected(3.1234, 3),
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [
		0,
		{
			ignoreProperties: ['letter-spacing', '/^my-/'],
			ignoreUnits: ['%', '/^my-/'],
		},
	],

	accept: [
		{
			code: 'a { letter-spacing: 1.2px; }',
		},
		{
			code: 'a { my-prop: 3.1%; }',
		},
		{
			code: 'a { top: 1.2%; }',
		},
		{
			code: 'a { top: 1.2my-unit; }',
		},
	],

	reject: [
		{
			code: 'a { top: 3.1px; }',
			message: messages.expected(3.1, 3),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { top: 3.123em; }',
			message: messages.expected(3.123, 3),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { myprop: 6.123px 3.1234px; }',
			warnings: [
				{
					message: messages.expected(6.123, 6),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
				{
					message: messages.expected(3.1234, 3),
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [
		2,
		{
			insideFunctions: {
				oklch: 4,
				zero: 0,
				one: 1,
				two: 2,
				[/^three/i]: 3,
			},
		},
	],

	accept: [
		{
			code: 'a { color: oklch(0.1234 0.1234 0.1234) }',
		},
		{
			code: 'a { color: oklch(calc(0.1234 + 1.0001) 0.1234 0.1234) }',
		},
		{
			code: 'a { color: zero(0, one(1.1, tWo(2.22%, ThReE(3.333px), three-percentage(3.333%)))) }',
		},
	],

	reject: [
		{
			code: 'a { color: oklch(0.12345 0.1234 0.1234) }',
			message: messages.expected(0.12345, 0.1235),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { color: zero(0, one(1.1, two(2.22, ThReE(3.333, zero(calc(0.1)))))) }',
			message: messages.expected(0.1, 0),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 65,
		},
	],
});
