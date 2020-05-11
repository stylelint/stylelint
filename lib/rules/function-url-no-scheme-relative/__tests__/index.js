'use strict';

const { messages, ruleName } = require('..');

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
			code:
				"a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
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
		},
		{
			code: 'a { background: url(//www.google.com/file.jpg); }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
		{
			code: "a { background: url('//www.google.com/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 21,
		},
		{
			code: 'a { background: url("//www.google.com/file.jpg"); }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
		{
			code: 'a { background: url( "//www.google.com/file.jpg" ); }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('//www.google.com/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 43,
		},
		{
			code: "a { background: no-repeat center/80% url('//www.google.com/file.jpg'); }",
			message: messages.rejected,
			line: 1,
			column: 42,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'html',

	reject: [
		{
			code: '<template><a style="background: url(//www.google.com/file.jpg);"></a><template>',
			message: messages.rejected,
			line: 1,
			column: 37,
		},
		{
			code:
				'<html><head><style>a { background: url(//www.google.com/file.jpg); }</style></head></html>',
			message: messages.rejected,
			line: 1,
			column: 40,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'css-in-js',

	accept: [
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` background: url(${variable}) `;",
			description: 'ignore variable',
		},
		{
			code:
				"import styled from 'react-emotion';\nexport default styled.div` background: url(${variable}) `;",
			description: 'ignore variable',
		},
	],
	reject: [
		{
			code:
				'import styled from "styled-components";\nexport default styled.div` background: url(//www.google.com/file.jpg); `;',
			message: messages.rejected,
			line: 2,
			column: 44,
		},
		{
			code:
				'import styled from "react-emotion";\nexport default styled.div` background: url(//www.google.com/file.jpg); `;',
			message: messages.rejected,
			line: 2,
			column: 44,
		},
	],
});
