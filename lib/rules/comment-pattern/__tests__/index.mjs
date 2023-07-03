import { stripIndent } from 'common-tags';

import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [/foo-.+/],

	accept: [
		{
			code: '/* foo-valid yay */',
		},
		{
			code: stripIndent`
				/* foo--
				multi-line
				\n
				\r
				\r\n
				\n\r
				\t
				*/
			`,
		},
	],

	reject: [
		{
			code: '/* not foo- */',
			message: messages.expected(/foo-.+/),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '/**/',
			message: messages.expected(/foo-.+/),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
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
			code: stripIndent`
				/* foo--
				multi-line
				\n
				\r
				\r\n
				\n\r
				\t
				*/
			`,
		},
	],

	reject: [
		{
			code: '/* not foo- */',
			message: messages.expected('foo-.+'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '/**/',
			message: messages.expected('foo-.+'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
	],
});

testRule({
	ruleName,
	config: [/foo-.+/],
	customSyntax: 'postcss-scss',

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
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 16,
		},
	],
});
