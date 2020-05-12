'use strict';

const stripIndent = require('common-tags').stripIndent;

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a {\n\n top: 15px;\n}',
		},
		{
			code: 'a {\n\n\n\n top: 15px;\n}',
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n}',
		},
		{
			code: 'a{\n\n top: 15px; }',
		},
		{
			code: 'a{\n\n top: 15px;\r\n\r\n bottom: 5px;}',
		},
		{
			code: 'a{\n\n top: 15px;\n\r\n bottom: 5px;}',
		},
		{
			code: 'a{\n --custom-prop: value;\n\r\n top: 15px;}',
		},
		{
			code: 'a{\n @extends .class;\n\r\n top: 15px;}',
		},
		{
			code: 'a{\n $var: 15px;\n\r\n top: 15px;}',
		},
	],

	reject: [
		{
			code: 'a { top: 15px; }',
			fixed: 'a {\n\n top: 15px; }',
			message: messages.expected,
			line: 1,
			column: 5,
		},
		{
			code: 'a {\ntop: 15px;\n}',
			fixed: 'a {\n\ntop: 15px;\n}',
			message: messages.expected,
			line: 2,
			column: 1,
		},
		{
			code: 'a {\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a{\n\n top: 15px; \n bottom: 5px;}',
			fixed: 'a{\n\n top: 15px; \n\n bottom: 5px;}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\r\n\r\n top: 15px;\r\n bottom: 5px;}',
			fixed: 'a{\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n --custom-prop: value;\n top: 15px;}',
			fixed: 'a{\n --custom-prop: value;\n\n top: 15px;}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\r\n @extends .class;\r\n top: 15px;}',
			fixed: 'a{\r\n @extends .class;\r\n\r\n top: 15px;}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\n $var: 15px;\n top: 15px;}',
			fixed: 'a{\n $var: 15px;\n\n top: 15px;}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: 'a {\n\n #{var}: 15px;\n}',
		},
		{
			code: 'a{\n\n #{var}: 15px;\r\n\r\n prop#{var2}: 5px;}',
		},
		{
			code: 'a{\n\n top: 15px;\n\r\n #{var}: 5px;}',
		},
	],

	reject: [
		{
			code: 'a { #{var}: 15px; }',
			fixed: 'a {\n\n #{var}: 15px; }',
			message: messages.expected,
			line: 1,
			column: 5,
		},
		{
			code: 'a{\n\n top: 15px; \n #{var}: 5px;}',
			fixed: 'a{\n\n top: 15px; \n\n #{var}: 5px;}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\r\n\r\n #{var}: 15px;\r\n prop#{var2}: 5px;}',
			fixed: 'a{\r\n\r\n #{var}: 15px;\r\n\r\n prop#{var2}: 5px;}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n $var: 15px;\n #{var}: 15px;}',
			fixed: 'a{\n $var: 15px;\n\n #{var}: 15px;}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'less',
	fix: true,

	accept: [
		{
			code: 'a {\n\n @{var}: 15px;\n}',
		},
		{
			code: 'a{\n\n @{var}: 15px;\r\n\r\n prop@{var2}: 5px;}',
		},
		{
			code: 'a{\n\n top: 15px;\n\r\n @{var}: 5px;}',
		},
	],

	reject: [
		{
			code: 'a { @{var}: 15px; }',
			fixed: 'a {\n\n @{var}: 15px; }',
			message: messages.expected,
			line: 1,
			column: 5,
		},
		{
			code: 'a{\n\n top: 15px; \n @{var}: 5px;}',
			fixed: 'a{\n\n top: 15px; \n\n @{var}: 5px;}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\r\n\r\n @{var}: 15px;\r\n prop@{var2}: 5px;}',
			fixed: 'a{\r\n\r\n @{var}: 15px;\r\n\r\n prop@{var2}: 5px;}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n $var: 15px;\n @{var}: 15px;}',
			fixed: 'a{\n $var: 15px;\n\n @{var}: 15px;}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['inside-single-line-block'] }],
	fix: true,

	accept: [
		{
			code: 'a { top: 15px; }',
		},
		{
			code: 'a {\n\n top: 15px;\n}',
		},
	],

	reject: [
		{
			code: 'a {\n top: 15px;\n}',
			fixed: 'a {\n\n top: 15px;\n}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['after-comment'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n/* comment */\ntop: 15px;\n}',
		},
		{
			code: 'a {\r\n/* comment */\r\ntop: 15px;\r\n}',
		},
	],

	reject: [
		{
			code: 'a {\n/* comment */ top: 15px;\n}',
			fixed: 'a {\n/* comment */\n\n top: 15px;\n}',
			message: messages.expected,
			line: 2,
			column: 15,
			description: "shared-line comments don't save you",
		},
		{
			code: 'a {/* comment */\n top: 15px;\n}',
			fixed: 'a {/* comment */\n\n top: 15px;\n}',
			message: messages.expected,
			line: 2,
			column: 2,
			description: "shared-line comments don't save you, again",
		},
		{
			code: 'a {\n top: 15px;\n}',
			fixed: 'a {\n\n top: 15px;\n}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['after-declaration'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n\n top: 15px; bottom: 5px;\n}',
		},
		{
			code: 'a {\r\n\r\n top: 15px; bottom: 5px;\r\n}',
		},
		{
			code: 'a {\n\n top: 15px;\n bottom: 5px;\n}',
		},
		{
			code: 'a {\n\n top: 15px; /* comment */\n bottom: 5px;\n}',
			description: 'shared-line comment accepted',
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n bottom: 5px;\r\n}',
		},
		{
			code: 'a {\n\n top: 15px;\n\n bottom: 5px;\n}',
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
		},
	],

	reject: [
		{
			code: 'a{\n @extends .class;\n top: 15px;\n}',
			fixed: 'a{\n @extends .class;\n\n top: 15px;\n}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\r\n @extends .class;\r\n top: 15px;\r\n}',
			fixed: 'a{\r\n @extends .class;\r\n\r\n top: 15px;\r\n}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\n @include mixin;\n top: 15px;\n}',
			fixed: 'a{\n @include mixin;\n\n top: 15px;\n}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\r\n @include mixin;\r\n top: 15px;\r\n}',
			fixed: 'a{\r\n @include mixin;\r\n\r\n top: 15px;\r\n}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n top: 15px;\n}',
			fixed: 'a {\n\n top: 15px;\n}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\n  --foo: pink;\n  top: 15px;\n}',
			fixed: 'a {\n  --foo: pink;\n\n  top: 15px;\n}',
			message: messages.expected,
			line: 3,
			column: 3,
			description: "custom properties don't count",
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['first-nested'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n top: 15px;\n\n bottom: 5px;\n}',
		},
		{
			code: 'a {\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
		},
		{
			code: 'a {\n\n top: 15px;\n\n bottom: 5px;\n}',
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
		},
	],

	reject: [
		{
			code: 'a {\n top: 15px;\n bottom: 5px;\n}',
			fixed: 'a {\n top: 15px;\n\n bottom: 5px;\n}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n\n top: 15px;\n bottom: 5px;\n}',
			fixed: 'a {\n\n top: 15px;\n\n bottom: 5px;\n}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a {\r\n top: 15px;\r\n bottom: 5px;\r\n}',
			fixed: 'a {\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n bottom: 5px;\r\n}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['first-nested'] }],
	fix: true,

	accept: [
		{
			code: 'a { top: 15px;\n}',
		},
		{
			code: 'a {\n top: 15px;\n}',
		},
		{
			code: 'a {\r\n top: 15px;\r\n}',
		},
		{
			code: 'a { /* comment */\n top: 15px;\n}',
			description: 'shared-line comment',
		},
	],

	reject: [
		{
			code: 'a {\n\n top: 15px;\n}',
			fixed: 'a {\n top: 15px;\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n top: 15px;\r\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a { /* comment */\n\n top: 15px;\n}',
			fixed: 'a { /* comment */\n top: 15px;\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-comment'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n\n top: 15px;\n}',
		},
		{
			code: 'a {\n /* I am a comment */ \n bottom: 5px;}',
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n bottom: 5px;}',
		},
	],

	reject: [
		{
			code: 'a {\n\n top: 15px;\n /* I am a comment */ \n\n bottom: 5px;}',
			fixed: 'a {\n\n top: 15px;\n /* I am a comment */ \n bottom: 5px;}',
			message: messages.rejected,
			line: 6,
			column: 2,
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n\r\n bottom: 5px;}',
			fixed: 'a {\r\n /* I am a comment */ \r\n bottom: 5px;}',
			message: messages.rejected,
			line: 4,
			column: 2,
		},
		{
			code: 'a {\n\n color: pink; /* I am a comment */\n bottom: 5px;}',
			fixed: 'a {\n\n color: pink; /* I am a comment */\n\n bottom: 5px;}',
			message: messages.expected,
			line: 4,
			column: 2,
			description: 'shared-line comments do not apply',
		},
		{
			code: 'a {/* I am a comment */ \n bottom: 5px;}',
			fixed: 'a {/* I am a comment */ \n\n bottom: 5px;}',
			message: messages.expected,
			line: 2,
			column: 2,
			description: 'shared-line comments still do not apply',
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-declaration'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n\n top: 15px;\n}',
		},
		{
			code: 'a {\n\n top:15px; \n bottom: 5px;}',
		},
		{
			code: 'a {\n\n top:15px; \n /* comment */ bottom: 5px;}',
			description: 'shared-line comment accepted',
		},
		{
			code: 'a {\n\n top:15px; \r\n bottom: 5px;}',
		},
	],

	reject: [
		{
			code: 'a {\n\n top:15px;\n\n bottom: 5px;}',
			fixed: 'a {\n\n top:15px;\n bottom: 5px;}',
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n bottom: 5px;}',
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\n  --foo: pink;\n  bottom: 5px;}',
			fixed: 'a {\n  --foo: pink;\n\n  bottom: 5px;}',
			message: messages.expected,
			line: 3,
			column: 3,
			description: "custom properties don't count",
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-declaration'] }],
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: 'a {\n\n #{$var}: 15px;\n}',
		},
		{
			code: 'a {\n\n top:15px; \n #{$var}: 5px; }',
		},
	],

	reject: [
		{
			code: 'a {\n\n top:15px;\n\n #{$var}: 5px; }',
			fixed: 'a {\n\n top:15px;\n #{$var}: 5px; }',
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n prop#{$var}erty: 15px;\r\n\r\n #{$var2}: 5px; }',
			fixed: 'a {\r\n\r\n prop#{$var}erty: 15px;\r\n #{$var2}: 5px; }',
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\n  $foo: pink;\n  bottom: 5px;}',
			fixed: 'a {\n  $foo: pink;\n\n  bottom: 5px;}',
			message: messages.expected,
			line: 3,
			column: 3,
			description: "variable declarations don't count",
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-declaration'] }],
	syntax: 'less',
	fix: true,

	accept: [
		{
			code: 'a {\n\n @{var}: 15px;\n}',
		},
		{
			code: 'a {\n\n top:15px; \n @{var}: 5px; }',
		},
	],

	reject: [
		{
			code: 'a {\n\n top:15px;\n\n @{var}: 5px; }',
			fixed: 'a {\n\n top:15px;\n @{var}: 5px; }',
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n prop@{var}erty: 15px;\r\n\r\n @{var2}: 5px; }',
			fixed: 'a {\r\n\r\n prop@{var}erty: 15px;\r\n @{var2}: 5px; }',
			message: messages.rejected,
			line: 5,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['first-nested', 'after-comment'] }],

	accept: [
		{
			code: 'a {\n top: 15px;\n}',
		},
		{
			code: 'a { /* comment */\n top: 15px;\n}',
			description: 'shared-line comment',
		},
		{
			code: 'a {\n /* I am a comment */ \n bottom: 5px;}',
		},
	],
});

