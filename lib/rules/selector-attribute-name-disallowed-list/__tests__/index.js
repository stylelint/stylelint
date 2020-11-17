'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: ['class', 'id', '/^data-/'],

	accept: [
		{
			code: 'a[title] { }',
		},
		{
			code: 'a[target="_blank"] { }',
		},
		{
			code: 'a[href$=".pdf"] { }',
		},
		{
			code: 'div[lang~="en-us"] { }',
		},
	],

	reject: [
		{
			code: '[class*="foo"] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 2,
		},
		{
			code: '[ class*="foo" ] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 3,
		},
		{
			code: '[class *= "foo"] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 2,
		},
		{
			code: '[id~="bar"] { }',
			message: messages.rejected('id'),
			line: 1,
			column: 2,
		},
		{
			code: '[data-foo*="bar"] { }',
			message: messages.rejected('data-foo'),
			line: 1,
			column: 2,
		},
		{
			code: '[ data-foo *= "bar" ] { }',
			message: messages.rejected('data-foo'),
			line: 1,
			column: 3,
		},
	],
});
