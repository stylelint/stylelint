import { stripIndent } from 'common-tags';

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
			code: '@media screen { a { color: red; } }',
		},
		{
			code: '@supports (display: grid) { a { color: red; } }',
		},
		{
			code: '@container (min-width: 768px) { a { color: red; } }',
		},
		{
			code: '@layer base { a { color: red; } }',
		},
		{
			code: stripIndent`
				@keyframes slide {
					0% { opacity: 0; }
					100% { opacity: 1; }
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
					font-family: "MyFont";
					src: url("font.woff");
				}
			`,
		},
		{
			code: stripIndent`
				@media screen {
					@media (min-width: 768px) {
						a { color: red; }
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
			description: 'custom property at root level',
		},
		{
			code: 'color: red;',
			message: messages.rejected,
			line: 1,
			column: 1,
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
			description: 'custom property at root after selector',
		},
		{
			code: stripIndent`
				a { color: blue; }
				margin: 10px;
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			description: 'regular property at root after selector',
		},
		{
			code: stripIndent`
				--foo: red;
				color: blue;
			`,
			warnings: [
				{ message: messages.rejected, line: 1, column: 1 },
				{ message: messages.rejected, line: 2, column: 1 },
			],
			description: 'multiple properties at root level',
		},
		{
			code: stripIndent`
				@import url("styles.css");
				--foo: red;
				a { color: blue; }
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			description: 'custom property at root after import',
		},
		{
			code: stripIndent`
				@import url("styles.css");
				color: red;
				a { color: blue; }
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			description: 'regular property at root after import',
		},
		{
			code: stripIndent`
				--foo: red;
				
				a {
					color: blue;
				}
				
				margin: 10px;
			`,
			warnings: [
				{ message: messages.rejected, line: 1, column: 1 },
				{ message: messages.rejected, line: 7, column: 1 },
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
			description: 'regular property at root after charset',
		},
		{
			code: '@media screen { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: '@supports (display: grid) { margin: 10px; }',
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: '@container (min-width: 768px) { padding: 5px; }',
			message: messages.rejected,
			line: 1,
			column: 33,
		},
		{
			code: '@layer base { font-size: 16px; }',
			message: messages.rejected,
			line: 1,
			column: 15,
		},
		{
			code: '@apply text-red-500 { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 23,
		},
		{
			code: '@scope (main) { margin: 10px; }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: '@starting-style { padding: 5px; }',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: '@document url-prefix("https://") { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 36,
		},
		{
			code: stripIndent`
				@media screen {
					color: red;
					background: blue;
				}
			`,
			warnings: [
				{ message: messages.rejected, line: 2, column: 2 },
				{ message: messages.rejected, line: 3, column: 2 },
			],
		},
		{
			code: stripIndent`
				@supports (display: grid) {
					a { color: red; }
					margin: 10px;
				}
			`,
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: stripIndent`
				@media screen {
					@media (min-width: 768px) {
						color: red;
					}
				}
			`,
			message: messages.rejected,
			line: 3,
			column: 3,
		},
	],
});
