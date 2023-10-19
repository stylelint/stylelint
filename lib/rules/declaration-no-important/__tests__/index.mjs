import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { color: pink; }',
			description: 'without !important',
		},
	],

	reject: [
		{
			code: 'a { color: pink !important; }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { color: pink ! important; }',
			description: 'with ! important',
			message: messages.rejected,
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { color: pink!important; }',
			description: 'with value!important',
			message: messages.rejected,
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 26,
		},
	],
});
