'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	accept: [
		{
			code: 'a { font-family: "Lucida Grande", "Arial", sans-serif; }',
		},
		{
			code: 'a { font: 1em "Lucida Grande", \'Arial\', sans-serif; }',
		},
		{
			code: 'a { font: 1em "Lucida Grande", \'Arial\', "sans-serif", sans-serif; }',
		},
		{
			code: 'a { font-family: Times, serif; }',
		},
		{
			code: 'b { font-family: inherit; }',
		},
		{
			code: 'b { font-family: inherit; }',
		},
		{
			code: 'b { font-family: initial; }',
		},
		{
			code: 'b { font-family: unset; }',
		},
		{
			code: 'b { font-family: serif; }',
		},
		{
			code: 'b { font-family: sans-serif; }',
		},
		{
			code: 'b { font-family: Courier, monospace; }',
		},
		{
			code: 'b { font: 1em/1.5 "Whatever Fanciness", cursive; }',
		},
		{
			code: 'a { font-family: Helvetica Neue, sans-serif, Apple Color Emoji; }',
		},
		{
			code: '@font-face { font-family: Gentium; }',
		},
		{
			code: '@FONT-FACE { font-family: Gentium; }',
		},
		{
			code: 'a { font: inherit; }',
		},
		{
			code: 'a { font: caption; }',
		},
		{
			code: 'a { font: icon; }',
		},
		{
			code: 'a { font: menu; }',
		},
		{
			code: 'a { font: message-box; }',
		},
		{
			code: 'a { font: small-caption; }',
		},
		{
			code: 'a { font: status-bar; }',
		},
		{
			code: 'a { font: @font-family; }',
		},
		{
			code: 'a { font: $font-family; }',
		},
		{
			code: 'a { font: namespace.$font-family; }',
		},
		{
			code: 'a { font-family: "font", var(--font); }',
		},
	],

	reject: [
		{
			code: 'a { font-family: Arial; }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-family: \'Arial\', "Lucida Grande", Arial; }',
			message: messages.rejected,
			line: 1,
			column: 44,
		},
		{
			code: "a { fOnT-fAmIlY: '  Lucida Grande '; }",
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-family: Times; }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { FONT: italic 300 16px/30px Arial, " Arial"; }',
			message: messages.rejected,
			line: 1,
			column: 39,
		},
		{
			code: 'b { font: normal 14px/32px -apple-system, BlinkMacSystemFont; }',
			message: messages.rejected,
			line: 1,
			column: 43,
		},
		{
			code: 'a { font: 1em Lucida Grande, Arial, "sans-serif" }',
			message: messages.rejected,
			line: 1,
			column: 37,
		},
	],
});

testRule({
	ruleName,
	config: [
		true,
		{
			ignoreFontFamilies: ['custom-font', /foo/, '/baz[0-9]/'],
		},
	],
	accept: [
		{
			code: 'a { font-family: custom-font; }',
		},
		{
			code: 'a { font: 1em Lucida Grande, Arial, custom-font }',
		},
		{
			code: 'a { font: foo-font }',
		},
		{
			code: 'a { font: baz7 }',
		},
	],
	reject: [
		{
			code: 'a { font-family: Arial; }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { font: 1em Lucida Grande, Arial, "sans-serif" }',
			message: messages.rejected,
			line: 1,
			column: 37,
		},
		{
			code: 'a { font: bar-font }',
			message: messages.rejected,
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: baz-7 }',
			message: messages.rejected,
			line: 1,
			column: 11,
		},
	],
});
