import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [
		true,
		{
			ignoreAnnotations: ['/^--foo-/', '--bar'],
		},
	],

	accept: [
		{
			code: 'a { color: green !important; }',
		},
		{
			code: 'a { color: green !IMPORTANT; }',
		},
		{
			code: 'a { color: green !ImPoRtAnT; }',
		},
		{
			code: 'a { color: green !--foo--bar; }',
		},
		{
			code: 'a { color: green !--bar; }',
		},
	],

	reject: [
		{
			code: 'a { color: green !imprtant }',
			message: messages.rejected('!imprtant'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { color: green !IMPRTANT }',
			message: messages.rejected('!IMPRTANT'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { color: green !ImPrTaNt }',
			message: messages.rejected('!ImPrTaNt'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: [true],

	accept: [
		{
			code: 'a { color: #{$green} !imprtant; }',
		},
	],
});
