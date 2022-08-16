'use strict';

const { messages, ruleName } = require('../index.js');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@media (color-gamut: p3) {\n' + 'a {\n' + 'color: lch(48% 82 283);\n' + '}\n' + '}',
			description: 'lch out of srgb gamut but wrapped in media query',
		},
		{
			code:
				'@media (color-gamut: p3) {\n' +
				'a {\n' +
				'color: oklch(48% 82 283 / 73%);\n' +
				'}\n' +
				'}',
			description: 'oklch with alpha out of srgb gamut but wrapped in media query',
		},
		{
			code: 'a { color: lch(50% 0 0); }',
			description: 'in srgb gamut',
		},
		{
			code: 'a { color: red; }',
			description: 'ignore not lch color declaration',
		},
		{
			code: ':root { --clr: lch(48% 82 283 / 75%); }\n' + 'a { color: var(--clr); }',
			description: 'ignore css variables',
		},
	],

	reject: [
		{
			code: 'a { color: lch(48% 82 283); }',
			description: 'lch',
			message: messages.rejected('lch(48% 82 283)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { color: lch(48% 82 283 / 72%); }',
			description: 'lch with alpha',
			message: messages.rejected('lch(48% 82 283 / 72%)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { color: oklch(98% 49 129); }',
			description: 'oklch',
			message: messages.rejected('oklch(98% 49 129)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { color: lab(98% 49 129); }',
			description: 'lab',
			message: messages.rejected('lab(98% 49 129)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { color: oklab(98% 49 129); }',
			description: 'oklab',
			message: messages.rejected('oklab(98% 49 129)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 29,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-less',
	accept: [
		{
			code: '@myVariable: lch(48% 82 283);\n' + 'a { color: @myVariable; }',
			description: 'ignore Less variable',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',
	accept: [
		{
			code: ':root { $clr: lch(48% 82 283 / 67%) }\n' + 'a { color: $clr; }\n',
			description: 'ignore scss variables',
		},
	],
});
