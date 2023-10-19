import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

const basicAZTests = {
	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a {} b {}',
		},
		{
			code: '@media print { a {} b {} }',
		},
		{
			code: 'a { B {} }',
		},
		{
			code: 'a { DIV { SPAN {} } }',
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
	],
};

testRule({
	ruleName,
	config: [/^[A-Z]+$/],

	...basicAZTests,

	reject: [
		{
			code: 'a { b {} }',
			message: messages.expected('b', /^[A-Z]+$/),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: stripIndent`
				a {
					DIV {
						span {}
					}
				}`,
			message: messages.expected('span', /^[A-Z]+$/),
			line: 3,
			column: 3,
			endLine: 3,
			endColumn: 7,
		},
		{
			code: '@media print { a { b {} } }',
			message: messages.expected('b', /^[A-Z]+$/),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 21,
		},
	],
});

testRule({
	ruleName,
	config: ['^[A-Z]+$'],

	...basicAZTests,

	reject: [
		{
			code: 'a { b {} }',
			message: messages.expected('b', '^[A-Z]+$'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: stripIndent`
				a {
					DIV {
						span {}
					}
				}`,
			message: messages.expected('span', '^[A-Z]+$'),
			line: 3,
			column: 3,
			endLine: 3,
			endColumn: 7,
		},
		{
			code: '@media print { a { b {} } }',
			message: messages.expected('b', '^[A-Z]+$'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 21,
		},
	],
});

testRule({
	ruleName,
	config: ['^&:(?:hover|focus)$'],

	accept: [
		{
			code: '.foo { &:hover {} }',
		},
		{
			code: '.foo { &:focus {} }',
		},
		{
			code: '.foo { &:hover {} &:focus {} }',
		},
	],

	reject: [
		{
			code: '.foo { .bar {} }',
			message: messages.expected('.bar', '^&:(?:hover|focus)$'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '.foo { .bar:hover {} }',
			message: messages.expected('.bar:hover', '^&:(?:hover|focus)$'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '.foo { &:hover, &:focus {} }',
			message: messages.expected('&:hover, &:focus', '^&:(?:hover|focus)$'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 24,
		},
	],
});

testRule({
	ruleName,
	config: ['^&:(?:hover|focus)$', { splitList: true }],

	accept: [
		{
			code: '.foo { &:hover {} }',
		},
		{
			code: '.foo { &:hover, &:focus {} }',
		},
	],

	reject: [
		{
			code: '.foo { .bar:hover {} }',
			message: messages.expected('.bar:hover', '^&:(?:hover|focus)$'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '.foo { .bar:hover, &:focus {} }',
			message: messages.expected('.bar:hover', '^&:(?:hover|focus)$'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 18,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: [/^[A-Z]+$/],

	accept: [
		{
			code: 'a { &:#{something} {}}',
			description: 'ignore Sass interpolation',
		},
	],
});
