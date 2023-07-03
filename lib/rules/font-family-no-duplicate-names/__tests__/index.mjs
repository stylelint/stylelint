import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { font-family: "Lucida Grande", "Arial", sans-serif; }',
		},
		{
			code: 'a { font: 1em "Lucida Grande", \'Arial\', sans-serif; }',
		},
		{
			code: 'a { font: 1em "Lucida Grande", \'Arial\', "sans-serif", sans-serif; }',
		},
		{
			code: 'a { font-family: Times, serif; }',
		},
		{
			code: 'b { font: normal 14px/32px -apple-system, BlinkMacSystemFont, sans-serif; }',
		},
	],

	reject: [
		{
			code: 'a { font-family: "Lucida Grande", \'Arial\', sans-serif, sans-serif; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 56,
			endLine: 1,
			endColumn: 66,
		},
		{
			code: 'a { font-family: \'Arial\', "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Arial'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 49,
		},
		{
			code: 'a { fOnT-fAmIlY: \'  Lucida Grande \', "Lucida Grande", sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: 'a { font-family: \'Times\', Times, "serif", serif; }',
			message: messages.rejected('Times'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { FONT: italic 300 16px/30px Arial, " Arial", serif; }',
			message: messages.rejected('Arial'),
			line: 1,
			column: 39,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: 'b { font: normal 14px/32px -apple-system, BlinkMacSystemFont, sans-serif, sans-serif; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 75,
			endLine: 1,
			endColumn: 85,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreFontFamilyNames: ['monospace', '/my-/', '/^YOUR-/i'] }],

	accept: [
		{
			code: 'pre { font-family: monospace, monospace }',
		},
		{
			code: 'pre { font: 1em monospace, monospace}',
		},
		{
			code: 'pre { font-family: monospace, "Roberto Mono", monospace}',
		},
		{
			code: 'pre { font-family: "my-font", "my-font", sans-serif}',
		},
		{
			code: 'pre { font-family: "your-font", "YOUR-font", sans-serif}',
		},
	],

	reject: [
		{
			code: 'pre { font-family: "Roberto Mono", "Roberto Mono", monospace}',
			message: messages.rejected('Roberto Mono'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: 'pre { font-family: My-font, "My-font", sans-serif}',
			message: messages.rejected('My-font'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 38,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreFontFamilyNames: [/my-/] }],

	accept: [
		{
			code: 'pre { font-family: "my-font", "my-font", sans-serif}',
		},
	],

	reject: [
		{
			code: 'pre { font-family: "Roberto Mono", "Roberto Mono", monospace}',
			message: messages.rejected('Roberto Mono'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 50,
		},
	],
});
