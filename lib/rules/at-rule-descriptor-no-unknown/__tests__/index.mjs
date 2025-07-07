import rule from '../index.mjs';
import { stripIndent } from 'common-tags';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { unknown: 0; }',
			description: 'ignore normal properties',
		},
		{
			code: '@counter-style foo { system: cyclic; symbols: url(bar.svg); suffix: " "; }',
		},
		{
			code: '@property --foo { syntax: "<integer>"; inherits: false; initial-value: 0; }',
		},
		{
			code: '@view-transition { navigation: auto; }',
		},
		{
			code: '@foo { bar: 0 }',
		},
		{
			code: '@media (width > 400px) { a { color: red; } }',
		},
		{
			code: 'a { @media (width > 400px) { color: red; } }',
		},
		{
			code: '@page { size: landscape; }',
			description: 'known descriptor in @page',
		},
		{
			code: '@page { color: red; }',
			description: 'known page context property in @page',
		},
		{
			code: '@page { @top-center { content: "foo"; } }',
			description: 'known margin context property within margin at-rule',
		},
	],

	reject: [
		{
			code: '@counter-style foo { bar: 0; }',
			message: messages.rejected('@counter-style', 'bar'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '@property --foo { bar: 0; }',
			message: messages.rejected('@property', 'bar'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@property --foo { bar: 0; baz: 0; }',
			warnings: [
				{
					message: messages.rejected('@property', 'bar'),
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 22,
				},
				{
					message: messages.rejected('@property', 'baz'),
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 30,
				},
			],
			description: 'multiple unknown descriptors in @property',
		},
		{
			code: '@property --foo { system: cyclic; }',
			message: messages.rejected('@property', 'system'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 25,
			description: 'a descriptor known for another at-rule but not @property',
		},
		{
			code: '@position-try --foo { @supports (bar: 0) { bar: 0 } }',
			message: messages.rejected('@position-try', 'bar'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 47,
			description: 'an unknown descriptor in a nested at-rule',
		},

		{
			code: '@page { bar: 0; }',
			message: messages.rejected('@page', 'bar'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 12,
			description: 'an unknown descriptor or page context property in @page',
		},
		{
			code: '@page { margin-block: 2px 1px; }',
			message: messages.rejected('@page', 'margin-block'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 21,
			description: 'an unknown logical margin property in @page',
		},
		{
			code: '@page { content: "foo"; }',
			message: messages.rejected('@page', 'content'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
			description: 'a margin context property in @page',
		},
		{
			code: '@page { @top-center { bar: 0; } }',
			message: messages.rejected('@page', 'bar'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 26,
			description: 'an unknown descriptor or margin context property in a margin at-rule',
		},
		{
			code: '@page { foo: 0; @top-center { bar: 0; } }',
			warnings: [
				{
					message: messages.rejected('@page', 'foo'),
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					message: messages.rejected('@page', 'bar'),
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 34,
				},
			],
		},
		{
			code: stripIndent`
				@mixin --qux-baz(@contents) {
					@supports (overflow-anchor: auto) {
						@contents;
					}
				}

				body {
					@apply --qux-baz {
						@font-face {
						  foo: normal;
						}
					}
				}
			`,
			message: messages.rejected('@font-face', 'foo'),
			line: 10,
			column: 5,
			endLine: 10,
			endColumn: 8,
			description: 'without indirection',
		},
		{
			code: stripIndent`
				@mixin --qux-baz(@contents) {
					@supports (overflow-anchor: auto) {
						@font-face {
							@contents;
						}
					}
				}

				body {
					@apply --qux-baz {
						foo: normal;
					}
				}
			`,
			message: messages.rejected('@font-face', 'foo'),
			line: 11,
			column: 3,
			endLine: 11,
			endColumn: 6,
			description: 'with indirection',
			// TODO: unskip once we support @mixin indirection
			skip: true,
		},
	],
});
