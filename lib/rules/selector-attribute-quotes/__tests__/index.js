'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	fix: true,

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
		{
			code: `a[href="te's't"] { }`,
			description: 'double-quoted attribute contains single quote',
		},
		{
			code: `a[href='te"s"t'] { }`,
			description: 'single-quoted attribute contains double quote',
		},
	],

	reject: [
		{
			code: 'a[title=flower] { }',
			fixed: 'a[title="flower"] { }',
			message: messages.expected('flower'),
			line: 1,
			column: 9,
		},
		{
			code: 'a[ title=flower ] { }',
			fixed: 'a[ title="flower" ] { }',
			message: messages.expected('flower'),
			line: 1,
			column: 10,
		},
		{
			code: '[class^=top] { }',
			fixed: '[class^="top"] { }',
			message: messages.expected('top'),
			line: 1,
			column: 9,
		},
		{
			code: '[class ^= top] { }',
			fixed: '[class ^= "top"] { }',
			message: messages.expected('top'),
			line: 1,
			column: 11,
		},
		{
			code: '[frame=hsides i] { }',
			fixed: '[frame="hsides" i] { }',
			message: messages.expected('hsides'),
			line: 1,
			column: 8,
		},
		{
			code: '[data-style=value][data-loading] { }',
			fixed: '[data-style="value"][data-loading] { }',
			message: messages.expected('value'),
			line: 1,
			column: 13,
		},
		{
			code: `[href=te\\'s\\"t] { }`,
			fixed: `[href="te's\\"t"] { }`,
			message: messages.expected(`te's"t`),
			line: 1,
			column: 7,
		},
		{
			code: '[href=\\"test\\"] { }',
			fixed: '[href="\\"test\\""] { }',
			message: messages.expected('"test"'),
			line: 1,
			column: 7,
		},
		{
			code: "[href=\\'test\\'] { }",
			fixed: `[href="'test'"] { }`,
			message: messages.expected("'test'"),
			line: 1,
			column: 7,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

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
		{
			code: `a[href=te\\'s\\"t] { }`,
			description: 'attribute contains inner quotes',
		},
		{
			code: '[href=\\"test\\"] { }',
			description: 'escaped double-quotes are not considered as framing quotes',
		},
		{
			code: "[href=\\'test\\'] { }",
			description: 'escaped single-quotes are not considered as framing quotes',
		},
	],

	reject: [
		{
			code: 'a[target="_blank"] { }',
			fixed: 'a[target=_blank] { }',
			message: messages.rejected('_blank'),
			line: 1,
			column: 10,
		},
		{
			code: 'a[ target="_blank" ] { }',
			fixed: 'a[ target=_blank ] { }',
			message: messages.rejected('_blank'),
			line: 1,
			column: 11,
		},
		{
			code: '[class|="top"] { }',
			fixed: '[class|=top] { }',
			message: messages.rejected('top'),
			line: 1,
			column: 9,
		},
		{
			code: '[class |= "top"] { }',
			fixed: '[class |= top] { }',
			message: messages.rejected('top'),
			line: 1,
			column: 11,
		},
		{
			code: "[title~='text'] { }",
			fixed: '[title~=text] { }',
			message: messages.rejected('text'),
			line: 1,
			column: 9,
		},
		{
			code: "[data-attribute='component'] { }",
			fixed: '[data-attribute=component] { }',
			message: messages.rejected('component'),
			line: 1,
			column: 17,
		},
		{
			code: '[frame="hsides" i] { }',
			fixed: '[frame=hsides i] { }',
			message: messages.rejected('hsides'),
			line: 1,
			column: 8,
		},
		{
			code: "[frame='hsides' i] { }",
			fixed: '[frame=hsides i] { }',
			message: messages.rejected('hsides'),
			line: 1,
			column: 8,
		},
		{
			code: "[data-style='value'][data-loading] { }",
			fixed: '[data-style=value][data-loading] { }',
			message: messages.rejected('value'),
			line: 1,
			column: 13,
		},
		{
			code: `[href="te'st"] { }`,
			fixed: "[href=te\\'st] { }",
			message: messages.rejected("te'st"),
			line: 1,
			column: 7,
		},
		{
			code: `[href='te"st'] { }`,
			fixed: '[href=te\\"st] { }',
			message: messages.rejected('te"st'),
			line: 1,
			column: 7,
		},
		{
			code: "[href='te\\'s\\'t'] { }",
			fixed: "[href=te\\'s\\'t] { }",
			message: messages.rejected("te's't"),
			line: 1,
			column: 7,
		},
		{
			code: '[href="te\\"s\\"t"] { }',
			fixed: '[href=te\\"s\\"t] { }',
			message: messages.rejected('te"s"t'),
			line: 1,
			column: 7,
		},
		{
			code: 'a[target="_blank"], /* comment */ a { }',
			fixed: 'a[target=_blank], /* comment */ a { }',
			message: messages.rejected('_blank'),
			line: 1,
			column: 10,
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
