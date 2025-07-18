/* eslint-disable no-irregular-whitespace */

import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

const IRREGULAR_WHITESPACES = [
	'\u000B', // Line Tabulation (\v) - <VT>
	'\u000C', // Form Feed (\f) - <FF>
	'\u00A0', // No-Break Space - <NBSP>
	'\u0085', // Next Line
	'\u1680', // Ogham Space Mark
	'\u180E', // Mongolian Vowel Separator - <MVS>
	'\uFEFF', // Zero Width No-Break Space - <BOM>
	'\u2000', // En Quad
	'\u2001', // Em Quad
	'\u2002', // En Space - <ENSP>
	'\u2003', // Em Space - <EMSP>
	'\u2004', // Tree-Per-Em
	'\u2005', // Four-Per-Em
	'\u2006', // Six-Per-Em
	'\u2007', // Figure Space
	'\u2008', // Punctuation Space - <PUNCSP>
	'\u2009', // Thin Space
	'\u200A', // Hair Space
	'\u200B', // Zero Width Space - <ZWSP>
	'\u2028', // Line Separator
	'\u2029', // Paragraph Separator
	'\u202F', // Narrow No-Break Space
	'\u205F', // Medium Mathematical Space
	'\u3000', // Ideographic Space
];

const characterToUnicodeString = (str) =>
	`\\u${str.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`;

