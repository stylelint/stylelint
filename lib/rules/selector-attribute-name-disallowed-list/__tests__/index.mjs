import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: ['class', 'disabled', 'id', '/^data-/'],

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
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-attribute-name-disallowed-list */
				div[class*="foo"], /* stylelint-disable-next-line selector-attribute-name-disallowed-list */
				div[id*="foo"],
				/* stylelint-disable-next-line selector-attribute-name-disallowed-list */
				div[data-foo*="foo"]
				{ color: red; }
			`,
		},
	],

	reject: [
		{
			code: '[class*="foo"] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '[ class*="foo" ] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: '[class *= "foo"] { }',
			message: messages.rejected('class'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '[disabled] { }',
			message: messages.rejected('disabled'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '[id~="bar"] { }',
			message: messages.rejected('id'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: '[data-foo*="bar"] { }',
			message: messages.rejected('data-foo'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '[ data-foo *= "bar" ] { }',
			message: messages.rejected('data-foo'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: stripIndent`
				/* a comment */
				div[class*="foo"], /* a comment */
				div[id*="foo"],
				/* a comment */
				div[data-foo*="foo"]
				{ color: red; }
			`,
			warnings: [
				{
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 10,
					message: messages.rejected('class'),
				},
				{
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 7,
					message: messages.rejected('id'),
				},
				{
					line: 5,
					column: 5,
					endLine: 5,
					endColumn: 13,
					message: messages.rejected('data-foo'),
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: /^data-/,

	accept: [
		{
			code: 'a[title] { }',
		},
	],

	reject: [
		{
			code: 'a[data-foo="bar"] { }',
			message: messages.rejected('data-foo'),
		},
	],
});
