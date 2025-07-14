import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { --foo: red; }',
			description: 'custom property inside a rule',
		},
		{
			code: '.selector { color: red; }',
			description: 'regular property inside a rule',
		},
		{
			code: '@media screen { --custom-prop: red; }',
			description: 'custom property inside an at-rule',
		},
		{
			code: '@container (min-width: 768px) { color: red; }',
			description: 'regular property inside a container at-rule',
		},
		{
			code: '@supports (display: grid) { --custom-prop: red; }',
			description: 'custom property inside a supports at-rule',
		},
		{
			code: ':root { --custom-prop: red; }',
			description: 'custom property inside :root selector',
		},
		{
			code: '@media screen { .selector { --custom-prop: red; } }',
			description: 'custom property nested inside at-rule and selector',
		},
		{
			code: stripIndent`
				@layer base {
					.component { --custom-prop: red; }
				}
			`,
			description: 'custom property inside layer at-rule',
		},
		{
			code: stripIndent`
				@keyframes slide {
					0% { --custom-prop: red; }
					100% { color: blue; }
				}
			`,
			description: 'properties inside keyframes',
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
			description: 'custom property inside page at-rule',
		},
		{
			code: stripIndent`
				.selector {
					--primary-color: red;
					--secondary-color: blue;
					color: var(--primary-color);
				}
			`,
			description: 'multiple properties inside selector',
		},
		{
			code: stripIndent`
				@import url("styles.css");
				.selector { color: red; }
			`,
			description: 'valid at-rule and rule structure',
		},
		{
			code: stripIndent`
				@charset "UTF-8";
				.selector { color: red; }
			`,
			description: 'valid charset and rule structure',
		},
	],

	reject: [
		{
			code: '--custom-prop: red;',
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
				--custom-prop: red;
				.selector { color: blue; }
			`,
			message: messages.rejected,
			line: 1,
			column: 1,
			description: 'custom property at root before selector',
		},
		{
			code: stripIndent`
				color: red;
				.selector { color: blue; }
			`,
			message: messages.rejected,
			line: 1,
			column: 1,
			description: 'regular property at root before selector',
		},
		{
			code: stripIndent`
				.selector { color: blue; }
				--custom-prop: red;
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			description: 'custom property at root after selector',
		},
		{
			code: stripIndent`
				.selector { color: blue; }
				margin: 10px;
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			description: 'regular property at root after selector',
		},
		{
			code: stripIndent`
				--primary-color: red;
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
				--custom-prop: red;
				.selector { color: blue; }
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
				.selector { color: blue; }
			`,
			message: messages.rejected,
			line: 2,
			column: 1,
			description: 'regular property at root after import',
		},
		{
			code: stripIndent`
				--custom-prop: red;
				
				.selector {
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
				--custom-prop: red;
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
	],
});