testRule({
	ruleName,
	config: true,
	accept: [
		{
			code: ' ',
			description: 'regular whitespace',
		},
		{
			code: '\n',
			description: 'new line',
		},
		{
			code: '/* Irregular whitespace\nin multi line comments\nare allowed */',
			description: 'irregular whitespace in multi line comments',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line no-irregular-whitespace */
				 b, /* stylelint-disable-next-line no-irregular-whitespace */
				a b
				/* stylelint-disable-next-line no-irregular-whitespace */
				 
				{}
			`,
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line no-irregular-whitespace */
				 @media
				/* stylelint-disable-next-line no-irregular-whitespace */
				  /* stylelint-disable-next-line no-irregular-whitespace */
				only screen
				{}
			`,
		},
		{
			code: stripIndent`
				.foo {
					/* stylelint-disable-next-line no-irregular-whitespace */
					padding : /* stylelint-disable-next-line no-irregular-whitespace */
					  /* stylelint-disable-next-line no-irregular-whitespace */
					1px 2px
					/* stylelint-disable-next-line no-irregular-whitespace */
					calc(5px + 6px);
				}
			`,
		},
		{
			code: "a { content: '\u00A0'; }",
			description: 'non-breaking space as content value inside declaration',
		},
		{
			code: 'a { content: "foo \t \n  bar"; }',
			description: 'non-breaking space inside a quoted string value in declaration',
		},
		{
			code: '@charset "\u00A0"',
			description: 'non-breaking space within at-rule',
		},
		{
			code: 'a[id="\u00A0"] {}',
			description: 'non-breaking space as attribute in selector',
		},
		{
			code: 'a { animation-name: "foo\u00A0" }',
		},
		{
			code: "a { animation-name: 'ba\u00A0r' }",
		},
		{
			code: "a { font-family: 'Times\u0085New\u00A0\u00A0Roman', serif; }",
		},
		{
			code: '@font-feature-values "foo\u00A0bar"',
		},
		// Generic test for all types of irregular whitespaces.
		...IRREGULAR_WHITESPACES.map((ws) => ({
			code: `a[title="irregular${ws}whitespace"] { color: pink; }`,
			description: `irregular whitespace in attribute selector: ${characterToUnicodeString(ws)}`,
		})),
		{
			code: ':lang("en\u00A0us ")',
		},
		{
			code: ':not([data-id="a\u00A0b"])',
		},
		{
			code: "a[data-x='foo \u00A0  bar'] {}",
		},
		{
			code: ':is(.class[attr="\u00A0a"])',
		},
		{
			code: ':is(input[type="checkbox\u00A0"])',
		},
		{
			code: "a[class='\u00A0foo'] {}",
		},
		{
			code: "a[id='f\u00A0oo'] {}",
		},
		{
			code: '[data-y="foo\tbar"] {}',
		},
		{
			code: 'input[placeholder="foo\u2009bar"] {}',
		},
		{
			code: ':nth-child(" 2n+ 1\u00A0")',
		},
		{
			code: 'a/*foo bar*/[attr="test"] {}',
		},
		{
			code: 'a { /* comment\u00A0*/ color: red; }',
		},
		{
			code: 'a { grid-template-areas: /* "comment " */ none /* " comment " */; }',
		},
		{
			code: 'a { grid-template-areas: /* comment  */ none /*  comment */; }',
		},
		{
			code: 'a { cursor: url("pointer.cur\u00A0"), pointer; }',
		},
		{
			code: '@counter-style custom-list { symbols: "-\u00A0" "◦" "‣"; }',
		},
	],

	reject: [
		{
			code: '@ charset "utf-8"',
			description: 'irregular whitespace in at-charset css rule',
			message: messages.rejected,
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: '@charset  "utf-8"',
			description: 'irregular whitespace after at-charset css rule',
			message: messages.rejected,
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '.firstClass .secondClass { color: pink; }',
			description: 'irregular whitespace in selector',
			message: messages.rejected,
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '.firstClass .secondClass  { color: pink; }',
			description: 'irregular whitespace after selector',
			message: messages.rejected,
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'margin: 1rem 2rem;',
			description: 'irregular whitespace in declaration value',
			message: messages.rejected,
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'margin: 1rem 2rem ;',
			description: 'irregular whitespace after value',
			message: messages.rejected,
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '$variable : 5rem;',
			description: 'irregular whitespace in variable name',
			message: messages.rejected,
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: '@media screen {\f}',
			description: 'irregular whitespace in the after of an at rule',
			message: messages.rejected,
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: '.a {\f}',
			description: 'irregular whitespace in the after of a rule',
			message: messages.rejected,
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: '.a {\f\f}',
			description: 'irregular whitespace in the after of a rule',
			message: messages.rejected,
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: stripIndent`
				/* a comment */
				 b, /* a comment */
				a b
				/* a comment */
				 
				{}
			`,
			warnings: [
				{
					message: messages.rejected,
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 2,
				},
				{
					message: messages.rejected,
					line: 3,
					column: 2,
					endLine: 3,
					endColumn: 3,
				},
				{
					message: messages.rejected,
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 2,
				},
			],
		},
		{
			code: stripIndent`
				/* a comment */
				 @media
				/* a comment */
				  /* a comment */
				only screen
				{}
			`,
			warnings: [
				{
					message: messages.rejected,
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 2,
				},
				{
					message: messages.rejected,
					line: 4,
					column: 1,
					endLine: 4,
					endColumn: 2,
				},
				{
					message: messages.rejected,
					line: 5,
					column: 5,
					endLine: 5,
					endColumn: 6,
				},
			],
		},
		{
			code: stripIndent`
				.foo {
					/* a comment */
					padding : /* a comment */
					  /* a comment */
					1px 2px
					/* a comment */
					calc(5px + 6px);
				}
			`,
			warnings: [
				{
					message: messages.rejected,
					line: 3,
					column: 9,
					endLine: 3,
					endColumn: 10,
				},
				{
					message: messages.rejected,
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 3,
				},
				{
					message: messages.rejected,
					line: 5,
					column: 5,
					endLine: 5,
					endColumn: 6,
				},
				{
					message: messages.rejected,
					line: 7,
					column: 10,
					endLine: 7,
					endColumn: 11,
				},
			],
		},
		{
			code: stripIndent`
				a {
					grid-template:
						"a a a" 40px
						"b c c" 40px
						"b c c" 40px / 1fr 1fr 1fr;
				}
			`,
			warnings: [
				{
					message: messages.rejected,
					line: 3,
					column: 7,
					endLine: 3,
					endColumn: 8,
				},
				{
					message: messages.rejected,
					line: 5,
					column: 5,
					endLine: 5,
					endColumn: 6,
				},
			],
		},
		{
			code: 'a { grid-template-areas: "a\u00A0a" "b b"; }',
			message: messages.rejected,
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { grid: "foo\u00A0" 1fr /* \u00A0comment */ "bar" 1fr; }',
			message: messages.rejected,
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 16,
		},
	],
});
