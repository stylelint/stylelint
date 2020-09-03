'use strict';

const standalone = require('../../../standalone');
const { messages, ruleName } = require('..');

it('warns that the rule is deprecated', () => {
	const config = {
		rules: {
			[ruleName]: ['before'],
		},
	};

	const code = '';

	return standalone({ code, config }).then((output) => {
		const result = output.results[0];

		expect(result.deprecations).toHaveLength(1);
		expect(result.deprecations[0].text).toEqual(
			`'${ruleName}' has been deprecated. Instead use 'selector-pseudo-element-allowed-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
		);
	});
});

testRule({
	ruleName,
	config: ['before', 'selection', /^my/i],
	skipBasicChecks: true,

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
	],

	reject: [
		{
			code: 'a::BEFORE {}',
			message: messages.rejected('BEFORE'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::after {}',
			message: messages.rejected('after'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::AFTER {}',
			message: messages.rejected('AFTER'),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\nb::after {}',
			message: messages.rejected('after'),
			line: 2,
			column: 2,
		},
		{
			code: 'a::not-my-pseudo-element {}',
			message: messages.rejected('not-my-pseudo-element'),
			line: 1,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: /^before/,
	skipBasicChecks: true,

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
			message: messages.rejected('after'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::not-before {}',
			message: messages.rejected('not-before'),
			line: 1,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['before'],
	skipBasicChecks: true,
	syntax: 'scss',

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
			message: messages.rejected('after'),
			line: 1,
			column: 2,
		},
	],
});
