import { stripIndent } from 'common-tags';

import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.js';

import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a {} b a {}',
		},
		{
			code: 'a b {} a b a b a b a b a b a b {}',
			description: '2 is less than 12 (type checking)',
		},
		{
			code: 'a {} a b {}',
		},
		{
			code: 'a {} a + a {}',
		},
		{
			code: 'a {} a[foo] {}',
		},
		{
			code: 'a[foo] {} a {}',
			description: 'only checks matching last compound selectors',
		},
		{
			code: 'a { b {} } c + b {}',
		},
		{
			code: 'b a {} @media print { a {} }',
		},
		{
			code: 'a {} a::after {}',
			description: 'pseudo-element last',
		},
		{
			code: 'a {} a:hover {}',
			description: 'pseudo-class last',
		},
		{
			code: 'a:hover {} a:hover::before {}',
		},
		{
			code: 'a:hover::before {} a:hover {}',
		},
		{
			code: 'a:not(.foo):hover {} a::before {}',
		},
		{
			code: 'a::before {} a:not(.foo):hover {} ',
		},
		{
			code: 'a::before {} a {} a:hover a:hover::before {} ',
		},
		{
			code: '.m:hover {} .b {}',
		},
		{
			code: '.menu:hover {} .burger {}',
		},
		{
			code: '.foo.bar, .foo.bar:focus { @mixin: foo; } .baz.bar, .baz.bar:focus {}',
		},
		{
			code: '.selector, { }',
		},
		{
			code: '.a:not(.b) .c:matches(.d, .e) .f:unknown(.g, .h) {} .a {}',
		},
		{
			code: ':root { --foo: {}; }',
		},
		{
			code: ':root { foo: {}; }',
		},
		{
			code: ':global(.buildResultsSummaryTable) span {} :global(.buildResultsSummaryTable) span:nth-child(2) {}',
		},
		{
			code: 'a:hover {} a::before {}',
		},
		{
			code: 'a:hover {} a::-webkit-slider-thumb {}',
		},
		{
			code: 'p::-moz-focus-inner {} p {}',
		},
		{
			code: ':where(a :is(b, i)) {} :where(a) {}',
		},
		{
			code: 'a :where(a, b) {} :where(c, d) {}',
		},
		{
			code: 'a b :global(.foo) {} a :global(.bar) {}',
		},
		{
			code: ':global(.foo) {} :global { .bar {} }',
		},
	],

	reject: [
		{
			code: 'b a {} a {}',
			message: messages.rejected('a', 'b a'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'b a, {} a, {}',
			message: messages.rejected('a', 'b a'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a + a {} a {}',
			message: messages.rejected('a', 'a + a'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'b > a[foo] {} a[foo] {}',
			message: messages.rejected('a[foo]', 'b > a[foo]'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'e > f, b + e + a {} c {} a d {} z, f + a, y {}',
			message: messages.rejected('f + a', 'b + e + a'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: 'e > f, b + e + a {} c {} a d {} z, f + a, y {}',
			message: messages.rejected('f + a', 'b + e + a'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: 'a { & > b {} } b {}',
			message: messages.rejected('b', 'a > b'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'b a {} @media print { #c a {} a {} }',
			message: messages.rejected('a', '#c a'),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a:hover {} a {} ',
			description: 'pseudo-class first',
			message: messages.rejected('a', 'a:hover'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a:hover::before {} a::before {} a {} a:hover ',
			description: 'pseudo-element with pseudo-class',
			message: messages.rejected('a::before', 'a:hover::before'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.a .b .c {} .b .c {} .c {}',
			warnings: [
				{
					message: messages.rejected('.b .c', '.a .b .c'),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
				{
					message: messages.rejected('.c', '.a .b .c'),
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: '.a .b .c {} .b .c {} .c {} .d .b .c {} .b .c {} .c {}',
			warnings: [
				{
					message: messages.rejected('.b .c', '.a .b .c'),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
				{
					message: messages.rejected('.c', '.a .b .c'),
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 24,
				},
				{
					message: messages.rejected('.b .c', '.a .b .c'),
					line: 1,
					column: 40,
					endLine: 1,
					endColumn: 45,
				},
				{
					message: messages.rejected('.c', '.a .b .c'),
					line: 1,
					column: 49,
					endLine: 1,
					endColumn: 51,
				},
			],
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: [true],

	accept: [
		{
			code: '.foo { &--a, &--a#{&}--b {  div {} } }',
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: [true],

	accept: [
		{
			code: stripIndent`
				a,
				// comment2
				b {}
			`,
		},
	],
});

testRule({
	ruleName,
	customSyntax: naiveCssInJs,
	config: [true],

	accept: [
		{
			code: 'css` &:hover { a {} } `;',
		},
		{
			code: 'css` &.active { a {} } `;',
		},
	],

	reject: [
		{
			code: 'css` &:hover { a {} } \n a {} `;',
			message: messages.rejected('a', '&:hover a'),
		},
		{
			code: 'css` &.active { a {} } \n a {} `;',
			message: messages.rejected('a', '&.active a'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['selectors-within-list'] }],

	accept: [
		{
			code: 'b a {} h1, h2, h3, a {}',
		},
		{
			code: 'b a {} a, h1, h2, h3 {}',
		},
	],

	reject: [
		{
			code: 'b a {} h1 {} h2 {} h3 {} a {}',
			message: messages.rejected('a', 'b a'),
			line: 1,
			column: 26,
		},
	],
});
