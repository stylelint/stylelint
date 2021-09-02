'use strict';

const postcssLess = require('postcss-less');
const postcssScss = require('postcss-scss');

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	fix: true,

	accept: [
		{
			code: '.foo { display: flex; }',
		},
		{
			code: '.foo { background: linear-gradient(to top, #000, #fff); }',
		},
		{
			code: '.foo { max-width: max-content; }',
		},
		{
			code: '.foo { -webkit-transform: translate(0, 0); }',
			description: 'ignores property vendor prefixes',
		},
		{
			code: '.foo { -wEbKiT-tRaNsFoRm: translate(0, 0); }',
			description: 'ignores property vendor prefixes',
		},
		{
			code: '.foo { -WEBKIT-TRANSFORM: translate(0, 0); }',
			description: 'ignores property vendor prefixes',
		},
	],

	reject: [
		{
			code: '.foo { display: -webkit-flex; }',
			fixed: '.foo { display: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 17,
		},
		{
			code: '.foo { display: -wEbKiT-fLeX; }',
			fixed: '.foo { display: fLeX; }',
			message: messages.rejected('-wEbKiT-fLeX'),
			line: 1,
			column: 17,
		},
		{
			code: '.foo { display: -WEBKIT-FLEX; }',
			fixed: '.foo { display: FLEX; }',
			message: messages.rejected('-WEBKIT-FLEX'),
			line: 1,
			column: 17,
		},
		{
			code: '.foo { dIsPlAy: -webkit-flex; }',
			fixed: '.foo { dIsPlAy: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 17,
		},
		{
			code: '.foo { DISPLAY: -webkit-flex; }',
			fixed: '.foo { DISPLAY: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 17,
		},
		{
			code: '.foo { color: pink; display: -webkit-flex; }',
			fixed: '.foo { color: pink; display: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 30,
		},
		{
			code: '.foo { display: -webkit-box; }',
			fixed: '.foo { display: box; }',
			message: messages.rejected('-webkit-box'),
			line: 1,
			column: 17,
		},
		{
			code: '.foo { background: -webkit-linear-gradient(bottom, #000, #fff); }',
			fixed: '.foo { background: linear-gradient(bottom, #000, #fff); }',
			message: messages.rejected('-webkit-linear-gradient'),
			line: 1,
			column: 20,
		},
		{
			code: '.foo { max-width: -moz-max-content; }',
			fixed: '.foo { max-width: max-content; }',
			message: messages.rejected('-moz-max-content'),
			line: 1,
			column: 19,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: postcssScss,
	fix: true,

	accept: [
		{
			code: 'a { $margin: -webkit-box; }',
		},
		{
			code: 'a { margin: $variable-webkit-variable; }',
		},
		{
			code: 'a { margin: #{$variable-webkit-variable}; }',
		},
		{
			code: 'a { #{$display}: -webkit-box; }',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: postcssLess,
	fix: true,

	accept: [
		{
			code: '@new-color: -webkit-function(@color, 10%);',
		},
		{
			code: 'a { margin: @variable-webkit-variable; }',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreValues: ['grab', 'max-content', '/^linear-/'] }],
	fix: true,

	accept: [
		{
			code: 'cursor: -webkit-grab;',
		},
		{
			code: '.foo { max-width: -moz-max-content; }',
		},
		{
			code: '.foo { background: -webkit-linear-gradient(bottom, #000, #fff); }',
		},
	],
	reject: [
		{
			code: '.foo { display: -webkit-flex; }',
			fixed: '.foo { display: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 17,
		},
		{
			code: '.foo { display: -wEbKiT-fLeX; }',
			fixed: '.foo { display: fLeX; }',
			message: messages.rejected('-wEbKiT-fLeX'),
			line: 1,
			column: 17,
		},
		{
			code: '.foo { display: -WEBKIT-FLEX; }',
			fixed: '.foo { display: FLEX; }',
			message: messages.rejected('-WEBKIT-FLEX'),
			line: 1,
			column: 17,
		},
	],
});
