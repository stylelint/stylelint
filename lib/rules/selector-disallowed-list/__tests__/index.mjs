import rule from '../index.mjs';
import { stripIndent } from 'common-tags';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['a > .foo', /\[data-.+\]/],

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
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a[data-auto="1"] {}',
			message: messages.rejected('a[data-auto="1"]'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a[data-auto] {}',
			message: messages.rejected('a[data-auto]'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '.foo, [data-auto="1"] {}',
			message: messages.rejected('.foo, [data-auto="1"]'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,
	config: [/^\.(foo)[,\s]?(?!\w).*$/, { ignore: ['inside-block'], splitList: true }],
	accept: [
		{
			code: 'a.foo {}',
		},
		{
			code: 'a\n>\n.foo {}',
		},
		{
			code: '.bar > a > .foo {}',
		},
		{
			code: '.bar { .foo {} }',
		},
		{
			code: '.fooo {}',
		},
	],

	reject: [
		{
			code: '.foo {}',
			message: messages.rejected('.foo'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: '.foo > .bar {}',
			message: messages.rejected('.foo > .bar'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '.foo, .bar {}',
			message: messages.rejected('.foo'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: '.bar, .foo {}',
			message: messages.rejected('.foo'),
			line: 1,
			column: 7,
			endColumn: 11,
			endLine: 1,
		},
	],
});

testRule({
	ruleName,
	config: /\.foo[^>]*>.*\.bar/,

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
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '.foo > .bar {}',
			message: messages.rejected('.foo > .bar'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '.foo > /*comment*/.bar {}',
			message: messages.rejected('.foo > .bar'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '.foo:hover > .bar {}',
			message: messages.rejected('.foo:hover > .bar'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '.foo > a > .bar {}',
			message: messages.rejected('.foo > a > .bar'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a > .foo > .bar {}',
			message: messages.rejected('a > .foo > .bar'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a, .foo > .bar {}',
			message: messages.rejected('a, .foo > .bar'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
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

testRule({
	ruleName,
	config: [[/from/, /[0-9]/], { ignore: ['keyframe-selectors'] }],

	accept: [
		{
			code: stripIndent`
				@keyframes fade-in {
					from { opacity: 0; }
				}
			`,
		},
		{
			code: stripIndent`
				@keyframes fade-in {
					0% {}
				}
			`,
		},
	],

	reject: [
		{
			code: '.from {}',
			message: messages.rejected('.from'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: '.color-0% {}',
			message: messages.rejected('.color-0%'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: stripIndent`
				@keyframes fade-in {
					from, to {}
				}
			`,
			message: messages.rejected('from, to'),
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,
	config: [/from/, { ignore: ['keyframe-selectors'], splitList: true }],

	accept: [
		{
			code: stripIndent`
				@keyframes fade-in {
					from {}
				}
			`,
		},
		{
			code: stripIndent`
				@keyframes fade-in {
					from, to {}
				}
			`,
		},
	],
});
