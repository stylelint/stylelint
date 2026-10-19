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
		{
			code: ':nth-child(2n of .foo) {}',
		},
		{
			code: ':host {}',
		},
		{
			code: ':host(.foo) {}',
		},
		{
			code: ':host-context(::before) {}',
			description: 'ignore deprecated',
		},
		{
			code: '::slotted(.foo) {}',
		},
		{
			code: '::before::marker {}',
			description: 'sub-pseudo-element',
		},
		{
			code: '::part(foo)::before {}',
			description: 'element-backed pseudo-element',
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
			message: messages.rejected(':dir()', 'expected "ltr" or "rtl" within ":dir()"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 7,
			description: 'Empty :dir() argument',
		},
		{
			code: ':dir(foo) {}',
			message: messages.rejected(':dir(foo)', 'expected "ltr" or "rtl" within ":dir()"'),
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
					message: messages.rejected(':dir(foo)', 'expected "ltr" or "rtl" within ":dir()"'),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
				{
					message: messages.rejected(':DIR(bar)', 'expected "ltr" or "rtl" within ":dir()"'),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: ':not(::before) {}',
			message: messages.rejected(':not(::before)', 'pseudo-elements are invalid within ":not()"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '.foo:has(::before) {}',
			message: messages.rejected(
				'.foo:has(::before)',
				'pseudo-elements are invalid within ":has()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: ':nth-child(2n of ::before) {}',
			message: messages.rejected(
				':nth-child(2n of ::before)',
				'pseudo-elements are invalid within ":nth-child()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: ':host(::before) {}',
			message: messages.rejected(':host(::before)', 'pseudo-elements are invalid within ":host()"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '::slotted(::before) {}',
			message: messages.rejected(
				'::slotted(::before)',
				'pseudo-elements are invalid within "::slotted()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '.foo:has(.bar:has(.baz)) {}',
			message: messages.rejected('.foo:has(.bar:has(.baz))', '":has()" is invalid within ":has()"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '::slotted(a .foo) {}',
			message: messages.rejected(
				'::slotted(a .foo)',
				'combinators are invalid within "::slotted()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '::slotted(> a) {}',
			message: messages.rejected('::slotted(> a)', 'combinators are invalid within "::slotted()"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: ':host(a .foo) {}',
			message: messages.rejected(':host(a .foo)', 'combinators are invalid within ":host()"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'a::after .foo {}',
			message: messages.rejected('a::after .foo', 'combinators are invalid after "::after"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: '::slotted(a) .foo {}',
			message: messages.rejected(
				'::slotted(a) .foo',
				'combinators are invalid after "::slotted()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '::after::before {}',
			message: messages.rejected('::after::before', '"::before" is invalid after "::after"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: ':is(:not(::before)) {}',
			message: messages.rejected(
				':is(:not(::before))',
				'pseudo-elements are invalid within ":not()"',
			),
			description: 'within a forgiving selector list',
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '.foo:has(:where(.bar:has(.baz))) {}',
			message: messages.rejected(
				'.foo:has(:where(.bar:has(.baz)))',
				'":has()" is invalid within ":has()"',
			),
			description: 'within a forgiving selector list',
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: ':NOT(::BEFORE) {}',
			message: messages.rejected(':NOT(::BEFORE)', 'pseudo-elements are invalid within ":not()"'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '::slotted(a .foo) .foo {}',
			warnings: [
				{
					message: messages.rejected(
						'::slotted(a .foo) .foo',
						'combinators are invalid within "::slotted()"',
					),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 23,
				},
				{
					message: messages.rejected(
						'::slotted(a .foo) .foo',
						'combinators are invalid after "::slotted()"',
					),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 23,
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
