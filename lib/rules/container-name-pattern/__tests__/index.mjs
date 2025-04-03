import rule from '../index.mjs';
import { stripIndent } from 'common-tags';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['foo-.+'],

	accept: [
		{ code: '@container foo-bar {}' },
		{ code: ' @CONTAINER foo-bar   {}' },
		{ code: ' @container foo-bar {}' },
		{ code: '@container foo-bar {\n}' },
		{ code: '@container foo-bar (width > 400px) {}' },
		{ code: '@container foo-bar () {}' },
		{ code: '@container foo-bar style(--cards small) {}' },
		{ code: '@container foo-bar scroll-state(stuck: top) {}' },
		{ code: '@container foo-bar (inline-size > 30em), foo-baz style(--large: true) {}' },
		{ code: '@container foo-bar (inline-size > 30em) and foo-baz style(--large: true) {}' },
		{
			code: '@container () {}',
			description: 'nameless container condition',
		},

		{
			code: stripIndent`
				.my-component {
					container-name: foo-bar;
				}
			`,
		},
		{
			code: stripIndent`
				a { container: foo-bar / inline-size; }
			`,
		},
	],

	reject: [
		{
			code: '@container foo {}',
			message: messages.expected('foo', 'foo-.+'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@container bar {}',
			message: messages.expected('bar', 'foo-.+'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@container FOO-bar {}',
			message: messages.expected('FOO-bar', 'foo-.+'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@container foo-bar (), FOO-bar () {}',
			message: messages.expected('FOO-bar', 'foo-.+'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: stripIndent`
				.my-component {
					container-name: FOO-bar;
				}
			`,
			message: messages.expected('FOO-bar', 'foo-.+'),
			line: 2,
			column: 18,
			endLine: 2,
			endColumn: 25,
		},
		{
			code: '@container bar (inline-size > 30em), baz style(--large: true) {}',
			warnings: [
				{
					message: messages.expected('bar', 'foo-.+'),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 15,
				},
				{
					message: messages.expected('baz', 'foo-.+'),
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 41,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [/^foo-bar$/],

	accept: [
		{
			code: '@container foo-bar {}',
			description: 'Accepts pattern in RegExp notation',
		},
	],

	reject: [
		{
			code: '@container foo-baz {}',
			description: 'Accepts pattern in RegExp notation',
			message: messages.expected('foo-baz', /^foo-bar$/),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
	],
});
