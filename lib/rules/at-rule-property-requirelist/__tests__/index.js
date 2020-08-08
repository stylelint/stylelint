'use strict';

const { messages, ruleName } = require('..');

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
