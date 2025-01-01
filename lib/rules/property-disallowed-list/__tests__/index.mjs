import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: [''],

	accept: [
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { --foo: red; }',
		},
	],
});

testRule({
	ruleName,

	config: [],

	accept: [
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { --foo: red; }',
		},
	],
});

testRule({
	ruleName,

	config: ['transform', 'background-size', '--foo'],

	accept: [
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { background: red; }',
		},
		{
			code: 'a { top: 0; color: red; }',
		},
		{
			code: 'a { $scss: 0; }',
		},
		{
			code: 'a { @less: 0; }',
		},
		{
			code: 'a { --bar: 0; }',
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
			code: 'a { color: red; background-size: cover; }',
			message: messages.rejected('background-size'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { color: red; -webkit-transform: scale(1); }',
			message: messages.rejected('-webkit-transform'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { --foo: 0; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,

	config: /color/,

	accept: [
		{
			code: 'a { $scss: 0; }',
		},
		{
			code: 'a { @less: 0; }',
		},
		{
			code: 'a { --foo: 0; }',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { background-color: red; }',
			message: messages.rejected('background-color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { --color: red; }',
			message: messages.rejected('--color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
	],
});

testRule({
	ruleName,

	config: '/^background/',

	accept: [
		{
			code: 'a { color: red; }',
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
			code: 'a { --background: red; }',
		},
	],

	reject: [
		{
			code: 'a { background: red; }',
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
			code: 'a { color: red; }',
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

	config: ['/color/'],

	accept: [
		{
			code: 'a { $color: red; }',
		},
		{
			code: 'a { @color: red; }',
		},
		{
			code: 'a { --margin: 0; }',
		},
	],

	reject: [
		{
			code: 'a { --color: red; }',
			message: messages.rejected('--color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
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
