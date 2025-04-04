import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: ':fullscreen a {}',
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
			code: 'input::placeholder { color: pink; }',
		},
		{
			code: 'a::before {}',
			description: 'handles pseudo-element',
		},
		{
			code: 'a:hover {}',
			description: 'handles pseudo-class',
		},
		{
			code: 'a[data-foo=":-webkit-full-screen"] {}',
			description: 'string',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-no-vendor-prefix */
				:-ms-fullscreen, /* stylelint-disable-next-line selector-no-vendor-prefix */
				:-ms-fullscreen,
				/* stylelint-disable-next-line selector-no-vendor-prefix */
				:-ms-fullscreen
				{}
			`,
		},
	],

	reject: [
		{
			code: ':-webkit-full-screen a {}',
			fixed: ':full-screen a {}',
			fix: {
				range: [1, 9],
				text: '',
			},
			message: messages.rejected(':-webkit-full-screen'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: ':-wEbKiT-fUlL-sCrEeN a {}',
			fixed: ':fUlL-sCrEeN a {}',
			fix: {
				range: [1, 9],
				text: '',
			},
			message: messages.rejected(':-wEbKiT-fUlL-sCrEeN'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: ':-WEBKIT-FULL-SCREEN a {}',
			fixed: ':FULL-SCREEN a {}',
			fix: {
				range: [1, 9],
				text: '',
			},
			message: messages.rejected(':-WEBKIT-FULL-SCREEN'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'body, :-ms-fullscreen a {}',
			fixed: 'body, :fullscreen a {}',
			fix: {
				range: [7, 11],
				text: '',
			},
			message: messages.rejected(':-ms-fullscreen'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'input::-moz-placeholder, input::placeholder { color: pink; }',
			fixed: 'input::placeholder, input::placeholder { color: pink; }',
			fix: {
				range: [7, 12],
				text: '',
			},
			message: messages.rejected('::-moz-placeholder'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'input::-moz-placeholder { color: pink; }',
			fixed: 'input::placeholder { color: pink; }',
			fix: {
				range: [7, 12],
				text: '',
			},
			message: messages.rejected('::-moz-placeholder'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'input::-webkit-input-placeholder { color: pink; }',
			fixed: 'input::input-placeholder { color: pink; }',
			fix: {
				range: [7, 15],
				text: '',
			},
			message: messages.rejected('::-webkit-input-placeholder'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'input::-ms-clear + input::-moz-placeholder {}',
			fixed: 'input::-ms-clear + input::placeholder {}',
			fix: {
				range: [26, 31],
				text: '',
			},
			message: messages.rejected('::-moz-placeholder'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 43,
		},
		{
			code: stripIndent`
				/* a comment */
				:-ms-fullscreen, /* a comment */
				:-ms-fullscreen,
				/* a comment */
				:-ms-fullscreen
				{}
			`,
			fixed: stripIndent`
				/* a comment */
				:fullscreen, /* a comment */
				:fullscreen,
				/* a comment */
				:fullscreen
				{}
			`,
			warnings: [
				{
					message: messages.rejected(':-ms-fullscreen'),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 16,
					fix: {
						range: [17, 21],
						text: '',
					},
				},
				{
					message: messages.rejected(':-ms-fullscreen'),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 16,
					fix: undefined,
				},
				{
					message: messages.rejected(':-ms-fullscreen'),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 16,
					fix: undefined,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreSelectors: ['::-webkit-input-placeholder', '/-moz-.*/', /-screen$/] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'input::-webkit-input-placeholder { color: pink; }',
		},
		{
			code: 'input::-moz-placeholder { color: pink; }',
		},
		{
			code: ':-webkit-full-screen a {}',
		},
	],

	reject: [
		{
			code: 'input::-ms-input-placeholder { color: pink; }',
			fixed: 'input::input-placeholder { color: pink; }',
			fix: {
				range: [7, 11],
				text: '',
			},
			message: messages.rejected('::-ms-input-placeholder'),
		},
	],
});
