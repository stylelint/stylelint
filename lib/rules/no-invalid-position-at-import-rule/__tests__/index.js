'use strict';

const postcssScss = require('postcss-scss');
const stripIndent = require('common-tags').stripIndent;

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: stripIndent`
				@import 'foo.css';
				a {}
			`,
			description: '@import on first line',
		},
		{
			code: stripIndent`
				/* some comment */
				@import 'foo.css';
			`,
			description: '@import after comment',
		},
		{
			code: stripIndent`
				@charset 'utf-8';
				@import 'foo.css';
			`,
			description: '@import after @charset ',
		},
		{
			code: stripIndent`
				@import 'foo.css';
				@import 'bar.css';
			`,
			description: '@import after another @import',
		},
		{
			code: stripIndent`
				@CHARSET 'utf-8';
				@imPORT 'foo.css';
				@import 'bar.css';
			`,
			description: 'case insensitive',
		},
	],

	reject: [
		{
			code: stripIndent`
				a {}
				@import 'foo.css';
			`,
			message: messages.rejected,
			description: '@import after selector',
			line: 2,
			column: 1,
		},
		{
			code: stripIndent`
				@media print {}
				@import url('foo.css');
			`,
			message: messages.rejected,
			description: '@import after another at-rule',
			line: 2,
			column: 1,
		},
		{
			code: stripIndent`
				@media print {}
				@imPort URl('foo.css');
			`,
			message: messages.rejected,
			description: 'case insensitive',
			line: 2,
			column: 1,
		},
		{
			code: stripIndent`
				@import 'foo.css';
				a {}
				@import 'bar.css';
			`,
			message: messages.rejected,
			description: 'only second @import reported',
			line: 3,
			column: 1,
		},
		{
			code: stripIndent`
				a {}
				@import 'foo.css';
				@import 'bar.css';
			`,
			warnings: [
				{
					message: messages.rejected,
					line: 2,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 3,
					column: 1,
				},
			],
			description: 'all @import reported',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: ['bar', '/^my-/', /foo/] }],

	accept: [
		{
			code: stripIndent`
				@bar 'bar.css';
				@import 'foo.css';
			`,
			description: 'ignored atRule at the beginning - equal string',
		},
		{
			code: stripIndent`
				@foofoo 'bar.css';
				@import 'foo.css';
			`,
			description: 'ignored atRule at the beginning - match regExp',
		},
		{
			code: stripIndent`
				@my-custom-rule {};
				@import 'foo.css';
			`,
			description: 'ignored atRule at the beginning - match regExp',
		},
	],

	reject: [
		{
			code: stripIndent`
				@baz 'bar.css';
				@import 'foo.css';
			`,
			message: messages.rejected,
			description: 'atRule does not match the pattern',
			line: 2,
			column: 1,
		},
		{
			code: stripIndent`
				@bar 'bar.css';
				@baz 'bar.css';
				@import 'foo.css';
			`,
			message: messages.rejected,
			description: 'one of atRules before @import does not match the pattern',
			line: 3,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: postcssScss,

	accept: [
		{
			code: stripIndent`
				$foo: 1;
				@import 'bar.css';
			`,
			description: 'dollar variable',
		},
		{
			code: stripIndent`
				// comment
				@import 'foo.css';
			`,
			description: 'double slash comment',
		},
	],

	reject: [
		{
			code: stripIndent`
				a {}
				$foo: 0;
				@import 'bar.css';
			`,
			message: messages.rejected,
			description: '@import after selector with dollar variable',
			line: 3,
			column: 1,
		},
	],
});
