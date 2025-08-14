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
			code: 'a { color: red; }',
			description: 'non-nested rule',
		},
		{
			code: 'a { b { color: red; } }',
			description: 'nested rule without combinator',
		},
		{
			code: 'a { & b { color: red; } }',
			description: 'explicit nesting with descendant combinator',
		},
		{
			code: 'a { & > b { color: red; } }',
			description: 'explicit nesting with child combinator',
		},
		{
			code: 'a { & + b { color: red; } }',
			description: 'explicit nesting with adjacent sibling combinator',
		},
		{
			code: 'a { & ~ b { color: red; } }',
			description: 'explicit nesting with general sibling combinator',
		},
		{
			code: 'a { &:hover { color: red; } }',
			description: 'nesting with pseudo-class',
		},
		{
			code: 'a { &.class { color: red; } }',
			description: 'nesting with class',
		},
		{
			code: 'a { &#id { color: red; } }',
			description: 'nesting with id',
		},
		{
			code: stripIndent`
				.parent {
					& .child {
						color: red;
						& > .grandchild {
							color: blue;
						}
					}
				}
			`,
			description: 'multiple levels of explicit nesting',
		},
	],

	reject: [
		{
			code: 'a { > b { color: red; } }',
			fixed: 'a { & > b { color: red; } }',
			message: messages.expected('> b', '& > b'),
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
			code: 'a { + b { color: red; } }',
			fixed: 'a { & + b { color: red; } }',
			message: messages.expected('+ b', '& + b'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 8,
			fix: {
				range: [4, 5],
				text: '& +',
			},
		},
		{
			code: 'a { ~ b { color: red; } }',
			fixed: 'a { & ~ b { color: red; } }',
			message: messages.expected('~ b', '& ~ b'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 8,
			fix: {
				range: [4, 5],
				text: '& ~',
			},
		},
		{
			code: stripIndent`
				.parent {
					> .child {
						color: red;
					}
					+ .sibling {
						color: blue;
					}
				}
			`,
			fixed: stripIndent`
				.parent {
					& > .child {
						color: red;
					}
					& + .sibling {
						color: blue;
					}
				}
			`,
			warnings: [
				{
					message: messages.expected('> .child', '& > .child'),
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 10,
					fix: {
						range: [11, 12],
						text: '& >',
					},
				},
				{
					message: messages.expected('+ .sibling', '& + .sibling'),
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 12,
					fix: {
						range: [40, 41],
						text: '& +',
					},
				},
			],
		},
		{
			code: '.parent { > .child, + .sibling { color: red; } }',
			fixed: '.parent { & > .child, & + .sibling { color: red; } }',
			warnings: [
				{
					message: messages.expected('> .child, + .sibling', '& > .child, & + .sibling'),
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 19,
					fix: {
						range: [10, 19],
						text: '& > .child, &',
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
			code: 'a { color: red; }',
			description: 'non-nested rule',
		},
		{
			code: 'a { b { color: red; } }',
			description: 'nested rule without combinator',
		},
		{
			code: 'a { > b { color: red; } }',
			description: 'implicit nesting with child combinator',
		},
		{
			code: 'a { + b { color: red; } }',
			description: 'implicit nesting with adjacent sibling combinator',
		},
		{
			code: 'a { ~ b { color: red; } }',
			description: 'implicit nesting with general sibling combinator',
		},
		{
			code: 'a { &:hover { color: red; } }',
			description: 'nesting with pseudo-class (& required)',
		},
		{
			code: 'a { &.class { color: red; } }',
			description: 'nesting with class (& required)',
		},
		{
			code: 'a { &#id { color: red; } }',
			description: 'nesting with id (& required)',
		},
		// note: `& > b` is unnecessary under "implicit" and should be rejected
		{
			code: stripIndent`
				.parent {
					.child {
						color: red;
						> .grandchild {
							color: blue;
						}
					}
				}
			`,
			description: 'multiple levels of implicit nesting',
		},
	],

	reject: [
		{
			code: 'a { & > b { color: red; } }',
			fixed: 'a { > b { color: red; } }',
			message: messages.expected('& > b', '> b'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 7,
			fix: {
				range: [4, 6],
				text: '',
			},
		},
		{
			code: 'a { & + b { color: red; } }',
			fixed: 'a { + b { color: red; } }',
			message: messages.expected('& + b', '+ b'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 7,
			fix: {
				range: [4, 6],
				text: '',
			},
		},
		{
			code: 'a { & ~ b { color: red; } }',
			fixed: 'a { ~ b { color: red; } }',
			message: messages.expected('& ~ b', '~ b'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 7,
			fix: {
				range: [4, 6],
				text: '',
			},
		},
		{
			code: 'a { & b { color: red; } }',
			fixed: 'a { b { color: red; } }',
			message: messages.expected('& b', 'b'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 7,
			fix: {
				range: [4, 6],
				text: '',
			},
		},
		{
			code: stripIndent`
				.parent {
					& .child {
						color: red;
					}
					& .other {
						color: blue;
					}
				}
			`,
			fixed: stripIndent`
				.parent {
					.child {
						color: red;
					}
					.other {
						color: blue;
					}
				}
			`,
			warnings: [
				{
					message: messages.expected('& .child', '.child'),
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 4,
					fix: {
						range: [11, 13],
						text: '',
					},
				},
				{
					message: messages.expected('& .other', '.other'),
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 4,
					fix: {
						range: [40, 42],
						text: '',
					},
				},
			],
		},
		{
			code: '.parent { & .child, & .sibling { color: red; } }',
			fixed: '.parent { .child, .sibling { color: red; } }',
			warnings: [
				{
					message: messages.expected('& .child, & .sibling', '.child, .sibling'),
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 13,
					fix: {
						range: [10, 21],
						text: '.child,',
					},
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['invalid'],

	reject: [
		{
			code: 'a { color: red; }',
			message: 'Invalid option value "invalid" for rule "selector-nesting-notation"',
		},
	],
});

// Test edge cases and complex scenarios
testRule({
	ruleName,
	config: ['explicit'],
	fix: true,
	accept: [
		{
			code: 'a { @media screen { > b { color: red; } } }',
			description: 'nested media query - should not be affected',
		},
		{
			code: 'a { /* comment */ & > b { color: red; } }',
			description: 'selector with comment',
		},
	],

	reject: [
		{
			code: '@media screen { a { > b { color: red; } } }',
			fixed: '@media screen { a { & > b { color: red; } } }',
			message: messages.expected('> b', '& > b'),
		},
		{
			code: '@media screen { a { b { > c { color: red; } } } }',
			fixed: '@media screen { a { b { & > c { color: red; } } } }',
			message: messages.expected('> c', '& > c'),
		},
	],
});

testRule({
	ruleName,
	config: ['implicit'],
	fix: true,
	accept: [
		{
			code: '@media screen { a { > b { color: red; } } }',
			description: 'nested rule with combinator in media query',
		},
		{
			code: '@media screen { a { b { > c { color: red; } } } }',
			description: 'multiple levels of nesting in media query',
		},
	],

	reject: [
		{
			code: '@media screen { a { b { & c { color: red; } } } }',
			fixed: '@media screen { a { b { c { color: red; } } } }',
			message: messages.expected('& c', 'c'),
		},
	],
});
