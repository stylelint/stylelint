'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: `
			@import 'foo.css';
			a {}
			`,
			description: '@import on first line',
		},
		{
			code: `
			/* some comment */
			@import 'foo.css';
			`,
			description: '@import after comment',
		},
		{
			code: `
			@charset 'utf-8';
			@import 'foo.css';
			`,
			description: '@import after @charset ',
		},
		{
			code: `
			@import 'foo.css';
			@import 'bar.css';
			`,
			description: '@import after another @import',
		},
		{
			code: `
			@CHARSET 'utf-8';
			@imPORT 'foo.css';
			@import 'bar.css';
			`,
			description: 'case insensitive',
		},
	],

	reject: [
		{
			code: `
			a {}
			@import 'foo.css';
			`,
			message: messages.rejected('foo.css'),
			description: '@import after selector',
			line: 3,
			column: 4,
		},
		{
			code: `
			@media print {}
			@import url('foo.css');
			`,
			message: messages.rejected('foo.css'),
			description: '@import after another at-rule',
			line: 3,
			column: 4,
		},
		{
			code: `
			@media print {}
			@imPort URl('foo.css');
			`,
			message: messages.rejected('foo.css'),
			description: 'case insensitive',
			line: 3,
			column: 4,
		},
	],
});
