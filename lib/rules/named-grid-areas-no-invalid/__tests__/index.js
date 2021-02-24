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
				div { 
					grid-template-areas: "head head"
					                     "nav  main"
															 "nav  foot";
				}`,
		},
		{
			code: stripIndent`
				div { 
					grid-template-areas: 
						/* "" */ "head head"
						"nav  main" /* "a b c" */
						"nav  foot" /* "" */;
				}`,
		},
		{
			code: 'div { grid-template-areas: none; }',
		},
		{
			code: 'div { grid-template-areas:    none; }',
		},
		{
			code: 'div { grid-template-areas: /* comment "" " */ none; }',
		},
		{
			code: stripIndent`
			div { 
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
			column: 28,
		},
		{
			code: 'div { grid-template-areas: "a a a" "b b"; }',
			message: messages.notRectangular(),
			line: 1,
			column: 7,
		},
		{
			code: 'div { grid-template-areas: "a a a" "b b a"; }',
			message: messages.notContiguousOrRectangular(['a']),
			line: 1,
			column: 7,
		},
		{
			code: stripIndent`
			  div { 
					grid-template-areas: "header header header header"
                               "main main . sidebar"
                               "footer footer footer header"; 
				}`,
			message: messages.notContiguousOrRectangular(['header']),
			line: 2,
			column: 2,
		},
		{
			code: 'div { grid-template-areas: ""; }',
			message: messages.noEmptyRows(),
			line: 1,
			column: 28,
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
			column: 6,
		},
	],
});
