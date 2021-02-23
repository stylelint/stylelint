'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [true],

	accept: [
		{
			code: 'div { grid-template-areas: "a a a" "b b b"; }',
		},
		{
			code: `div { grid-template-areas: "head head"
"nav  main"
"nav  foot";}`,
		},
		{
			code: 'div { grid-template-areas: none; }',
		},
	],

	reject: [
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
			code: `div { grid-template-areas: "header header header header"
"main main . sidebar"
"footer footer footer header"; }`,
			message: messages.notContiguousOrRectangular(['header']),
			line: 1,
			column: 7,
		},
		{
			code: 'div { grid-template-areas: ""; }',
			message: messages.noRows(),
			line: 1,
			column: 7,
		},
	],
});
