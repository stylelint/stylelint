import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['before', 'selection', /^my/i],

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a:hover {}',
		},
		{
			code: 'a::before {}',
		},
		{
			code: '::selection {}',
		},
		{
			code: '::-webkit-selection {}',
		},
		{
			code: 'a:not(::selection) {}',
		},
		{
			code: 'a::my-pseudo-element {}',
		},
		{
			code: 'a::MY-other-pseudo-element {}',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-pseudo-element-allowed-list */
				a::after, /* stylelint-disable-next-line selector-pseudo-element-allowed-list */
				a::after,
				/* stylelint-disable-next-line selector-pseudo-element-allowed-list */
				a::after
				{}
			`,
		},
	],

	reject: [
		{
			code: 'a::BEFORE {}',
			message: messages.rejected('::BEFORE'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a::after {}',
			message: messages.rejected('::after'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a::AFTER {}',
			message: messages.rejected('::AFTER'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a,\nb::after {}',
			message: messages.rejected('::after'),
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 9,
		},
		{
			code: 'a::not-my-pseudo-element {}',
			message: messages.rejected('::not-my-pseudo-element'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: stripIndent`
				/* a comment */
				a::after, /* a comment */
				a::after,
				/* a comment */
				a::after
				{}
			`,
			warnings: [
				{
					message: messages.rejected('::after'),
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 9,
				},
				{
					message: messages.rejected('::after'),
					line: 3,
					column: 2,
					endLine: 3,
					endColumn: 9,
				},
				{
					message: messages.rejected('::after'),
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 9,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: /^before/,

	accept: [
		{
			code: '::before {}',
		},
		{
			code: '::before-custom {}',
		},
	],
	reject: [
		{
			code: 'a::after {}',
			message: messages.rejected('::after'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::not-before {}',
			message: messages.rejected('::not-before'),
			line: 1,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['-moz-focus-inner'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '::-moz-focus-inner {}',
		},
	],
	reject: [
		{
			code: 'a::focus-inner {}',
			message: messages.rejected('::focus-inner'),
			line: 1,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['before'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '::#{$variable} {}',
		},
		{
			code: '::#{$VARIABLE} {}',
		},
		{
			code: 'a::#{$variable} {}',
		},
	],
	reject: [
		{
			code: 'a::after {}',
			message: messages.rejected('::after'),
			line: 1,
			column: 2,
		},
	],
});
