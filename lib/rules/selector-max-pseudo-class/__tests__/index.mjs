import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [0],

	accept: [
		{
			code: '',
			description: 'empty stylesheet',
		},
		{
			code: 'a {}',
			description: 'empty rule',
		},
		{
			code: '@import "foo.css";',
			description: 'blockless statement',
		},
		{
			code: 'a {}',
			description: 'selector with no pseudo-class',
		},
		{
			code: '.foo { .bar { .baz {} } }',
			description: 'nested selectors with no pseudo-classes',
		},
		{
			code: 'a:before {}',
			description: 'single level 2 pseudo-element',
		},
		{
			code: 'a::before {}',
			description: 'single level 3 pseudo-element',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-max-pseudo-class */
				a:first-child, /* stylelint-disable-next-line selector-max-pseudo-class */
				a:first-child,
				/* stylelint-disable-next-line selector-max-pseudo-class */
				a:first-child
				{}
			`,
		},
	],

	reject: [
		{
			code: ':global {}',
			message: messages.expected(':global', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a:first-child {}',
			message: messages.expected('a:first-child', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'a,\na:first-child {}',
			message: messages.expected('a:first-child', 0),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 14,
		},
	],
});

testRule({
	ruleName,
	config: [0],
	customSyntax: 'postcss-scss',

	accept: [],

	reject: [
		{
			code: 'a { &:hover {}}',
			message: messages.expected('&:hover', 0),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: ':global { @include test {} }',
			message: messages.expected(':global', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a:first-child { @include test {} }',
			message: messages.expected('a:first-child', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'a,\na:first-child { @include test {} }',
			message: messages.expected('a:first-child', 0),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 14,
		},
		{
			code: '@include test { a { &:hover {}} }',
			message: messages.expected('&:hover', 0),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: stripIndent`
				/* a comment */
				a:first-child, /* a comment */
				a:first-child,
				/* a comment */
				a:first-child
				{}
			`,
			warnings: [
				{
					message: messages.expected('a:first-child', 0),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 14,
				},
				{
					message: messages.expected('a:first-child', 0),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 14,
				},
				{
					message: messages.expected('a:first-child', 0),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 14,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [1],

	accept: [
		{
			code: 'a:first-child {}',
			description: 'selector with one pseudo-class',
		},
		{
			code: '.foo .bar:first-child {}',
			description: 'compound selectors with one pseudo-class',
		},
		{
			code: '.foo > .bar:first-child {}',
			description: 'parent selector with one pseudo-class',
		},
		{
			code: 'a::before:hover {}',
			description: 'selector a pseudo element and a pseudo-class',
		},
		{
			code: '.foo:hover, \n.bar:hover {}',
			description: 'multiple selectors: fewer than max pseudo-classes',
		},
		{
			code: 'a:not(:first-child) {}',
			description: 'two selectors with one pseudo-class each',
		},
	],

	reject: [
		{
			code: 'a:first:focus {}',
			message: messages.expected('a:first:focus', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'a::before:first:focus {}',
			message: messages.expected('a::before:first:focus', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '.foo .bar:first-child:hover {}',
			message: messages.expected('.foo .bar:first-child:hover', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: '.foo > bar:nth-child(2):focus {}',
			message: messages.expected('.foo > bar:nth-child(2):focus', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'input[type=file]:first-of-type:focus {}',
			message: messages.expected('input[type=file]:first-of-type:focus', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: 'a:not(:first-child:lang(en)) {}',
			message: messages.expected('a:not(:first-child:lang(en))', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 29,
		},
	],
});

testRule({
	ruleName,
	config: [1],
	customSyntax: 'postcss-scss',

	accept: [],

	reject: [
		{
			code: '.foo:last-child { .bar:first-child { .baz:visited {} } }',
			warnings: [
				{
					message: messages.expected('.bar:first-child', 1),
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 35,
				},
				{
					message: messages.expected('.baz:visited', 1),
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 50,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: 'a:first:hover {}',
			description: 'selector with two pseudo-classes',
		},
	],

	reject: [
		{
			code: 'input:first-of-type:read-only:hover {}',
			message: messages.expected('input:first-of-type:read-only:hover', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 36,
		},
	],
});
