import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['0,1,0'],

	accept: [
		{
			code: '.ab {}',
		},
		{
			code: 'span a {}',
		},
		{
			code: ':not(.b) {}',
		},
		{
			code: ':not(.b, .c) {}',
		},
		{
			code: ':matches(.b) {}',
		},
		{
			code: ':matches(.b, .c) {}',
		},
		{
			code: 'div div div div div div div div div div div {}',
			message:
				'a selector with 11 elements has a lower specificity than a selector with one classname',
		},
		{
			code: 'z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z {}',
			message:
				'a selector with 101 elements has a lower specificity than a selector with one classname',
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
			code: '.foo() {\n&.bar {}}',
		},
		{
			code: '.foo(@a, @b) {\n&.bar {}}',
		},
		{
			code: ':where(.ab .ab) {}',
		},
		{
			code: ':is(.ab) {}',
		},
		{
			code: ':nth-child(2n + 1) {}',
		},
		{
			code: '[value] {}',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-max-specificity */
				.ab .ab, /* stylelint-disable-next-line selector-max-specificity */
				.ab .ab,
				/* stylelint-disable-next-line selector-max-specificity */
				.ab .ab
				{}
			`,
		},
	],

	reject: [
		{
			code: '.ab .ab {}',
			message: messages.expected('.ab .ab', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: '.ab span {}',
			message: messages.expected('.ab span', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: '.a:not(.b) {}',
			message: messages.expected('.a:not(.b)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: '.a:not(.b, .c) {}',
			message: messages.expected('.a:not(.b, .c)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: ':not(.b, .c.d) {}',
			message: messages.expected(':not(.b, .c.d)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '.a:matches(.b) {}',
			message: messages.expected('.a:matches(.b)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '.a:matches(.b, .c) {}',
			message: messages.expected('.a:matches(.b, .c)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: ':matches(.b, .c.d) {}',
			message: messages.expected(':matches(.b, .c.d)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: ':is(.ab .ab) {}',
			message: messages.expected(':is(.ab .ab)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '.foo:nth-child(2n + 1) {}',
			message: messages.expected('.foo:nth-child(2n + 1)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: ':nth-child(2n + 1 of .foo) {}',
			message: messages.expected(':nth-child(2n + 1 of .foo)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '.a [value] {}',
			message: messages.expected('.a [value]', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: stripIndent`
				/* a comment */
				.ab .ab, /* a comment */
				.ab .ab,
				/* a comment */
				.ab .ab
				{}
			`,
			warnings: [
				{
					message: messages.expected('.ab .ab', '0,1,0'),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 8,
				},
				{
					message: messages.expected('.ab .ab', '0,1,0'),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 8,
				},
				{
					message: messages.expected('.ab .ab', '0,1,0'),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 8,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['0,3,0'],

	accept: [
		{
			code: '.ab {}',
		},
		{
			code: '.ab .cd {}',
		},
		{
			code: '.ab .cd span {}',
		},
		{
			code: '.cd div span {}',
		},
		{
			code: '.cd .de div span a {}',
		},
		{
			code: '.cd .de div span a > b {}',
		},
		{
			code: '.cd .de, .cd .ef > b {}',
		},
	],

	reject: [
		{
			code: '#jubjub {}',
			message: messages.expected('#jubjub', '0,3,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: '.thing div .thing .sausages {}',
			message: messages.expected('.thing div .thing .sausages', '0,3,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: '.thing div .thing, .sausages .burgers .bacon a {}',
			message: messages.expected('.sausages .burgers .bacon a', '0,3,0'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 47,
		},
	],
});

testRule({
	ruleName,
	config: ['0,2,1'],

	accept: [
		{
			code: '.cd .de,\n.cd .ef > b {}',
		},
		{
			code: '.cd { .de {} }',
			description: 'standard nesting',
		},
		{
			code: 'div:hover { .de {} }',
			description: 'element, pseudo-class, nested class',
		},
		{
			code: '.ab, .cd { & > .de {} }',
			description: 'initial (unnecessary) parent selector',
		},
		{
			code: '.cd { .de > & {} }',
			description: 'necessary parent selector',
		},
		{
			code: '.cd { @media print { .de {} } }',
			description: 'nested rule within nested media query',
		},
		{
			code: '@media print { .cd { .de {} } }',
			description: 'media query > rule > rule',
		},
	],

	reject: [
		{
			code: '.thing div .thing,\n.sausages .burgers .bacon a {}',
			message: messages.expected('.sausages .burgers .bacon a', '0,2,1'),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 28,
		},
		{
			code: '.cd { .de { .fg {} } }',
			message: messages.expected('.fg', '0,2,1'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '.cd { .de { & > .fg {} } }',
			message: messages.expected('& > .fg', '0,2,1'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '.cd { .de { &:hover > .fg {} } }',
			message: messages.expected('&:hover > .fg', '0,2,1'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '.cd { .de { .fg > & {} } }',
			message: messages.expected('.fg > &', '0,2,1'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '.cd { @media print { .de { & + .fg {} } } }',
			message: messages.expected('& + .fg', '0,2,1'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '@media print { li { & + .ab, .ef.ef { .cd {} } } }',
			message: messages.expected('.cd', '0,2,1'),
			line: 1,
			column: 39,
			endLine: 1,
			endColumn: 42,
		},
	],
});

testRule({
	ruleName,
	config: ['0,4,1'],

	accept: [
		{
			code: '.cd .de {& .fg {}}',
		},
	],

	reject: [
		{
			code: '.thing .thing2 {&.nested {#pop {}}}',
			message: messages.expected('#pop', '0,4,1'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: '.thing .thing2 {#here & {}}',
			message: messages.expected('#here &', '0,4,1'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '.thing .thing2 .thing3 .thing4 {a.here & {}}',
			message: messages.expected('a.here &', '0,4,1'),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: '.a { #b { #c {} } }',
			warnings: [
				{
					message: messages.expected('#b', '0,4,1'),
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
				},
				{
					message: messages.expected('#c', '0,4,1'),
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['0,1,1'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '#hello #{$test} {}',
			description: 'ignore rules with variable interpolation',
		},
		{
			code: '@each $a in $b { .#{ map-get($a, b) } { c {} } }',
			description: 'ignore nested rules with variable interpolation',
		},
	],

	reject: [
		{
			code: '.ab .ab { @include test {} }',
			message: messages.expected('.ab .ab', '0,1,1'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: '.a:not(.b) { @include test {} }',
			message: messages.expected('.a:not(.b)', '0,1,1'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: '.a:not(.b, .c) { @include test {} }',
			message: messages.expected('.a:not(.b, .c)', '0,1,1'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: ':not(.b, .c.d) { @include test {} }',
			message: messages.expected(':not(.b, .c.d)', '0,1,1'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '.a:matches(.b) { @include test {} }',
			message: messages.expected('.a:matches(.b)', '0,1,1'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '.a:matches(.b, .c) { @include test {} }',
			message: messages.expected('.a:matches(.b, .c)', '0,1,1'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: ':matches(.b, .c.d) { @include test {} }',
			message: messages.expected(':matches(.b, .c.d)', '0,1,1'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@include test { .ab .ab {} }',
			message: messages.expected('.ab .ab', '0,1,1'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 24,
		},
	],
});

testRule({
	ruleName,
	config: ['0,3,0'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '.navigation__item:nth-of-type(4n) .navigation__sub-list {}',
		},
	],
});

testRule({
	ruleName,
	config: ['0,1,1'],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '#hello @{test} {}',
			description: 'ignore rules with variable interpolation',
		},
	],
});

testRule({
	ruleName,
	config: [
		'0,1,0',
		{
			ignoreSelectors: [':is', ':has', ':host', '/my-/'],
		},
	],

	accept: [
		{
			code: ':is(.b) {}',
		},
		{
			code: ':is(.b, :has(.c)) {}',
		},
		{
			code: ':has(.b) {}',
		},
		{
			code: ':has(.b, :is(.c)) {}',
		},
		{
			code: ':has(.b, :is(a a)) {}',
		},
		{
			code: 'my-tag.a {}',
		},
		{
			code: ':nth-child(even of my-tag) {}',
		},
		{
			code: '.a:host {}',
		},
		{
			code: '.a:host(:where(.b)) {}',
		},
		{
			code: ':host(.a) {}',
		},
	],

	reject: [
		{
			code: '.a:is(.b) {}',
			message: messages.expected('.a:is(.b)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '.a:is(.b, .c) {}',
			message: messages.expected('.a:is(.b, .c)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: ':is(.b, .c.d) {}',
			message: messages.expected(':is(.b, .c.d)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: '.a:has(.b) {}',
			message: messages.expected('.a:has(.b)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: '.a:has(.b, .c) {}',
			message: messages.expected('.a:has(.b, .c)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: ':has(.b, .c.d) {}',
			message: messages.expected(':has(.b, .c.d)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'my-tag.a.b {}',
			message: messages.expected('my-tag.a.b', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a.b:host {}',
			message: messages.expected('a.b:host', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a:host(.b) {}',
			message: messages.expected('a:host(.b)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: ':host(a.b) {}',
			message: messages.expected(':host(a.b)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
	],
});

testRule({
	ruleName,
	config: [
		'0,1,0',
		{
			ignoreSelectors: [/my-/],
		},
	],

	accept: [
		{
			code: 'my-tag.a {}',
		},
	],

	reject: [
		{
			code: '.a:is(.b) {}',
			message: messages.expected('.a:is(.b)', '0,1,0'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
	],
});
