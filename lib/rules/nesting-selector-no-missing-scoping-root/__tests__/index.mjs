import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '.foo { & .bar { } }',
			description: 'nesting selector within a rule with class selector',
		},
		{
			code: '.foo { & { } }',
			description: 'nesting selector within a rule',
		},
		{
			code: 'div { & { } }',
			description: 'nesting selector within a rule with type selector',
		},
		{
			code: '#id { & { } }',
			description: 'nesting selector within a rule with id selector',
		},
		{
			code: '.foo { &:hover { } }',
			description: 'nesting selector with pseudo-class within a rule',
		},
		{
			code: '.foo { &.bar { } }',
			description: 'nesting selector with class within a rule',
		},
		{
			code: '.foo { & .bar .baz { } }',
			description: 'nesting selector with complex selector within a rule',
		},
		{
			code: '@scope (.foo) { & { } }',
			description: 'nesting selector within @scope at-rule',
		},
		{
			code: '@scope (.foo) { & .bar { } }',
			description: 'nesting selector with descendant within @scope at-rule',
		},
		{
			code: '.foo { @media screen { & { } } }',
			description: 'nesting selector within @media inside a rule',
		},
		{
			code: '.foo { @supports (color: red) { & { } } }',
			description: 'nesting selector within @supports inside a rule',
		},
		{
			code: '.foo { @layer base { & { } } }',
			description: 'nesting selector within @layer inside a rule',
		},
		{
			code: '.foo { }',
			description: 'regular selector without nesting selector',
		},
		{
			code: 'a { }',
			description: 'type selector without nesting selector',
		},
		{
			code: ':root { }',
			description: 'root selector without nesting selector',
		},
		{
			code: ':host { }',
			description: 'host selector without nesting selector',
		},
		{
			code: '.foo { .bar { & { } } }',
			description: 'nesting selector within deeply nested rule',
		},
		{
			code: '@media screen { .foo { & { } } }',
			description: 'nesting selector within rule inside @media',
		},
		{
			code: '@supports (color: red) { .foo { & { } } }',
			description: 'nesting selector within rule inside @supports',
		},
		{
			code: '@layer base { .foo { & { } } }',
			description: 'nesting selector within rule inside @layer',
		},
	],

	reject: [
		{
			code: '& { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: '& li { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: '& .foo { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: '&.foo { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '&:hover { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '& > .foo { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '& + .foo { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '& ~ .foo { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '@media screen { & { } }',
			message: messages.rejected,
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@supports (color: red) { & { } }',
			message: messages.rejected,
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: '@layer base { & { } }',
			message: messages.rejected,
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '@media screen { & .foo { } }',
			message: messages.rejected,
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@supports (color: red) { &:hover { } }',
			message: messages.rejected,
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: '@layer base { &.foo { } }',
			message: messages.rejected,
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: stripIndent`
				@media screen {
					& .foo { }
				}
			`,
			message: messages.rejected,
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 12,
		},
		{
			code: stripIndent`
				@supports (color: red) {
					& { }
				}
			`,
			message: messages.rejected,
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 7,
		},
		{
			code: stripIndent`
				@layer base {
					&:hover { }
				}
			`,
			message: messages.rejected,
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 13,
		},
		{
			code: stripIndent`
				& { }
				.foo { }
			`,
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: stripIndent`
				.foo { }
				& { }
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 6,
		},
		{
			code: stripIndent`
				@media screen {
					& { }
					.foo { }
				}
			`,
			message: messages.rejected,
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 7,
		},
		{
			code: stripIndent`
				@supports (color: red) {
					.foo { }
					& { }
				}
			`,
			message: messages.rejected,
			line: 3,
			column: 2,
			endLine: 3,
			endColumn: 7,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '.foo { & .bar { } }',
			description: 'nesting selector within a rule (SCSS)',
		},
		{
			code: '@scope (.foo) { & { } }',
			description: 'nesting selector within @scope at-rule (SCSS)',
		},
	],

	reject: [
		{
			code: '& { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: '@media screen { & { } }',
			message: messages.rejected,
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '.foo { & .bar { } }',
			description: 'nesting selector within a rule (Less)',
		},
		{
			code: '@scope (.foo) { & { } }',
			description: 'nesting selector within @scope at-rule (Less)',
		},
	],

	reject: [
		{
			code: '& { }',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: '@media screen { & { } }',
			message: messages.rejected,
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 22,
		},
	],
});
