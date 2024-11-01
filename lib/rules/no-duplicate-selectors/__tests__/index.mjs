import { fileURLToPath } from 'node:url';
import { stripIndent } from 'common-tags';

import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssStylelint from '../../../postcssPlugin.mjs';

import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.cjs';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a {} b {} c {} d, e, f {}',
			description: 'no duplicates',
		},
		{
			code: 'a {}\n@media print { a {} }',
			description: 'duplicate inside media query',
		},
		{
			code: '@keyframes a { 0% {} } @keyframes b { 0% {} }',
			description: 'duplicate inside keyframes',
		},
		{
			code: 'a { a { a {} } }',
			description: 'duplicates inside nested rules',
		},
		{
			code: '.foo .bar {}\n .foo {}\n.bar {}\n.bar .foo {}',
			description: 'selectors using parts of other selectors',
		},
		{
			code: 'a {} a, b {}',
			description: 'selectors reused in other non-equivalent selector lists',
		},
		{
			code: 'a b { top: 0; } a { b, c { color: pink; } }',
			description: 'nested resolution',
		},
		{
			code: '@mixin foo { &:hover {} } @mixin bar { &:hover {} }',
		},
		{
			code: 'ul, ol {} ul {}',
		},
		{
			code: '[disabled].foo, [disabled] .foo {}',
		},
		{
			code: '[a=" "] {} [a="  "] {}',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line no-duplicate-selectors */
				a, /* stylelint-disable-next-line no-duplicate-selectors */
				a,
				/* stylelint-disable-next-line no-duplicate-selectors */
				a
				{}
			`,
		},
		{
			code: stripIndent`
				a {}
				/* stylelint-disable-next-line no-duplicate-selectors */
				a {} /* stylelint-disable-next-line no-duplicate-selectors */
				a
				/* stylelint-disable-next-line no-duplicate-selectors */ {}
				a
				{}
			`,
		},
	],

	reject: [
		{
			code: 'a, a {}',
			description: "duplicate within one rule's selector list",
			warnings: [
				{
					message: messages.rejected('a', 1),
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: 'a,\na {}',
			description: "duplicate within one rule's selector list. multiline",
			warnings: [
				{
					message: messages.rejected('a', 1),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 2,
				},
			],
		},
		{
			code: 'a, /* test */a {}',
			description: "duplicate within one rule's selector list. with comments",
			warnings: [
				{
					message: messages.rejected('a', 1),
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: 'b,\na,\na {}',
			description: "duplicate within one rule's selector list. multiline",
			warnings: [
				{
					message: messages.rejected('a', 2),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 2,
				},
			],
		},
		{
			code: '.a, .a, .a {}',
			description: "duplicated selectors within one rule's selector list. 3 duplicates",
			warnings: [
				{
					message: messages.rejected('.a', 1),
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 7,
				},
				{
					message: messages.rejected('.a', 1),
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: '.a, .a {} .a {}',
			description: "duplicated selectors within two rule's selector list. 3 duplicates",
			warnings: [
				{
					message: messages.rejected('.a', 1),
					line: 1,
					column: 5,
				},
				{
					message: messages.rejected('.a', 1),
					line: 1,
					column: 11,
				},
			],
		},
		{
			code: 'a {} b {} a {}',
			description: 'duplicate simple selectors with another rule between',
			warnings: [
				{
					message: messages.rejected('a', 1),
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '\n\n\n a {}\n b {}\n a {}',
			description: 'duplicate simple selectors with another rule between',
			warnings: [
				{
					message: messages.rejected('a', 4),
					line: 6,
					column: 2,
					endLine: 6,
					endColumn: 3,
				},
			],
		},
		{
			code: 'a, b {} b, a {}',
			description: 'duplicate selector lists with different order',
			warnings: [
				{
					message: messages.rejected('b, a', 1),
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: ':is(a, c), :is(b, c) {} :is(b, c), :is(c, a) {}',
			description: 'duplicate selector lists with different order in nested parts',
			warnings: [
				{
					message: messages.rejected(':is(b, c), :is(c, a)', 1),
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
		{
			code: 'a b {}\na b {}',
			description: 'duplicate selectors with multiple components',
			warnings: [
				{
					message: messages.rejected('a b', 1),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 4,
				},
			],
		},
		{
			code: '.foo   a, b\t> .bar,\n#baz {}\n  #baz,\n\n  .foo     a,b>.bar {}',
			description: 'essentially duplicate selector lists with varied spacing',
			warnings: [
				{
					message: messages.rejected('#baz,\n\n  .foo     a,b>.bar', 1),
					line: 3,
					column: 3,
					endLine: 5,
					endColumn: 20,
				},
			],
		},
		{
			code: ':is(a,b), :is( a,b), :is( a ,b), :is( a , b), :is( a , b ) {}',
			description: 'essentially duplicate selector lists with varied spacing in pseudo selector',
			warnings: [
				{
					message: messages.rejected(':is( a,b)', 1),
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.rejected(':is( a ,b)', 1),
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 32,
				},
				{
					message: messages.rejected(':is( a , b)', 1),
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 45,
				},
				{
					message: messages.rejected(':is( a , b )', 1),
					line: 1,
					column: 47,
					endLine: 1,
					endColumn: 59,
				},
			],
		},
		{
			code: '[a="b"i], [ a="b"i], [ a ="b"i], [ a = "b"i], [ a = "b" i], [ a = "b" i ] {}',
			description: 'essentially duplicate selector lists with varied spacing in attribute',
			warnings: [
				{
					message: messages.rejected('[ a="b"i]', 1),
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
				{
					message: messages.rejected('[ a ="b"i]', 1),
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 32,
				},
				{
					message: messages.rejected('[ a = "b"i]', 1),
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 45,
				},
				{
					message: messages.rejected('[ a = "b" i]', 1),
					line: 1,
					column: 47,
					endLine: 1,
					endColumn: 59,
				},
				{
					message: messages.rejected('[ a = "b" i ]', 1),
					line: 1,
					column: 61,
					endLine: 1,
					endColumn: 74,
				},
			],
		},
		{
			code: 'a {}\n@media print { a, a {} }',
			description: 'duplicate within a media query, in the same rule',
			warnings: [
				{
					message: messages.rejected('a', 2),
					line: 2,
					column: 19,
					endLine: 2,
					endColumn: 20,
				},
			],
		},
		{
			code: 'a {}\n@media print { a {} a {} }',
			description: 'duplicate within a media query, in different rules',
			warnings: [
				{
					message: messages.rejected('a', 2),
					line: 2,
					column: 21,
					endLine: 2,
					endColumn: 22,
				},
			],
		},
		{
			code: 'a b {} a { b {} }',
			description: 'duplicate caused by nesting',
			warnings: [
				{
					message: messages.rejected('b', 1),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: 'a { & {} }',
			description: 'duplicate caused by &-parent selector',
			warnings: [
				{
					message: messages.rejected('&', 1),
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: stripIndent`
				/* a comment */
				a, /* a comment */
				a,
				/* a comment */
				a
				{}
			`,
			warnings: [
				{
					message: messages.rejected('a', 2),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 2,
				},
				{
					message: messages.rejected('a', 2),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 2,
				},
			],
		},
		{
			code: stripIndent`
				a {}
				/* a comment */
				a {} /* a comment */
				a
				/* a comment */ {}
				a
				{}
			`,
			warnings: [
				{
					message: messages.rejected('a', 1),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 2,
				},
				{
					message: messages.rejected('a', 1),
					line: 4,
					column: 1,
					endLine: 4,
					endColumn: 2,
				},
				{
					message: messages.rejected('a', 1),
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
	config: [true, { disallowInList: true }],

	accept: [
		{
			code: 'input, button {}; textarea {}',
			description: 'no duplicate within a grouping selector',
		},
		{
			code: '*::a {}; a {}',
			description: 'no duplicate when one selector is substring of another',
		},
		{
			code: '*::a, b {}; a {}',
			description: 'no duplicate when one selector is substring of another within a list',
		},
		{
			code: 'a b, c {}; a {}',
			description: 'no duplicate when one selector is component of another within a list',
		},
		{
			code: stripIndent`
				a, b {}
				/* stylelint-disable-next-line no-duplicate-selectors */
				a, /* stylelint-disable-next-line no-duplicate-selectors */
				a,
				/* stylelint-disable-next-line no-duplicate-selectors */
				a
				{}
			`,
		},
	],

	reject: [
		{
			code: 'input, textarea {}; textarea {}',
			description: 'duplicate within a grouping selector',
			warnings: [
				{
					message: messages.rejected('textarea', 1),
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: 'textarea {}; input, textarea {}',
			description: 'duplicate within a grouping selector, reversed',
			warnings: [
				{
					message: messages.rejected('textarea', 1),
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: 'input, div {};\n textarea, section {};\n textarea {}',
			description: 'duplicate within a grouping selector. multiline',
			warnings: [
				{
					message: messages.rejected('textarea', 2),
					line: 3,
					column: 2,
					endLine: 3,
					endColumn: 10,
				},
			],
		},
		{
			code: stripIndent`
				a, b {}
				/* a comment */
				a, /* a comment */
				a,
				/* a comment */
				a
				{}
			`,
			warnings: [
				{
					message: messages.rejected('a', 1),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 2,
				},
				{
					message: messages.rejected('a', 1),
					line: 4,
					column: 1,
					endLine: 4,
					endColumn: 2,
				},
				{
					message: messages.rejected('a', 1),
					line: 6,
					column: 1,
					endLine: 6,
					endColumn: 2,
				},
			],
		},
	],
});

it('with postcss-import and duplicates within a file, a warning strikes', () => {
	return postcss()
		.use(postcssImport())
		.use(
			postcssStylelint({
				config: {
					rules: { [ruleName]: true },
				},
			}),
		)
		.process("@import 'fixtures/using-foo-twice.css';", {
			from: fileURLToPath(new URL('./test.css', import.meta.url)),
		})
		.then((result) => {
			expect(result.warnings()).toHaveLength(1);
			expect(result.warnings()[0]).toHaveProperty('text', messages.rejected('.foo', 1));
		});
});

it('with postcss-import and duplicates across files, no warnings', () => {
	return postcss()
		.use(postcssImport())
		.use(
			postcssStylelint({
				config: {
					rules: { [ruleName]: true },
				},
			}),
		)
		.process("@import 'fixtures/using-foo.css'; @import 'fixtures/also-using-foo.css';", {
			from: fileURLToPath(new URL('./test.css', import.meta.url)),
		})
		.then((result) => {
			expect(result.warnings()).toHaveLength(0);
		});
});

testRule({
	ruleName,
	customSyntax: naiveCssInJs,
	config: [true],

	accept: [
		{
			code: 'css` a {}`;',
		},
		{
			code: 'css` a {} b {}`;',
		},
	],

	reject: [
		{
			code: 'css` a {} a {} `;',
			message: messages.rejected('a', 1),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 8,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: [true],

	accept: [
		{
			code: 'a { background: { color: red } }',
			description: 'Non standard SCSS nested property',
		},
		{
			code: '.#{foo} { &:last-child { &, & > .#{foo}-bar {} } }',
			description: 'Non standard SCSS nested interpolation',
		},
		{
			code: 'a { b, .#{var} {} b {} }',
			description: 'Non standard SCSS nested interpolation (2',
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: [true],

	accept: [
		{
			code: '.@{foo} { .@{foo}-bar {} }',
			description: 'Non standard Less nested interpolation',
		},
		{
			code: '.@{foo} { &:last-child { &, & > .@{foo}-bar {} } }',
			description: 'Non standard Less nested interpolation (2',
		},
		{
			code: 'a { b, .@{var} {} b {} }',
			description: 'Non standard Less nested interpolation (3',
		},
		{
			code: '.foo() { .bar > & { color: #000; } &.readonly { color: #fff; } }',
		},
	],
});
