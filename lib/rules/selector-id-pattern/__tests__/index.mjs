import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

const basicAZTests = {
	accept: [
		{
			code: 'a {}',
		},
		{
			code: '.foo {}',
		},
		{
			code: "[foo='bar'] {}",
		},
		{
			code: '#FOO {}',
		},
		{
			code: "a .foo > [foo='bar'], #FOO {}",
		},
		{
			code: 'a /* #foo */ {}',
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
				/* stylelint-disable-next-line selector-id-pattern */
				a #foo, /* stylelint-disable-next-line selector-id-pattern */
				a #bar,
				/* stylelint-disable-next-line selector-id-pattern */
				a #foo
				{}
			`,
		},
	],
};

testRule({
	ruleName,
	config: [/^[A-Z]+$/],

	...basicAZTests,

	reject: [
		{
			code: 'a #foo {}',
			message: messages.expected('#foo', /^[A-Z]+$/),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '#ABABA > #bar {}',
			message: messages.expected('#bar', /^[A-Z]+$/),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: stripIndent`
				/* a comment */
				a #foo, /* a comment */
				a #bar,
				/* a comment */
				a #foo
				{}
			`,
			warnings: [
				{
					line: 2,
					column: 3,
					endLine: 2,
					endColumn: 7,
					message: messages.expected('#foo', /^[A-Z]+$/),
				},
				{
					line: 3,
					column: 3,
					endLine: 3,
					endColumn: 7,
					message: messages.expected('#bar', /^[A-Z]+$/),
				},
				{
					line: 5,
					column: 3,
					endLine: 5,
					endColumn: 7,
					message: messages.expected('#foo', /^[A-Z]+$/),
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['^[A-Z]+$'],

	...basicAZTests,

	reject: [
		{
			code: 'a #foo {}',
			message: messages.expected('#foo', '^[A-Z]+$'),
			line: 1,
			column: 3,
		},
		{
			code: '#ABABA > #bar {}',
			message: messages.expected('#bar', '^[A-Z]+$'),
			line: 1,
			column: 10,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: [/^[A-Z]+$/],

	accept: [
		{
			code: '@for $n from 1 through 5 { #a#{$n} {} }',
			description: 'ignore sass interpolation inside @for',
		},
		{
			code: '.#{$a} {}',
			description: 'ignore sass var interpolation',
		},
		{
			code: '.foo { .#{$a} {} }',
			description: 'ignore sass var nested interpolation',
		},
		{
			code: 'a { #ABABA {} }',
		},
	],

	reject: [
		{
			code: 'a { #bar {} }',
			message: messages.expected('#bar', /^[A-Z]+$/),
			line: 1,
			column: 5,
		},
	],
});
