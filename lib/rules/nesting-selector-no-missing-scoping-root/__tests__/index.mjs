import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a /* & */ {}',
		},
		{
			code: 'a { & {} }',
		},
		{
			code: 'a { && {} }',
		},
		{
			code: 'a { & .foo {} }',
		},
		{
			code: 'a { .foo & {} }',
		},
		{
			code: 'a { .foo & .bar {} }',
		},
		{
			code: 'a { :not(&) {} }',
		},
		{
			code: 'a { &.foo, &.bar {} }',
		},
		{
			code: 'a { :is(&.foo, &.bar) {} }',
		},
		{
			code: 'a { .foo { & {} } }',
		},
		{
			code: 'a { @media all { & {} } }',
		},
		{
			code: '@scope (a) { & {} }',
		},
		{
			code: 'a { @scope (&) {} }',
		},
		{
			code: 'a { @scope (.foo) to (&) {} }',
		},
		{
			code: 'a { @scope (&) to (.foo) {} }',
		},
	],

	reject: [
		{
			code: '& {}',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 2,
		},
		{
			code: '&& {}',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 2,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: '& .foo {}',
			message: messages.rejected,
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 2,
		},
		{
			code: '.foo & {}',
			message: messages.rejected,
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '.foo & .bar {}',
			message: messages.rejected,
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: ':not(&) {}',
			message: messages.rejected,
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '&.foo, &.bar {}',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 2,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: ':is(&.foo, &.bar) {}',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 6,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '@media all { & {} }',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@media all { & {} .foo & {} }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 15,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: '@scope (&) {}',
			message: messages.rejected,
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '@scope (&) to (a) {}',
			message: messages.rejected,
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '@scope (a) to (&) {}',
			message: messages.rejected,
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: '@scope (&) to (&) {}',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 10,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: ['--foo', '/^--bar-/'] }],

	accept: [
		{
			code: '@--foo { & {} }',
		},
		{
			code: '@--bar-baz qux { & {} }',
		},
	],

	reject: [
		{
			code: '@media all { & {} }',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@--baz { & {} }',
			message: messages.rejected,
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 11,
		},
	],
});
