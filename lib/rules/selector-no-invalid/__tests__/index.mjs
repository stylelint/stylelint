import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a {}',
		},
		{
			code: '.foo {}',
		},
		{
			code: 'a, b {}',
		},
		{
			code: 'a > b {}',
		},
		{
			code: 'a + b {}',
		},
		{
			code: 'a ~ b {}',
		},
		{
			code: '[foo] {}',
		},
		{
			code: '[foo="bar"] {}',
		},
		{
			code: ':hover {}',
		},
		{
			code: ':nth-child(2n+1) {}',
		},
		{
			code: ':not(.foo) {}',
		},
		{
			code: ':is(a, b) {}',
		},
		{
			code: ':has(> a) {}',
		},
		{
			code: '::before {}',
		},
		{
			code: '& a {}',
		},
		{
			code: '&:hover {}',
		},
		{
			code: ':dir(ltr) {}',
		},
		{
			code: ':dir(rtl) {}',
		},
		{
			code: ':dir(rtl), :lang(en) {}',
		},

		{
			code: '@keyframes foo { from {} 50% {} to {} }',
		},
	],

	reject: [
		{
			code: 'a ) b {}',
			message: messages.rejected('a ) b', 'unexpected input'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 4,
			description: 'Stray closing parenthesis',
		},
		{
			code: ', a {}',
			message: messages.rejected(', a', 'selector is expected'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 2,
			description: 'Leading comma',
		},
		{
			code: ':nth-child(2n+) {}',
			message: messages.rejected(':nth-child(2n+)', 'integer is expected'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 16,
			description: 'Trailing operator in An+B',
		},
		{
			code: '[0foo] {}',
			message: messages.rejected('[0foo]', 'identifier is expected'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
			description: 'Attribute name starting with a digit',
		},
		{
			code: '[foo==bar] {}',
			message: messages.rejected('[foo==bar]', 'identifier is expected'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 7,
			description: 'Doubled operator in attribute selector',
		},
		{
			code: '.foo..bar {}',
			message: messages.rejected('.foo..bar', 'identifier is expected'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 7,
			description: 'Doubled class dot',
		},
		{
			code: ':dir() {}',
			message: messages.rejected(':dir()', 'expected "ltr" or "rtl"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 7,
			description: 'Empty :dir() argument',
		},
		{
			code: ':dir(foo) {}',
			message: messages.rejected(':dir(foo)', 'expected "ltr" or "rtl"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
			description: 'Invalid argument to :dir()',
		},
		{
			code: ':dir(foo), :DIR(bar) {}',
			warnings: [
				{
					message: messages.rejected(':dir(foo)', 'expected "ltr" or "rtl"'),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
				{
					message: messages.rejected(':DIR(bar)', 'expected "ltr" or "rtl"'),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: true,
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '#{$foo} {}',
		},
		{
			code: '%foo {}',
		},
	],
});