testRule({
	ruleName,
	config: [
		'always',
		{
			except: ['first-nested', 'after-comment', 'after-declaration'],
		},
	],
	fix: true,

	accept: [
		{
			code:
				"a {\n top: 15px; \n bottom: 5px; \n /* comment */ \n prop: 15px;\n\n @extends 'x';\n\n prop: 15px; \n & b {\n prop: 15px;\n } \n\n prop: 15px; \n }",
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a { top: 15px;\n}',
		},
		{
			code: 'a {\n top: 15px;\n}',
		},
		{
			code: 'a {\r\n top: 15px;\r\n}',
		},
		{
			code: 'a {\n top: 15px; bottom: 5px;\n}',
		},
		{
			code: 'a {\n top: 15px; \n bottom: 5px; }',
		},
		{
			code: 'a {\n/* comment */ \n top3: 15px; \n\n }',
		},
		{
			code: 'a{\n --custom-prop: value;\n top: 15px;}',
		},
		{
			code: 'a{\n @extends .class;\n top: 15px;}',
		},
		{
			code: 'a{\n $var: 15px;\n top: 15px;}',
		},
	],

	reject: [
		{
			code: 'a {\n\n top: 15px;\n}',
			fixed: 'a {\n top: 15px;\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n top: 15px;\r\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\n bottom: 5px;\n\n top: 15px;}',
			fixed: 'a{\n bottom: 5px;\n top: 15px;}',
			message: messages.rejected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n --custom-prop: value;\n\n top: 15px;}',
			fixed: 'a{\n --custom-prop: value;\n top: 15px;}',
			message: messages.rejected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\r\n @extends .class;\r\n\r\n top: 15px;}',
			fixed: 'a{\r\n @extends .class;\r\n top: 15px;}',
			message: messages.rejected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n $var: 15px;\n\n top: 15px;}',
			fixed: 'a{\n $var: 15px;\n top: 15px;}',
			message: messages.rejected,
			line: 4,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['first-nested'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n\n top: 15px;\n}',
		},
		{
			code: 'a {\n\n top: 15px;\n bottom: 5px;}',
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n}',
		},
	],

	reject: [
		{
			code: 'a {\n\n top: 15px;\n\nbottom:5px; }',
			fixed: 'a {\n\n top: 15px;\nbottom:5px; }',
			message: messages.rejected,
			line: 5,
			column: 1,
		},
		{
			code: 'a {\n top: 15px;\n}',
			fixed: 'a {\n\n top: 15px;\n}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['after-comment'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n top: 15px;\n}',
		},
		{
			code: 'a {\n /* I am a comment */ \n\n bottom: 5px;}',
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n\r\n bottom: 5px;}',
		},
	],

	reject: [
		{
			code: 'a {\n/* I am a comment */ \n\n bottom: 5px;\n\ntop: 15px;}',
			fixed: 'a {\n/* I am a comment */ \n\n bottom: 5px;\ntop: 15px;}',
			message: messages.rejected,
			line: 6,
			column: 1,
		},
		{
			code: 'a {\n top: 15px;\n /* I am a comment */ \n bottom: 5px;}',
			fixed: 'a {\n top: 15px;\n /* I am a comment */ \n\n bottom: 5px;}',
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n bottom: 5px;}',
			fixed: 'a {\r\n /* I am a comment */ \r\n\r\n bottom: 5px;}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n color: pink; /* I am a comment */\n\n bottom: 5px;}',
			fixed: 'a {\n color: pink; /* I am a comment */\n bottom: 5px;}',
			message: messages.rejected,
			line: 4,
			column: 2,
			description: 'shared-line comments do not apply',
		},
		{
			code: 'a {/* I am a comment */ \n\n bottom: 5px;}',
			fixed: 'a {/* I am a comment */ \n bottom: 5px;}',
			message: messages.rejected,
			line: 3,
			column: 2,
			description: 'shared-line comments still do not apply',
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['after-declaration'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n top: 15px;\n}',
		},
		{
			code: 'a {\n top:15px; \n\n bottom: 5px;}',
		},
		{
			code: 'a {\n top:15px; /* comment */\n\n bottom: 5px;}',
			description: 'shared-line comment accepted',
		},
		{
			code: 'a {\n top:15px; \r\n\r\n bottom: 5px;}',
		},
	],

	reject: [
		{
			code: 'a {\n\n top:15px;\n\nbottom: 5px;}',
			fixed: 'a {\n top:15px;\n\nbottom: 5px;}',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n top:15px;\nbottom: 5px;}',
			fixed: 'a {\n top:15px;\n\nbottom: 5px;}',
			message: messages.expected,
			line: 3,
			column: 1,
		},
		{
			code: 'a {\n top: 15px;\n bottom: 5px;}',
			fixed: 'a {\n top: 15px;\n\n bottom: 5px;}',
			message: messages.expected,
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: [
		'never',
		{
			except: ['first-nested', 'after-comment', 'after-declaration'],
		},
	],
	fix: true,

	accept: [
		{
			code:
				"a {\n\n top: 15px; \n\n bottom: 5px; \n /* comment */ \n\n prop: 15px;\n\n @extends 'x';\n prop: 15px; \n & b {\n\n prop: 15px;\n } \n prop: 15px; \n }",
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'html',
	fix: true,
	accept: [
		{
			code: `<span style="color: red;"></span>`,
			description: 'Single-line HTML style tag',
		},
		{
			code: stripIndent`
				<span
					style="
						color: red;

						font-size: 1rem;
					">
					Text
				</span>`,
			description: 'Multi-line HTML style attribute with two declarations',
		},
	],
	reject: [
		{
			code: stripIndent`
				<span style="color: red;font-size: 16px;"></span>
				<style>
					color: red;
					font-size: 16px;
				</style>`,
			fixed: stripIndent`
				<span style="color: red;

				font-size: 16px;"></span>
				<style>
					color: red;

					font-size: 16px;
				</style>`,
			description: 'flush declaration in style tag',
			warnings: [
				{
					message: messages.expected,
					line: 1,
					column: 25,
				},
				{
					message: messages.expected,
					line: 4,
					column: 2,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['inside-single-line-block'] }],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `<span style="color: red; font-size: 1rem;"></span>`,
			description: 'Single-line HTML style attribute with two declarations',
		},
		{
			code: stripIndent`
				<span
					style="
						color: red;

						font-size: 1rem;
					">
					Text
				</span>`,
			description: 'Multi-line HTML style attribute with two declarations',
		},
	],
	reject: [
		{
			code: stripIndent`
				<span style="color: red; font-size: 1rem;"></span>
				<style>
					color: red;
					font-size: 16px;
				</style>`,
			fixed: stripIndent`
				<span style="color: red; font-size: 1rem;"></span>
				<style>
					color: red;

					font-size: 16px;
				</style>`,
			description: 'flush declaration in style tag',
			message: messages.expected,
			line: 4,
			column: 2,
		},
	],
});
