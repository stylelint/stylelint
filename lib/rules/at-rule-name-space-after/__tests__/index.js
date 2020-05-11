'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: '@charset "UTF-8";',
		},
		{
			code: '@charset "UTF-8";',
		},
		{
			code: '@import "x.css";',
		},
		{
			code: '@import "x.css" screen and (orientation:landscape);',
		},
		{
			code: '@import url("x.css");',
		},
		{
			code: '@import url("x.css") screen and (orientation:landscape);',
		},
		{
			code: '@namespace url(XML-namespace-URL);',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape) { }',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape)  { }',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape)\n{ }',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape)\r\n{ }',
		},
		{
			code: '@media (min-width: 700px)  and (orientation: landscape) { }',
		},
		{
			code: '@media (min-width: 700px)\nand (orientation: landscape) { }',
		},
		{
			code: '@media (min-width: 700px)\r\nand (orientation: landscape) { }',
		},
		{
			code: '@supports (animation-name: test) { }',
		},
		{
			code: '@keyframes identifier { }',
		},
		{
			code: '@-webkit-keyframes identifier { }',
		},
		{
			code: '@viewport { }',
		},
		{
			code: '@viewport{ }',
		},
		{
			code: '@viewport\n{ }',
		},
		{
			code: '@viewport\r\n{ }',
		},
		{
			code: '@viewport\n\n{ }',
		},
		{
			code: '@viewport\r\n\r\n{ }',
		},
		{
			code: '@counter-style winners-list { }',
		},
		{
			code: '@font-face { };',
		},
		{
			code: '@unknown "ident";',
		},
		{
			code: '@unknown ident { };',
		},
		{
			code: 'a { color: pink; @crazy-custom-at-rule; }',
		},
	],

	reject: [
		{
			code: '@charset"UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@charset"UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@charset  "UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@charset\n"UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@charset\r\n"UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@charset\n\n"UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@charset\r\n\r\n"UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@media(width <= 100px) { }',
			fixed: '@media (width <= 100px) { }',
			message: messages.expectedAfter('@media'),
			line: 1,
			column: 6,
		},
		{
			code: '@media\n(width <= 100px) { }',
			fixed: '@media (width <= 100px) { }',
			message: messages.expectedAfter('@media'),
			line: 1,
			column: 6,
		},
		{
			code: '@media\r\n(width <= 100px) { }',
			fixed: '@media (width <= 100px) { }',
			message: messages.expectedAfter('@media'),
			line: 1,
			column: 6,
		},
		{
			code: '@media  (width <= 100px) { }',
			fixed: '@media (width <= 100px) { }',
			message: messages.expectedAfter('@media'),
			line: 1,
			column: 6,
		},
		{
			code: '@unknown"ident";',
			fixed: '@unknown "ident";',
			message: messages.expectedAfter('@unknown'),
			line: 1,
			column: 8,
		},
		{
			code: '@unknown"ident" { };',
			fixed: '@unknown "ident" { };',
			message: messages.expectedAfter('@unknown'),
			line: 1,
			column: 8,
		},
		{
			code: '@unknown  ident { };',
			fixed: '@unknown ident { };',
			message: messages.expectedAfter('@unknown'),
			line: 1,
			column: 8,
		},
		{
			code: '@-webkit-keyframes  ident { };',
			fixed: '@-webkit-keyframes ident { };',
			message: messages.expectedAfter('@-webkit-keyframes'),
			line: 1,
			column: 18,
		},
		{
			code: '@media/*comment*/(width <= 100px) { }',
			fixed: '@media /*comment*/(width <= 100px) { }',
			message: messages.expectedAfter('@media'),
			line: 1,
			column: 6,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['always'],

	accept: [
		{
			code: '@nice-blue:#5B83AD;',
			description: 'ignore variables',
		},
		{
			code: '@nice-blue: #5B83AD;',
			description: 'ignore variables',
		},
		{
			code: '@nice-blue:\n#5B83AD;',
			description: 'ignore variables',
		},
		{
			code: '@variable: .bucket; .@{variable} { }',
			description: 'ignore interpolation',
		},
		{
			code: '@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }',
			description: 'ignore passing rulesets to mixins',
		},
		{
			code: '@my-ruleset: { .my-selector { background-color: black; } };',
		},
		{
			code: '.class1 { .mixin(#ddd) }',
			description: 'ignore mixins',
		},
		{
			code: '.button { &-ok {} }',
			description: 'ignore parent selectors',
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: ['always'],

	accept: [
		{
			code: '@mixin mixin() { @content; }; .colors { @include mixin { color: $color; }}',
			description: 'ignore content blocks',
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: '@charset "UTF-8";',
		},
		{
			code: '@charset\n"UTF-8";',
		},
		{
			code: '@charset\r\n"UTF-8";',
		},
		{
			code: '@charset\n\n"UTF-8";',
		},
		{
			code: '@charset\r\n\r\n"UTF-8";',
		},
		{
			code: '@charset "UTF-8";',
		},
		{
			code: '@charset\n"UTF-8";',
		},
		{
			code: '@charset\r\n"UTF-8";',
		},
		{
			code: '@charset\n\n"UTF-8";',
		},
		{
			code: '@charset\r\n\r\n"UTF-8";',
		},
		{
			code: '@import "x.css";',
		},
		{
			code: '@import "x.css" screen and (orientation:landscape);',
		},
		{
			code: '@import url("x.css");',
		},
		{
			code: '@import\nurl("x.css");',
		},
		{
			code: '@import\r\nurl("x.css");',
		},
		{
			code: '@import url("x.css") screen and (orientation:landscape);',
		},
		{
			code: '@namespace url(XML-namespace-URL);',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape) { }',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape)  { }',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape)\n{ }',
		},
		{
			code: '@media (min-width: 700px) and (orientation: landscape)\r\n{ }',
		},
		{
			code: '@media (min-width: 700px)  and (orientation: landscape) { }',
		},
		{
			code: '@media (min-width: 700px)\nand (orientation: landscape) { }',
		},
		{
			code: '@media (min-width: 700px)\r\nand (orientation: landscape) { }',
		},
		{
			code: '@media(min-width: 700px)\nand (orientation: landscape) { }',
		},
		{
			code: '@media(min-width: 700px)\r\nand (orientation: landscape) { }',
		},
		{
			code: '@media(min-width: 700px) and\n(orientation: landscape) { }',
		},
		{
			code: '@media(min-width: 700px) and\r\n(orientation: landscape) { }',
		},
		{
			code: '@media\n(min-width: 700px) and (orientation: landscape) { }',
		},
		{
			code: '@media\r\n(min-width: 700px) and (orientation: landscape) { }',
		},
		{
			code: '@supports (animation-name: test) { }',
		},
		{
			code: '@keyframes identifier { }',
		},
		{
			code: '@-webkit-keyframes identifier { }',
		},
		{
			code: '@viewport { }',
		},
		{
			code: '@viewport{ }',
		},
		{
			code: '@viewport\n{ }',
		},
		{
			code: '@viewport\r\n{ }',
		},
		{
			code: '@viewport\n\n{ }',
		},
		{
			code: '@viewport\r\n\r\n{ }',
		},
		{
			code: '@counter-style winners-list { }',
		},
		{
			code: '@font-face { };',
		},
		{
			code: '@unknown "ident";',
		},
		{
			code: '@unknown ident { };',
		},
	],

	reject: [
		{
			code: '@charset"UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@charset"UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@charset  "UTF-8";',
			fixed: '@charset "UTF-8";',
			message: messages.expectedAfter('@charset'),
			line: 1,
			column: 8,
		},
		{
			code: '@media(width <= 100px) { }',
			fixed: '@media (width <= 100px) { }',
			message: messages.expectedAfter('@media'),
			line: 1,
			column: 6,
		},
		{
			code: '@media  (width <= 100px) { }',
			fixed: '@media (width <= 100px) { }',
			message: messages.expectedAfter('@media'),
			line: 1,
			column: 6,
		},
		{
			code: '@unknown"ident";',
			fixed: '@unknown "ident";',
			message: messages.expectedAfter('@unknown'),
			line: 1,
			column: 8,
		},
		{
			code: '@unknown"ident" { };',
			fixed: '@unknown "ident" { };',
			message: messages.expectedAfter('@unknown'),
			line: 1,
			column: 8,
		},
		{
			code: '@unknown  ident { };',
			fixed: '@unknown ident { };',
			message: messages.expectedAfter('@unknown'),
			line: 1,
			column: 8,
		},
		{
			code: '@-webkit-keyframes  ident { };',
			fixed: '@-webkit-keyframes ident { };',
			message: messages.expectedAfter('@-webkit-keyframes'),
			line: 1,
			column: 18,
		},
	],
});
