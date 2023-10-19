import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['>', ' '],

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a, b {}',
		},
		{
			code: 'a /for/ b {}',
		},
		{
			code: 'a > b {}',
		},
		{
			code: 'a:not(b > c) {}',
		},
		{
			code: 'a b {}',
		},
		{
			code: 'a\tb {}',
		},
		{
			code: 'a\nb {}',
		},
	],

	reject: [
		{
			code: 'a ~ b {}',
			message: messages.rejected('~'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a:not(b ~ c) {}',
			message: messages.rejected('~'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a,\nb + c {}',
			message: messages.rejected('+'),
			line: 2,
			column: 3,
			endLine: 2,
			endColumn: 4,
		},
	],
});

testRule({
	ruleName,
	config: '~',

	accept: [
		{
			code: 'a ~ b {}',
		},
	],

	reject: [
		{
			code: 'a b {}',
			message: messages.rejected(' '),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a\tb {}',
			message: messages.rejected(' '),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a\n\tb {}',
			message: messages.rejected(' '),
			line: 1,
			column: 2,
			endLine: 2,
			endColumn: 2,
		},
	],
});
