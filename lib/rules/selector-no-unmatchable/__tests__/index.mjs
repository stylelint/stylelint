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
			code: 'a:hover {}',
		},
		{
			code: 'a::before {}',
		},
		{
			code: 'a { .foo {} }',
		},
		{
			code: 'a { &::before {} }',
		},
		{
			code: '@keyframes foo { to {} }',
		},
		{
			code: '::slotted(a):hover {}',
		},
		{
			code: '::slotted(a):first-child {}',
		},
		{
			code: '::before:hover {}',
		},
		{
			code: 'a:first-child::before {}',
		},
		{
			code: ':host {}',
		},
		{
			code: ':host(.foo) {}',
		},
		{
			code: ':host:hover {}',
		},
		{
			code: ':host a {}',
		},
		{
			code: '*:host {}',
		},
		{
			code: 'a:not(:host) {}',
		},
		{
			code: 'input:checked {}',
		},
		{
			code: 'input:required:valid {}',
		},
		{
			code: 'custom-element:checked {}',
		},
		{
			code: 'svg|path:checked {}',
		},
		{
			code: 'a:not(:checked) {}',
			description: 'negation flips semantics',
		},
		{
			code: '.foo:has(::before) {}',
			description: 'invalid, not unmatchable',
		},
		{
			code: ':not(::before) {}',
			description: 'invalid, not unmatchable',
		},
	],

	reject: [
		{
			code: ':is(::before) {}',
			message: messages.rejected(
				':is(::before)',
				'',
				'pseudo-elements cannot be represented by ":is()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: ':is(.foo, ::before) {}',
			message: messages.rejected(
				':is(.foo, ::before)',
				'',
				'pseudo-elements cannot be represented by ":is()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: ':where(input::placeholder) {}',
			message: messages.rejected(
				':where(input::placeholder)',
				'',
				'pseudo-elements cannot be represented by ":where()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '.foo:hover :is(a::before) {}',
			message: messages.rejected(
				'.foo:hover :is(a::before)',
				'',
				'pseudo-elements cannot be represented by ":is()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a::before { .foo:hover & {} }',
			message: messages.rejected(
				'.foo:hover &',
				'.foo:hover :is(a::before)',
				'"&" cannot represent pseudo-elements',
			),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a::before { &:hover {} }',
			message: messages.rejected(
				'&:hover',
				':is(a::before):hover',
				'"&" cannot represent pseudo-elements',
			),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a::before { .foo {} }',
			message: messages.rejected(
				'.foo',
				':is(a::before) .foo',
				'"&" cannot represent pseudo-elements',
			),
			description: 'implicit nesting selector',
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { &:is(::after) {} }',
			message: messages.rejected(
				'&:is(::after)',
				'a:is(::after)',
				'pseudo-elements cannot be represented by ":is()"',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a, a::before { &:hover {} }',
			message: messages.rejected(
				'&:hover',
				':is(a,a::before):hover',
				'"&" cannot represent pseudo-elements',
			),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: ':is(a, a::before):hover {}',
			message: messages.rejected(
				':is(a, a::before):hover',
				'',
				'pseudo-elements cannot be represented by ":is()"',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '::before:first-child {}',
			message: messages.rejected(
				'::before:first-child',
				'',
				'":first-child" never matches pseudo-elements',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a :host {}',
			message: messages.rejected(
				'a :host',
				'',
				'the shadow host has no ancestors or siblings in its shadow tree',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a { & :host {} }',
			message: messages.rejected(
				'& :host',
				'a :host',
				'the shadow host has no ancestors or siblings in its shadow tree',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'a { & /* foo */ :host {} }',
			message: messages.rejected(
				'& /* foo */ :host',
				'a :host',
				'the shadow host has no ancestors or siblings in its shadow tree',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a:host {}',
			message: messages.rejected('a:host', '', '"a" never matches the shadow host'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: ':host.foo {}',
			message: messages.rejected(':host.foo', '', '".foo" never matches the shadow host'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '::slotted(:host) {}',
			message: messages.rejected(
				'::slotted(:host)',
				'',
				'slotted elements are never the shadow host',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'label:enabled {}',
			message: messages.rejected('label:enabled', '', '":enabled" never matches "label" elements'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'label { &:enabled {} }',
			message: messages.rejected(
				'&:enabled',
				'label:enabled',
				'":enabled" never matches "label" elements',
			),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: ':is(label):enabled {}',
			message: messages.rejected(
				':is(label):enabled',
				'',
				'":enabled" never matches "label" elements',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: ':is(label, button):enabled {}',
			message: messages.rejected(
				':is(label, button):enabled',
				'',
				'":enabled" never matches "label" elements',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'LABEL:ENABLED {}',
			message: messages.rejected('LABEL:ENABLED', '', '":ENABLED" never matches "LABEL" elements'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'label/* foo */:enabled {}',
			message: messages.rejected(
				'label/* foo */:enabled',
				'',
				'":enabled" never matches "label" elements',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: ':any-link:checked {}',
			message: messages.rejected(
				':any-link:checked',
				'',
				'":any-link" and ":checked" never match the same element',
			),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a:has(label:enabled) {}',
			message: messages.rejected(
				'a:has(label:enabled)',
				'',
				'":enabled" never matches "label" elements',
			),
			description: '":has()" with an unmatchable argument matches nothing',
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'label:enabled, p:checked {}',
			warnings: [
				{
					message: messages.rejected(
						'label:enabled',
						'',
						'":enabled" never matches "label" elements',
					),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
				{
					message: messages.rejected('p:checked', '', '":checked" never matches "p" elements'),
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '#{$foo}:enabled {}',
		},
		{
			code: '%foo:host {}',
		},
		{
			code: 'a { #{&}::before {} }',
		},
		{
			code: '@mixin foo { &:first-child {} }',
		},
	],
});
