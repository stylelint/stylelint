'use strict';

const standalone = require('../../../standalone');
const { messages, ruleName } = require('..');

it('warns that the rule is deprecated', () => {
	const config = {
		rules: {
			[ruleName]: { page: ['margin'] },
		},
	};

	const code = '';

	return standalone({ code, config }).then((output) => {
		const result = output.results[0];

		expect(result.deprecations).toHaveLength(1);
		expect(result.deprecations[0].text).toEqual(
			`'${ruleName}' has been deprecated. Instead use 'at-rule-property-required-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
		);
	});
});

testRule({
	ruleName,
	config: {
		'font-face': ['font-display', 'font-family'],
		page: ['margin'],
	},

	accept: [
		{
			code: "@font-face { font-display: auto; font-family: 'Arvo'; }",
			description: '@font-face with both required properties',
		},
		{
			code: "@font-face { font-display: auto; font-family: 'Arvo'; src: url('abc'); /* IE9 */ }",
			description: '@font-face with inner comment',
		},
		{
			code: "@FONT-FACE { FONT-DISPLAY: AUTO; FONT-FAMILY: 'ARVO'; }",
			description: '@font-face with both required properties (case-sensitive)',
		},
		{
			code: '@page { padding: 0.5cm; margin: 1cm; }',
			description: '@page with required property',
		},
		{
			code: '@counter-style counter { system: cyclic; }',
			description: 'at-rule not specified in config',
		},
		{
			code: '@mixin invalid-at-rule { @content; }',
			description: '@mixin with invalid at-rule',
		},
	],

	reject: [
		{
			code: '@font-face { font-display: auto; }',
			description: '@font-face with missing property',
			message: messages.expected('font-family', 'font-face'),
		},
		{
			code: '@FONT-FACE { FONT-DISPLAY: AUTO; }',
			description: '@font-face with missing property (case-sensitive)',
			message: messages.expected('font-family', 'font-face'),
		},
		{
			code: "@font-face { font-family: 'Arvo'; font-weight: normal }",
			description: '@font-face with missing property',
			message: messages.expected('font-display', 'font-face'),
		},
		{
			code: '@page { padding: 0.5cm }',
			description: '@page with missing property',
			message: messages.expected('margin', 'page'),
		},
	],
});
