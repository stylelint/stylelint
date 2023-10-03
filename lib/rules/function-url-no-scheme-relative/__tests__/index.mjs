import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.js';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { background: url(); }',
		},
		{
			code: "a { background: url(''); }",
		},
		{
			code: 'a { background: url(""); }',
		},
		{
			code: 'a { background: url(/); }',
		},
		{
			code: 'a { background: url(./); }',
		},
		{
			code: 'a { background: url(./file.jpg); }',
		},
		{
			code: 'a { background: url(../file.jpg); }',
		},
		{
			code: 'a { background: URL(../file.jpg); }',
		},
		{
			code: "a { background: url('../file.jpg'); }",
		},
		{
			code: 'a { background: url("../file.jpg"); }',
		},
		{
			code: "a { background: url('/path/to/file.jpg'); }",
		},
		{
			code: "a { background: url('https://www.google.com/file.jpg'); }",
		},
		{
			code: "a { background: url('http://www.google.com/file.jpg'); }",
		},
		{
			code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('/path/to/foo.ttf'); }",
		},
		{
			code: 'a { background: some-url(); }',
			description: 'ignore contain url function',
		},
		{
			code: 'a { background: url($image); }',
			description: 'ignore variable',
		},
		{
			code: 'a { background: url(@image); }',
			description: 'ignore variable',
		},
		{
			code: 'a { background: url(var(--image)); }',
			description: 'ignore variable',
		},
	],

	reject: [
		{
			code: 'a { background: url(//); }',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { background: url(//www.google.com/file.jpg); }',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: "a { background: url('//www.google.com/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 48,
		},
		{
			code: 'a { background: url("//www.google.com/file.jpg"); }',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 48,
		},
		{
			code: 'a { background: url( "//www.google.com/file.jpg" ); }',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('//www.google.com/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 70,
		},
		{
			code: "a { background: no-repeat center/80% url('//www.google.com/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 69,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-html',

	reject: [
		{
			code: '<template><a style="background: url(//www.google.com/file.jpg);"></a><template>',
			message: messages.rejected,
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 62,
		},
		{
			code: '<html><head><style>a { background: url(//www.google.com/file.jpg); }</style></head></html>',
			message: messages.rejected,
			line: 1,
			column: 40,
			endLine: 1,
			endColumn: 65,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: naiveCssInJs,

	accept: [
		{
			code: 'css` background: url(${variable}); `;',
			description: 'ignore variable',
		},
	],
	reject: [
		{
			code: 'css` background: url(//www.google.com/file.jpg); `;',
			message: messages.rejected,
		},
	],
});
