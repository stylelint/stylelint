import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: [''],

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
			code: 'a { --foo: red; }',
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

	config: [],

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
			code: 'a { --foo: red; }',
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

	config: ['transform', 'background-size', '--foo'],

	accept: [
		{
			code: 'a { background-size: cover; }',
		},
		{
			code: 'a { transform: scale(1); }',
		},
		{
			code: 'a { --foo: red; }',
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
			code: 'a { color: red; }',
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
		{
			code: 'a { --bar: 0; }',
			message: messages.rejected('--bar'),
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
			code: 'a { $color: red; }',
		},
		{
			code: 'a { @color: red; }',
		},
		{
			code: 'a { --color: red; }',
		},
		{
			code: 'a { --some-color: red; }',
		},
		{
			code: 'a { --color-of-mine: 0; }',
		},
		{
			code: 'a { --some-color-of-mine: 0; }',
		},
	],

	reject: [
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

	config: '/^background/',

	accept: [
		{
			code: 'a { background: red; }',
		},
		{
			code: 'a { background-color: red; }',
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
			code: 'a { --background: 0; }',
			message: messages.rejected('--background'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
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
			code: 'a { color: red; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { --background: red; }',
			message: messages.rejected('--background'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
	],
});

testRule({
	ruleName,

	config: /color$/,

	accept: [
		{
			code: 'a { $color: red; }',
		},
		{
			code: 'a { @color: red; }',
		},
		{
			code: 'a { --color: red; }',
		},
	],

	reject: [
		{
			code: 'a { --foo: 0; }',
			message: messages.rejected('--foo'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { --color-of-mine: 0; }',
			message: messages.rejected('--color-of-mine'),
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
			code: 'a { --color: red; }',
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
