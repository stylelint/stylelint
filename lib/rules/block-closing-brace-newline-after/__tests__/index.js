'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; }\nb { color: red; }',
		},
		{
			code: 'a { color: pink; }\r\nb { color: red; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink; }\n\nb { color: red; }',
		},
		{
			code: 'a { color: pink; }\r\n\r\nb { color: red; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;}\n\t\tb { color: red;}',
		},
		{
			code: 'a { color: pink;}\r\n\t\tb { color: red;}',
			description: 'CRLF',
		},
		{
			code: 'a { @extend foo; color: pink; }',
		},
		{
			code: 'a { @extend foo; /* comment */\ncolor: pink;  }',
		},
		{
			code: '@media print { a { color: pink; }\nb { color: red; }}',
		},
		{
			code: '@media print { a { color: pink; }}\n@media screen { b { color: red; }}',
		},
		{
			code: '.a {} /* comment */',
		},
		{
			code: '.a {} /* comment */\n b {}',
		},
		{
			code: ':root {\n --x { color: pink; };\n --y { color: red; };\n }',
			description: 'Allow a trailing semicolon after the closing brace of a block',
		},
		{
			code: ':root {\n --x { color: pink; } ;\n --y { color: red; };\n }',
			description: 'Allow a spaced trailing semicolon after the closing brace of an at-apply block',
		},
		{
			code: '.foo {\n --my-theme: { color: red; };\n --toolbar-theme: { color: green; };\n }',
			description: 'Make sure trailing semicolon works well for blocks outside :root',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }b { color: red; }',
			fixed: 'a { color: pink; }\nb { color: red; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; } b { color: red; }',
			fixed: 'a { color: pink; }\n b { color: red; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }  b { color: red; }',
			fixed: 'a { color: pink; }\n  b { color: red; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\tb { color: red; }',
			fixed: 'a { color: pink; }\n\tb { color: red; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: '@media print { a { color: pink; } b { color: red; }}',
			fixed: '@media print { a { color: pink; }\n b { color: red; }}',
			message: messages.expectedAfter(),
			line: 1,
			column: 34,
		},
		{
			code: '@media print { a { color: pink; }} @media screen { b { color: red; }}',
			fixed: '@media print { a { color: pink; }}\n @media screen { b { color: red; }}',
			message: messages.expectedAfter(),
			line: 1,
			column: 35,
		},
		{
			code: '.a {} /* comment */ b {}',
			fixed: '.a {} /* comment */\n b {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 6,
		},
		{
			code: ':root {\n --x { color: pink; } ; \n --y { color: red; };\n }',
			fixed: ':root {\n --x { color: pink; } ;\n --y { color: red; };\n }',
			message: messages.expectedAfter(),
			line: 2,
			column: 24,
		},
		{
			code: ':root {\n --x { color: pink; }; \n --y { color: red; };\n }',
			fixed: ':root {\n --x { color: pink; };\n --y { color: red; };\n }',
			message: messages.expectedAfter(),
			line: 2,
			column: 23,
		},
		{
			code: '.foo {\n --my-theme: { color: red; }; \n --toolbar-theme: { color: green; };\n }',
			fixed: '.foo {\n --my-theme: { color: red; };\n --toolbar-theme: { color: green; };\n }',
			description: 'Make sure trailing semicolon works well for blocks outside :root',
			message: messages.expectedAfter(),
			line: 2,
			column: 30,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignoreAtRules: ['if', 'else'] }],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }\nb {}',
		},
		{
			code: '@if ... { color: pink; } @else {}',
		},
		{
			code: '@if ... { color: pink; } @else if {} else {}',
		},
		{
			code: '@if ... {\r\n  color: pink; \n} @else if {\n  color: pink;\n} else {}',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }b{}',
			fixed: 'a { color: pink; }\nb{}',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignoreAtRules: '/if/' }],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }\nb {}',
		},
		{
			code: '@if ... { color: pink; } @else {}',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }b{}',
			fixed: 'a { color: pink; }\nb{}',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; }\nb { color: red; }',
		},
		{
			code: 'a { color: pink; }\r\nb { color: red; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;}\n\t\tb { color: red;}',
		},
		{
			code: 'a { color: pink;}\r\n\t\tb { color: red;}',
			description: 'CRLF',
		},
		{
			code: '@media print { a { color: pink; }\nb { color: red; }}',
		},
		{
			code: '@media print { a { color: pink; }}\n@media screen { b { color: red; }}',
		},
		{
			code: 'a { color: pink;\ntop: 0; }b { color: red; }',
		},
		{
			code: 'a { color: pink;\ntop: 0;}b { color: red;}',
		},
		{
			code: 'a { color: pink;\r\ntop: 0;}b { color: red;}',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }b { color: red; }',
			fixed: 'a { color: pink; }\nb { color: red; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; } b { color: red; }',
			fixed: 'a { color: pink; }\n b { color: red; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }  b { color: red; }',
			fixed: 'a { color: pink; }\n  b { color: red; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\tb { color: red; }',
			fixed: 'a { color: pink; }\n\tb { color: red; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
		{
			code: '@media print { a { color: pink; } b { color: red; }}',
			fixed: '@media print { a { color: pink; }\n b { color: red; }}',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 34,
		},
		{
			code: '@media print { a { color: pink; }} @media screen { b { color: red; }}',
			fixed: '@media print { a { color: pink; }}\n @media screen { b { color: red; }}',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 35,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; }b { color: red; }',
		},
		{
			code: 'a { color: pink;}b { color: red;}',
		},
		{
			code: '@media print { a { color: pink; }b { color: red; }}',
		},
		{
			code: '@media print { a { color: pink; }}@media screen { b { color: red; }}',
		},
		{
			code: 'a { color: pink;\ntop: 0; }\nb { color: red; }',
		},
		{
			code: 'a { color: pink;\ntop: 0;} b { color: red;}',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }\nb { color: red; }',
			fixed: 'a { color: pink; }b { color: red; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; } b { color: red; }',
			fixed: 'a { color: pink; }b { color: red; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }  b { color: red; }',
			fixed: 'a { color: pink; }b { color: red; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\tb { color: red; }',
			fixed: 'a { color: pink; }b { color: red; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 19,
		},
		{
			code: '@media print { a { color: pink; }\nb { color: red; }}',
			fixed: '@media print { a { color: pink; }b { color: red; }}',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 34,
		},
		{
			code: '@media print { a { color: pink; }}\n @media screen { b { color: red; }}',
			fixed: '@media print { a { color: pink; }}@media screen { b { color: red; }}',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 35,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\ntop: 0; }',
		},
		{
			code: 'a { color: pink;\ntop: 0; }\nb { color: red; }',
		},
		{
			code: 'a { color: pink;\r\ntop: 0; }\r\nb { color: red; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0;}\n\t\tb { color: red;}',
		},
		{
			code: '@media print { a {\ncolor: pink; }\nb { color: red; }}',
		},
		{
			code: '@media print { a {\ncolor: pink; }}\n@media screen { b { color: red; }}',
		},
		{
			code: 'a { color: pink; }\nb { color: red; }',
		},
		{
			code: 'a { color: pink; }b { color: red;}',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\ntop: 0; }b { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; }\nb { color: red; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\r\ntop: 0; }b { color: red; }',
			fixed: 'a { color: pink;\r\ntop: 0; }\r\nb { color: red; }',
			description: 'CRLF',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\ntop: 0; } b { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; }\n b { color: red; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\ntop: 0; }  b { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; }\n  b { color: red; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\ntop: 0; }\tb { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; }\n\tb { color: red; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: '@media print { a {\ncolor: pink; } b { color: red; }}',
			fixed: '@media print { a {\ncolor: pink; }\n b { color: red; }}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 15,
		},
		{
			code: '@media print { a {\ncolor: pink; }} @media screen { b {\ncolor: red; }}',
			fixed: '@media print { a {\ncolor: pink; }}\n @media screen { b {\ncolor: red; }}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\ntop: 0; }',
		},
		{
			code: 'a { color: pink;\ntop: 0; }b { color: red; }',
		},
		{
			code: 'a { color: pink;\ntop: 0;}b { color: red;}',
		},
		{
			code: 'a { color: pink;\r\ntop: 0;}b { color: red;}',
			description: 'CRLF',
		},
		{
			code: '@media print { a {\ncolor: pink; }b { color: red; }}',
		},
		{
			code: '@media print { a {\ncolor: pink; }}@media screen { b { color: red; }}',
		},
		{
			code: '@media print { a {\r\ncolor: pink; }}@media screen { b { color: red; }}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink; }\nb { color: red; }',
		},
		{
			code: 'a { color: pink; }\r\nb { color: red; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;} b { color: red;}',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\ntop: 0; }\nb { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; }b { color: red; }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\r\ntop: 0; }\r\nb { color: red; }',
			fixed: 'a { color: pink;\r\ntop: 0; }b { color: red; }',
			description: 'CRLF',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\ntop: 0; } b { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; }b { color: red; }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\ntop: 0; }  b { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; }b { color: red; }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\ntop: 0; }\tb { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; }b { color: red; }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 10,
		},
		{
			code: '@media print { a {\ncolor: pink; }\nb { color: red; }}',
			fixed: '@media print { a {\ncolor: pink; }b { color: red; }}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 15,
		},
		{
			code: '@media print { a {\ncolor: pink; }}\n@media screen { b {\ncolor: red; }}',
			fixed: '@media print { a {\ncolor: pink; }}@media screen { b {\ncolor: red; }}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 16,
		},
	],
});
