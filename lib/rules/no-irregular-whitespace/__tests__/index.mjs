import rule from '../index.mjs';
const { messages, ruleName } = rule;

const IRREGULAR_WHITESPACES = [
	'\u000B', // Line Tabulation (\v) - <VT>
	'\u000C', // Form Feed (\f) - <FF>
	'\u00A0', // No-Break Space - <NBSP>
	'\u0085', // Next Line
	'\u1680', // Ogham Space Mark
	'\u180E', // Mongolian Vowel Separator - <MVS>
	'\uFEFF', // Zero Width No-Break Space - <BOM>
	'\u2000', // En Quad
	'\u2001', // Em Quad
	'\u2002', // En Space - <ENSP>
	'\u2003', // Em Space - <EMSP>
	'\u2004', // Tree-Per-Em
	'\u2005', // Four-Per-Em
	'\u2006', // Six-Per-Em
	'\u2007', // Figure Space
	'\u2008', // Punctuation Space - <PUNCSP>
	'\u2009', // Thin Space
	'\u200A', // Hair Space
	'\u200B', // Zero Width Space - <ZWSP>
	'\u2028', // Line Separator
	'\u2029', // Paragraph Separator
	'\u202F', // Narrow No-Break Space
	'\u205F', // Medium Mathematical Space
	'\u3000', // Ideographic Space
];

const characterToUnicodeString = (str) =>
	`\\u${str.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`;

testRule({
	ruleName,
	config: true,
	accept: [
		{
			code: ' ',
			description: 'regular whitespace',
		},
		{
			code: '\n',
			description: 'new line',
		},
		{
			code: '/* Irregular whitespace\nin multi line comments\nare allowed */',
			description: 'irregular whitespace in multi line comments',
		},
	],

	reject: [
		{
			code: '@ charset "utf-8"',
			description: 'irregular whitespace in at-rule',
			message: messages.unexpected,
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: '@charset  "utf-8"',
			description: 'irregular whitespace after at-rule',
			message: messages.unexpected,
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '.firstClass .secondClass { color: pink; }',
			description: 'irregular whitespace in selector',
			message: messages.unexpected,
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '.firstClass .secondClass  { color: pink; }',
			description: 'irregular whitespace after selector',
			message: messages.unexpected,
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'margin: 1rem 2rem;',
			description: 'irregular whitespace in declaration value',
			message: messages.unexpected,
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'margin: 1rem 2rem ;',
			description: 'irregular whitespace after value',
			message: messages.unexpected,
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '$variable : 5rem;',
			description: 'irregular whitespace in variable name',
			message: messages.unexpected,
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 11,
		},
		// Generic test for all types of irregular whitespaces.
		...IRREGULAR_WHITESPACES.map((ws) => ({
			code: `a[title="irregular${ws}whitespace"] { color: pink; }`,
			description: `irregular whitespace in attribute selector: ${characterToUnicodeString(ws)}`,
			message: messages.unexpected,
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		})),
	],
});
