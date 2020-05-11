'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "(a) ( a)"; }',
		},
		{
			code: "a::before { background: url(\n'asdf( Vcxvsd)ASD'\n); }",
		},
		{
			code: 'a { transform: translate(\n1, 1\n); }',
		},
		{
			code: 'a { transform: translate(\n\n1, 1\n\n); }',
		},
		{
			code: 'a { transform: translate(\r\n1, 1\r\n); }',
			description: 'CRLF',
		},
		{
			code: 'a { transform: translate(\r\n\r\n1, 1\r\n\r\n); }',
			description: 'CRLF',
		},
		{
			code: 'a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }',
		},
		{
			code: '$map: (key: value,key2: value2)',
			description: 'Sass map ignored',
		},
		{
			code: '$list: (value, value2)',
			description: 'Sass list ignored',
		},
		{
			code: 'a { transform: translate( /*comment*/\n1,\n  1\n); }',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(1, 1\n); }',
			fixed: 'a { transform: translate(\n1, 1\n); }',
			message: messages.expectedOpening,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(\n1, 1); }',
			fixed: 'a { transform: translate(\n1, 1\n); }',
			message: messages.expectedClosing,
			line: 2,
			column: 4,
		},
		{
			code: 'a { transform: translate(  1, 1\n); }',
			fixed: 'a { transform: translate(\n  1, 1\n); }',
			message: messages.expectedOpening,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(\n1,\n1\t); }',
			fixed: 'a { transform: translate(\n1,\n1\n\t); }',
			message: messages.expectedClosing,
			line: 3,
			column: 2,
		},
		{
			code: 'a { color: color(rgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }',
			fixed: 'a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }',
			message: messages.expectedOpening,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: color(\nrgb(\n0, 0, 0\n) lightness(50%\n)\n); }',
			fixed: 'a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }',
			message: messages.expectedOpening,
			line: 4,
			column: 13,
		},
		{
			code: 'a::before { content: attr(data-foo\n); }',
			fixed: 'a::before { content: attr(\ndata-foo\n); }',
			message: messages.expectedOpening,
			line: 1,
			column: 27,
		},
		{
			code: 'a::before { content: attr(\n\tdata-foo); }',
			fixed: 'a::before { content: attr(\n\tdata-foo\n); }',
			message: messages.expectedClosing,
			line: 2,
			column: 9,
		},
		{
			code: 'a { transform: translate(  1,\n  1\n); }',
			fixed: 'a { transform: translate(\n  1,\n  1\n); }',
			message: messages.expectedOpening,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(1,\r\n1\n); }',
			fixed: 'a { transform: translate(\r\n1,\r\n1\n); }',
			description: 'CRLF',
			message: messages.expectedOpening,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate( /*comment*/ 1,\n  1\n); }',
			fixed: 'a { transform: translate( /*comment*/\n 1,\n  1\n); }',
			message: messages.expectedOpening,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate( /*c1*/ /*c2*/ 1,1 /*c3*/ /*c4*/ ); }',
			fixed: 'a { transform: translate( /*c1*/ /*c2*/\n 1,1 /*c3*/ /*c4*/\n ); }',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 26,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 58,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "(a) ( a)"; }',
		},
		{
			code: "a::before { background: url(\n'asdf( Vcxvsd)ASD'\n); }",
		},
		{
			code: 'a { transform: translate(\n1, 1\n); }',
		},
		{
			code: 'a { transform: translate(\r\n1, 1\r\n); }',
			description: 'CRLF',
		},
		{
			code: 'a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }',
		},
		{
			code: 'a { transform: translate(1, 1); }',
		},
		{
			code: 'a { transform: translate(  1, 1\t); }',
		},
		{
			code: '$map: (key: value,\nkey2: value2)',
			description: 'SCSS map',
		},
		{
			code: 'a { transform: translate(\n/*comment*/ 1,1\n); }',
		},
		{
			code: 'a { transform: translate( /*comment*/\n1,1\n); }',
		},
		{
			code: 'a { transform: translate(\n1,1\n/*comment*/ ); }',
		},
		{
			code: 'a { transform: translate(\n1,1 /*comment*/\n); }',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(1, 1\n); }',
			fixed: 'a { transform: translate(\n1, 1\n); }',
			message: messages.expectedOpeningMultiLine,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(\n1, 1); }',
			fixed: 'a { transform: translate(\n1, 1\n); }',
			message: messages.expectedClosingMultiLine,
			line: 2,
			column: 4,
		},
		{
			code: 'a { transform: translate(  1, 1\n); }',
			fixed: 'a { transform: translate(\n  1, 1\n); }',
			message: messages.expectedOpeningMultiLine,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(\n1,\n1\t); }',
			fixed: 'a { transform: translate(\n1,\n1\n\t); }',
			message: messages.expectedClosingMultiLine,
			line: 3,
			column: 2,
		},
		{
			code: 'a { color: color(rgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }',
			fixed: 'a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }',
			message: messages.expectedOpeningMultiLine,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: color(\nrgb(\n0, 0, 0\n) lightness(50%\n)\n); }',
			fixed: 'a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }',
			message: messages.expectedOpeningMultiLine,
			line: 4,
			column: 13,
		},
		{
			code: 'a::before { content: attr(data-foo\n); }',
			fixed: 'a::before { content: attr(\ndata-foo\n); }',
			message: messages.expectedOpeningMultiLine,
			line: 1,
			column: 27,
		},
		{
			code: 'a::before { content: attr(\n\tdata-foo); }',
			fixed: 'a::before { content: attr(\n\tdata-foo\n); }',
			message: messages.expectedClosingMultiLine,
			line: 2,
			column: 9,
		},
		{
			code: 'a { transform: translate(  1,\n  1\n); }',
			fixed: 'a { transform: translate(\n  1,\n  1\n); }',
			message: messages.expectedOpeningMultiLine,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(1,\r\n1\n); }',
			fixed: 'a { transform: translate(\r\n1,\r\n1\n); }',
			description: 'CRLF',
			message: messages.expectedOpeningMultiLine,
			line: 1,
			column: 26,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "(a) ( a)"; }',
		},
		{
			code: "a::before { background: url('asdf(Vcxv\nsd\n)ASD'); }",
		},
		{
			code: 'a { transform: translate(1, 1); }',
		},
		{
			code: 'a { transform: translate(1,\r\n1); }',
			description: 'CRLF',
		},
		{
			code: 'a { color: color(rgb(0, 0, 0) lightness(50%)); }',
		},
		{
			code: 'a { transform: translate(1,\n  1); }',
		},
		{
			code: 'a { transform: translate(1,\n\t\t1); }',
		},
		{
			code: '$map: (\nkey: value,\nkey2: value2\n)',
			description: 'SCSS map',
		},
		{
			code: 'a { transform: translate(/*comment*/1,\n1); }',
		},
		{
			code: 'a { transform: translate(1,\n1/*comment*/); }',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(\n  1,\n  1); }',
			fixed: 'a { transform: translate(1,\n  1); }',
			message: messages.rejectedOpeningMultiLine,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(  \n  1,\n  1); }',
			fixed: 'a { transform: translate(1,\n  1); }',
			message: messages.rejectedOpeningMultiLine,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(1,\n  1\n); }',
			fixed: 'a { transform: translate(1,\n  1); }',
			message: messages.rejectedClosingMultiLine,
			line: 2,
			column: 4,
		},
		{
			code: 'a { transform: translate(1,\r\n1\t); }',
			fixed: 'a { transform: translate(1,\r\n1); }',
			message: messages.rejectedClosingMultiLine,
			line: 2,
			column: 2,
		},
		{
			code: 'a { color: color(rgb(0,\r\n  0,\r\n  0\r\n) lightness(50%)); }',
			fixed: 'a { color: color(rgb(0,\r\n  0,\r\n  0) lightness(50%)); }',
			message: messages.rejectedClosingMultiLine,
			line: 3,
			column: 5,
		},
		{
			code: 'a { color: color(rgb(0, 0, 0) lightness(\n50%)); }',
			fixed: 'a { color: color(rgb(0, 0, 0) lightness(50%)); }',
			message: messages.rejectedOpeningMultiLine,
			line: 1,
			column: 41,
		},
		{
			code: 'a { transform: translate( /*c1*/ /*c2*/ 1,\n1 /*c3*/ /*c4*/ ); }',
			fixed: 'a { transform: translate(/*c1*//*c2*/1,\n1/*c3*//*c4*/); }',
			warnings: [
				{
					message: messages.rejectedOpeningMultiLine,
					line: 1,
					column: 26,
				},
				{
					message: messages.rejectedClosingMultiLine,
					line: 2,
					column: 16,
				},
			],
		},
		{
			code: 'a { transform: translate( /*c1*//*c2*/1,\n1/*c3*//*c4*/ ); }',
			fixed: 'a { transform: translate(/*c1*//*c2*/1,\n1/*c3*//*c4*/); }',
			warnings: [
				{
					message: messages.rejectedOpeningMultiLine,
					line: 1,
					column: 26,
				},
				{
					message: messages.rejectedClosingMultiLine,
					line: 2,
					column: 14,
				},
			],
		},
		{
			code: 'a { transform: translate(/*c1*//*c2*/ 1,\n1 /*c3*//*c4*/); }',
			fixed: 'a { transform: translate(/*c1*//*c2*/1,\n1/*c3*//*c4*/); }',
			warnings: [
				{
					message: messages.rejectedOpeningMultiLine,
					line: 1,
					column: 26,
				},
				{
					message: messages.rejectedClosingMultiLine,
					line: 2,
					column: 14,
				},
			],
		},
		{
			code: 'a { transform: translate(/*c1*/ /*c2*/1,\n1/*c3*/ /*c4*/); }',
			fixed: 'a { transform: translate(/*c1*//*c2*/1,\n1/*c3*//*c4*/); }',
			warnings: [
				{
					message: messages.rejectedOpeningMultiLine,
					line: 1,
					column: 26,
				},
				{
					message: messages.rejectedClosingMultiLine,
					line: 2,
					column: 14,
				},
			],
		},
	],
});
