import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '',
		},
		{
			code: 'a {}',
		},
		{
			code: '& {}',
		},
		{
			code: 'a { &:hover {} }',
		},
		{
			code: 'a { &.foo {} }',
		},
		{
			code: 'a { &#foo {} }',
		},
		{
			code: 'a { &[foo] {} }',
		},
		{
			code: 'a { & .foo {} }',
		},
		{
			code: 'a { & > .foo {} }',
		},
		{
			code: 'a { &::before { content: ""; } }',
		},
		{
			code: 'a & {}',
		},
		{
			code: '@media all { a {} }',
		},
		{
			code: 'a { @media all { color: red; } }',
		},
		{
			code: 'a { /* comment */ &.foo {} }',
			description: 'with comment',
		},
		{
			code: 'a { & /* comment */ .foo {} }',
			description: 'nesting selector with comment',
		},
	],

	reject: [
		{
			code: 'a { & {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a { @media all { & {} } }',
			message: messages.rejected,
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@scope (a) { & {} }',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { @media all {} & {} }',
			message: messages.rejected,
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { & {} & {} }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 9,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: 'a { & /* foo */ {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 19,
			description: 'with comment',
		},
		{
			code: 'a { /* foo */ & {} }',
			message: messages.rejected,
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 19,
		},
	],
});
