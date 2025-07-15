import { stripIndent } from 'common-tags';

import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.cjs';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { color: red; } b a { color: red; }',
		},
		{
			code: 'a b { color: red; } a b a b a b a b a b a b { color: red; }',
			description: '2 is less than 12 (type checking)',
		},
		{
			code: 'a { color: red; } a b { color: red; }',
		},
		{
			code: 'a { color: red; } a + a { color: red; }',
		},
		{
			code: 'a { color: red; } a[foo] { color: red; }',
		},
		{
			code: 'a[foo] { color: red; } a { color: red; }',
			description: 'only checks matching last compound selectors',
		},
		{
			code: 'a { b { color: red; } } c + b { color: red; }',
		},
		{
			code: 'b a { color: red; } @media print { a { color: red; } }',
		},
		{
			code: 'a { color: red; } a::after { color: red; }',
			description: 'pseudo-element last',
		},
		{
			code: 'a { color: red; } a:hover { color: red; }',
			description: 'pseudo-class last',
		},
		{
			code: 'a:hover { color: red; } a:hover::before { color: red; }',
		},
		{
			code: 'a:hover::before { color: red; } a:hover { color: red; }',
		},
		{
			code: 'a:not(.foo):hover { color: red; } a::before { color: red; }',
		},
		{
			code: 'a::before { color: red; } a:not(.foo):hover { color: red; } ',
		},
		{
			code: 'a::before { color: red; } a { color: red; } a:hover a:hover::before { color: red; } ',
		},
		{
			code: '.m:hover { color: red; } .b { color: red; }',
		},
		{
			code: '.menu:hover { color: red; } .burger { color: red; }',
		},
		{
			code: '.foo.bar, .foo.bar:focus { @mixin: foo; } .baz.bar, .baz.bar:focus {}',
		},
		{
			code: '.selector, { color: red; }',
		},
		{
			code: '.a:not(.b) .c:matches(.d, .e) .f:unknown(.g, .h) { color: red; } .a { color: red; }',
		},
		{
			code: ':root { --foo: {}; }',
		},
		{
			code: ':root { foo: { color: red; }; }',
		},
		{
			code: ':is(.buildResultsSummaryTable) span { color: red; } :is(.buildResultsSummaryTable) span:nth-child(2) { color: red; }',
		},
		{
			code: 'a:hover { color: red; } a::before { color: red; }',
		},
		{
			code: 'a:hover { color: red; } a::-webkit-slider-thumb { color: red; }',
		},
		{
			code: 'p::-moz-focus-inner { color: red; } p { color: red; }',
		},
		{
			code: ':where(a :is(b, i)) { color: red; } :where(a) { color: red; }',
		},
		{
			code: 'a :where(a, b) { color: red; } :where(c, d) { color: red; }',
		},
		{
			code: 'a b :is(.foo) { color: red; } a :is(.bar) { color: red; }',
		},
		{
			code: ':is(.foo) { color: red; } :host { .bar { color: red; } }',
		},
		{
			code: 'a { .foo.bar & { color: red; } } b { .foo & { color: red; } }',
		},
		{
			code: '.foo { & h2 { & + p { color: red; } } } h1 { & h2 { & + #baz { color: red; } } }',
		},
		{
			code: 'b a {} a {}',
		},
		{
			code: stripIndent`
				b a, b aa, b aaa { color: red; }
				/* stylelint-disable-next-line no-descending-specificity */
				a, /* stylelint-disable-next-line no-descending-specificity */
				aa,
				/* stylelint-disable-next-line no-descending-specificity */
				aaa
				{ color: red; }
			`,
		},
	],

	reject: [
		{
			code: 'b a { color: red; } a { color: red; }',
			message: messages.expected('a', 'b a', 1),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'b a, { color: red; } a, { color: red; }',
			message: messages.expected('a', 'b a', 1),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a + a { color: red; } a { color: red; }',
			message: messages.expected('a', 'a + a', 1),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'b > a[foo] { color: red; } a[foo] { color: red; }',
			message: messages.expected('a[foo]', 'b > a[foo]', 1),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'e > f, b + e + a { color: red; } c { color: red; } a d { color: red; } z, f + a, y { color: red; }',
			message: messages.expected('f + a', 'b + e + a', 1),
			line: 1,
			column: 75,
			endLine: 1,
			endColumn: 80,
		},
		{
			code: 'e > f, b + e + a { color: red; } c { color: red; } a d { color: red; } z, f + a, y { color: red; }',
			message: messages.expected('f + a', 'b + e + a', 1),
			line: 1,
			column: 75,
			endLine: 1,
			endColumn: 80,
		},
		{
			code: 'a { & > b { color: red; } } b { color: red; }',
			message: messages.expected('b', 'a > b', 1),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'b a { color: red; } @media print { #c a { color: red; } a { color: red; } }',
			message: messages.expected('a', '#c a', 1),
			line: 1,
			column: 57,
			endLine: 1,
			endColumn: 58,
		},
		{
			code: 'a:hover { color: red; } a { color: red; } ',
			description: 'pseudo-class first',
			message: messages.expected('a', 'a:hover', 1),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a:hover::before { color: red; } a::before { color: red; } a { color: red; } a:hover ',
			description: 'pseudo-element with pseudo-class',
			message: messages.expected('a::before', 'a:hover::before', 1),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '.a .b .c { color: red; } .b .c { color: red; } .c { color: red; }',
			warnings: [
				{
					message: messages.expected('.b .c', '.a .b .c', 1),
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 31,
				},
				{
					message: messages.expected('.c', '.a .b .c', 1),
					line: 1,
					column: 48,
					endLine: 1,
					endColumn: 50,
				},
			],
		},
		{
			code: '.a .b .c { color: red; } .b .c { color: red; } .c { color: red; } .d .b .c { color: red; } .b .c { color: red; } .c { color: red; }',
			warnings: [
				{
					message: messages.expected('.b .c', '.a .b .c', 1),
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 31,
				},
				{
					message: messages.expected('.c', '.a .b .c', 1),
					line: 1,
					column: 48,
					endLine: 1,
					endColumn: 50,
				},
				{
					message: messages.expected('.b .c', '.a .b .c', 1),
					line: 1,
					column: 92,
					endLine: 1,
					endColumn: 97,
				},
				{
					message: messages.expected('.c', '.a .b .c', 1),
					line: 1,
					column: 114,
					endLine: 1,
					endColumn: 116,
				},
			],
		},
		{
			code: 'a { .foo.bar & { color: red; } } a { color: red; .foo & { color: red; } }',
			warnings: [
				{
					message: messages.expected('a', '.foo.bar a', 1),
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 35,
				},
				{
					message: messages.expected('.foo &', '.foo.bar a', 1),
					line: 1,
					column: 50,
					endLine: 1,
					endColumn: 56,
				},
			],
		},
		{
			code: '.foo { & h2 { @media { color: red; } } } h1 { & h2 { @media { color: red; } } }',
			description: 'at rules',
			message: messages.expected('& h2', '.foo h2', 1),
			line: 1,
			column: 47,
			endLine: 1,
			endColumn: 51,
		},
		{
			code: stripIndent`
				b a, b aa, b aaa { color: red; }
				/* a comment */
				a, /* a comment */
				aa,
				/* a comment */
				aaa
				{ color: red; }
			`,
			warnings: [
				{
					message: messages.expected('a', 'b a', 1),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 2,
				},
				{
					message: messages.expected('aa', 'b aa', 1),
					line: 4,
					column: 1,
					endLine: 4,
					endColumn: 3,
				},
				{
					message: messages.expected('aaa', 'b aaa', 1),
					line: 6,
					column: 1,
					endLine: 6,
					endColumn: 4,
				},
			],
		},
		{
			code: stripIndent`
				a {color: red }
				/* a comment */
				b:hover { color: red; }
				c { color: red; }
				/* b comment */
				b { color: red; }
			`,
			warnings: [
				{
					message: messages.expected('b', 'b:hover', 3),
					line: 6,
					column: 1,
					endLine: 6,
					endColumn: 2,
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
			code: '.foo { &--a, &--a#{&}--b {  div { color: red; } } }',
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
				b { color: red; }
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
			code: 'css` &:hover { a { color: red; } } `;',
		},
		{
			code: 'css` &.active { a { color: red; } } `;',
		},
	],

	reject: [
		{
			code: 'css` &:hover { a { color: red; } } \n a { color: red; } `;',
			message: messages.expected('a', '&:hover a', 1),
		},
		{
			code: 'css` &.active { a { color: red; } } \n a { color: red; } `;',
			message: messages.expected('a', '&.active a', 1),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['selectors-within-list'] }],

	accept: [
		{
			code: 'b a { color: red; } h1, h2, h3, a { color: red; }',
		},
		{
			code: 'b a { color: red; } a, h1, h2, h3 { color: red; }',
		},
	],

	reject: [
		{
			code: 'b a { color: red; } h1 { color: red; } h2 { color: red; } h3 { color: red; } a { color: red; }',
			message: messages.expected('a', 'b a', 1),
			line: 1,
			column: 78,
			endLine: 1,
			endColumn: 79,
		},
	],
});
