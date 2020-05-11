'use strict';

const { messages, ruleName } = require('..');

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
			code:
				'z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z {}',
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
	],

	reject: [
		{
			code: '.ab .ab {}',
			message: messages.expected('.ab .ab', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.ab span {}',
			message: messages.expected('.ab span', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:not(.b) {}',
			message: messages.expected('.a:not(.b)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:not(.b, .c) {}',
			message: messages.expected('.a:not(.b, .c)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: ':not(.b, .c.d) {}',
			message: messages.expected(':not(.b, .c.d)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:matches(.b) {}',
			message: messages.expected('.a:matches(.b)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:matches(.b, .c) {}',
			message: messages.expected('.a:matches(.b, .c)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: ':matches(.b, .c.d) {}',
			message: messages.expected(':matches(.b, .c.d)', '0,1,0'),
			line: 1,
			column: 1,
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
		},
		{
			code: '.thing div .thing .sausages {}',
			message: messages.expected('.thing div .thing .sausages', '0,3,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.thing div .thing, .sausages .burgers .bacon a {}',
			message: messages.expected('.sausages .burgers .bacon a', '0,3,0'),
			line: 1,
			column: 20,
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
		},
		{
			code: '.cd { .de { .fg {} } }',
			message: messages.expected('.cd .de .fg', '0,2,1'),
		},
		{
			code: '.cd { .de { & > .fg {} } }',
			message: messages.expected('.cd .de > .fg', '0,2,1'),
		},
		{
			code: '.cd { .de { &:hover > .fg {} } }',
			message: messages.expected('.cd .de:hover > .fg', '0,2,1'),
		},
		{
			code: '.cd { .de { .fg > & {} } }',
			message: messages.expected('.fg > .cd .de', '0,2,1'),
		},
		{
			code: '.cd { @media print { .de { & + .fg {} } } }',
			message: messages.expected('.cd .de + .fg', '0,2,1'),
		},
		{
			code: '@media print { li { & + .ab, .ef.ef { .cd {} } } }',
			message: messages.expected('li .ef.ef .cd', '0,2,1'),
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
			message: messages.expected('.thing .thing2.nested #pop', '0,4,1'),
			line: 1,
			column: 27,
		},
		{
			code: '.thing .thing2 {#here & {}}',
			message: messages.expected('#here .thing .thing2', '0,4,1'),
			line: 1,
			column: 17,
		},
		{
			code: '.thing .thing2 .thing3 .thing4 {a.here & {}}',
			message: messages.expected('a.here .thing .thing2 .thing3 .thing4', '0,4,1'),
			line: 1,
			column: 33,
		},
	],
});

testRule({
	ruleName,
	config: ['0,1,1'],
	syntax: 'scss',

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
		},
		{
			code: '.a:not(.b) { @include test {} }',
			message: messages.expected('.a:not(.b)', '0,1,1'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:not(.b, .c) { @include test {} }',
			message: messages.expected('.a:not(.b, .c)', '0,1,1'),
			line: 1,
			column: 1,
		},
		{
			code: ':not(.b, .c.d) { @include test {} }',
			message: messages.expected(':not(.b, .c.d)', '0,1,1'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:matches(.b) { @include test {} }',
			message: messages.expected('.a:matches(.b)', '0,1,1'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:matches(.b, .c) { @include test {} }',
			message: messages.expected('.a:matches(.b, .c)', '0,1,1'),
			line: 1,
			column: 1,
		},
		{
			code: ':matches(.b, .c.d) { @include test {} }',
			message: messages.expected(':matches(.b, .c.d)', '0,1,1'),
			line: 1,
			column: 1,
		},
		{
			code: '@include test { .ab .ab {} }',
			message: messages.expected('.ab .ab', '0,1,1'),
			line: 1,
			column: 17,
		},
	],
});

testRule({
	ruleName,
	config: ['0,3,0'],
	syntax: 'scss',

	accept: [
		{
			code: '.navigation__item:nth-of-type(4n) .navigation__sub-list {}',
		},
	],
});

testRule({
	ruleName,
	config: ['0,1,1'],
	syntax: 'less',

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
			ignoreSelectors: [':global', ':local', '/my-/'],
		},
	],

	accept: [
		{
			code: ':global(.b) {}',
		},
		{
			code: ':global(.b, :local(.c)) {}',
		},
		{
			code: ':local(.b) {}',
		},
		{
			code: ':local(.b, :global(.c)) {}',
		},
		{
			code: 'my-tag.a {}',
		},
	],

	reject: [
		{
			code: '.a:global(.b) {}',
			message: messages.expected('.a:global(.b)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:global(.b, .c) {}',
			message: messages.expected('.a:global(.b, .c)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: ':global(.b, .c.d) {}',
			message: messages.expected(':global(.b, .c.d)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:local(.b) {}',
			message: messages.expected('.a:local(.b)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: '.a:local(.b, .c) {}',
			message: messages.expected('.a:local(.b, .c)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: ':local(.b, .c.d) {}',
			message: messages.expected(':local(.b, .c.d)', '0,1,0'),
			line: 1,
			column: 1,
		},
		{
			code: 'my-tag.a.b {}',
			message: messages.expected('my-tag.a.b', '0,1,0'),
			line: 1,
			column: 1,
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
			code: '.a:global(.b) {}',
			message: messages.expected('.a:global(.b)', '0,1,0'),
			line: 1,
			column: 1,
		},
	],
});
