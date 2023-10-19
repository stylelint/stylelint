import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: [''],

	accept: [
		{
			code: 'a { color: pink; }',
		},
	],
});

testRule({
	ruleName,

	config: [],

	accept: [
		{
			code: 'a { color: pink; }',
		},
	],
});

testRule({
	ruleName,

	config: ['transform', 'background-size'],

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { background: red; }',
		},
		{
			code: 'a { top: 0; color: pink; }',
		},
		{
			code: 'a { $scss: 0; }',
		},
		{
			code: 'a { @less: 0; }',
		},
		{
			code: 'a { --custom-property: 0; }',
		},
	],

	reject: [
		{
			code: 'a { transform: scale(1); }',
			message: messages.rejected('transform'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'a { color: pink; background-size: cover; }',
			message: messages.rejected('background-size'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { color: pink; -webkit-transform: scale(1); }',
			message: messages.rejected('-webkit-transform'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 35,
		},
	],
});

testRule({
	ruleName,

	config: '/^background/',

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { no-background: sure; }',
		},
		{
			code: 'a { $scss: 0; }',
		},
		{
			code: 'a { @less: 0; }',
		},
		{
			code: 'a { --custom-property: 0; }',
		},
	],

	reject: [
		{
			code: 'a { background: pink; }',
			message: messages.rejected('background'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { background-size: cover; }',
			message: messages.rejected('background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { background-image: none; }',
			message: messages.rejected('background-image'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 21,
		},
	],
});

testRule({
	ruleName,

	config: /^background/,

	accept: [
		{
			code: 'a { color: pink; }',
		},
	],

	reject: [
		{
			code: 'a { background-size: cover; }',
			message: messages.rejected('background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
	],
});

testRule({
	ruleName,

	config: ['/margin/'],

	accept: [
		{
			code: 'a { $margin: 0; }',
		},
		{
			code: 'a { @margin: 0; }',
		},
		{
			code: 'a { --margin: 0; }',
		},
	],
});

testRule({
	ruleName,

	config: ['-webkit-text-stroke'],

	accept: [
		{
			code: 'a { text-stroke: 2px red; }',
		},
	],

	reject: [
		{
			code: 'a { -webkit-text-stroke: 2px red; }',
			message: messages.rejected('-webkit-text-stroke'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 24,
		},
	],
});

testRule({
	ruleName,

	config: ['text-stroke'],

	reject: [
		{
			code: 'a { -webkit-text-stroke: 2px red; }',
			message: messages.rejected('-webkit-text-stroke'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { text-stroke: 2px red; }',
			message: messages.rejected('text-stroke'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
	],
});
