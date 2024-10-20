import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

// Testing plain selectors, different combinators
testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: 'a.class#id[ type = "value"]::before { top: 0; }',
		},
		{
			code: 'a[ type = "value"].class[data-val] { top: 0; }',
		},
		{
			code: 'a b { top: 0; }',
		},
		{
			code: ' a   b { top: 0; }',
		},
		{
			code: ' a>  b { top: 0; }',
		},
		{
			code: ' a  >  b { top: 0; }',
		},
		{
			code: ' a  >b { top: 0; }',
		},
		{
			code: 'a b, a b.c { top: 0; }',
		},
		{
			code: 'a { b { top: 0; }}',
		},
		{
			code: 'a { top: 0; d { top: 0; }}',
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
			code: stripIndent`
				/* stylelint-disable-next-line selector-max-compound-selectors */
				a b c, /* stylelint-disable-next-line selector-max-compound-selectors */
				a b c,
				/* stylelint-disable-next-line selector-max-compound-selectors */
				a b c
				{}
			`,
		},
	],

	reject: [
		{
			code: 'a b c { top: 0; }',
			message: messages.expected('a b c', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: '#id > .cl + .cl2 { top: 0; }',
			message: messages.expected('#id > .cl + .cl2', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a c, d + e h { top: 0; }',
			message: messages.expected('d + e h', 2),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a ~ h + d { top: 0; }',
			message: messages.expected('a ~ h + d', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: stripIndent`
				/* a comment */
				a b c, /* a comment */
				a b c,
				/* a comment */
				a b c
				{}
			`,
			warnings: [
				{
					message: messages.expected('a b c', 2),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 6,
				},
				{
					message: messages.expected('a b c', 2),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 6,
				},
				{
					message: messages.expected('a b c', 2),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 6,
				},
			],
		},
	],
});

// Testing :not, attr selectors
testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: ':not( a b ) {}',
			description: 'Standalone :not(), number of compound selectors <= max inside it',
		},
		{
			code: 'a b:not(c d) {}',
		},
		{
			code: '[type="text"] {top: 1px;}',
			description: 'Single attr selector, complies.',
		},
		{
			code: 'a [type="text"] {}',
			description: 'Type selector and a single attr selector, complies.',
		},
		{
			code: ' [type="text"]#id.classname l {}',
			description: 'attr selector with class and ID selectors, complies.',
		},
	],

	reject: [
		{
			code: ':not(a b c) { top: 0; }',
			description: 'Standalone :not(), number of compound selectors > max inside it',
			message: messages.expected(':not(a b c)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'a b > c:not( d e ) { top: 0; }',
			description: 'number of compound selectors > max outside of :not()',
			message: messages.expected('a b > c:not( d e )', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a b :not(d) { top: 0; }',
			description: 'Standalone :not, number of compound selectors > max outside of :not()',
			message: messages.expected('a b :not(d)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'a b :not(d) { top: 0; }',
			description: 'Standalone attr selector, number of compound selectors > max outside of :not()',
			message: messages.expected('a b :not(d)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
	],
});

// Testing nested selectors
testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: '.cd .de,\n.ef > b {}',
		},
		{
			code: 'a { b {} }',
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
			code: '.thing div,\n.burgers .bacon a {}',
			message: messages.expected('.burgers .bacon a', 2),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 18,
		},
		{
			code: '.cd { .de { .fg {} } }',
			message: messages.expected('.fg', 2),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '.cd { .de { & > .fg {} } }',
			message: messages.expected('& > .fg', 2),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '.cd { .de { &:hover > .fg {} } }',
			message: messages.expected('&:hover > .fg', 2),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '.cd { .de { .fg > & {} } }',
			message: messages.expected('.fg > &', 2),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { b { c {} } }',
			description: 'standard nesting',
			message: messages.expected('c', 2),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a b { c { top: 10px; } }',
			description: 'standard nesting with declaration',
			message: messages.expected('c', 2),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a b { c { d {} } }',
			description: 'standard nesting with declaration and more nested rule',
			warnings: [
				{
					message: messages.expected('c', 2),
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 8,
				},
				{
					message: messages.expected('d', 2),
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: 'a b { c { top: 10px; @media print {} } }',
			description: 'standard nesting with declaration and more nested rule',
			message: messages.expected('c', 2),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a b { c { @media print { top: 10px; } } }',
			description: 'standard nesting with declaration and more nested rule',
			message: messages.expected('c', 2),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a { @media print { b > c { d {} } } }',
			description: 'The rule fails, but nesting even deeper with more compound selectors,',
			warnings: [
				{
					message: messages.expected('b > c', 2),
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 25,
				},
				{
					message: messages.expected('d', 2),
					line: 1,
					column: 28,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: '.a { @media print { & .b > .c { & + .d {} } } }',
			description:
				'The rule fails, but nesting even deeper with more compound selectors, parent ref.,',
			warnings: [
				{
					message: messages.expected('& .b > .c', 2),
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 30,
				},
				{
					message: messages.expected('& + .d', 2),
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: '@media print { li { & + .ab { .cd { top: 10px; } } } }',
			description:
				'The rule fails, but nesting even deeper with more compound selectors, has declarations',
			message: messages.expected('.cd', 2),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 34,
		},
	],
});

// Testing interpolation
testRule({
	ruleName,
	config: [1],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '#hello #{$test} {}',
			description: 'ignore rules with variable interpolation',
		},
		{
			code: '.foo { margin: { left: 5px; top: 10px; }; }',
			description: 'nested properties',
		},
	],

	reject: [
		{
			code: 'a b { @include test {} top: 0; }',
			message: messages.expected('a b', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: '#id > .cl + .cl2 { @include test {} top: 0; }',
			message: messages.expected('#id > .cl + .cl2', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a c, d + e h { @include test{} top: 0; }',
			warnings: [
				{
					message: messages.expected('a c', 1),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
				{
					message: messages.expected('d + e h', 1),
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: 'a ~ h + d { @include test {} top: 0; }',
			message: messages.expected('a ~ h + d', 1),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '@include test { a b { top: 0; } }',
			message: messages.expected('a b', 1),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 20,
		},
	],
});

testRule({
	ruleName,
	config: [1],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '#hello @{test} {}',
			description: 'ignore rules with variable interpolation',
		},
		{
			code: '.setFont(@size) { font-size: @size; }',
			description: 'ignore mixins',
		},
		{
			code: '.test { .setFont(12px) }',
			description: 'ignore called mixins',
		},
	],
});

// Testing ignoreSelectors
testRule({
	ruleName,
	config: [2, { ignoreSelectors: ['::v-deep', '/-moz-.*/', /-screen$/, '.ignored'] }],

	accept: [
		{
			code: '.ignored .foo .bar {}',
			description: 'ignored selector at the beginning',
		},
		{
			code: '.foo ::v-deep .bar {}',
			description: 'ignored selector in the middle',
		},
		{
			code: '.foo ::v-deep > .bar {}',
			description: 'ignored selector in the middle followed by a combinator',
		},
		{
			code: '.foo::v-deep .bar {}',
			description: 'ignored selector as pseudo-element',
		},
		{
			code: '.foo::v-deep > .bar {}',
			description: 'ignored selector as pseudo-element followed by a combinator',
		},
		{
			code: '.foo > ::v-deep .bar {}',
			description: 'ignored selector preceded by a combinator',
		},
		{
			code: '.foo input::-moz-placeholder {}',
			description: 'selector ignored by string regex',
		},
		{
			code: '.foo :-webkit-full-screen a {}',
			description: 'selector ignored by regex',
		},
		{
			code: '.foo::v-deep :-webkit-full-screen a ::-moz-placeholder {}',
			description: 'multiple ignored selectors',
		},
		{
			code: '.foo { & ::v-deep > .bar {} }',
			description: 'nested ignored selector',
		},
		{
			code: '.foo .bar > .ignored.ignored {}',
			description: 'concatenated class selectors ignored one by one',
		},
		{
			code: '.foo .bar > .ignored .ignored {}',
			description: 'doubled class selectors ignored',
		},
	],

	reject: [
		{
			code: '.foo .bar ::v-deep .baz {}',
			description: 'ignored selector in the middle',
			message: messages.expected('.foo .bar ::v-deep .baz', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '.foo .bar::v-deep .baz {}',
			description: 'ignored selector as pseudo-element',
			message: messages.expected('.foo .bar::v-deep .baz', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '.foo { & ::v-deep > .bar .baz {} }',
			description: 'nested ignored selector',
			message: messages.expected('& ::v-deep > .bar .baz', 2),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: '.foo .bar > .baz.ignored {}',
			message: messages.expected('.foo .bar > .baz.ignored', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '.foo .bar > .ignored.baz {}',
			message: messages.expected('.foo .bar > .ignored.baz', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 25,
		},
	],
});

testRule({
	ruleName,
	config: [2, { ignoreSelectors: [':not'] }],

	accept: [
		{
			code: '.foo .bar:not(.baz) {}',
		},
		{
			code: 'p a :not(.foo .bar) {}',
		},
		{
			code: 'p a :not(.foo .bar, .foo .baz) {}',
		},
	],

	reject: [
		{
			code: 'p a :not(.foo .bar .baz) {}',
			description: 'still evaluates compound selectors inside :not',
			message: messages.expected('p a :not(.foo .bar .baz)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'p a :not(.foo .bar, .foo .bar .baz) {}',
			description: 'still evaluates compound selectors inside :not with comma',
			message: messages.expected('p a :not(.foo .bar, .foo .bar .baz)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 36,
		},
	],
});

// https://github.com/stylelint/stylelint/issues/2453
testRule({
	ruleName,
	config: [3],

	accept: [
		{
			code: '.a { @nest .b:not(:hover, :focus) & { & .c {} } }',
		},
	],

	reject: [
		{
			code: '.a { @nest .b:not(:hover, :focus) & { & .c .d {} } }',
			message: messages.expected('& .c .d', 3),
			line: 1,
			column: 39,
			endLine: 1,
			endColumn: 46,
		},
	],
});
