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
			message: messages.expected,
		},
		{
			code: '/**/',
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '/* some comment */',
		},
		{
			code: '/**/',
		},
		{
			code: '.without-comment {}',
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
			description: 'ignored inline scss comments',
		},
		{
			code: '// foo-ok',
			description: 'ignored inline scss comments',
		},
		{
			code: '.without-comment { }',
			description: 'ignores scss without comments',
		},
	],

	reject: [
		{
			code: 'a {} // not-foo',
			description: 'checks inline scss comments',
			message: messages.expected,
		},
	],
});
