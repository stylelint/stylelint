'use strict';

const stripIndent = require('common-tags').stripIndent;
const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [true],

	accept: [
		{
			code: 'a { grid-template-areas: 1fr / auto 1fr auto; }',
		},
		{
			code: 'a { grid-template-areas: "a a a" "b b b"; }',
		},
		{
			code: 'a { GRID-TEMPLATE-AREAS: "a a a" "b b b"; }',
		},
		{
			code: stripIndent`
				a {
					grid-template-areas: "head head"
						"nav  main"
						"nav  foot";
				}`,
		},
		{
			code: stripIndent`
				a {
					grid-template-areas:
						/* "" */ "head head"
						"nav  main" /* "a b c" */
						"nav  foot" /* "" */;
				}`,
		},
		{
			code: 'a { grid-template-areas: none; }',
		},
		{
			code: 'a { grid-template-areas:    none; }',
		},
		{
			code: 'a { grid-template-areas: /*comment*/ none /* comment */; }',
		},
		{
			code: 'a { grid-template-areas: /*comment*/ NONE /* comment */; }',
		},
		{
			code: 'a { grid-template-areas: NONE; }',
		},
		{
			code: 'a { grid-template-areas: /* comment "" " */ none; }',
		},
		{
			code: stripIndent`
				a {
					grid-template-areas: /* "comment" */ none /* "comment " */;
				}`,
		},
		{
			code: stripIndent`
				a {
					grid-template:
						"a a a" 40px
						"b c c" 40px
						"b c c" 40px / 1fr 1fr 1fr;
				}`,
		},
	],

	reject: [
		{
			code: 'a { grid-template-areas: "a a a" "b b"; }',
			message: messages.expectedSameNumber(),
			line: 1,
			column: 26,
		},
		{
			code: 'a { grid-template-areas: "a a a" "b b a"; }',
			message: messages.expectedRectangle('a'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { grid-template-areas: "a c a" "c b a"; }',
			warnings: [
				{ message: messages.expectedRectangle('a'), line: 1, column: 26 },
				{ message: messages.expectedRectangle('c'), line: 1, column: 26 },
			],
		},
		{
			code: stripIndent`
			  a {
					grid-template-areas: "header header header header"
						"main main . sidebar"
						"footer footer footer header";
				}`,
			message: messages.expectedRectangle('header'),
			line: 2,
			column: 23,
		},
		{
			code: 'a { grid-template-areas: ""; }',
			message: messages.expectedToken(),
			line: 1,
			column: 26,
		},
		{
			code: 'a { grid-template-areas: /* "comment" */ ""; }',
			message: messages.expectedToken(),
			line: 1,
			column: 42,
		},
		{
			code: stripIndent`
				a { grid-template-areas:
					"";
				}`,
			message: messages.expectedToken(),
			line: 2,
			column: 2,
		},
		{
			code: 'a { grid-template-areas: "" "" ""; }',
			warnings: [
				{ message: messages.expectedToken(), line: 1, column: 26 },
				{ message: messages.expectedToken(), line: 1, column: 29 },
				{ message: messages.expectedToken(), line: 1, column: 32 },
			],
		},
		{
			code: stripIndent`
				a {
					grid-template-areas: /* none */
 						"" /* none */;
				}`,
			message: messages.expectedToken(),
			line: 3,
			column: 4,
		},
		{
			code: 'a { GRID-TEMPLATE-AREAS: ""; }',
			message: messages.expectedToken(),
			line: 1,
			column: 26,
		},
		{
			code: stripIndent`
				a {
					grid-template:
						"a a" 40px
						"b c c" 40px
						"b c c" 40px / 1fr 1fr 1fr;
				}`,
			message: messages.expectedSameNumber(),
			line: 3,
			column: 3,
		},
		{
			code: `a { grid: "" 200px "b" min-content; }`,
			message: messages.expectedToken(),
			line: 1,
			column: 11,
		},
	],
});
