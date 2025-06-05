import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['always'],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [2, 3],
				text: '{\n\n',
			},
			message: messages.expected,
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { top: 15px }',
			fixed: 'a {\n\n top: 15px }',
			fix: {
				range: [2, 3],
				text: '{\n\n',
			},
			message: messages.expected,
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'a { bottom: 12px; top: 17px }',
			fixed: 'a {\n\n bottom: 12px;\n\n top: 17px }',
			warnings: [
				{
					message: messages.expected,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 18,
					fix: {
						range: [2, 3],
						text: '{\n\n',
					},
				},
				{
					message: messages.expected,
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: 'a {\ntop: 15px;\n}',
			fixed: 'a {\n\ntop: 15px;\n}',
			fix: {
				range: [3, 4],
				text: '\n\n',
			},
			message: messages.expected,
			line: 2,
			column: 1,
		},
		{
			code: 'a {\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n}',
			fix: {
				range: [4, 5],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a{\n\n top: 15px; \n bottom: 5px;}',
			fixed: 'a{\n\n top: 15px; \n\n bottom: 5px;}',
			fix: {
				range: [16, 17],
				text: '\n\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\r\n\r\n top: 15px;\r\n bottom: 5px;}',
			fixed: 'a{\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;}',
			fix: {
				range: [18, 19],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n --custom-prop: value;\n top: 15px;}',
			fixed: 'a{\n --custom-prop: value;\n\n top: 15px;}',
			fix: {
				range: [25, 26],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\r\n @extends .class;\r\n top: 15px;}',
			fixed: 'a{\r\n @extends .class;\r\n\r\n top: 15px;}',
			fix: {
				range: [22, 23],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\n $var: 15px;\n top: 15px;}',
			fixed: 'a{\n $var: 15px;\n\n top: 15px;}',
			fix: {
				range: [15, 16],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-scss',
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [2, 3],
				text: '{\n\n',
			},
			message: messages.expected,
			line: 1,
			column: 5,
		},
		{
			code: 'a{\n\n top: 15px; \n #{var}: 5px;}',
			fixed: 'a{\n\n top: 15px; \n\n #{var}: 5px;}',
			fix: {
				range: [16, 17],
				text: '\n\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\r\n\r\n #{var}: 15px;\r\n prop#{var2}: 5px;}',
			fixed: 'a{\r\n\r\n #{var}: 15px;\r\n\r\n prop#{var2}: 5px;}',
			fix: {
				range: [21, 22],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n $var: 15px;\n #{var}: 15px;}',
			fixed: 'a{\n $var: 15px;\n\n #{var}: 15px;}',
			fix: {
				range: [15, 16],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-less',
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [2, 3],
				text: '{\n\n',
			},
			message: messages.expected,
			line: 1,
			column: 5,
		},
		{
			code: 'a{\n\n top: 15px; \n @{var}: 5px;}',
			fixed: 'a{\n\n top: 15px; \n\n @{var}: 5px;}',
			fix: {
				range: [16, 17],
				text: '\n\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\r\n\r\n @{var}: 15px;\r\n prop@{var2}: 5px;}',
			fixed: 'a{\r\n\r\n @{var}: 15px;\r\n\r\n prop@{var2}: 5px;}',
			fix: {
				range: [21, 22],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n $var: 15px;\n @{var}: 15px;}',
			fixed: 'a{\n $var: 15px;\n\n @{var}: 15px;}',
			fix: {
				range: [15, 16],
				text: '\n\n',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [3, 4],
				text: '\n\n',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [16, 17],
				text: '/\n\n',
			},
			message: messages.expected,
			line: 2,
			column: 15,
			description: "shared-line comments don't save you",
		},
		{
			code: 'a {/* comment */\n top: 15px;\n}',
			fixed: 'a {/* comment */\n\n top: 15px;\n}',
			fix: {
				range: [16, 17],
				text: '\n\n',
			},
			message: messages.expected,
			line: 2,
			column: 2,
			description: "shared-line comments don't save you, again",
		},
		{
			code: 'a {\n top: 15px;\n}',
			fixed: 'a {\n\n top: 15px;\n}',
			fix: {
				range: [3, 4],
				text: '\n\n',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [20, 21],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\r\n @extends .class;\r\n top: 15px;\r\n}',
			fixed: 'a{\r\n @extends .class;\r\n\r\n top: 15px;\r\n}',
			fix: {
				range: [22, 23],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\n @include mixin;\n top: 15px;\n}',
			fixed: 'a{\n @include mixin;\n\n top: 15px;\n}',
			fix: {
				range: [19, 20],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\r\n @include mixin;\r\n top: 15px;\r\n}',
			fixed: 'a{\r\n @include mixin;\r\n\r\n top: 15px;\r\n}',
			fix: {
				range: [21, 22],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n top: 15px;\n}',
			fixed: 'a {\n\n top: 15px;\n}',
			fix: {
				range: [3, 4],
				text: '\n\n',
			},
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n}',
			fix: {
				range: [4, 5],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\n  --foo: pink;\n  top: 15px;\n}',
			fixed: 'a {\n  --foo: pink;\n\n  top: 15px;\n}',
			fix: {
				range: [18, 19],
				text: '\n\n',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [15, 16],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n\n top: 15px;\n bottom: 5px;\n}',
			fixed: 'a {\n\n top: 15px;\n\n bottom: 5px;\n}',
			fix: {
				range: [16, 17],
				text: '\n\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a {\r\n top: 15px;\r\n bottom: 5px;\r\n}',
			fixed: 'a {\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
			fix: {
				range: [17, 18],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n bottom: 5px;\r\n}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
			fix: {
				range: [19, 20],
				text: '\n\r\n',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [4, 5],
				text: '',
			},
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n top: 15px;\r\n}',
			fix: {
				range: [5, 7],
				text: '',
			},
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a { /* comment */\n\n top: 15px;\n}',
			fixed: 'a { /* comment */\n top: 15px;\n}',
			fix: {
				range: [18, 19],
				text: '',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [40, 41],
				text: '',
			},
			message: messages.rejected,
			line: 6,
			column: 2,
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n\r\n bottom: 5px;}',
			fixed: 'a {\r\n /* I am a comment */ \r\n bottom: 5px;}',
			fix: {
				range: [29, 31],
				text: '',
			},
			message: messages.rejected,
			line: 4,
			column: 2,
		},
		{
			code: 'a {\n\n color: pink; /* I am a comment */\n bottom: 5px;}',
			fixed: 'a {\n\n color: pink; /* I am a comment */\n\n bottom: 5px;}',
			fix: {
				range: [39, 40],
				text: '\n\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
			description: 'shared-line comments do not apply',
		},
		{
			code: 'a {/* I am a comment */ \n bottom: 5px;}',
			fixed: 'a {/* I am a comment */ \n\n bottom: 5px;}',
			fix: {
				range: [24, 25],
				text: '\n\n',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [16, 17],
				text: '',
			},
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n bottom: 5px;}',
			fix: {
				range: [20, 22],
				text: '',
			},
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\n  --foo: pink;\n  bottom: 5px;}',
			fixed: 'a {\n  --foo: pink;\n\n  bottom: 5px;}',
			fix: {
				range: [18, 19],
				text: '\n\n',
			},
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
	customSyntax: 'postcss-scss',
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [16, 17],
				text: '',
			},
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n prop#{$var}erty: 15px;\r\n\r\n #{$var2}: 5px; }',
			fixed: 'a {\r\n\r\n prop#{$var}erty: 15px;\r\n #{$var2}: 5px; }',
			fix: {
				range: [32, 34],
				text: '',
			},
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\n  $foo: pink;\n  bottom: 5px;}',
			fixed: 'a {\n  $foo: pink;\n\n  bottom: 5px;}',
			fix: {
				range: [17, 18],
				text: '\n\n',
			},
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
	customSyntax: 'postcss-less',
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [16, 17],
				text: '',
			},
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n prop@{var}erty: 15px;\r\n\r\n @{var2}: 5px; }',
			fixed: 'a {\r\n\r\n prop@{var}erty: 15px;\r\n @{var2}: 5px; }',
			fix: {
				range: [31, 33],
				text: '',
			},
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
			code: "a {\n top: 15px; \n bottom: 5px; \n /* comment */ \n prop: 15px;\n\n @extends 'x';\n\n prop: 15px; \n & b {\n prop: 15px;\n } \n\n prop: 15px; \n }",
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [4, 5],
				text: '',
			},
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\r\n\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n top: 15px;\r\n}',
			fix: {
				range: [5, 7],
				text: '',
			},
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\n bottom: 5px;\n\n top: 15px;}',
			fixed: 'a{\n bottom: 5px;\n top: 15px;}',
			fix: {
				range: [17, 18],
				text: '',
			},
			message: messages.rejected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n --custom-prop: value;\n\n top: 15px;}',
			fixed: 'a{\n --custom-prop: value;\n top: 15px;}',
			fix: {
				range: [26, 27],
				text: '',
			},
			message: messages.rejected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\r\n @extends .class;\r\n\r\n top: 15px;}',
			fixed: 'a{\r\n @extends .class;\r\n top: 15px;}',
			fix: {
				range: [23, 25],
				text: '',
			},
			message: messages.rejected,
			line: 4,
			column: 2,
		},
		{
			code: 'a{\n $var: 15px;\n\n top: 15px;}',
			fixed: 'a{\n $var: 15px;\n top: 15px;}',
			fix: {
				range: [16, 17],
				text: '',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [17, 18],
				text: '',
			},
			message: messages.rejected,
			line: 5,
			column: 1,
		},
		{
			code: 'a {\n top: 15px;\n}',
			fixed: 'a {\n\n top: 15px;\n}',
			fix: {
				range: [3, 4],
				text: '\n\n',
			},
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\r\n top: 15px;\r\n}',
			fixed: 'a {\r\n\r\n top: 15px;\r\n}',
			fix: {
				range: [4, 5],
				text: '\n\r\n',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [41, 42],
				text: '',
			},
			message: messages.rejected,
			line: 6,
			column: 1,
		},
		{
			code: 'a {\n top: 15px;\n /* I am a comment */ \n bottom: 5px;}',
			fixed: 'a {\n top: 15px;\n /* I am a comment */ \n\n bottom: 5px;}',
			fix: {
				range: [38, 39],
				text: '\n\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n bottom: 5px;}',
			fixed: 'a {\r\n /* I am a comment */ \r\n\r\n bottom: 5px;}',
			fix: {
				range: [28, 29],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n color: pink; /* I am a comment */\n\n bottom: 5px;}',
			fixed: 'a {\n color: pink; /* I am a comment */\n bottom: 5px;}',
			fix: {
				range: [39, 40],
				text: '',
			},
			message: messages.rejected,
			line: 4,
			column: 2,
			description: 'shared-line comments do not apply',
		},
		{
			code: 'a {/* I am a comment */ \n\n bottom: 5px;}',
			fixed: 'a {/* I am a comment */ \n bottom: 5px;}',
			fix: {
				range: [25, 26],
				text: '',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [4, 5],
				text: '',
			},
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n top:15px;\nbottom: 5px;}',
			fixed: 'a {\n top:15px;\n\nbottom: 5px;}',
			fix: {
				range: [14, 15],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 1,
		},
		{
			code: 'a {\n top: 15px;\n bottom: 5px;}',
			fixed: 'a {\n top: 15px;\n\n bottom: 5px;}',
			fix: {
				range: [15, 16],
				text: '\n\n',
			},
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
	computeEditInfo: true,

	accept: [
		{
			code: "a {\n\n top: 15px; \n\n bottom: 5px; \n /* comment */ \n\n prop: 15px;\n\n @extends 'x';\n prop: 15px; \n & b {\n\n prop: 15px;\n } \n prop: 15px; \n }",
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-html',
	fix: true,
	computeEditInfo: true,
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
					fix: {
						range: [13, 26],
						text: 'color: red;\n\nfo',
					},
				},
				{
					message: messages.expected,
					line: 4,
					column: 2,
					fix: {
						range: [58, 89],
						text: '\tcolor: red;\n\n\tfont-size: 16px;\n',
					},
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['inside-single-line-block'] }],
	customSyntax: 'postcss-html',
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [59, 90],
				text: '\tcolor: red;\n\n\tfont-size: 16px;\n',
			},
			message: messages.expected,
			line: 4,
			column: 2,
		},
	],
});
