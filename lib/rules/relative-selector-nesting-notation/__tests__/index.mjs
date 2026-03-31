import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['explicit'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {}',
			description: 'non-nested rule',
		},
		{
			code: '@media all { a {} }',
			description: 'rule in at-rule',
		},
		{
			code: 'a { & a {} }',
			description: 'explicit nesting with descendant combinator',
		},
		{
			code: 'a { & > a {} }',
			description: 'explicit nesting with child combinator',
		},
		{
			code: 'a { &:hover {} }',
			description: 'nesting with pseudo-class',
		},
		{
			code: 'a { &.foo {} }',
			description: 'nesting with class',
		},
		{
			code: 'a { :not(&) {} }',
			description: 'nesting in pseudo-class',
		},
		{
			code: 'a { a & {} }',
			description: 'nesting selector as parent',
		},
		{
			code: 'a { & /* foo */ a, .bar /* baz */ & {} }',
			description: 'nesting selector in list with comment',
		},
		{
			code: 'a { /* bar */ & a, /* baz */ .foo & {} }',
			description: 'nesting selector in list with starting comments',
		},
		{
			code: stripIndent`
				.a {
					& .foo {
						& > #bar {}
					}
				}
			`,
			description: 'multiple levels of explicit nesting',
		},
	],

	reject: [
		{
			code: 'a { a {} }',
			fixed: 'a { & a {} }',
			message: messages.expected('explicit'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 6,
			fix: {
				range: [4, 5],
				text: '& a',
			},
		},
		{
			code: 'a { > a {} }',
			fixed: 'a { & > a {} }',
			message: messages.expected('explicit'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 8,
			fix: {
				range: [4, 5],
				text: '& >',
			},
		},
		{
			code: 'a { [foo] {} }',
			fixed: 'a { & [foo] {} }',
			message: messages.expected('explicit'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
			fix: {
				range: [4, 5],
				text: '& [',
			},
		},
		{
			code: 'a { + a & {} }',
			fixed: 'a { & + a & {} }',
			description: 'nesting as parent and implicit inital & before combinator',
			message: messages.expected('explicit'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
			fix: {
				range: [4, 5],
				text: '& +',
			},
		},
		{
			code: 'a { @media all { a {} } }',
			fixed: 'a { @media all { & a {} } }',
			description: 'nesting in media query',
			message: messages.expected('explicit'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
			fix: {
				range: [17, 18],
				text: '& a',
			},
		},
		{
			code: 'a { ~ /* foo */ a {} }',
			fixed: 'a { & ~ /* foo */ a {} }',
			description: 'comment in selector',
			message: messages.expected('explicit'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
			fix: {
				range: [4, 5],
				text: '& ~',
			},
		},
		{
			code: 'a { > .foo, /* bar */ + .baz {} }',
			fixed: 'a { & > .foo, /* bar */ & + .baz {} }',
			description: 'selector list with comments ',
			warnings: [
				{
					message: messages.expected('explicit'),
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 11,
					fix: {
						range: [4, 5],
						text: '& >',
					},
				},
				{
					message: messages.expected('explicit'),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: stripIndent`
				a {
					>  .foo {}
					+
					.bar {}
				}
			`,
			fixed: stripIndent`
				a {
					& >  .foo {}
					& +
					.bar {}
				}
			`,
			description: 'extra spacing in selector',
			warnings: [
				{
					message: messages.expected('explicit'),
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 9,
					fix: {
						range: [5, 6],
						text: '& >',
					},
				},
				{
					message: messages.expected('explicit'),
					line: 3,
					column: 2,
					endLine: 4,
					endColumn: 6,
					fix: {
						range: [17, 18],
						text: '& +',
					},
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['implicit'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {}',
			description: 'non-nested rule',
		},
		{
			code: 'a { a {} }',
			description: 'nested rule with implied descendant combinator',
		},
		{
			code: 'a { > a {} }',
			description: 'implicit nesting with child combinator',
		},
		{
			code: 'a { &:hover {} }',
			description: 'nesting with pseudo-class (& required)',
		},
		{
			code: 'a { &.foo {} }',
			description: 'nesting with class (& required)',
		},
		{
			code: 'a { :not(&) {} }',
			description: 'nesting in pseudo-class',
		},
		{
			code: 'a { [foo] {} }',
			description: 'nesting in attribute selector',
		},
		{
			code: 'a { a & {} }',
			description: 'nesting selector as parent',
		},
		{
			code: 'a { + a & {} }',
			description: 'nesting selector as parent and implied initial &',
		},
		{
			code: 'a { a, .foo /* bar */ {} }',
			description: 'nesting selector in list with comment',
		},
		{
			code: 'a { /* bar */ a, /* baz */ .foo {} }',
			description: 'nesting selector in list with starting comments',
		},
	],

	reject: [
		{
			code: 'a { & a {} }',
			fixed: 'a { a {} }',
			message: messages.expected('implicit'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 8,
			fix: {
				range: [4, 6],
				text: '',
			},
		},
		{
			code: 'a { & > a {} }',
			fixed: 'a { > a {} }',
			message: messages.expected('implicit'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
			fix: {
				range: [4, 6],
				text: '',
			},
		},
		{
			code: 'a { & > a & {} }',
			fixed: 'a { > a & {} }',
			message: messages.expected('implicit'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
			fix: {
				range: [4, 6],
				text: '',
			},
		},
		{
			code: 'a { & .foo, /* bar */ & .baz {} }',
			fixed: 'a { .foo, /* bar */ .baz {} }',
			warnings: [
				{
					message: messages.expected('implicit'),
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 11,
					fix: {
						range: [4, 6],
						text: '',
					},
				},
				{
					message: messages.expected('implicit'),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: stripIndent`
				a {
					& .foo {}
					& .bar {}
				}
			`,
			fixed: stripIndent`
				a {
					.foo {}
					.bar {}
				}
			`,
			warnings: [
				{
					message: messages.expected('implicit'),
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 8,
					fix: {
						range: [5, 7],
						text: '',
					},
				},
				{
					message: messages.expected('implicit'),
					line: 3,
					column: 2,
					endLine: 3,
					endColumn: 8,
					fix: {
						range: [16, 18],
						text: '',
					},
				},
			],
		},
	],
});
