'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,
	accept: [
		{
			code: 'a { margin: 0; }',
			description: 'plain zero',
		},
		{
			code: 'a { line-height: 2; }',
			description: 'plain integer',
		},
		{
			code: 'a { margin: 2px; }',
			description: 'integer with units',
		},
		{
			code: 'a { line-height: 0.5; }',
			description: 'unitless fractional value with leading zero',
		},
		{
			code: 'a { line-height: -0.5; }',
			description: 'negative unitless fractional value with leading zero',
		},
		{
			code: 'a { margin: 0.5px; }',
			description: 'fractional value with `px` units with leading zero',
		},
		{
			code: 'a { margin: 0.5em; }',
			description: 'fractional value with `em` units with leading zero',
		},
		{
			code: 'a { line-height: 1.5; }',
			description: 'unitless fractional value greater than 1',
		},
		{
			code: 'a { margin: 1.5px; }',
			description: 'fractional value greater than 1 with units',
		},
		{
			code: 'a { line-height: 10.5; }',
			description: 'unitless fractional value greater than 1 with a zero before the decimal',
		},
		{
			code: 'a { margin: 10.5px; }',
			description: 'fractional value greater than 1 with a zero before the decimal and units',
		},
		{
			code: 'a { margin: 0.3em 0.123px 0.999999px; }',
			description: 'multiple fractional values with leading zeros',
		},
		{
			code: 'a { transform: translate(0.4px, 0.8px); }',
			description: 'multiple fractional values with leading zeros in a function',
		},
		{
			code: '@media (min-width: 0.01em)',
			description: 'media feature',
		},
		{
			code: 'a { background: url(data:image/svg+xml;...0.5); }',
			description: 'data URI containing leading zero',
		},
		{
			code: 'a { background: uRl(data:image/svg+xml;...0.5); }',
			description: 'data URI containing leading zero',
		},
		{
			code: 'a { background: URL(data:image/svg+xml;...0.5); }',
			description: 'data URI containing leading zero',
		},
		{
			code: "@import 'testfile.0.3.css'",
			description: 'ignore @import at-rules',
		},
		{
			code: "@iMpOrT 'testfile.0.3.css'",
			description: 'ignore @import at-rules',
		},
		{
			code: "@IMPORT 'testfile.0.3.css'",
			description: 'ignore @import at-rules',
		},
		{
			code: 'a { margin: 0.5em /*.6em*/ 0.7em; }',
			description: 'should ignore comments',
		},
		{
			code: 'a::before { content: ".9em"; }',
			description: 'should ignore strings',
		},
		{
			code: 'a { my-string: ".1"; }',
			description: "ignore all strings rather than only in 'content'",
		},
	],

	reject: [
		{
			code: 'a { line-height: .5; }',
			fixed: 'a { line-height: 0.5; }',
			description: 'unitless fractional value without leading zero',
			message: messages.expected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { line-height: -.5; }',
			fixed: 'a { line-height: -0.5; }',
			description: 'negative unitless fractional value without leading zero',
			message: messages.expected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { margin: .5px; }',
			fixed: 'a { margin: 0.5px; }',
			description: 'fractional value with units without leading zero',
			message: messages.expected,
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px .5px; }',
			fixed: 'a { margin: 1px 0.5px; }',
			description: 'fractional value without leading zero in the middle of a list',
			message: messages.expected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { transform: translate(.4px, 2px); }',
			fixed: 'a { transform: translate(0.4px, 2px); }',
			description: 'fractional value without leading zero at the beginning  of a function',
			message: messages.expected,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(2px, .4px); }',
			fixed: 'a { transform: translate(2px, 0.4px); }',
			description: 'fractional value without leading zero in the middle of a function',
			message: messages.expected,
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: translate(.4px, .8px); }',
			fixed: 'a { transform: translate(0.4px, 0.8px); }',
			description: 'multiple fractional values without leading zeros in a function',
			warnings: [
				{
					message: messages.expected,
					line: 1,
					column: 26,
				},
				{
					message: messages.expected,
					line: 1,
					column: 32,
				},
			],
		},
		{
			code: '@media (min-width: .01em)',
			fixed: '@media (min-width: 0.01em)',
			description: 'media feature',
			message: messages.expected,
			line: 1,
			column: 20,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,
	accept: [
		{
			code: 'a { margin: 0; }',
			description: 'plain zero',
		},
		{
			code: 'a { line-height: 2; }',
			description: 'plain integer',
		},
		{
			code: 'a { margin: 2px; }',
			description: 'integer with units',
		},
		{
			code: 'a { line-height: .5; }',
			description: 'unitless fractional value without leading zero',
		},
		{
			code: 'a { line-height: -.5; }',
			description: 'negative unitless fractional value without leading zero',
		},
		{
			code: 'a { margin: .5px; }',
			description: 'fractional value with `px` units without leading zero',
		},
		{
			code: 'a { margin: .5em; }',
			description: 'fractional value with `em` units without leading zero',
		},
		{
			code: 'a { line-height: 1.5; }',
			description: 'unitless fractional value greater than 1',
		},
		{
			code: 'a { margin: 1.5px; }',
			description: 'fractional value greater than 1 with units',
		},
		{
			code: 'a { line-height: 10.5; }',
			description: 'unitless fractional value greater than 1 with a zero before the decimal',
		},
		{
			code: 'a { margin: 10.5px; }',
			description: 'fractional value greater than 1 with a zero before the decimal and units',
		},
		{
			code: 'a { margin: .3em .123px .999999px; }',
			description: 'multiple fractional values without leading zeros',
		},
		{
			code: 'a { transform: translate(.4px, .8px); }',
			description: 'multiple fractional values without leading zeros in a function',
		},
		{
			code: 'a { background: url(data:image/svg+xml;...0.5); }',
			description: 'data URI containing leading zero',
		},
		{
			code: 'a { background: uRl(data:image/svg+xml;...0.5); }',
			description: 'data URI containing leading zero',
		},
		{
			code: 'a { background: URL(data:image/svg+xml;...0.5); }',
			description: 'data URI containing leading zero',
		},
		{
			code: "@import 'testfile.0.3.css'",
			description: 'ignore @import at-rules',
		},
		{
			code: "@iMpOrT 'testfile.0.3.css'",
			description: 'ignore @import at-rules',
		},
		{
			code: "@IMPORT 'testfile.0.3.css'",
			description: 'ignore @import at-rules',
		},
	],

	reject: [
		{
			code: 'a { line-height: 0.5; }',
			fixed: 'a { line-height: .5; }',
			description: 'unitless fractional value with leading zero',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { line-height: -0.5; }',
			fixed: 'a { line-height: -.5; }',
			description: 'negative unitless fractional value with leading zero',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { margin: 0.5px; }',
			fixed: 'a { margin: .5px; }',
			description: 'fractional value with units with leading zero',
			message: messages.rejected,
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 0.5px; }',
			fixed: 'a { margin: 1px .5px; }',
			description: 'fractional value with leading zero in the middle of a list',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { transform: translate(0.4px, 2px); }',
			fixed: 'a { transform: translate(.4px, 2px); }',
			description: 'fractional value with leading zero at the beginning  of a function',
			message: messages.rejected,
			line: 1,
			column: 26,
		},
		{
			code: 'a { transform: translate(2px, 0.8px); }',
			fixed: 'a { transform: translate(2px, .8px); }',
			description: 'fractional value with leading zero in the middle of a function',
			message: messages.rejected,
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: translate(0.4px, 0.8px); }',
			fixed: 'a { transform: translate(.4px, .8px); }',
			description: 'multiple fractional values with leading zeros in a function',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 26,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 33,
				},
			],
		},
		{
			code: 'a { line-height: 000.5; }',
			fixed: 'a { line-height: .5; }',
			description: 'multiple leading zeros',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: '@media (min-width: 0.01em)',
			fixed: '@media (min-width: .01em)',
			description: 'media feature',
			message: messages.rejected,
			line: 1,
			column: 20,
		},
	],
});
