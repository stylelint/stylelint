'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['a > .foo', /\[data-.+]/],

	accept: [
		{
			code: 'a {}',
		},
		{
			code: '.foo {}',
		},
		{
			code: 'a\n>\n.foo {}',
		},
		{
			code: '.bar > a > .foo {}',
		},
		{
			code: '.foo > a {}',
		},
		{
			code: '.data-auto {}',
		},
		{
			code: 'a[href] {}',
		},
	],

	reject: [
		{
			code: 'a > .foo {}',
			message: messages.rejected('a > .foo'),
			line: 1,
			column: 1,
		},
		{
			code: 'a[data-auto="1"] {}',
			message: messages.rejected('a[data-auto="1"]'),
			line: 1,
			column: 1,
		},
		{
			code: 'a[data-auto] {}',
			message: messages.rejected('a[data-auto]'),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, [data-auto="1"] {}',
			message: messages.rejected('.foo, [data-auto="1"]'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [/\.foo.*>.*\.bar/],

	accept: [
		{
			code: '.bar {}',
		},
		{
			code: '.foo .bar {}',
		},
		{
			code: '.bar { --baz: 1px; }',
		},
	],

	reject: [
		{
			code: '.foo>.bar {}',
			message: messages.rejected('.foo>.bar'),
			line: 1,
			column: 1,
		},
		{
			code: '.foo > .bar {}',
			message: messages.rejected('.foo > .bar'),
			line: 1,
			column: 1,
		},
		{
			code: '.foo > /*comment*/.bar {}',
			message: messages.rejected('.foo > .bar'),
			line: 1,
			column: 1,
		},
		{
			code: '.foo:hover > .bar {}',
			message: messages.rejected('.foo:hover > .bar'),
			line: 1,
			column: 1,
		},
		{
			code: '.foo > a > .bar {}',
			message: messages.rejected('.foo > a > .bar'),
			line: 1,
			column: 1,
		},
		{
			code: 'a > .foo > .bar {}',
			message: messages.rejected('a > .foo > .bar'),
			line: 1,
			column: 1,
		},
		{
			code: 'a, .foo > .bar {}',
			message: messages.rejected('a, .foo > .bar'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['.foo, .bar'],

	accept: [
		{
			code: '.foo > a {}',
		},
		{
			code: '.bar, a {}',
		},
	],

	reject: [
		{
			code: '.foo, .bar {}',
			message: messages.rejected('.foo, .bar'),
			line: 1,
			column: 1,
		},
	],
});
