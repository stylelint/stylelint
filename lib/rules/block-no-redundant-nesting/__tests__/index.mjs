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
			code: 'a { color: red; }',
		},
		{
			code: 'a { &:hover { color: red; } }',
		},
		{
			code: 'a { &.foo { color: red; } }',
		},
		{
			code: 'a { &#bar { color: red; } }',
		},
		{
			code: 'a { &[href] { color: red; } }',
		},
		{
			code: 'a { & span { color: red; } }',
		},
		{
			code: 'a { & > span { color: red; } }',
		},
		{
			code: 'a { &::before { content: ""; } }',
		},
		{
			code: '.foo & { color: red; }',
		},
		{
			code: 'a { b { color: red; } }',
		},
		{
			code: '@media print { a { color: red; } }',
		},
		{
			code: 'a { @media print { &:hover { color: red; } } }',
		},
		{
			code: 'a { /* comment */ &:hover { color: red; } }',
			description: 'with comment',
		},
		{
			code: 'a { & /* comment */ :hover { color: red; } }',
			description: 'nesting selector with comment',
		},
	],

	reject: [
		{
			code: 'a { & {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a {\n  & {\n    color: red;\n  }\n}',
			message: messages.rejected,
			line: 2,
			column: 3,
		},
		{
			code: 'a { @media all { & {} } }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: '@scope (a) { & {} }',
			message: messages.rejected,
			line: 1,
			column: 14,
		},
		{
			code: 'a { @media all {} & {} }',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { & {} & {} }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 5,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 10,
				},
			],
		},
		{
			code: 'a { & /* comment */ {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
			description: 'with comment',
		},
	],
});
