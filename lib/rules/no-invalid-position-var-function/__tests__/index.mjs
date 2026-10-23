import stripIndent from '../../../testUtils/stripIndent.mjs';
import testRule from '../../../testUtils/testRule.mjs';

import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{ code: 'a { color: var(--color); --foo: var(--bar, red); }' },
		{ code: '@media (min-width: 10px) { a { color: var(--color); } }' },
		{ code: 'a { @media (min-width: 10px) { color: var(--color); } }' },
		{ code: '@page { color: var(--color); margin: var(--margin); }' },
		{ code: '@page { @top-center { content: var(--content); } }' },
		{ code: '@foo { bar: var(--color); }' },
		{ code: '@font-face { font-family: "var(--family)"; }' },
		{ code: '@font-face { font-weight: /* var(--weight) */ 400; }' },
		{ code: '@font-face { src: url("var(--font)"); }' },
		{ code: '@font-face { font-weight: env(--weight); }' },
		{ code: '@font-face { font-weight: other-var(--weight); }' },
		{ code: '@media (min-width: 10px) /* var(--width) */ {}' },
		{ code: 'a[data-foo="var(--foo)"] {}' },
		{ code: 'a { content: "var(--foo)"; }' },
	],

	reject: [
		{
			code: '@font-face { font-weight: var(--weight); }',
			message: messages.rejected,
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: '@counter-style foo { symbols: var(--symbol); }',
			message: messages.rejected,
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 44,
		},
		{
			code: '@property --foo { initial-value: var(--color); }',
			message: messages.rejected,
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: '@font-palette-values --foo { base-palette: var(--palette); }',
			message: messages.rejected,
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 58,
		},
		{
			code: '@font-feature-values foo { @styleset { bar: var(--foo); } }',
			message: messages.rejected,
			line: 1,
			column: 45,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: '@page { size: var(--size); }',
			message: messages.rejected,
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '@page { page-orientation: var(--orientation); }',
			message: messages.rejected,
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: '@media (min-width: var(--width)) {}',
			message: messages.rejected,
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a:has(var(--foo)) {}',
			message: messages.rejected,
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'var(--foo) {}',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a > var(--foo) {}',
			message: messages.rejected,
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { var(--foo): red; }',
			message: messages.rejected,
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@font-face { font-weight: calc(var(--weight) + 1); }',
			message: messages.rejected,
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: '@font-face { font-weight: VAR(--weight); }',
			message: messages.rejected,
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: stripIndent`
				@font-face {
				  font-weight: var(--weight);
				}
			`,
			message: messages.rejected,
			line: 2,
			column: 16,
			endLine: 2,
			endColumn: 29,
		},
		{
			code: '@font-face { font-weight: var(--foo); font-style: var(--bar); }',
			warnings: [
				{ message: messages.rejected, line: 1, column: 27, endLine: 1, endColumn: 37 },
				{ message: messages.rejected, line: 1, column: 51, endLine: 1, endColumn: 61 },
			],
		},
		{
			code: '@font-face { font-weight: var(--foo, var(--bar)); }',
			warnings: [
				{ message: messages.rejected, line: 1, column: 27, endLine: 1, endColumn: 49 },
				{ message: messages.rejected, line: 1, column: 38, endLine: 1, endColumn: 48 },
			],
		},
	],
});
