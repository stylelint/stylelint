'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [
		true,
		{
			ignoreAnnotations: ['!custom', '/^!my-/'],
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
			code: 'a { color: green !custom; }',
		},
		{
			code: 'a { color: green !my-custom-annotation; }',
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
