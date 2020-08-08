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
			code: 'a { margin: 0 0 0 0 }',
		},
		{
			code: 'a { margin: 0 10px 5rem 2in; }',
		},
		{
			code: 'a { margin: 0 10pX 5rem 2in; }',
		},
		{
			code: 'a { margin: 0 10PX 5rem 2in; }',
		},
		{
			code: 'a { background-position: top right, 1em 5vh; }',
		},
		{
			code: 'a { margin: calc(30vh - 10vh); }',
		},
		{
			code: 'a { animation: animation-name 300ms ease; }',
		},
		{
			code: 'a { -webkit-animation: animation-name 300ms ease; }',
		},
		{
			code: 'a { animation-duration: 3s; }',
		},
		{
			code: 'a { -webkit-animation-duration: 3s; }',
		},
		{
			code: 'a { font-size: /* 100px */ 1.2rem; }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a::before { font-size: "10px"}',
			description: 'ignore unit within quotes',
		},
		{
			code: 'a { font-size: $fs10px; }',
			description: 'ignore preprocessor variable includes unit',
		},
		{
			code: 'a { font-size: --some-fs-10px; }',
			description: 'ignore css variable includes unit',
		},
	],

	reject: [
		{
			code: 'a { font-size: 12px; }',
			message: messages.rejected('font-size', 'px'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { font-size: 12pX; }',
			message: messages.rejected('font-size', 'pX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { font-size: 12PX; }',
			message: messages.rejected('font-size', 'PX'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { margin: 10px 0 5em; }',
			message: messages.rejected('margin', 'em'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { background-position: 0 10%; }',
			message: messages.rejected('background-position', '%'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { background-position: top right, 0 10%; }',
			message: messages.rejected('background-position', '%'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { margin: calc(10vh - 10em); }',
			message: messages.rejected('margin', 'em'),
			column: 25,
		},
		{
			code: 'a { animation: foo 3s; }',
			message: messages.rejected('animation', 's'),
		},
		{
			code: 'a { -webkit-animation: foo 3s; }',
			message: messages.rejected('-webkit-animation', 's'),
		},
	],
});

testRule({
	ruleName,

	config: [
		{
			'/^animation/': ['s'],
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
