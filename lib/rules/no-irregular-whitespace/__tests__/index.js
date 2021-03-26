'use strict';

const { messages, ruleName } = require('..');

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
			code: '.firstClass .secondClass { color: pink; }',
			description: 'irregular whitespace in selector',
			message: messages.unexpected,
			line: 1,
			column: 12,
		},
		{
			code: '.firstClass .secondClass  { color: pink; }',
			description: 'irregular whitespace after selector',
			message: messages.unexpected,
			line: 1,
			column: 26,
		},
		{
			code: 'margin: 1rem 2rem;',
			description: 'irregular whitespace in declaration value',
			message: messages.unexpected,
			line: 1,
			column: 13,
		},
		{
			code: 'margin: 1rem 2rem ;',
			description: 'irregular whitespace after value',
			message: messages.unexpected,
			line: 1,
			column: 18,
		},
		{
			code: '$variable : 5rem;',
			description: 'irregular whitespace in variable name',
			message: messages.unexpected,
			line: 1,
			column: 10,
		},
		{
			code: 'a[title="irregular' + '\u0085' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
	],
});

testRule({
	ruleName,
	config: [true, { allow: ['\u2003'] }],

	accept: [
		{
			code: 'a[title="irregular' + '\u2003' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
		},
	],

	reject: [
		{
			code: '.firstClass .secondClass { color: pink; }',
			description: 'irregular whitespace in selector',
			message: messages.unexpected,
			line: 1,
			column: 12,
		},
		{
			code: 'margin: 1rem 2rem;',
			description: 'irregular whitespace in declaration value',
			message: messages.unexpected,
			line: 1,
			column: 13,
		},
		{
			code: '$variable :',
			description: 'irregular whitespace in variable name',
			message: messages.unexpected,
			line: 1,
			column: 10,
		},
	],
});

testRule({
	ruleName,
	config: [true, { only: ['\u00A0'] }],

	accept: [
		{
			code: 'a[title="irregular' + '\u00A0' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
		},
	],

	reject: [
		{
			code: 'a[title="irregular' + '\u000B' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u000C' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u0085' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u1680' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u180E' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\ufeff' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2000' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2001' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2002' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2003' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2004' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2005' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2006' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2007' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2008' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2009' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u200A' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u200B' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2028' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u2029' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u202F' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u205f' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
		{
			code: 'a[title="irregular' + '\u3000' + 'whitespace"] { color: pink; }',
			description: 'irregular whitespace in attribute selector',
			message: messages.unexpected,
			line: 1,
			column: 19,
		},
	],
});
