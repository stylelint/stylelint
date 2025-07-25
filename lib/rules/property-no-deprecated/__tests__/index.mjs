import rule from '../index.mjs';
import { stripIndent } from 'common-tags';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { clip-path: rect(0, 0, 0, 0); }',
		},
	],

	reject: [
		{
			code: 'a { clip: rect(0, 0, 0, 0); }',
			fixed: 'a { clip-path: rect(0, 0, 0, 0); }',
			fix: {
				range: [7, 8],
				text: 'p-path',
			},
			message: messages.expected('clip', 'clip-path'),
			column: 5,
			endColumn: 9,
			line: 1,
			endLine: 1,
		},
		{
			code: 'a { /* comment */ clip: rect(0, 0, 0, 0); }',
			fixed: 'a { /* comment */ clip-path: rect(0, 0, 0, 0); }',
			fix: {
				range: [21, 22],
				text: 'p-path',
			},
			message: messages.expected('clip', 'clip-path'),
			column: 19,
			endColumn: 23,
			line: 1,
			endLine: 1,
		},
		{
			code: 'a { ime-mode: active; }',
			unfixable: true,
			message: messages.rejected('ime-mode'),
			column: 5,
			endColumn: 13,
			line: 1,
			endLine: 1,
		},
		{
			code: stripIndent`
				a {
					-moz-box-flex: revert;
					image-orientation: from-image;
				}
			`,
			fixed: stripIndent`
				a {
					flex-grow: revert;
					image-orientation: from-image;
				}
			`,
			warnings: [
				{
					message: messages.expected('-moz-box-flex', 'flex-grow'),
					fix: { range: [5, 18] },
					column: 2,
					endColumn: 15,
					line: 2,
					endLine: 2,
				},
				{
					message: messages.rejected('image-orientation'),
					unfixable: true,
					column: 2,
					endColumn: 19,
					line: 3,
					endLine: 3,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [
		true,
		{
			ignoreProperties: [/^grid-/, 'word-wrap'],
		},
	],

	accept: [
		{
			code: 'a { grid-column-gap: 1px; }',
		},
		{
			code: 'a { grid-gap: 1px; }',
		},
		{
			code: 'a { grid-row-gap: 1px; }',
		},
		{
			code: 'a { word-wrap: break-word; }',
		},
	],

	reject: [
		{
			code: 'a { -webkit-user-modify: read-only; }',
			message: messages.rejected('-webkit-user-modify'),
			column: 5,
			endColumn: 24,
			line: 1,
			endLine: 1,
		},
	],
});
