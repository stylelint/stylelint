import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: [''],

	reject: [
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,

	config: [],

	reject: [
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,

	config: ['transform', 'background-size'],

	accept: [
		{
			code: 'a { background-size: cover; }',
		},
		{
			code: 'a { transform: scale(1); }',
		},
		{
			code: 'a { -webkit-transform: scale(1); }',
		},
		{
			code: 'a { transform: scale(1); background-size: cover; }',
		},
		{
			code: 'a { transform: scale(1); -webkit-transform: scale(1); background-size: cover; }',
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
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { overflow: hidden; background-size: cover; }',
			message: messages.rejected('overflow'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { color: orange; -webkit-transform: scale(1); }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,

	config: '/^background/',

	accept: [
		{
			code: 'a { background: pink; }',
		},
		{
			code: 'a { background-color: pink; }',
		},
		{
			code: 'a { background-image: none; }',
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
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,

	config: /^background/,

	accept: [
		{
			code: 'a { background-image: none; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,

	config: ['/margin/'],

	accept: [
		{
			code: 'a { $padding: 0; }',
		},
		{
			code: 'a { @padding: 0; }',
		},
		{
			code: 'a { --padding: 0; }',
		},
	],
});

testRule({
	ruleName,

	config: ['-webkit-text-stroke'],

	accept: [
		{
			code: 'a { -webkit-text-stroke: 2px red; }',
		},
	],

	reject: [
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

testRule({
	ruleName,

	config: ['text-stroke'],

	accept: [
		{
			code: 'a { -webkit-text-stroke: 2px red; }',
		},
		{
			code: 'a { text-stroke: 2px red; }',
		},
	],
});
