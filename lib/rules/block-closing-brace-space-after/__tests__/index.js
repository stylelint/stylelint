'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; } b { color: red; }',
		},
		{
			code: 'a { color: pink;} b { color: red;}',
		},
		{
			code: '@media print { a { color: pink; } b { color: red; } }',
		},
		{
			code: '@media print { a { color: pink; } } @media screen { b { color: red; } }',
		},
		{
			code: "@import 'foo.css';\n@import 'bar.css';",
			description: 'two blockless statements',
		},
		{
			code: '@media print { a { color: pink; } b { color: red; }}',
		},
		{
			code: '@media print { a { color: pink; }} @media screen { b { color: red; }}',
		},
		{
			code: '.a {} /* stylelint-disable-line block-no-empty */',
		},
		{
			code: ':root { --x { color: pink; }; --y { color: red; }; }',
			description: 'Allow a trailing semicolon after the closing brace of a block',
		},
		{
			code: '.foo { --my-theme: { color: red; }; --toolbar-theme: { color: green; }; }',
			description: 'Make sure trailing semicolon works well for blocks outside :root',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }b { color: red; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }  b { color: red; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\nb { color: red; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\r\nb { color: red; }',
			description: 'CRLF',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\tb { color: red; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: '@media print { a { color: pink; }b { color: red; }}',
			message: messages.expectedAfter(),
			line: 1,
			column: 34,
		},
		{
			code: '@media print { a { color: pink; }}@media screen { b { color: red; }}',
			message: messages.expectedAfter(),
			line: 1,
			column: 35,
		},
		{
			code: ':root { --x { color: pink; };--y { color: red; }; }',
			message: messages.expectedAfter(),
			line: 1,
			column: 30,
		},
		{
			code: '.foo { --my-theme: { color: red; };--toolbar-theme: { color: green; }; }',
			description: 'Make sure trailing semicolon works well for blocks outside :root',
			message: messages.expectedAfter(),
			line: 1,
			column: 36,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],

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
			code: '@media print { a { color: pink; }b { color: red; } }',
		},
		{
			code: '@media print { a { color: pink; } }@media screen { b { color: red; } }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; } b { color: red; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }  b { color: red; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\nb { color: red; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\r\nb { color: red; }',
			description: 'CRLF',
			message: messages.rejectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\tb { color: red; }',
			message: messages.rejectedAfter(),
			line: 1,
			column: 19,
		},
		{
			code: '@media print { a { color: pink; } b { color: red; }}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 34,
		},
		{
			code: '@media print { a { color: pink; }} @media screen { b { color: red; }}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 35,
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],

	accept: [
		{
			code: 'a { color: pink; background: orange; }',
		},
		{
			code: 'a { color: pink; background: orange; } b { color: red; }',
		},
		{
			code: 'a { color: pink; background: orange;} b { color: red;}',
		},
		{
			code: 'a { color:\npink;}',
		},
		{
			code: 'a { color:\r\npink;}',
			description: 'CRLF',
		},
		{
			code: 'a { color:\npink;}b { color: red; }',
		},
		{
			code: 'a { color:\npink;}b { color:\nred;}',
		},
		{
			code: '@media print { a {\ncolor: pink; } b { color: red;}}',
		},
		{
			code: '@media print { a {\ncolor: pink; }} @media screen { b { color: red;}}',
		},
		{
			code: '@media print { a {\r\ncolor: pink; }} @media screen { b { color: red;}}',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'a { color: pink; background: orange;}b { color: red; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 38,
		},
		{
			code: 'a { color: pink; background: orange;}  b { color: red; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 38,
		},
		{
			code: 'a { color: pink; background: orange;}\tb { color: red; }',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 38,
		},
		{
			code: '@media print { a { color: pink; }b { color: red; }}',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 34,
		},
		{
			code: '@media print { a { color: pink; }}@media screen { b { color: red; }}',
			message: messages.expectedAfterSingleLine(),
			line: 1,
			column: 35,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],

	accept: [
		{
			code: 'a { color: pink; background: orange; }',
		},
		{
			code: 'a { color: pink; background: orange; }b { color: red; }',
		},
		{
			code: 'a { color: pink; background: orange;}b { color: red;}',
		},
		{
			code: 'a { color:\npink;}',
		},
		{
			code: 'a { color:\r\npink;}',
			description: 'CRLF',
		},
		{
			code: 'a { color:\npink;} b { color: red; }',
		},
		{
			code: 'a { color:\npink;} b { color:\nred;}',
		},
		{
			code: '@media print { a {\ncolor: pink;} b { color: red;} }',
		},
		{
			code: '@media print { a {\r\ncolor: pink;} b { color: red;} }',
			description: 'CRLF',
		},
		{
			code: '@media print { a {\ncolor: pink;} } @media screen { b { color: red;} }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; background: orange;} b { color: red; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 38,
		},
		{
			code: 'a { color: pink; background: orange;}  b { color: red; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 38,
		},
		{
			code: 'a { color: pink; background: orange;}\tb { color: red; }',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 38,
		},
		{
			code: '@media print { a { color: pink; } b { color: red; }}',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 34,
		},
		{
			code: '@media print { a { color: pink; }} @media screen { b { color: red; }}',
			message: messages.rejectedAfterSingleLine(),
			line: 1,
			column: 35,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],

	accept: [
		{
			code: 'a { color: pink;\nbackground: orange; }',
		},
		{
			code: 'a { color: pink;\r\nbackground: orange; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\nbackground: orange; } b { color: red; }',
		},
		{
			code: 'a { color: pink;\nbackground: orange;} b { color: red;}',
		},
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
			code: '@media print { a {\ncolor: pink; } b { color: red; }}',
		},
		{
			code: '@media print { a {\r\ncolor: pink; } b { color: red; }}',
			description: 'CRLF',
		},
		{
			code: '@media print { a {\ncolor: pink; }} @media screen { b { color: red; }}',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\nbackground: orange;}b { color: red; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: 'a { color: pink;\nbackground: orange;}  b { color: red; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: 'a { color: pink;\nbackground: orange;}\nb { color: red; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: 'a { color: pink;\r\nbackground: orange;}\r\nb { color: red; }',
			description: 'CRLF',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: 'a { color: pink;\nbackground: orange;}\tb { color: red; }',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: '@media print { a {\ncolor: pink; }b { color: red; }}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 15,
		},
		{
			code: '@media print { a {\ncolor: pink; }}@media screen { b {\ncolor: red; }}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],

	accept: [
		{
			code: 'a { color: pink;\nbackground: orange; }',
		},
		{
			code: 'a { color: pink;\r\nbackground: orange; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\nbackground: orange; }b { color: red; }',
		},
		{
			code: 'a { color: pink;\nbackground: orange;}b { color: red;}',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; } b { color: red; }',
		},
		{
			code: 'a { color: pink;} b { color: red;}',
		},
		{
			code: '@media print { a {\ncolor: pink; }b { color: red; } }',
		},
		{
			code: '@media print { a {\r\ncolor: pink; }b { color: red; } }',
			description: 'CRLF',
		},
		{
			code: '@media print { a {\ncolor: pink; }}@media screen { b { color: red; } }',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\nbackground: orange;} b { color: red; }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: 'a { color: pink;\nbackground: orange;}  b { color: red; }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: 'a { color: pink;\nbackground: orange;}\nb { color: red; }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: 'a { color: pink;\nbackground: orange;}\tb { color: red; }',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 21,
		},
		{
			code: '@media print { a {\ncolor: pink; } b { color: red; }}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 15,
		},
		{
			code: '@media print { a {\ncolor: pink; }} @media screen { b {\ncolor: red; }}',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 16,
		},
		{
			code: '@media print { a {\r\ncolor: pink; }} @media screen { b {\r\ncolor: red; }}',
			description: 'CRLF',
			message: messages.rejectedAfterMultiLine(),
			line: 2,
			column: 16,
		},
	],
});
