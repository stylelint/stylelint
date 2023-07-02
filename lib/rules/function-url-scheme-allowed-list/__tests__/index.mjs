import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['https', 'data'],

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
			code: 'a { background: url(:); }',
		},
		{
			code: 'a { background: url(://); }',
		},
		{
			code: 'a { background: url(//); }',
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
			code: 'a { background: url(//www.example.com/file.jpg); }',
		},
		{
			code: 'a { background: url("//www.example.com/file.jpg"); }',
		},
		{
			code: "a { background: url('https://www.example.com/file.jpg'); }",
		},
		{
			code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
		},
		{
			code: "a { background-image: url('https://example.com:3000'); }",
		},
		{
			code: "a { background-image: url('//example.com:3000'); }",
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('/path/to/foo.ttf'); }",
		},
		{
			code: 'a { background: url(HTTPS://example.com/file.jpg); }',
			description: 'ignore case',
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
			code: 'a { background: url(http://#{$host}/path); }',
			description: 'ignore interpolation',
		},
		{
			code: "a { background: url('http://@{host}/path'); }",
			description: 'ignore interpolation',
		},
		{
			code: 'a { background: url(http://$(host)/path); }',
			description: 'ignore interpolation',
		},
		{
			code: 'a { background: url(var(--image)); }',
			description: 'ignore variable',
		},
		{
			code: 'a { background: url(example.com); }',
			description: 'schemeless url',
		},
		{
			code: 'a { background: url(example.com:3000); }',
			description: 'schemeless url and port',
		},
		{
			code: 'a { background: url(https://example.com:3000); }',
			description: 'url with scheme and port',
		},
	],

	reject: [
		{
			code: 'a { background: url(http://www.example.com/file.jpg); }',
			message: messages.rejected('http'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: "a { background: url('http://www.example.com/file.jpg'); }",
			message: messages.rejected('http'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 54,
		},
		{
			code: 'a { background: url("http://www.example.com/file.jpg"); }',
			message: messages.rejected('http'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 54,
		},
		{
			code: "a { background: url('http://example.com:3000'); }",
			message: messages.rejected('http'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('http://www.example.com/file.jpg'); }",
			message: messages.rejected('http'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 76,
		},
		{
			code: "a { background: no-repeat center/80% url('http://www.example.com/file.jpg'); }",
			message: messages.rejected('http'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 75,
		},
	],
});

testRule({
	ruleName,
	config: [],

	accept: [
		{
			code: "a { background: url('/path/to/file.jpg'); }",
		},
		{
			code: 'a { background: url(//www.example.com/file.jpg); }',
		},
		{
			code: 'a { background: url("//www.example.com/file.jpg"); }',
		},
		{
			code: 'a { background: url(example.com:3000); }',
		},
	],

	reject: [
		{
			code: "a { background: url('https://www.example.com/file.jpg'); }",
			message: messages.rejected('https'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
			message: messages.rejected('data'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 99,
		},
	],
});

testRule({
	ruleName,
	config: '',

	accept: [
		{
			code: "a { background: url('/path/to/file.jpg'); }",
		},
		{
			code: 'a { background: url(//www.example.com/file.jpg); }',
		},
		{
			code: 'a { background: url("//www.example.com/file.jpg"); }',
		},
		{
			code: 'a { background: url(example.com:3000); }',
		},
	],

	reject: [
		{
			code: "a { background: url('https://www.example.com/file.jpg'); }",
			message: messages.rejected('https'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
			message: messages.rejected('data'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 99,
		},
	],
});

testRule({
	ruleName,
	config: ['uri', 'file', 'https'],

	accept: [
		{
			code: 'a { background: url(https://example.com/file.jpg); }',
		},
	],

	reject: [
		{
			code: 'a { background: url(http://example.com/file.jpg); }',
			message: messages.rejected('http'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 48,
		},
	],
});

testRule({
	ruleName,

	config: ['/^http/'],

	accept: [
		{
			code: 'a { background: url(http://example.com/file.jpg); }',
		},
		{
			code: 'a { background: url(HTTP://example.com/file.jpg); }',
		},
		{
			code: 'a { background: url(https://example.com/file.jpg); }',
		},
	],

	reject: [
		{
			code: 'a { background: url(ftp://example.com/file.jpg); }',
			message: messages.rejected('ftp'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 47,
		},
		{
			code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
			message: messages.rejected('data'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 99,
		},
	],
});

testRule({
	ruleName,

	config: [/^http/],

	accept: [
		{
			code: 'a { background: url(http://example.com/file.jpg); }',
		},
		{
			code: 'a { background: url(HTTP://example.com/file.jpg); }',
		},
		{
			code: 'a { background: url(https://example.com/file.jpg); }',
		},
	],

	reject: [
		{
			code: 'a { background: url(ftp://example.com/file.jpg); }',
			message: messages.rejected('ftp'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 47,
		},
		{
			code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
			message: messages.rejected('data'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 99,
		},
	],
});
