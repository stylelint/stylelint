import rule from '../index.mjs';
import { stripIndent } from 'common-tags';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['foo-.+'],

	accept: [
		{ code: '@container foo-bar {}' },
		{ code: ' @container foo-bar   {}' },
		{ code: ' @container foo-bar {}' },
		{ code: '@container foo-bar {\n}' },
		{ code: '@container foo-bar (width > 400px) {}' },
		{ code: '@container foo-bar () {}' },
		{ code: '@container foo-bar style(--cards small) {}' },
		{ code: '@container foo-bar scroll-state(stuck: top) {}' },
		{ code: '@container foo-bar (inline-size > 30em), foo-baz style(--large: true) {}' },
		{ code: '@container foo-bar (inline-size > 30em) and foo-baz style(--large: true) {}' },

		/*
		{
			code: stripIndent`
				.my-component {
					container-type: inline-size;
					container-name: my-component-library;
				}' }
			`,
		},
		*/
		{
			code: stripIndent`
				.grid-item {
				  container: foo-bar / inline-size;
				}
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
		{
			code: '@container () {}',
			description: 'nameless container condition',
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

testRule({
	ruleName,
	config: /^[a-z][a-z0-9-]*$/,
	accept: [{ code: '@container foo {}' }, { code: '@container foo-bar {}' }],
	reject: [
		{
			code: '@container Foo {}',
			message: messages.expected('Foo', '/^[a-z][a-z0-9-]*$/'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@container foo_bar {}',
			message: messages.expected('foo_bar', '/^[a-z][a-z0-9-]*$/'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@container foo.Bar {}',
			message: messages.expected('foo.Bar', '/^[a-z][a-z0-9-]*$/'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
	],
});
