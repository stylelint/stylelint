'use strict';

const mergeTestDescriptions = require('../../../testUtils/mergeTestDescriptions');

const { messages, ruleName } = require('..');

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
	],

	reject: [
		{
			code: 'a #foo {}',
			message: messages.expected('foo'),
			line: 1,
			column: 3,
		},
		{
			code: '#ABABA > #bar {}',
			message: messages.expected('bar'),
			line: 1,
			column: 10,
		},
	],
};

testRule(
	mergeTestDescriptions(basicAZTests, {
		ruleName,
		config: [/^[A-Z]+$/],
	}),
);

testRule(
	mergeTestDescriptions(basicAZTests, {
		ruleName,
		config: ['^[A-Z]+$'],
	}),
);

testRule({
	ruleName,
	syntax: 'scss',
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
			message: messages.expected('bar'),
			line: 1,
			column: 5,
		},
	],
});
