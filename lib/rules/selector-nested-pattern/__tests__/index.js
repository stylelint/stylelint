'use strict';

const stripIndent = require('common-tags').stripIndent;
const { messages, ruleName } = require('..');

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
			column: 5,
		},
		{
			code: '@media print { a { b {} } }',
			message: messages.expected('b', /^[A-Z]+$/),
			line: 1,
			column: 20,
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
			column: 5,
		},
		{
			code: '@media print { a { b {} } }',
			message: messages.expected('b', '^[A-Z]+$'),
			line: 1,
			column: 20,
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
		},
		{
			code: '.foo { .bar:hover {} }',
			message: messages.expected('.bar:hover', '^&:(?:hover|focus)$'),
			line: 1,
			column: 8,
		},
		{
			code: '.foo { &:hover, &focus {} }',
			message: messages.expected('&:hover, &focus', '^&:(?:hover|focus)$'),
			line: 1,
			column: 8,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: [/^[A-Z]+$/],

	accept: [
		{
			code: 'a { &:#{something} {}}',
			description: 'ignore Sass interpolation',
		},
	],
});
