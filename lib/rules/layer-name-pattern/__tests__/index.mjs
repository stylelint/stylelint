import rule from '../index.mjs';

const { ruleName, messages } = rule;

testRule({
	ruleName,
	config: /^[a-z][a-z0-9-]*$/,
	accept: [
		{ code: '@layer foo;' },
		{ code: '@layer {}' },
		{ code: '@layer foo {}' },
		{ code: '@layer foo-bar {}' },
		{ code: '@layer foo, bar {}' },
		{ code: '@import "foo.css" layer(foo)' },
		{ code: '@import "foo.css" layer(foo, bar)' },
	],
	reject: [
		{
			code: '@layer Foo {}',
			message: messages.expected('Foo', '/^[a-z][a-z0-9-]*$/'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: '@layer foo_bar {}',
			message: messages.expected('foo_bar', '/^[a-z][a-z0-9-]*$/'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@layer foo.Bar {}',
			message: messages.expected('foo.Bar', '/^[a-z][a-z0-9-]*$/'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@layer foo, Bar {}',
			message: messages.expected('Bar', '/^[a-z][a-z0-9-]*$/'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@layer Foo, Bar {}',
			warnings: [
				{
					message: messages.expected('Foo', '/^[a-z][a-z0-9-]*$/'),
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 11,
				},
				{
					message: messages.expected('Bar', '/^[a-z][a-z0-9-]*$/'),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: '@import "foo.css" layer(foo, Bar)',
			message: messages.expected('Bar', '/^[a-z][a-z0-9-]*$/'),
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: '@import "foo.css" layer(Foo, Bar)',
			warnings: [
				{
					message: messages.expected('Foo', '/^[a-z][a-z0-9-]*$/'),
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 28,
				},
				{
					message: messages.expected('Bar', '/^[a-z][a-z0-9-]*$/'),
					line: 1,
					column: 30,
					endLine: 1,
					endColumn: 33,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: 'foo',
	accept: [{ code: '@layer foo {}' }, { code: '@import "bar.css" layer(foo)' }],
	reject: [
		{
			code: '@layer bar {}',
			message: messages.expected('bar', 'foo'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: '@layer foo, baz {}',
			message: messages.expected('baz', 'foo'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '@import "foo.css" layer(bar)',
			message: messages.expected('bar', 'foo'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 28,
		},
	],
});
