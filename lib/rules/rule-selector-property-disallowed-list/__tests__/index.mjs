import rule from '../index.mjs';
import { stripIndent } from 'common-tags';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: {
		a: ['color', '/margin/'],
		'/foo/': '/size/',
	},

	accept: [
		{
			code: 'a { background: red; }',
		},
		{
			code: 'a { padding-top: 0px; }',
		},
		{
			code: 'a { background-color: red; }',
		},
		{
			code: 'a { b { color: red; } }',
		},
		{
			code: 'b { & a { color: red; } }',
		},
		{
			code: 'a[href="#"] { color: red; }',
		},
		{
			code: 'html.foo { color: red; }',
		},
		{
			code: 'html[data-foo] { color: red; }',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			message: messages.rejected('a', 'color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { background: red; color: red; }',
			message: messages.rejected('a', 'color'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { @media screen { color: red; } }',
			message: messages.rejected('a', 'color'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { margin-top: 0px; }',
			message: messages.rejected('a', 'margin-top'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { color: red; margin-top: 0px; }',
			warnings: [
				{
					message: messages.rejected('a', 'color'),
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 10,
				},
				{
					message: messages.rejected('a', 'margin-top'),
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: '[data-foo] { font-size: 1rem; }',
			message: messages.rejected('[data-foo]', 'font-size'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'html[data-foo] { font-size: 1px; }',
			message: messages.rejected('html[data-foo]', 'font-size'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'b { a { color: red; } }',
			message: messages.rejected('a', 'color'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'a { b { width: 100% } color: red; }',
			message: messages.rejected('a', 'color'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 28,
		},
	],
});

testRule({
	ruleName,
	config: [{ a: 'color' }, { message: 'foo' }],

	reject: [
		{
			code: 'a { color: red; }',
			message: `foo (${ruleName})`,
			description: 'custom message',
		},
	],
});

testRule({
	ruleName,
	config: {
		'/^((?!input).)*$/': 'color',
	},

	accept: [
		{
			code: '.foo input { color: red; }',
		},
		{
			code: '.foo { & input { color: red; } }',
		},
		{
			code: 'input .foo { color: red; }',
		},
	],

	reject: [
		{
			code: '.foo form { color: red; }',
			message: messages.rejected('.foo form', 'color'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '.search { & form { color: red; } }',
			message: messages.rejected('& form', 'color'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'input { & .foo { color: red; } }',
			message: messages.rejected('& .foo', 'color'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
	],
});

testRule({
	ruleName,
	config: [{ '/^[a-z]+$/': ['opacity'] }, { ignore: ['keyframe-selectors'] }],

	accept: [
		{
			code: stripIndent`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
				}
			`,
		},
	],
});
