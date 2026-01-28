import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['short'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { display: block; }',
		},
		{
			code: 'a { display: run-in flow-root; }',
		},
		{
			code: 'a { display: flow-root list-item; }',
		},
		{
			code: 'a { display: ; }',
			description: 'ignore empty values',
		},
		{
			code: 'a { display: /* block */; }',
			description: 'ignore empty values',
		},
		{
			code: 'a { display: block var(--foo, flow); }',
			description: 'ignore variables',
		},
		{
			code: 'a { display: none; }',
			description: "ignores values that don't have a full notation",
		},
		{
			code: 'a { display: inline-block; }',
		},
		{
			code: 'a { display: list-item; }',
		},
	],

	reject: [
		{
			code: 'a { display: block flow; }',
			fixed: 'a { display: block; }',
			message: messages.expected('block flow', 'block'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 24,
			fix: { range: [18, 23], text: '' },
		},
		{
			code: 'a { display: inline flow-root; }',
			fixed: 'a { display: inline-block; }',
			message: messages.expected('inline flow-root', 'inline-block'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 30,
			fix: { range: [19, 29], text: '-block' },
		},
		{
			code: 'a { display: block list-item; }',
			fixed: 'a { display: list-item; }',
			message: messages.expected('block list-item', 'list-item'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 29,
			fix: { range: [13, 19], text: '' },
		},
		{
			code: 'a { display: flow list-item; }',
			fixed: 'a { display: list-item; }',
			message: messages.expected('flow list-item', 'list-item'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 28,
			fix: { range: [13, 18], text: '' },
		},
		{
			code: 'a { display: /* foo */block/* bar */flow/* baz */; }',
			fixed: 'a { display: /* foo */block/* bar *//* baz */; }',
			message: messages.expected('block flow', 'block'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 41,
			fix: { range: [36, 40], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['short', { except: 'legacy-values' }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { display: block; }',
		},
		{
			code: 'a { display: run-in flow-root; }',
		},
		{
			code: 'a { display: flow-root list-item; }',
		},
		{
			code: 'a { display: inline flow-root; }',
		},
	],

	reject: [
		{
			code: 'a { display: block flow; }',
			fixed: 'a { display: block; }',
			message: messages.expected('block flow', 'block'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 24,
			fix: { range: [18, 23], text: '' },
		},
		{
			code: 'a { display: inline-block; }',
			fixed: 'a { display: inline flow-root; }',
			message: messages.expected('inline-block', 'inline flow-root'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 26,
			fix: { range: [19, 25], text: ' flow-root' },
		},
		{
			code: 'a { display: block list-item; }',
			fixed: 'a { display: list-item; }',
			message: messages.expected('block list-item', 'list-item'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 29,
			fix: { range: [13, 19], text: '' },
		},
		{
			code: 'a { display: flow list-item; }',
			fixed: 'a { display: list-item; }',
			message: messages.expected('flow list-item', 'list-item'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 28,
			fix: { range: [13, 18], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['full'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { display: block flow; }',
		},
		{
			code: 'a { display: run-in flow-root; }',
		},
		{
			code: 'a { display: block flow-root list-item; }',
		},
		{
			code: 'a { display: none; }',
			description: "ignores values that don't have a full notation",
		},
		{
			code: 'a { display: inline flow root; }',
		},
		{
			code: 'a { display: block flow list-item; }',
		},
	],

	reject: [
		{
			code: 'a { display: block; }',
			fixed: 'a { display: block flow; }',
			message: messages.expected('block', 'block flow'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 19,
			fix: { range: [17, 18], text: 'k flow' },
		},
		{
			code: 'a { display: inline-block; }',
			fixed: 'a { display: inline flow-root; }',
			message: messages.expected('inline-block', 'inline flow-root'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 26,
			fix: { range: [19, 25], text: ' flow-root' },
		},
		{
			code: 'a { display: list-item; }',
			fixed: 'a { display: block flow list-item; }',
			message: messages.expected('list-item', 'block flow list-item'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 23,
			fix: { range: [12, 13], text: ' block flow ' },
		},
		{
			code: 'a { display: flow list-item; }',
			fixed: 'a { display: block flow list-item; }',
			message: messages.expected('flow list-item', 'block flow list-item'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 28,
			fix: { range: [12, 13], text: ' block ' },
		},
		{
			code: 'a { display: /* foo */block/* bar */; }',
			fixed: 'a { display: /* foo */block flow/* bar */; }',
			message: messages.expected('block', 'block flow'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 28,
			fix: { range: [26, 27], text: 'k flow' },
		},
	],
});

testRule({
	ruleName,
	config: ['full', { ignore: ['non-legacy-values'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { display: inline; }',
		},
		{
			code: 'a { display: grid; }',
		},
		{
			code: 'a { display: inline flow-root; }',
		},
	],

	reject: [
		{
			code: 'a { display: inline-block; }',
			fixed: 'a { display: inline flow-root; }',
			message: messages.expected('inline-block', 'inline flow-root'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 26,
			fix: { range: [19, 25], text: ' flow-root' },
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['short'],

	accept: [
		{
			code: 'a { display: $block; }',
			description: 'ignore sass variable',
		},
	],
});
