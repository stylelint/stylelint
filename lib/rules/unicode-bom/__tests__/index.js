'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],

	accept: [
		{
			code: '\uFEFF',
			description: 'empty with BOM',
		},
		{
			code: '\uFEFFa{}',
			description: 'with BOM',
		},
	],

	reject: [
		{
			code: '',
			description: 'empty without BOM',
			message: messages.expected,
		},
		{
			code: 'a{}',
			description: 'without BOM',
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],

	accept: [
		{
			code: '',
			description: 'empty without BOM',
		},
		{
			code: 'a{}',
			description: 'without BOM',
		},
	],

	reject: [
		{
			code: '\uFEFF',
			description: 'empty with BOM',
			message: messages.rejected,
		},
		{
			code: '\uFEFFa{}',
			description: 'with BOM',
			message: messages.rejected,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-html',
	config: ['always'],

	accept: [
		{
			code: '<a style="color: red;"></a>',
			description: 'without BOM',
		},
		{
			code: '<a style="\uFEFFcolor: red;"></a>',
			description: 'with BOM',
		},
		{
			code: `<style>a{}</style>`,
			description: 'without BOM',
		},
		{
			code: `<style>\uFEFFa{}</style>`,
			description: 'with BOM',
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-html',
	config: ['never'],

	accept: [
		{
			code: '<a style="color: red;"></a>',
			description: 'without BOM',
		},
		{
			code: '<a style="\uFEFFcolor: red;"></a>',
			description: 'with BOM',
		},
		{
			code: `<style>a{}</style>`,
			description: 'without BOM',
		},
		{
			code: `<style>\uFEFFa{}</style>`,
			description: 'with BOM',
		},
	],
});

testRule({
	skip: true,
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-css-in-js',

	accept: [
		{
			code: `export default (
        <button
          style={{ color: "#fff" }}
        >
        </button>
      );`,
		},
	],
});

testRule({
	skip: true,
	ruleName,
	config: ['never'],
	customSyntax: 'postcss-css-in-js',

	accept: [
		{
			code: `export default (
        <button
          style={{ color: "#fff" }}
        >
        </button>
      );`,
		},
	],
});
