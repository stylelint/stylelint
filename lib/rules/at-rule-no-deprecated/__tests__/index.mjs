import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@position-try --foo {}',
		},
		{
			code: '@starting-style {}',
		},
		{
			code: '@container (min-width: 700px) {}',
		},
		{
			code: '@CONTAINER (min-width: 500px) {}',
		},
	],

	reject: [
		{
			code: '@document url(http://www.w3.org/);',
			message: messages.rejected('@document'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '@VIEWPORT { orientation: landscape; }',
			message: messages.rejected('@VIEWPORT'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { @nest .foo & {} }',
			message: messages.rejected('@nest'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { @apply foo; }',
			message: messages.rejected('@apply'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: ['document', '/^view/'] }],

	accept: [
		{
			code: '@document url(http://www.w3.org/);',
		},
		{
			code: '@viewport { orientation: landscape; }',
		},
	],

	reject: [
		{
			code: 'a { @apply foo; }',
			message: messages.rejected('@apply'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
	],
});
