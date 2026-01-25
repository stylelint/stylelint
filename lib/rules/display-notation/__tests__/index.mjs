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
			code: 'a { display: block var(--foo, flow); }',
			description: 'ignore variables',
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
			code: 'a { display: /* comment 1 */block/* comment 2 */flow/* comment 3 */; }',
			fixed: 'a { display: /* comment 1 */block/* comment 3 */; }',
			message: messages.expected('block flow', 'block'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 53,
			fix: { range: [44, 63], text: '' },
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
			code: 'a { display: block var(--foo, flow); }',
			description: 'ignore variables',
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
