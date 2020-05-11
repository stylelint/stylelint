'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [0],
	skipBasicChecks: true,

	accept: [
		{
			code: '',
			description: 'empty stylesheet',
		},
		{
			code: 'a {}',
			description: 'empty rule',
		},
		{
			code: '@import "foo.css";',
			description: 'blockless statement',
		},
		{
			code: 'a {}',
			description: 'selector with no pseudo-class',
		},
		{
			code: '.foo { .bar { .baz {} } }',
			description: 'nested selectors with no pseudo-classes',
		},
		{
			code: 'a:before {}',
			description: 'single level 2 pseudo-element',
		},
		{
			code: 'a::before {}',
			description: 'single level 3 pseudo-element',
		},
	],

	reject: [
		{
			code: ':global {}',
			message: messages.expected(':global', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'a:first-child {}',
			message: messages.expected('a:first-child', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'a,\na:first-child {}',
			message: messages.expected('a:first-child', 0),
			line: 2,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [0],
	skipBasicChecks: true,
	syntax: 'scss',

	accept: [],

	reject: [
		{
			code: 'a { &:hover {}}',
			message: messages.expected('a:hover', 0),
			line: 1,
			column: 5,
		},
		{
			code: ':global { @include test {} }',
			message: messages.expected(':global', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'a:first-child { @include test {} }',
			message: messages.expected('a:first-child', 0),
			line: 1,
			column: 1,
		},
		{
			code: 'a,\na:first-child { @include test {} }',
			message: messages.expected('a:first-child', 0),
			line: 2,
			column: 1,
		},
		{
			code: '@include test { a { &:hover {}} }',
			message: messages.expected('a:hover', 0),
			line: 1,
			column: 21,
		},
	],
});

testRule({
	ruleName,
	config: [1],
	skipBasicChecks: true,

	accept: [
		{
			code: 'a:first-child {}',
			description: 'selector with one pseudo-class',
		},
		{
			code: '.foo .bar:first-child {}',
			description: 'compound selectors with one pseudo-class',
		},
		{
			code: '.foo > .bar:first-child {}',
			description: 'parent selector with one pseudo-class',
		},
		{
			code: 'a::before:hover {}',
			description: 'selector a pseudo element and a pseudo-class',
		},
		{
			code: '.foo:hover, \n.bar:hover {}',
			description: 'multiple selectors: fewer than max pseudo-classes',
		},
		{
			code: 'a:not(:first-child) {}',
			description: 'two selectors with one pseudo-class each',
		},
	],

	reject: [
		{
			code: 'a:first:focus {}',
			message: messages.expected('a:first:focus', 1),
			line: 1,
			column: 1,
		},
		{
			code: 'a::before:first:focus {}',
			message: messages.expected('a::before:first:focus', 1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo .bar:first-child:hover {}',
			message: messages.expected('.foo .bar:first-child:hover', 1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo > bar:nth-child(2):focus {}',
			message: messages.expected('.foo > bar:nth-child(2):focus', 1),
			line: 1,
			column: 1,
		},
		{
			code: 'input[type=file]:first-of-type:focus {}',
			message: messages.expected('input[type=file]:first-of-type:focus', 1),
			line: 1,
			column: 1,
		},
		{
			code: 'a:not(:first-child:lang(en)) {}',
			message: messages.expected(':first-child:lang(en)', 1),
			line: 1,
			column: 7,
		},
	],
});

testRule({
	ruleName,
	config: [1],
	skipBasicChecks: true,
	syntax: 'scss',

	accept: [],

	reject: [
		{
			code: '.foo:last-child { .bar:first-child { .baz:visited {} } }',
			warnings: [
				{
					message: messages.expected('.foo:last-child .bar:first-child', 1),
					line: 1,
					column: 19,
				},
				{
					message: messages.expected('.foo:last-child .bar:first-child .baz:visited', 1),
					line: 1,
					column: 38,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: 'a:first:hover {}',
			description: 'selector with two pseudo-classes',
		},
	],

	reject: [
		{
			code: 'input:first-of-type:read-only:hover {}',
			message: messages.expected('input:first-of-type:read-only:hover', 2),
			line: 1,
			column: 1,
		},
	],
});
