'use strict';

const stripIndent = require('common-tags').stripIndent;
const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [true],

	accept: [
		{
			code: 'a { grid-template-areas: "a a a" "b b b"; }',
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
			code: 'a {grid-template-areas: /*comment*/ none /* comment */; }',
		},
		{
			code: 'a {grid-template-areas: /*comment*/ NONE /* comment */; }',
		},
		{
			code: 'a {grid-template-areas: NONE; }',
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
			column: 4,
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
	],
});
