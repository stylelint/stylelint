'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,

	accept: [
		{
			code: '[title] { }',
		},
		{
			code: 'a[target="_blank"] { }',
		},
		{
			code: 'a[ target="_blank" ] { }',
		},
		{
			code: '[class|="top"] { }',
		},
		{
			code: '[class |= "top"] { }',
		},
		{
			code: "[title~='text'] { }",
		},
		{
			code: "[data-attribute='component'] { }",
		},
		{
			code: '[frame="hsides" i] { }',
		},
		{
			code: "[frame='hsides' i] { }",
		},
		{
			code: "[data-style='value'][data-loading] { }",
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
	],

	reject: [
		{
			code: 'a[title=flower] { }',
			message: messages.expected('flower'),
			line: 1,
			column: 9,
		},
		{
			code: 'a[ title=flower ] { }',
			message: messages.expected('flower'),
			line: 1,
			column: 10,
		},
		{
			code: '[class^=top] { }',
			message: messages.expected('top'),
			line: 1,
			column: 9,
		},
		{
			code: '[class ^= top] { }',
			message: messages.expected('top'),
			line: 1,
			column: 11,
		},
		{
			code: '[frame=hsides i] { }',
			message: messages.expected('hsides'),
			line: 1,
			column: 8,
		},
		{
			code: '[data-style=value][data-loading] { }',
			message: messages.expected('value'),
			line: 1,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],

	accept: [
		{
			code: '[title] { }',
		},
		{
			code: '[title=flower] { }',
		},
		{
			code: '[class^=top] { }',
		},
		{
			code: '[frame=hsides i] { }',
		},
		{
			code: '[data-style=value][data-loading] { }',
		},
	],

	reject: [
		{
			code: 'a[target="_blank"] { }',
			message: messages.rejected('_blank'),
			line: 1,
			column: 10,
		},
		{
			code: 'a[ target="_blank" ] { }',
			message: messages.rejected('_blank'),
			line: 1,
			column: 11,
		},
		{
			code: '[class|="top"] { }',
			message: messages.rejected('top'),
			line: 1,
			column: 9,
		},
		{
			code: '[class |= "top"] { }',
			message: messages.rejected('top'),
			line: 1,
			column: 11,
		},
		{
			code: "[title~='text'] { }",
			message: messages.rejected('text'),
			line: 1,
			column: 9,
		},
		{
			code: "[data-attribute='component'] { }",
			message: messages.rejected('component'),
			line: 1,
			column: 17,
		},
		{
			code: '[frame="hsides" i] { }',
			message: messages.rejected('hsides'),
			line: 1,
			column: 8,
		},
		{
			code: "[frame='hsides' i] { }",
			message: messages.rejected('hsides'),
			line: 1,
			column: 8,
		},
		{
			code: "[data-style='value'][data-loading] { }",
			message: messages.rejected('value'),
			line: 1,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'scss',

	accept: [
		{
			code: '[class="#{$variable}"] { }',
		},
		{
			code: "[data-attribute^='#{$variable}'] { }",
		},
		{
			code: '[class=#{$variable}] { } { }',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	syntax: 'scss',

	accept: [
		{
			code: '[class=#{$variable}] { }',
		},
		{
			code: '[data-attribute^=#{$variable}] { }',
		},
		{
			code: '[class="#{$variable}"] { }',
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'less',

	accept: [
		{
			code: '[class="@{variable}"] { }',
		},
		{
			code: "[data-attribute^='@{variable}'] { }",
		},
		{
			code: '[class=@{variable}] { }',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	syntax: 'less',

	accept: [
		{
			code: '[class=@{variable}] { }',
		},
		{
			code: '[data-attribute^=@{variable}] { }',
		},
		{
			code: '[class="@{variable}"] { }',
		},
	],
});
