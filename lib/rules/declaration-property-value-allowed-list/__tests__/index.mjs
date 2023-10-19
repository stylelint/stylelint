import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: [
		{
			transform: ['/scale/'],
			whitespace: 'nowrap',
			'/color/': ['/^green/'],
		},
	],

	accept: [
		{
			code: 'div { whitespace: nowrap; }',
		},
		{
			code: 'a { transform: scale(1, 1); }',
		},
		{
			code: 'a { -webkit-transform: scale(1, 1); }',
		},
		{
			code: 'a { color: green; }',
		},
		{
			code: 'a { background-color: green; }',
		},
	],

	reject: [
		{
			code: 'div { whitespace: pre; }',
			message: messages.rejected('whitespace', 'pre'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { transform: translate(1, 1); }',
			message: messages.rejected('transform', 'translate(1, 1)'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { -webkit-transform: translate(1, 1); }',
			message: messages.rejected('-webkit-transform', 'translate(1, 1)'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color', 'pink'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { background-color: pink; }',
			message: messages.rejected('background-color', 'pink'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: { position: ['static'] },
	accept: [
		{
			code: 'a { font-size: 1em; }',
			description: 'irrelevant CSS',
		},
	],
});

testRule({
	ruleName,
	config: {
		'/.*/': ['rebeccapurple'],
		'background-color': ['none'],
	},

	accept: [
		{
			code: 'a { color: rebeccapurple; background-color: none; }',
		},
	],
});
