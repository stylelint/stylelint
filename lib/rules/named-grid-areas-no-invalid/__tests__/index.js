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
			code: 'a { grid-template-areas: foo "a a a" bar "b b b" baz; }',
			warnings: [
				{ message: messages.noInvalidSymbols('foo'), line: 1, column: 26 },
				{ message: messages.noInvalidSymbols('bar'), line: 1, column: 38 },
				{ message: messages.noInvalidSymbols('baz'), line: 1, column: 50 },
			],
		},
		{
			code: stripIndent`
				a { 
					grid-template-areas: "a a a"
						foo
						"b b b";
				}`,
			message: messages.noInvalidSymbols('foo'),
			line: 3,
			column: 3,
		},
		{
			code: 'a { grid-template-areas: "a a a" "b b"; }',
			message: messages.notRectangular(),
			line: 1,
			column: 5,
		},
		{
			code: 'a { grid-template-areas: "a a a" "b b a"; }',
			message: messages.notContiguousOrRectangular(['a']),
			line: 1,
			column: 5,
		},
		{
			code: 'a { grid-template-areas: "a c a" "c b a"; }',
			message: messages.notContiguousOrRectangular(['a', 'c']),
			line: 1,
			column: 5,
		},
		{
			code: stripIndent`
			  a { 
					grid-template-areas: "header header header header"
						"main main . sidebar"
						"footer footer footer header"; 
				}`,
			message: messages.notContiguousOrRectangular(['header']),
			line: 2,
			column: 2,
		},
		{
			code: 'a { grid-template-areas: ""; }',
			message: messages.noEmptyRows(),
			line: 1,
			column: 26,
		},
		{
			code: 'a { grid-template-areas: /* "comment" */ ""; }',
			message: messages.noEmptyRows(),
			line: 1,
			column: 42,
		},
		{
			code: stripIndent`
				a { grid-template-areas: 
			   	""; 
				}`,
			message: messages.noEmptyRows(),
			line: 2,
			column: 4,
		},
		{
			code: 'a { grid-template-areas: "" "" ""; }',
			warnings: [
				{ message: messages.noEmptyRows(), line: 1, column: 26 },
				{ message: messages.noEmptyRows(), line: 1, column: 29 },
				{ message: messages.noEmptyRows(), line: 1, column: 32 },
			],
		},
		{
			code: stripIndent`
				a { 
					grid-template-areas: /* none */
 						"" /* none */; 
				}`,
			message: messages.noEmptyRows(),
			line: 3,
			column: 4,
		},
	],
});
