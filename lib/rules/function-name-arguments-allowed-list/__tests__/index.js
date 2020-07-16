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
			code: 'a { background: url(vendor/x.jpg); }',
		},
		{
			code: 'a { background: url(https://image/1.png); }',
		},
		{
			code:
				'a { background: url(data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=); }',
		},
	],

	reject: [
		{
			code: 'a { background: url(data/x.jpg); }',
			message: messages.rejected('background', 'data/x.jpg'),
			line: 1,
			column: 21,
		},
	],
});
