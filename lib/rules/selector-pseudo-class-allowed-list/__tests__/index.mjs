import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['hover', 'nth-child', 'root', 'placeholder', 'has'],

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a:hover {}',
		},
		{
			code: 'a:nth-child(5) {}',
		},
		{
			code: ':root {}',
		},
		{
			code: 'a:has(#id) {}',
		},
		{
			code: 'a:hover, a:nth-child(5) {}',
		},
		{
			code: 'a::before {}',
		},
		{
			code: 'a:nth-child(5)::before {}',
		},
		{
			code: 'a:-moz-placeholder {}',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-pseudo-class-allowed-list */
				:focus, /* stylelint-disable-next-line selector-pseudo-class-allowed-list */
				:focus,
				/* stylelint-disable-next-line selector-pseudo-class-allowed-list */
				:focus
				{}
			`,
		},
	],

	reject: [
		{
			code: 'a:HOVER {}',
			message: messages.rejected(':HOVER'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a:-MOZ-PLACEholder {}',
			message: messages.rejected(':-MOZ-PLACEholder'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a:focus {}',
			message: messages.rejected(':focus'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'div:nth-LAST-child {}',
			message: messages.rejected(':nth-LAST-child'),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a,\n:global {}',
			message: messages.rejected(':global'),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 8,
		},
		{
			code: 'input:-ms-input-placeholder {}',
			message: messages.rejected(':-ms-input-placeholder'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'input:-Ms-INPUT-placeholder {}',
			message: messages.rejected(':-Ms-INPUT-placeholder'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a:not(::selection) {}',
			message: messages.rejected(':not'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: stripIndent`
				/* a comment */
				:focus, /* a comment */
				:focus,
				/* a comment */
				:focus
				{}
			`,
			warnings: [
				{
					message: messages.rejected(':focus'),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 7,
				},
				{
					message: messages.rejected(':focus'),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 7,
				},
				{
					message: messages.rejected(':focus'),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 7,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: '/^nth/',

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a:nth-child(5) {}',
		},
		{
			code: 'a:nth-LAST-child {}',
		},
	],

	reject: [
		{
			code: 'a:hover {}',
			message: messages.rejected(':hover'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 8,
		},
	],
});

testRule({
	ruleName,
	config: ['-moz-first-node'],

	accept: [
		{
			code: 'a:-moz-first-node {}',
		},
	],

	reject: [
		{
			code: 'a:first-node {}',
			message: messages.rejected(':first-node'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 13,
		},
	],
});

testRule({
	ruleName,
	config: /^nth/,

	accept: [
		{
			code: 'a {}',
		},
		{
			code: '@page foo {}',
		},
		{
			code: '@page :nth(1) {}',
		},
	],

	reject: [
		{
			code: 'a:hover {}',
			message: messages.rejected(':hover'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: '@page :first {}',
			message: messages.rejected(':first'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '@page:blank:first {}',
			warnings: [
				{ message: messages.rejected(':blank'), line: 1, column: 6, endLine: 1, endColumn: 12 },
				{ message: messages.rejected(':first'), line: 1, column: 12, endLine: 1, endColumn: 18 },
			],
			skip: true,
		},
		{
			code: stripIndent`
				@page
				:first {}
			`,
			message: messages.rejected(':first'),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 7,
		},
	],
});

testRule({
	ruleName,
	config: ['hover'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: ':#{$variable} {}',
		},
		{
			code: ':#{$VARIABLE} {}',
		},
		{
			code: 'a:#{$variable} {}',
		},
	],
});
