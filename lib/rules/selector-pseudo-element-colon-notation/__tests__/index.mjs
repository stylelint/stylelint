import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['single'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a:before { color: pink; }',
		},
		{
			code: 'a:after { color: pink; }',
		},
		{
			code: 'a:first-letter { color: pink; }',
		},
		{
			code: 'a:first-line { color: pink; }',
		},
		{
			code: "a:before, a[data-before='before'] { color: pink; }",
		},
		{
			code: '::selection { color: pink; }',
		},
		{
			code: 'a::spelling-error { color: pink; }',
		},
		{
			code: 'a::grammar-error { color: pink; }',
		},
		{
			code: 'a\\:before { color: pink; }',
		},
		{
			code: 'li::marker { font-variant-numeric: tabular-nums; }',
		},
		{
			code: 'input::placeholder { color: pink; }',
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
			code: stripIndent`
				/* stylelint-disable-next-line selector-pseudo-element-colon-notation */
				a::after, /* stylelint-disable-next-line selector-pseudo-element-colon-notation */
				a::after,
				/* stylelint-disable-next-line selector-pseudo-element-colon-notation */
				a::after
				{}
			`,
		},
	],

	reject: [
		{
			code: 'a::before { color: pink; }',
			fixed: 'a:before { color: pink; }',
			fix: {
				range: [2, 3],
				text: '',
			},
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::bEfOrE { color: pink; }',
			fixed: 'a:bEfOrE { color: pink; }',
			fix: {
				range: [2, 3],
				text: '',
			},
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::BEFORE { color: pink; }',
			fixed: 'a:BEFORE { color: pink; }',
			fix: {
				range: [2, 3],
				text: '',
			},
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::after { color: pink; }',
			fixed: 'a:after { color: pink; }',
			fix: {
				range: [2, 3],
				text: '',
			},
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::first-line { color: pink; }',
			fixed: 'a:first-line { color: pink; }',
			fix: {
				range: [2, 3],
				text: '',
			},
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::first-letter { color: pink; }',
			fixed: 'a:first-letter { color: pink; }',
			fix: {
				range: [2, 3],
				text: '',
			},
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a\\:before-none::before { color: pink; }',
			fixed: 'a\\:before-none:before { color: pink; }',
			fix: {
				range: [15, 16],
				text: '',
			},
			message: messages.expected('single'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a::before, a::after, a::first-letter { color: pink; }',
			fixed: 'a:before, a:after, a:first-letter { color: pink; }',
			warnings: [
				{
					message: messages.expected('single'),
					fix: {
						range: [2, 3],
						text: '',
					},
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
				{
					message: messages.expected('single'),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 15,
				},
				{
					message: messages.expected('single'),
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: stripIndent`
				/* a comment */
				a::after, /* a comment */
				a::after,
				/* a comment */
				a::after
				{}
			`,
			fixed: stripIndent`
				/* a comment */
				a:after, /* a comment */
				a:after,
				/* a comment */
				a:after
				{}
			`,
			warnings: [
				{
					message: messages.expected('single'),
					fix: {
						range: [18, 19],
						text: '',
					},
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 4,
				},
				{
					message: messages.expected('single'),
					line: 3,
					column: 2,
					endLine: 3,
					endColumn: 4,
				},
				{
					message: messages.expected('single'),
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 4,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['double'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a::before { color: pink; }',
		},
		{
			code: 'a::after { color: pink; }',
		},
		{
			code: 'a::first-letter { color: pink; }',
		},
		{
			code: 'a::first-line { color: pink; }',
		},
		{
			code: "a::before, a[data-before='before'] { color: pink; }",
		},
		{
			code: '::selection { color: pink; }',
		},
		{
			code: 'a::spelling-error { color: pink; }',
		},
		{
			code: 'a::grammar-error { color: pink; }',
		},
		{
			code: 'li::marker { font-variant-numeric: tabular-nums; }',
		},
		{
			code: 'input::placeholder { color: pink; }',
		},
	],

	reject: [
		{
			code: 'a:before { color: pink; }',
			fixed: 'a::before { color: pink; }',
			fix: {
				range: [1, 2],
				text: '::',
			},
			message: messages.expected('double'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a:after { color: pink; }',
			fixed: 'a::after { color: pink; }',
			fix: {
				range: [1, 2],
				text: '::',
			},
			message: messages.expected('double'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a:first-line { color: pink; }',
			fixed: 'a::first-line { color: pink; }',
			fix: {
				range: [1, 2],
				text: '::',
			},
			message: messages.expected('double'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a:first-letter { color: pink; }',
			fixed: 'a::first-letter { color: pink; }',
			fix: {
				range: [1, 2],
				text: '::',
			},
			message: messages.expected('double'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a:before, a:after, a:first-letter { color: pink; }',
			fixed: 'a::before, a::after, a::first-letter { color: pink; }',
			warnings: [
				{
					message: messages.expected('double'),
					fix: {
						range: [1, 2],
						text: '::',
					},
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 3,
				},
				{
					message: messages.expected('double'),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 13,
				},
				{
					message: messages.expected('double'),
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
	],
});
