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
			code: 'a { clip-path: auto; }',
		},
	],

	reject: [
		{
			code: 'a { clip: auto; }',
			fixed: 'a { clip-path: auto; }',
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
			code: 'a { /* comment */ clip: auto; }',
			fixed: 'a { /* comment */ clip-path: auto; }',
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
			code: 'a { box-lines: unset; }',
			unfixable: true,
			message: messages.rejected('box-lines'),
			column: 5,
			endColumn: 14,
			line: 1,
			endLine: 1,
		},
		{
			code: stripIndent`
				a {
					box-flex: revert;
					box-flex-group: 1;
				}
			`,
			fixed: stripIndent`
				a {
					flex-grow: revert;
					box-flex-group: 1;
				}
			`,
			warnings: [
				{
					message: messages.expected('box-flex', 'flex-grow'),
					fix: { range: [5, 13] },
					column: 2,
					endColumn: 10,
					line: 2,
					endLine: 2,
				},
				{
					message: messages.rejected('box-flex-group'),
					unfixable: true,
					column: 2,
					endColumn: 16,
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
			code: 'a { user-modify: read-only; }',
			message: messages.rejected('user-modify'),
			column: 5,
			endColumn: 16,
			line: 1,
			endLine: 1,
		},
	],
});
