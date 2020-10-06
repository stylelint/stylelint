'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [/foo-.+/],

	accept: [
		{
			code: '/* foo-valid yay */',
		},
		{
			code: `/* foo--
			multi-line
			\n
			\r
			\r\n
			\n\r
			\t
				*/`,
		},
		{
			code: '.without-comment {}',
		},
	],

	reject: [
		{
			code: '/* not foo- */',
			message: messages.expected(/foo-.+/),
		},
		{
			code: '/**/',
			message: messages.expected(/foo-.+/),
		},
	],
});

testRule({
	ruleName,
	config: ['foo-.+'],

	accept: [
		{
			code: '/* foo-valid yay */',
		},
		{
			code: `/* foo--
			multi-line
			\n
			\r
			\r\n
			\n\r
			\t
				*/`,
		},
		{
			code: '.without-comment {}',
		},
	],

	reject: [
		{
			code: '/* not foo- */',
			message: messages.expected('foo-.+'),
		},
		{
			code: '/**/',
			message: messages.expected('foo-.+'),
		},
	],
});

testRule({
	ruleName,
	config: [/foo-.+/],
	syntax: 'scss',

	accept: [
		{
			code: 'a {} // foo-ok',
		},
		{
			code: '// foo-ok',
		},
	],

	reject: [
		{
			code: 'a {} // not-foo',
			description: 'checks inline scss comments',
			message: messages.expected(/foo-.+/),
		},
	],
});
