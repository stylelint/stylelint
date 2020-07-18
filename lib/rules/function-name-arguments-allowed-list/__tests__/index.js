'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [
		{
			'/^background/': ['/^data:/', '/^images/', '/^http/', '/^vendor/'],
		},
	],

	accept: [
		{
			code: 'a { background: url(images/x.jpg); }',
		},
		{
			code: 'a { background-image: url(vendor/x.jpg); }',
		},
		{
			code: 'a { background: url(https://image/1.png); }',
		},
		{
			code:
				'a { background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=); }',
		},
		{
			code: 'a { background-image: #fff url(images/select2.png) no-repeat 100% -22px }',
		},
		{
			code:
				'a {background-image: url(images/select2.png) no-repeat 100% -22px, -moz-linear-gradient(bottom, #fff 85%, #eee 99%);}',
		},
	],

	reject: [
		{
			code: 'a { background-image: url(data/x.jpg); }',
			message: messages.rejected('background-image', 'data/x.jpg'),
			line: 1,
			column: 27,
		},
		{
			code: 'a { background-image: #fff url(magic/select2.png) no-repeat 100% -22px }',
			message: messages.rejected('background-image', 'magic/select2.png'),
			line: 1,
			column: 32,
		},
		{
			code: 'a { background: url(#fff) }',
			message: messages.rejected('background', '#fff'),
			line: 1,
			column: 21,
		},
	],
});
