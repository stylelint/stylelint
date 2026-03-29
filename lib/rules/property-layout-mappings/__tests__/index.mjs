import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['flow-relative'],

	accept: [
		{
			code: '',
		},
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { --foo: 0; }',
		},
		{
			code: 'a { margin-inline-start: 0; }',
		},
		{
			code: 'a { padding-block-end: 0; }',
		},
		{
			code: 'a { inline-size: 0; }',
		},
		{
			code: 'a { scroll-margin-inline-start: 0; }',
		},
		{
			code: 'a { border-start-start-radius: 0; }',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 0; }',
			message: messages.rejected('physical', 'margin-left'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { padding-top: 0; }',
			message: messages.rejected('physical', 'padding-top'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { left: 0; }',
			message: messages.rejected('physical', 'left'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a { width: 0; }',
			message: messages.rejected('physical', 'width'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { border-top-left-radius: 0; overflow-x: hidden; }',
			warnings: [
				{
					message: messages.rejected('physical', 'border-top-left-radius'),
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 27,
				},
				{
					message: messages.rejected('physical', 'overflow-x'),
					line: 1,
					column: 32,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['physical'],

	accept: [
		{
			code: 'a { margin-left: 0; }',
		},
		{
			code: 'a { padding-top: 0; }',
		},
		{
			code: 'a { border-right: 0; }',
		},
		{
			code: 'a { left: 0; }',
		},
		{
			code: 'a { width: 0; }',
		},
	],

	reject: [
		{
			code: 'a { margin-inline-start: 0; }',
			message: messages.rejected('flow-relative', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { padding-block-start: 0; }',
			message: messages.rejected('flow-relative', 'padding-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { inline-size: 0; }',
			message: messages.rejected('flow-relative', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { border-start-start-radius: 0; }',
			message: messages.rejected('flow-relative', 'border-start-start-radius'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { overflow-inline: hidden; }',
			message: messages.rejected('flow-relative', 'overflow-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { margin-inline: 0; }',
			message: messages.rejected('flow-relative', 'margin-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
			description: 'shorthand flow-relative property',
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative', { ignoreProperties: ['/^margin/', 'width'] }],

	accept: [
		{
			code: 'a { margin-left: 0; }',
		},
		{
			code: 'a { margin-right: 0; }',
		},
		{
			code: 'a { width: 0; }',
		},
	],

	reject: [
		{
			code: 'a { padding-left: 0; }',
			message: messages.rejected('physical', 'padding-left'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],
	languageOptions: {
		directionality: {
			block: 'top-to-bottom',
			inline: 'left-to-right',
		},
	},
	fix: true,

	accept: [
		{
			code: 'a { margin-inline-start: 0; }',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-start: 0; }',
			message: messages.expected('padding-top', 'padding-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { left: 0; }',
			fixed: 'a { inset-inline-start: 0; }',
			message: messages.expected('left', 'inset-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a { width: 0; }',
			fixed: 'a { inline-size: 0; }',
			message: messages.expected('width', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],
	languageOptions: {
		directionality: {
			block: 'top-to-bottom',
			inline: 'right-to-left',
		},
	},
	fix: true,

	reject: [
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-end: 0; }',
			message: messages.expected('margin-left', 'margin-inline-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-right: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			message: messages.expected('margin-right', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-start: 0; }',
			message: messages.expected('padding-top', 'padding-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { border-top-left-radius: 0; }',
			fixed: 'a { border-start-end-radius: 0; }',
			message: messages.expected('border-top-left-radius', 'border-start-end-radius'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],
	languageOptions: {
		directionality: {
			block: 'bottom-to-top',
			inline: 'left-to-right',
		},
	},
	fix: true,

	reject: [
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-end: 0; }',
			message: messages.expected('padding-top', 'padding-block-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-bottom: 0; }',
			fixed: 'a { margin-block-start: 0; }',
			message: messages.expected('margin-bottom', 'margin-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],
	languageOptions: {
		directionality: {
			block: 'bottom-to-top',
			inline: 'right-to-left',
		},
	},
	fix: true,

	reject: [
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-end: 0; }',
			message: messages.expected('margin-left', 'margin-inline-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-right: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			message: messages.expected('margin-right', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-end: 0; }',
			message: messages.expected('padding-top', 'padding-block-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-bottom: 0; }',
			fixed: 'a { margin-block-start: 0; }',
			message: messages.expected('margin-bottom', 'margin-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { border-top-left-radius: 0; }',
			fixed: 'a { border-end-end-radius: 0; }',
			message: messages.expected('border-top-left-radius', 'border-end-end-radius'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 27,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],
	languageOptions: {
		directionality: {
			block: 'right-to-left',
			inline: 'top-to-bottom',
		},
	},
	fix: true,

	reject: [
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-end: 0; }',
			message: messages.expected('padding-top', 'padding-block-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-bottom: 0; }',
			fixed: 'a { margin-block-start: 0; }',
			message: messages.expected('margin-bottom', 'margin-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],
	languageOptions: {
		directionality: {},
	},

	reject: [
		{
			code: 'a { margin-left: 0; }',
			message: messages.rejected('physical', 'margin-left'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
	],
});
