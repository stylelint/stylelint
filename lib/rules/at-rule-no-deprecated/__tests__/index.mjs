import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,

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
			unfixable: true,
			message: messages.rejected('@document'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '@VIEWPORT { orientation: landscape; }',
			unfixable: true,
			message: messages.rejected('@VIEWPORT'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { @nest .foo & {} }',
			fixed: 'a { .foo & {} }',
			message: messages.rejected('@nest'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { @apply foo; }',
			unfixable: true,
			message: messages.rejected('@apply'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a { @nest .foo {} @nest .bar {} }',
			fixed: 'a { .foo {} .bar {} }',
			description: 'two nested @nest at-rules',
			warnings: [
				{
					message: rule.messages.rejected('@nest'),
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 12,
				},
				{
					message: rule.messages.rejected('@nest'),
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 25,
				},
			],
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
