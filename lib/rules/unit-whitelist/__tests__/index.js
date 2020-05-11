'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: ['px', 'em'],

	accept: [
		{
			code: 'a { line-height: 1; }',
		},
		{
			code: 'a { color: #000; }',
		},
		{
			code: 'a { font-size: 14px; }',
		},
		{
			code: 'a { font-size: 14pX; }',
		},
		{
			code: 'a { font-size: 14PX; }',
		},
		{
			code: 'a { font-size: 1.2em; }',
		},
		{
			code: 'a { font-size: .5em; }',
		},
		{
			code: 'a { font-size: 0.5em; }',
		},
		{
			code: 'a { margin: 0 10em 5em 2px; }',
		},
		{
			code: 'a { background-position: top right, 10px 20px; }',
		},
		{
			code: 'a { top: calc(10em - 3em); }',
		},
		{
			code: 'a { top: calc(10em*3); }',
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100px - 50em), silver); }',
		},
		{
			code: 'a { width: /* 100pc */ 1em; }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a::before { content: "10%"}',
			description: 'ignore unit within quotes',
		},
		{
			code: 'a { font-size: $fs10%; }',
			description: 'ignore preprocessor variable includes unit',
		},
		{
			code: 'a { font-size: --some-fs-10rem; }',
			description: 'ignore css variable includes unit',
		},
		{
			code: 'a { background-url: url(10vmin); }',
			description: 'ignore url function',
		},
		{
			code: 'a { background-url: uRl(10vmin); }',
			description: 'ignore url function',
		},
		{
			code: 'a { background-url: URL(10vmin); }',
			description: 'ignore url function',
		},
		{
			code: 'a { margin10rem: 10em; }',
			description: 'ignore property include wrong unit',
		},
		{
			code: 'a10rem { margin: 10em; }',
			description: 'ignore type selector include wrong unit',
		},
		{
			code: '#a10rem { margin: 10em; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: '.a10rem { margin: 10em; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: 'input[type=10rem] { margin: 10em; }',
			description: 'ignore class selector include wrong unit',
		},
		{
			code: 'a:hover10rem { margin: 10em; }',
			description: 'ignore pseudo-class include wrong unit',
		},
		{
			code: 'a::before10rem { margin: 10em; }',
			description: 'ignore pseudo-class include wrong unit',
		},
		{
			code: 'a { margin: calc(100px - #{margin * 2}); }',
			description: 'work with interpolation',
		},
		{
			code: '@media (min-width: 10em) {}',
			description: '@media',
		},
		{
			code: '@media (min-width: 10px)\n  and (max-width: 20em) {}',
			description: 'complex @media',
		},
	],

	reject: [
		{
			code: 'a { font-size: 80%; }',
			message: messages.rejected('%'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { width: 100vmin; }',
			message: messages.rejected('vmin'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { width: 100vMiN; }',
			message: messages.rejected('vMiN'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { width: 100VMIN; }',
			message: messages.rejected('VMIN'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { line-height: .1rem; }',
			message: messages.rejected('rem'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { line-height: 0.1rem; }',
			message: messages.rejected('rem'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { border-left: 1rem solid #ccc; }',
			message: messages.rejected('rem'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { margin: 0 20%; }',
			message: messages.rejected('%'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { margin: 0 0 0 20rem; }',
			message: messages.rejected('rem'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { background-position: top right, 1em 5rem; }',
			message: messages.rejected('rem'),
			line: 1,
			column: 41,
		},
		{
			code: 'a { top: calc(2vh*3); }',
			message: messages.rejected('vh'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { top: calc(100px - 30vh); }',
			message: messages.rejected('vh'),
			line: 1,
			column: 23,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100px - 5vmin), silver); }',
			message: messages.rejected('vmin'),
			line: 1,
			column: 68,
		},
		{
			code: 'a { margin: calc(100px - #{$margin * 2rem}); }',
			message: messages.rejected('rem'),
			line: 1,
			column: 38,
		},
		{
			code: '@media (min-width: 13rem) {}',
			message: messages.rejected('rem'),
			description: '@media',
			line: 1,
			column: 20,
		},
		{
			code: '@media (min-width: 10em)\n  and (max-width: 20rem) {}',
			message: messages.rejected('rem'),
			description: 'complex @media',
			line: 2,
			column: 19,
		},
		{
			code: '@media (width < 10.01REM) {}',
			message: messages.rejected('REM'),
			description: 'media feature range',
			line: 1,
			column: 17,
		},
	],
});

testRule({
	ruleName,

	config: ['px'],

	accept: [
		{
			code: 'a { line-height: 1px; }',
		},
	],

	reject: [
		{
			code: 'a { line-height: 1em; }',
			message: messages.rejected('em'),
			line: 1,
			column: 18,
		},
	],
});

testRule({
	ruleName,

	config: [
		['px', 'em'],
		{
			ignoreProperties: {
				rem: ['line-height', 'margin', '/^border/'],
				'%': ['width', 'height'],
			},
		},
	],

	accept: [
		{
			code: 'a { line-height: 0.1rem; }',
		},
		{
			code: 'a { line-height: 0.1rEm; }',
		},
		{
			code: 'a { margin: 0 20rem; }',
		},
		{
			code: 'a { margin: 0 0 0 20reM; }',
		},
		{
			code: 'a { width: 100%; }',
		},
		{
			code: 'a { height: 50%; }',
		},
		{
			code: 'a { border: 1rem solid purple; }',
		},
		{
			code: 'a { border-bottom-width: 6rem; }',
		},
	],

	reject: [
		{
			code: 'a { font-size: 80%; }',
			message: messages.rejected('%'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100px - 5rem), silver); }',
			message: messages.rejected('rem'),
			line: 1,
			column: 68,
		},
		{
			code: 'a { -moz-border-radius-topright: 40rem; }',
			message: messages.rejected('rem'),
			line: 1,
			column: 34,
		},
	],
});

testRule({
	ruleName,

	config: [
		['px', 'em'],
		{
			ignoreProperties: {
				rem: ['line-height', 'margin', /^border/],
				'%': ['width', 'height'],
			},
		},
	],

	accept: [
		{
			code: 'a { border: 1rem solid purple; }',
		},
		{
			code: 'a { border-bottom-width: 6rem; }',
		},
	],

	reject: [
		{
			code: 'a { font-size: 80%; }',
			message: messages.rejected('%'),
			line: 1,
			column: 16,
		},
	],
});
