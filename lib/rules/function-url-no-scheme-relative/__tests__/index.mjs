import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.cjs';

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
			code: "a { background: url('https://www.example.org/file.jpg'); }",
		},
		{
			code: "a { background: url('http://www.example.org/file.jpg'); }",
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
		{
			code: "@import url('../foo.css');",
		},
		{
			code: '@import url("../foo.css");',
		},
		{
			code: "@import url('/path/to/foo.css');",
		},
		{
			code: "@import url('https://www.example.org/foo.css');",
		},
		{
			code: "@import url('http://www.example.org/foo.css');",
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
			code: 'a { background: url(//www.example.org/file.jpg); }',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 47,
		},
		{
			code: "a { background: url('//www.example.org/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 49,
		},
		{
			code: 'a { background: url("//www.example.org/file.jpg"); }',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 49,
		},
		{
			code: 'a { background: url( "//www.example.org/file.jpg" ); }',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 51,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('//www.example.org/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 71,
		},
		{
			code: "a { background: no-repeat center/80% url('//www.example.org/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 70,
		},
		{
			code: "@import url('//www.example.org/foo.css')",
			message: messages.rejected,
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: `@import url("//www.example.org/foo.css") screen and (min-width: 768px);`,
			message: messages.rejected,
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 40,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-html',

	reject: [
		{
			code: '<template><a style="background: url(//www.example.org/file.jpg);"></a><template>',
			message: messages.rejected,
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 63,
		},
		{
			code: '<html><head><style>a { background: url(//www.example.org/file.jpg); }</style></head></html>',
			message: messages.rejected,
			line: 1,
			column: 40,
			endLine: 1,
			endColumn: 66,
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
			code: 'css` background: url(//www.example.org/file.jpg); `;',
			message: messages.rejected,
		},
	],
});
