import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

const basicAZTestsAccept = {
	accept: [
		{
			code: 'a {}',
		},
		{
			code: '#foo {}',
		},
		{
			code: "[foo='bar'] {}",
		},
		{
			code: '.FOO {}',
		},
		{
			code: "a #foo > [foo='bar'], .FOO {}",
		},
		{
			code: 'a /* .foo */ {}',
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
			code: '@keyframes a { 0%, 48.59% {} }',
			message: 'Keyframes with decimal percentages',
		},
		{
			code: '@keyframes a { entry 0%, exit 48.59% {} }',
			message: 'Keyframes with named timeline ranges',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-class-pattern */
				a .foo, /* stylelint-disable-next-line selector-class-pattern */
				a .foo,
				/* stylelint-disable-next-line selector-class-pattern */
				a .foo
				{}
			`,
		},
		{
			code: stripIndent`
				a {
					/* stylelint-disable-next-line selector-class-pattern */
					& .foo, /* stylelint-disable-next-line selector-class-pattern */
					& .foo,
					/* stylelint-disable-next-line selector-class-pattern */
					& .foo
					{}
				}
			`,
		},
	],
};

testRule({
	ruleName,
	config: [/^[A-Z]+$/],

	...basicAZTestsAccept,

	reject: [
		{
			code: 'a .foo {}',
			message: messages.expected('.foo', /^[A-Z]+$/),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '.foo.BAR {}',
			message: messages.expected('.foo', /^[A-Z]+$/),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: 'a, .foo {}',
			message: messages.expected('.foo', /^[A-Z]+$/),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a,\n\t.foo {}',
			message: messages.expected('.foo', /^[A-Z]+$/),
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 6,
		},
		{
			code: '.ABABA > .bar {}',
			message: messages.expected('.bar', /^[A-Z]+$/),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: stripIndent`
				/* a comment */
				a .foo, /* a comment */
				a .bar,
				/* a comment */
				a .foo
				{}
			`,
			warnings: [
				{
					line: 2,
					column: 3,
					endLine: 2,
					endColumn: 7,
					message: messages.expected('.foo', /^[A-Z]+$/),
				},
				{
					line: 3,
					column: 3,
					endLine: 3,
					endColumn: 7,
					message: messages.expected('.bar', /^[A-Z]+$/),
				},
				{
					line: 5,
					column: 3,
					endLine: 5,
					endColumn: 7,
					message: messages.expected('.foo', /^[A-Z]+$/),
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['^[A-Z]+$'],

	...basicAZTestsAccept,

	reject: [
		{
			code: 'a .foo {}',
			message: messages.expected('.foo', '^[A-Z]+$'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '.ABABA > .bar {}',
			message: messages.expected('.bar', '^[A-Z]+$'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 14,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: [/^[A-Z]+$/],

	accept: [
		{
			code: '@for $n from 1 through 5 { .A#{$n} {} }',
			description: 'ignore sass interpolation inside @for',
		},
		{
			code: '@for $n from 1 through 5 { .A { &B#{$n} {} }}',
			description: 'ignore sass interpolation of nested selector inside @for',
		},
		{
			code: '.#{$a} {}',
			description: 'ignore sass var interpolation',
		},
		{
			code: '.A#{$B} { &C {} &D, &E {} }',
			description: 'ignore sass var interpolation for parents of nested selectors',
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: [/^[A-Z]+$/],

	accept: [
		{
			code: '.mixin-name() { }',
			description: 'ignore non-outputting Less class mixin definition',
		},
		{
			code: '.A { .mixin-name; }',
			description: 'ignore called Less class mixin',
		},
		{
			code: '.A { .mixin-name(@var); }',
			description: 'ignore called Less class parametric mixin',
		},
		{
			code: '#mixin-name() { }',
			description: 'ignore non-outputting Less ID mixin definition',
		},
		{
			code: '.A { #mixin-name; }',
			description: 'ignore called Less ID mixin',
		},
		{
			code: '#namespace { .mixin-name() {} }',
			description: 'ignore namespaced non-outputting Less class mixin definition',
		},
		{
			code: '.A { #namespace > .mixin-name; }',
			description: 'ignore called namespaced Less mixin (child)',
		},
		{
			code: '.A { #namespace .mixin-name; }',
			description: 'ignore called namespaced Less mixin (descendant)',
		},
		{
			code: '.A { #namespace.mixin-name; }',
			description: 'ignore called namespaced Less mixin (compounded)',
		},
	],
});
