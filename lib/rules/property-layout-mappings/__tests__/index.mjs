import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['logical'],
	fix: true,

	accept: [
		{
			code: '',
		},
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { margin-inline-start: 10px; }',
		},
		{
			code: 'a { padding-block-end: 5px; }',
		},
		{
			code: 'a { border-inline-start: 1px solid red; }',
		},
		{
			code: 'a { inset-block-start: 0; }',
		},
		{
			code: 'a { inline-size: 100px; }',
		},
		{
			code: 'a { scroll-margin-inline-start: 10px; }',
		},
		{
			code: 'a { border-start-start-radius: 5px; }',
		},
		{
			code: 'a { --foo: 10px; }',
			description: 'custom properties ignored',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 10px; }',
			fixed: 'a { margin-inline-start: 10px; }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { padding-top: 8px; }',
			fixed: 'a { padding-block-start: 8px; }',
			message: messages.expected('padding-top', 'padding-block-start'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { border-right: 1px solid red; }',
			fixed: 'a { border-inline-end: 1px solid red; }',
			message: messages.expected('border-right', 'border-inline-end'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { left: 0; }',
			fixed: 'a { inset-inline-start: 0; }',
			message: messages.expected('left', 'inset-inline-start'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { width: 200px; }',
			fixed: 'a { inline-size: 200px; }',
			message: messages.expected('width', 'inline-size'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { scroll-margin-left: 10px; }',
			fixed: 'a { scroll-margin-inline-start: 10px; }',
			message: messages.expected('scroll-margin-left', 'scroll-margin-inline-start'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { border-top-left-radius: 5px; }',
			fixed: 'a { border-start-start-radius: 5px; }',
			message: messages.expected('border-top-left-radius', 'border-start-start-radius'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,
	config: ['physical'],
	fix: true,

	accept: [
		{
			code: '',
		},
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { margin-left: 10px; }',
		},
		{
			code: 'a { padding-top: 5px; }',
		},
		{
			code: 'a { border-right: 1px solid red; }',
		},
		{
			code: 'a { left: 0; }',
		},
		{
			code: 'a { width: 100px; }',
		},
		{
			code: 'a { --foo: 10px; }',
			description: 'custom properties ignored',
		},
	],

	reject: [
		{
			code: 'a { margin-inline-start: 10px; }',
			fixed: 'a { margin-left: 10px; }',
			message: messages.expected('margin-inline-start', 'margin-left'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { padding-block-start: 8px; }',
			fixed: 'a { padding-top: 8px; }',
			message: messages.expected('padding-block-start', 'padding-top'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { inset-inline-start: 0; }',
			fixed: 'a { left: 0; }',
			message: messages.expected('inset-inline-start', 'left'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { inline-size: 200px; }',
			fixed: 'a { width: 200px; }',
			message: messages.expected('inline-size', 'width'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { border-start-start-radius: 5px; }',
			fixed: 'a { border-top-left-radius: 5px; }',
			message: messages.expected('border-start-start-radius', 'border-top-left-radius'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,
	config: ['logical', { exceptProperties: ['margin-left', 'width'] }],

	accept: [
		{
			code: 'a { margin-left: 10px; }',
			description: 'except property allowed',
		},
		{
			code: 'a { width: 100px; }',
			description: 'except property allowed',
		},
		{
			code: 'a { margin-inline-start: 10px; }',
		},
	],

	reject: [
		{
			code: 'a { margin-right: 5px; }',
			message: messages.expected('margin-right', 'margin-inline-end'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { height: 50px; }',
			message: messages.expected('height', 'block-size'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,
	config: ['logical', { exceptProperties: ['/^margin/'] }],

	accept: [
		{
			code: 'a { margin-left: 10px; }',
			description: 'regex except property allowed',
		},
		{
			code: 'a { margin-right: 5px; }',
			description: 'regex except property allowed',
		},
	],

	reject: [
		{
			code: 'a { padding-left: 8px; }',
			message: messages.expected('padding-left', 'padding-inline-start'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { width: 100px; }',
			message: messages.expected('width', 'inline-size'),
			line: 1,
			column: 5,
		},
	],
});
