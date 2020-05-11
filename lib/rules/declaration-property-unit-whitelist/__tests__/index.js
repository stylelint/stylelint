'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [
		{
			'font-size': ['px', 'em'],
			margin: ['em'],
			'background-position': ['%'],
			animation: ['s'],
			'line-height': [],
		},
	],

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { top: 0; }',
		},
		{
			code: 'a { color: #000; }',
		},
		{
			code: 'a { margin: 0 0 0 0; }',
		},
		{
			code: 'a { margin: 0 10em; }',
		},
		{
			code: 'a { margin: 0 10eM; }',
		},
		{
			code: 'a { margin: 0 10EM; }',
		},
		{
			code: 'a { background-position: top right, 0 50%; }',
		},
		{
			code: 'a { margin: calc(30em - 10em); }',
		},
		{
			code: 'a { animation: animation-name 1s ease; }',
		},
		{
			code: 'a { -webkit-animation: animation-name 1s ease; }',
		},
		{
			code: 'a { line-height: 1; }',
		},
		{
			code: 'a { font-size: /* 1.2rem */ 12px; }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a::before { font-size: "1.2rem"}',
			description: 'ignore unit within quotes',
		},
		{
			code: 'a { font-size: $fs1rem; }',
			description: 'ignore preprocessor variable includes unit',
		},
		{
			code: 'a { font-size: --some-fs-1rem; }',
			description: 'ignore css variable includes unit',
		},
	],

	reject: [
		{
			code: 'a { font-size: 1.2rem; }',
			message: messages.rejected('font-size', 'rem'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { font-size: 1.2rEm; }',
			message: messages.rejected('font-size', 'rEm'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { font-size: 1.2REM; }',
			message: messages.rejected('font-size', 'REM'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { margin: 10em 0 1rem; }',
			message: messages.rejected('margin', 'rem'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { background-position: 0 10px; }',
			message: messages.rejected('background-position', 'px'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { background-position: top right, 0 10px; }',
			message: messages.rejected('background-position', 'px'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { margin: calc(10em - 10px); }',
			message: messages.rejected('margin', 'px'),
			column: 25,
		},
		{
			code: 'a { animation: animation-name 300ms ease; }',
			message: messages.rejected('animation', 'ms'),
			column: 31,
		},
		{
			code: 'a { -webkit-animation: animation-name 300ms ease; }',
			message: messages.rejected('-webkit-animation', 'ms'),
			column: 39,
		},
		{
			code: 'a { line-height: 1.2em; }',
			message: messages.rejected('line-height', 'em'),
			column: 18,
		},
	],
});

testRule({
	ruleName,

	config: [
		{
			'/^animation/': ['ms'],
		},
	],

	skipBasicChecks: true,

	accept: [
		{
			code: 'a { animation: animation-name 300ms ease; }',
		},
		{
			code: 'a { -webkit-animation: animation-name 300ms ease; }',
		},
		{
			code: 'a { animation-duration: 300ms; }',
		},
		{
			code: 'a { -webkit-animation-duration: 300ms; }',
		},
	],

	reject: [
		{
			code: 'a { animation: animation-name 3s ease; }',
			message: messages.rejected('animation', 's'),
		},
		{
			code: 'a { -webkit-animation: animation-name 3s ease; }',
			message: messages.rejected('-webkit-animation', 's'),
		},
		{
			code: 'a { animation-duration: 3s; }',
			message: messages.rejected('animation-duration', 's'),
		},
		{
			code: 'a { -webkit-animation-duration: 3s; }',
			message: messages.rejected('-webkit-animation-duration', 's'),
		},
	],
});
