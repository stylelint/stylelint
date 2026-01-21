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
	],

	reject: [
		{
			code: 'a { display: block flow; }',
			fixed: 'a { display: block; }',
			message: messages.expected('short'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 24,
			fix: { range: [18, 23], text: '' },
		},
		{
			code: 'a { display: inline flow-root; }',
			fixed: 'a { display: inline-block; }',
			message: messages.expected('short'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 30,
			fix: { range: [19, 29], text: '-block' },
		},
		{
			code: 'a { display: block list-item; }',
			fixed: 'a { display: list-item; }',
			message: messages.expected('short'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 29,
			fix: { range: [13, 19], text: '' },
		},
		{
			code: 'a { display: flow list-item; }',
			fixed: 'a { display: list-item; }',
			message: messages.expected('short'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 28,
			fix: { range: [13, 18], text: '' },
		},
	],
});
