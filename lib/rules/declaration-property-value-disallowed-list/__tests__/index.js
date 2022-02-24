'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,

	config: [
		{
			// regular string
			'text-transform': 'uppercase',
			// regexes
			transform: ['/scale3d/', '/rotate3d/', '/translate3d/'],
			// mixed string and regex
			color: ['red', 'green', 'blue', '/^sea/'],
		},
	],

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: lightgreen; }',
		},
		{
			code: 'a { text-transform: lowercase; }',
		},
		{
			code: 'a { transform: matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0) translate(12px, 50%); }',
		},
		{
			code: 'a { -webkit-transform: matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0) translate(12px, 50%); }',
		},
		{
			code: 'a { color: /* red */ pink; }',
			description: 'ignore value within comments',
		},
		{
			code: 'a::before { color: "red"}',
			description: 'ignore value within quotes',
		},
		{
			code: 'a { color: $red; }',
			description: 'ignore preprocessor variable includes value',
		},
		{
			code: 'a { color: --some-red; }',
			description: 'ignore css variable includes value',
		},
		{
			code: 'a { color: darkseagreen }',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			message: messages.rejected('color', 'red'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { color: green }',
			message: messages.rejected('color', 'green'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { text-transform: uppercase; }',
			message: messages.rejected('text-transform', 'uppercase'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { transform: scale3d(1, 2, 3) }',
			message: messages.rejected('transform', 'scale3d(1, 2, 3)'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { -webkit-transform: scale3d(1, 2, 3) }',
			message: messages.rejected('-webkit-transform', 'scale3d(1, 2, 3)'),
			column: 24,
		},
		{
			code: 'a { color: seagreen }',
			message: messages.rejected('color', 'seagreen'),
			column: 12,
		},
	],
});

testRule({
	ruleName,

	config: [
		{
			'/^animation/': ['/ease/'],
		},
	],

	accept: [
		{
			code: 'a { animation: foo 1s linear; }',
		},
		{
			code: 'a { -webkit-animation: foo 1s linear; }',
		},
		{
			code: 'a { animation-timing-function: linear; }',
		},
		{
			code: 'a { -webkit-animation-timing-function: linear; }',
		},
	],

	reject: [
		{
			code: 'a { animation: foo 1s ease-in-out; }',
			message: messages.rejected('animation', 'foo 1s ease-in-out'),
		},
		{
			code: 'a { -webkit-animation: foo 1s ease-in-out; }',
			message: messages.rejected('-webkit-animation', 'foo 1s ease-in-out'),
		},
		{
			code: 'a { animation-timing-function: ease-in-out; }',
			message: messages.rejected('animation-timing-function', 'ease-in-out'),
		},
		{
			code: 'a { -webkit-animation-timing-function: ease-in-out; }',
			message: messages.rejected('-webkit-animation-timing-function', 'ease-in-out'),
		},
	],
});

testRule({
	ruleName,

	config: [
		{
			'/^animation/': [/ease/],
		},
	],

	accept: [
		{
			code: 'a { animation: foo 1s linear; }',
		},
	],

	reject: [
		{
			code: 'a { animation: foo 1s ease-in-out; }',
			message: messages.rejected('animation', 'foo 1s ease-in-out'),
		},
		{
			code: 'a { -webkit-animation: foo 1s ease-in-out; }',
			message: messages.rejected('-webkit-animation', 'foo 1s ease-in-out'),
		},
		{
			code: 'a { animation-timing-function: ease-in-out; }',
			message: messages.rejected('animation-timing-function', 'ease-in-out'),
		},
		{
			code: 'a { -webkit-animation-timing-function: ease-in-out; }',
			message: messages.rejected('-webkit-animation-timing-function', 'ease-in-out'),
		},
	],
});

testRule({
	ruleName,
	config: { position: ['fixed'] },
	accept: [
		{
			code: 'a { font-size: 1em; }',
			description: 'irrelevant CSS',
		},
	],
});
