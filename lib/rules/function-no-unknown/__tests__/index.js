'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: true,
	skipBasicChecks: true,

	accept: [
		{
			code: 'a { transform: translate(1px); }',
		},
		{
			code: 'a { transform: TRANSLATE(1px); }',
		},
		{
			code: 'a { transform: --custom-function(1px); }',
		},
		{
			code: 'a { transform: scale(0.5) translate(-100%, -100%); }',
		},
	],

	reject: [
		{
			code: 'a { transform: unknown(4); }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: UNKNOWN(4); }',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { width: calc(10% * unknown(1)); }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 23,
		},
	],
});

testRule({
	ruleName,
	config: true,
	customSyntax: 'postcss-scss',
	skipBasicChecks: true,

	accept: [
		{
			code: 'a { $list: (list) }',
		},
		{
			code: 'a { --primary-color: #{theme(1px)}; }',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreFunctions: ['theme', '/^foo-/', /^bar$/i] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'a { transform: translate(1px); }',
		},
		{
			code: 'a { transform: theme(1px); }',
		},
		{
			code: 'a { transform: foo-func(1px); }',
		},
		{
			code: 'a { transform: bar(1px); }',
		},
		{
			code: 'a { transform: BAR(1px); }',
		},
	],

	reject: [
		{
			code: 'a { transform: unknown(1px); }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: theme-custom(1px); }',
			message: messages.rejected('theme-custom'),
			line: 1,
			column: 16,
		},
	],
});
