import { stripIndent } from 'common-tags';

import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.cjs';
import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { --foo: red; }',
		},
		{
			code: ':root { --foo: red; }',
		},
		{
			code: '@media all { a { color: red; } }',
		},
		{
			code: '@supports (color: red) { a { color: red; } }',
		},
		{
			code: '@container (width > 10em) { a { color: red; } }',
		},
		{
			code: '@layer { a { color: red; } }',
		},
		{
			code: 'a { @apply --foo { color: red; } }',
		},
		{
			code: stripIndent`
				@keyframes foo {
					0% { color: red; }
				}
			`,
		},
		{
			code: stripIndent`
				@page {
					size: 11in;
					@top-right {
						content: "foo";
					}
				}
			`,
		},
		{
			code: stripIndent`
				@font-face {
					font-family: "foo";
					src: url("bar.woff");
				}
			`,
		},
		{
			code: stripIndent`
				@media all {
					@supports (color: red) {
						a { color: red; }
					}
				}
			`,
		},
		{
			code: stripIndent`
				a {
					@media all {
						color: red;
					}
				}
			`,
		},
	],

	reject: [
		{
			code: '--foo: red;',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
			description: 'custom property at root level',
		},
		{
			code: 'color: red;',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
			description: 'regular property at root level',
		},
		{
			code: stripIndent`
				--foo: red;
				a { color: blue; }
			`,
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
			description: 'custom property at root before selector',
		},
		{
			code: stripIndent`
				color: red;
				a { color: blue; }
			`,
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
			description: 'regular property at root before selector',
		},
		{
			code: stripIndent`
				a { color: blue; }
				--foo: red;
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 12,
			description: 'custom property at root after selector',
		},
		{
			code: stripIndent`
				a { color: blue; }
				color: red;
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 12,
			description: 'regular property at root after selector',
		},
		{
			code: stripIndent`
				--foo: red;
				color: blue;
			`,
			warnings: [
				{ message: messages.rejected, line: 1, column: 1, endLine: 1, endColumn: 12 },
				{ message: messages.rejected, line: 2, column: 1, endLine: 2, endColumn: 13 },
			],
			description: 'multiple properties at root level',
		},
		{
			code: stripIndent`
				@import url("foo.css");
				--foo: red;
				a { color: blue; }
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 12,
			description: 'custom property at root after import',
		},
		{
			code: stripIndent`
				@import url("foo.css");
				color: red;
				a { color: blue; }
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 12,
			description: 'regular property at root after import',
		},
		{
			code: stripIndent`
				--foo: red;

				a {
					color: blue;
				}

				color: pink;
			`,
			warnings: [
				{ message: messages.rejected, line: 1, column: 1, endLine: 1, endColumn: 12 },
				{ message: messages.rejected, line: 7, column: 1, endLine: 7, endColumn: 13 },
			],
			description: 'properties at root before and after selector',
		},
		{
			code: stripIndent`
				/* Comment */
				--foo: red;
				/* Another comment */
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 12,
			description: 'custom property at root with comments',
		},
		{
			code: stripIndent`
				@charset "UTF-8";
				color: red;
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 12,
			description: 'regular property at root after charset',
		},
		{
			code: '@media all { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '@supports (color: red) { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: '@container (width > 10em) { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: '@layer { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '@apply --foo { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@scope (a) { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '@starting-style { color:red; }',
			message: messages.rejected,
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: stripIndent`
				@media all {
					color: red;
					color: blue;
				}
			`,
			warnings: [
				{ message: messages.rejected, line: 2, column: 2, endLine: 2, endColumn: 13 },
				{ message: messages.rejected, line: 3, column: 2, endLine: 3, endColumn: 14 },
			],
		},
		{
			code: stripIndent`
				@supports (color: red) {
					a { color: red; }
					color: blue;
				}
			`,
			message: messages.rejected,
			line: 3,
			column: 2,
			endLine: 3,
			endColumn: 14,
		},
		{
			code: stripIndent`
				@media all {
					@supports (color: red) {
						color: red;
					}
				}
			`,
			message: messages.rejected,
			line: 3,
			column: 3,
			endLine: 3,
			endColumn: 14,
		},
	],
});

testRule({
	ruleName,
	config: true,
	customSyntax: 'postcss-html',
	accept: [
		{
			code: '<a style="color: red"></a>',
			description: 'HTML style attribute',
		},
	],
	reject: [
		{
			skip: true,
			code: '<style>color: red</style>',
			message: messages.rejected,
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,
	config: true,
	customSyntax: naiveCssInJs,
	accept: [
		{
			code: 'css` color: red; `;',
			description: 'CSS-in-JS template literal',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: ['--foo', '/^--bar-/'] }],

	accept: [
		{
			code: '@--foo { @media all { color: red; } }',
		},
		{
			code: '@--bar-baz qux { @media all { color: red; } }',
		},
	],

	reject: [
		{
			code: '@foo { @media all { color: red; } }',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: '@--bar { @media all { color: red; } }',
			message: messages.rejected,
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 34,
		},
	],
});
