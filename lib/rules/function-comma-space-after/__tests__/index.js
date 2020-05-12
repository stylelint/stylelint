'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "func(foo,bar,baz)"; }',
		},
		{
			code: "a::before { background: url('func(foo,bar,baz)'); }",
		},
		{
			code: 'a { background-size: 0,0,0; }',
		},
		{
			code: 'a { transform: translate(1 , 1); }',
		},
		{
			code: 'a { transform: translate(1, 1); }',
		},
		{
			code: 'a { transform: color(rgb(0 , 0, 0) lightness(50%)); }',
		},
		{
			code: 'a { background: url(data:image/svg+xml;charset=utf8,%3Csvg%20xmlns); }',
			description: 'data URI with spaceless comma',
		},
		{
			code: 'a { transform: translate(1, /* comment */1); }',
			description: 'comments',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(1,1); }',
			fixed: 'a { transform: translate(1, 1); }',
			message: messages.expectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1,  1); }',
			fixed: 'a { transform: translate(1, 1); }',
			message: messages.expectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1,\n1); }',
			fixed: 'a { transform: translate(1, 1); }',
			message: messages.expectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1,\r\n1); }',
			fixed: 'a { transform: translate(1, 1); }',
			description: 'CRLF',
			message: messages.expectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1,\t1); }',
			fixed: 'a { transform: translate(1, 1); }',
			message: messages.expectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }',
			fixed: 'a { transform: color(rgb(0 , 0 , 0) lightness(50%)); }',
			message: messages.expectedAfter(),
			line: 1,
			column: 32,
		},
		{
			code: 'a { transform: color(lightness(50%) rgb(0 , 0 ,0)); }',
			fixed: 'a { transform: color(lightness(50%) rgb(0 , 0 , 0)); }',
			message: messages.expectedAfter(),
			line: 1,
			column: 47,
		},
		{
			code: 'a { transform: translate(1,/* comment */1); }',
			fixed: 'a { transform: translate(1, /* comment */1); }',
			description: 'comments',
			message: messages.expectedAfter(),
		},
		{
			code: 'a { color: rgba(0,0,0,0); }',
			fixed: 'a { color: rgba(0, 0, 0, 0); }',
			warnings: [
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 18,
				},
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 20,
				},
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 22,
				},
			],
		},
		{
			code: 'a { background: linear-gradient(45deg,rgba(0,0,0,1),red); }',
			fixed: 'a { background: linear-gradient(45deg, rgba(0, 0, 0, 1), red); }',
			warnings: [
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 38,
				},
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 52,
				},
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 45,
				},
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 47,
				},
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 49,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: '$map: (key: value,key2: value2)',
			description: 'Sass map ignored',
		},
		{
			code: '$list: (value,value2)',
			description: 'Sass list ignored',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "func(foo, bar, baz)"; }',
		},
		{
			code: "a::before { background: url('func(foo, bar, baz)'); }",
		},
		{
			code: 'a { background-size: 0, 0, 0; }',
		},
		{
			code: 'a { transform: translate(1 ,1); }',
		},
		{
			code: 'a { transform: translate(1,1); }',
		},
		{
			code: 'a { transform: color(rgb(0 ,0,0) lightness(50%)); }',
		},
		{
			code: 'a { transform: translate(1,/* comment */1); }',
			description: 'comments',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(1, 1); }',
			fixed: 'a { transform: translate(1,1); }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1,  1); }',
			fixed: 'a { transform: translate(1,1); }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1,\n1); }',
			fixed: 'a { transform: translate(1,1); }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1,\r\n1); }',
			fixed: 'a { transform: translate(1,1); }',
			description: 'CRLF',
			message: messages.rejectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1,\t1); }',
			fixed: 'a { transform: translate(1,1); }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }',
			fixed: 'a { transform: color(rgb(0 ,0 ,0) lightness(50%)); }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { transform: lightness(50%) color(rgb(0 , 0 ,0) ); }',
			fixed: 'a { transform: lightness(50%) color(rgb(0 ,0 ,0) ); }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 43,
		},
		{
			code: 'a { transform: translate(1, /* comment */1); }',
			fixed: 'a { transform: translate(1,/* comment */1); }',
			description: 'comments',
			message: messages.rejectedAfter(),
		},
		{
			code: 'a { transform: translate(1, /* comment */ 1); }',
			fixed: 'a { transform: translate(1,/* comment */1); }',
			description: 'comments',
			message: messages.rejectedAfter(),
		},
		{
			code: 'a { transform: translate(1, /* 1 */\n/* 2 */ /* 3 */ 1); }',
			fixed: 'a { transform: translate(1,/* 1 *//* 2 *//* 3 */1); }',
			description: 'comments',
			message: messages.rejectedAfter(),
		},
		{
			code: 'a { background: linear-gradient(45deg , rgba(0 , 0 , 0 , 1) , red); }',
			fixed: 'a { background: linear-gradient(45deg ,rgba(0 ,0 ,0 ,1) ,red); }',
			warnings: [
				{
					message: messages.rejectedAfter(),
					line: 1,
					column: 39,
				},
				{
					message: messages.rejectedAfter(),
					line: 1,
					column: 61,
				},
				{
					message: messages.rejectedAfter(),
					line: 1,
					column: 48,
				},
				{
					message: messages.rejectedAfter(),
					line: 1,
					column: 52,
				},
				{
					message: messages.rejectedAfter(),
					line: 1,
					column: 56,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	syntax: 'scss',

	accept: [
		{
			code: '$map: (key: value, key2: value2)',
			description: 'SCSS map',
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "func(foo,bar,baz)"; }',
		},
		{
			code: "a::before { background: url('func(foo,bar,baz)'); }",
		},
		{
			code: 'a { background-size: 0,0,0; }',
		},
		{
			code: 'a { transform: translate(1 , 1); }',
		},
		{
			code: 'a { transform: translate(1, 1); }',
		},
		{
			code: 'a { transform: color(rgb(0 , 0, 0) lightness(50%)); }',
		},
		{
			code: 'a { transform: translate(1,\n1); }',
		},
		{
			code: 'a { transform: translate(1\n,1); }',
		},
		{
			code: 'a { transform: translate(1,\r\n1); }',
			description: 'CRLF',
		},
		{
			code: 'a { color: rgba(0,0\n,0); }',
			description: 'CRLF',
		},
		{
			code: 'a { color: rgba(0\n,0,0); }',
			description: 'CRLF',
		},
		{
			code: 'a { background: linear-gradient(45deg\n,rgba(0, 0, 0, 1)\n,red); }',
		},
	],

	reject: [
		{
			code: 'a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }',
			fixed: 'a { transform: color(rgb(0 , 0 , 0) lightness(50%)); }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 32,
		},
		{
			code: 'a { transform: color(lightness(50%) rgb(0 , 0 ,0)); }',
			fixed: 'a { transform: color(lightness(50%) rgb(0 , 0 , 0)); }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 47,
		},
		{
			code: 'a { background: linear-gradient(45deg\n,rgba(0, 0,0, 1),red); }',
			fixed: 'a { background: linear-gradient(45deg\n,rgba(0, 0, 0, 1),red); }',
			message: messages.expectedAfterSingleLine(),
			line: 2,
			column: 11,
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	syntax: 'scss',

	accept: [
		{
			code: '$map: (key: value,key2: value2)',
			description: 'SCSS map',
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "func(foo, bar, baz)"; }',
		},
		{
			code: "a::before { background: url('func(foo, bar, baz)'); }",
		},
		{
			code: 'a { background-size: 0, 0, 0; }',
		},
		{
			code: 'a { transform: translate(1 ,1); }',
		},
		{
			code: 'a { transform: translate(1,1); }',
		},
		{
			code: 'a { transform: color(rgb(0 ,0,0) lightness(50%)); }',
		},
		{
			code: 'a { transform: translate(1,\n1); }',
		},
		{
			code: 'a { transform: translate(1\n, 1); }',
		},
		{
			code: 'a { transform: translate(1\r\n, 1); }',
			description: 'CRLF',
		},
		{
			code: 'a { color: rgba(0, 0\n, 0); }',
			description: 'CRLF',
		},
		{
			code: 'a { color: rgba(0\n, 0, 0); }',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }',
			fixed: 'a { transform: color(rgb(0 ,0 ,0) lightness(50%)); }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { transform: lightness(50%) color(rgb(0 , 0 ,0) ); }',
			fixed: 'a { transform: lightness(50%) color(rgb(0 ,0 ,0) ); }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 43,
		},
		{
			code: 'a { transform: lightness(50%)\ncolor(rgb(0 , 0 ,0) ); }',
			fixed: 'a { transform: lightness(50%)\ncolor(rgb(0 ,0 ,0) ); }',
			message: messages.rejectedAfterSingleLine(),
			line: 2,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	syntax: 'scss',

	accept: [
		{
			code: '$map: (key: value, key2: value2)',
			description: 'SCSS map',
		},
	],
});
