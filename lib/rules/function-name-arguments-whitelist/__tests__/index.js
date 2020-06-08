'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [{ background: ['/^http/', '/^images/'] }],

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
		{
			code: 'a { background: url(images/logo.png); }',
		},
		{
			code: 'a { background: url(/images/logo.png); }',
		},
		{
			code: 'a { background: url("images/logo.png"); }',
		},
		{
			code: 'a { background: url("/images/logo.png"); }',
		},
	],

	reject: [
		{
			code: 'a { background: url(ftp://example.com/file.jpg); }',
			message: messages.rejected('ftp'),
			line: 1,
			column: 21,
		},
		{
			code:
				"a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
			message: messages.rejected('data'),
			line: 1,
			column: 27,
		},
	],
});
