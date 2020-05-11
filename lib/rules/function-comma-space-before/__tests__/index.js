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
			code: 'a { background-size: 0, 0, 0; }',
		},
		{
			code: 'a { transform: translate(1 , 1); }',
		},
		{
			code: 'a { transform: translate(1 ,1); }',
		},
		{
			code: 'a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }',
		},
		{
			code: 'a { background: url(data:image/svg+xml;charset=utf8,%3Csvg%20xmlns); }',
			description: 'data URI with spaceless comma',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(1, 1); }',
			fixed: 'a { transform: translate(1 , 1); }',
			message: messages.expectedBefore(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { transform: translate(1  , 1); }',
			fixed: 'a { transform: translate(1 , 1); }',
			message: messages.expectedBefore(),
			line: 1,
			column: 29,
		},
		{
			code: 'a { transform: translate(1\n, 1); }',
			fixed: 'a { transform: translate(1 , 1); }',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { transform: translate(1\r\n, 1); }',
			fixed: 'a { transform: translate(1 , 1); }',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { transform: translate(1\t, 1); }',
			fixed: 'a { transform: translate(1 , 1); }',
			message: messages.expectedBefore(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { transform: color(rgb(0 , 0, 0) lightness(50%)); }',
			fixed: 'a { transform: color(rgb(0 , 0 , 0) lightness(50%)); }',
			message: messages.expectedBefore(),
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: color(lightness(50%) rgb(0 , 0, 0)); }',
			fixed: 'a { transform: color(lightness(50%) rgb(0 , 0 , 0)); }',
			message: messages.expectedBefore(),
			line: 1,
			column: 46,
		},
		{
			code: `
      a {
        transform: translate(
          1px /* comment */
          ,1px
        );
      }
    `,
			fixed: `
      a {
        transform: translate(
          1px /* comment */ ,1px
        );
      }
    `,
			description: 'eol comments',
			message: messages.expectedBefore(),
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'scss',

	accept: [
		{
			code: '$map: (key: value,key2: value2)',
			description: 'Sass map ignored',
		},
		{
			code: '$list: (value, value2)',
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
			code: 'a::before { content: "func(foo ,bar ,baz)"; }',
		},
		{
			code: "a::before { background: url('func(foo ,bar ,baz)'); }",
		},
		{
			code: 'a { background-size: 0 , 0 , 0; }',
		},
		{
			code: 'a { transform: translate(1, 1); }',
		},
		{
			code: 'a { transform: translate(1,1); }',
		},
		{
			code: 'a { transform: color(rgb(0, 0,0) lightness(50%)); }',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(1 , 1); }',
			fixed: 'a { transform: translate(1, 1); }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { transform: translate(1  , 1); }',
			fixed: 'a { transform: translate(1, 1); }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 29,
		},
		{
			code: 'a { transform: translate(1\n, 1); }',
			fixed: 'a { transform: translate(1, 1); }',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { transform: translate(1\r\n, 1); }',
			fixed: 'a { transform: translate(1, 1); }',
			description: 'CRLF',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: 'a { transform: translate(1\t, 1); }',
			fixed: 'a { transform: translate(1, 1); }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { transform: color(rgb(0, 0 , 0) lightness(50%)); }',
			fixed: 'a { transform: color(rgb(0, 0, 0) lightness(50%)); }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: color(lightness(50%) rgb(0, 0 , 0)); }',
			fixed: 'a { transform: color(lightness(50%) rgb(0, 0, 0)); }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 46,
		},
		{
			code: 'a { transform: translate(1 /*comment*/ , 1); }',
			fixed: 'a { transform: translate(1 /*comment*/, 1); }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 40,
		},
		{
			code: 'a { transform: translate(1 /*c*/ /*c*/ , 1); }',
			fixed: 'a { transform: translate(1 /*c*/ /*c*/, 1); }',
			message: messages.rejectedBefore(),
			line: 1,
			column: 40,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	syntax: 'scss',

	accept: [
		{
			code: '$map: (key: value ,key2: value2)',
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
			code: 'a { background-size: 0, 0, 0; }',
		},
		{
			code: 'a { transform: translate(1 , 1); }',
		},
		{
			code: 'a { transform: translate(1 ,1); }',
		},
		{
			code: 'a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }',
		},
		{
			code: 'a { transform: translate(1,\n1); }',
		},
		{
			code: 'a { transform: translate(1  ,\n1); }',
		},
		{
			code: 'a { transform: translate(1\t,\r\n1); }',
			description: 'CRLF',
		},
		{
			code: 'a { transform: translate(1\n, 1); }',
		},
		{
			code: 'a { transform: translate(1\n,\n1); }',
		},
		{
			code: 'a { background: linear-gradient(45deg,\nrgba(0 , 0 , 0 ,1)\n,red); }',
		},
	],

	reject: [
		{
			code: 'a { transform: color(rgb(0 , 0, 0) lightness(50%)); }',
			fixed: 'a { transform: color(rgb(0 , 0 , 0) lightness(50%)); }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: color(lightness(50%) rgb(0 , 0, 0)); }',
			fixed: 'a { transform: color(lightness(50%) rgb(0 , 0 , 0)); }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 46,
		},
		{
			code: 'a { background: linear-gradient(45deg,\nrgba(0 , 0,0 ,1),red); }',
			fixed: 'a { background: linear-gradient(45deg,\nrgba(0 , 0 ,0 ,1),red); }',
			message: messages.expectedBeforeSingleLine(),
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
			code: 'a::before { content: "func(foo ,bar ,baz)"; }',
		},
		{
			code: "a::before { background: url('func(foo ,bar ,baz)'); }",
		},
		{
			code: 'a { background-size: 0 , 0 , 0; }',
		},
		{
			code: 'a { transform: translate(1, 1); }',
		},
		{
			code: 'a { transform: translate(1,1); }',
		},
		{
			code: 'a { transform: color(rgb(0, 0,0) lightness(50%)); }',
		},
		{
			code: 'a { transform: translate(1 ,\n1); }',
		},
		{
			code: 'a { transform: translate(1  ,\n1); }',
		},
		{
			code: 'a { transform: translate(1\t,\r\n1); }',
			description: 'CRLF',
		},
		{
			code: 'a { transform: translate(1\n, 1); }',
		},
		{
			code: 'a { transform: translate(1\n,\n1); }',
		},
	],

	reject: [
		{
			code: 'a { transform: color(rgb(0, 0 , 0) lightness(50%)); }',
			fixed: 'a { transform: color(rgb(0, 0, 0) lightness(50%)); }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: color(lightness(50%) rgb(0, 0 , 0)); }',
			fixed: 'a { transform: color(lightness(50%) rgb(0, 0, 0)); }',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 46,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	syntax: 'scss',

	accept: [
		{
			code: '$map: (key: value ,key2: value2)',
			description: 'SCSS map',
		},
	],
});
