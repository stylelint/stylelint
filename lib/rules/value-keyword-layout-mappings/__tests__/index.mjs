import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['physical'],

	accept: [
		{
			code: 'a { float: left; }',
		},
		{
			code: 'a { text-align: right; }',
		},
		{
			code: 'a { resize: horizontal; }',
		},
		{
			code: 'a { caption-side: top; }',
		},
	],

	reject: [
		{
			code: 'a { float: inline-start; }',
			message: messages.rejected('flow-relative', 'inline-start'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { clear: inline-end; }',
			message: messages.rejected('flow-relative', 'inline-end'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { caption-side: block-start; }',
			message: messages.rejected('flow-relative', 'block-start'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { resize: inline; }',
			message: messages.rejected('flow-relative', 'inline'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { box-orient: block-axis; }',
			message: messages.rejected('flow-relative', 'block-axis'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { text-align: start; }',
			message: messages.rejected('flow-relative', 'start'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { text-align-last: end; }',
			message: messages.rejected('flow-relative', 'end'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { offset-anchor: block-start inline-end; }',
			warnings: [
				{
					message: messages.rejected('flow-relative', 'block-start'),
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
				{
					message: messages.rejected('flow-relative', 'inline-end'),
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
	config: ['flow-relative'],

	accept: [
		{
			code: 'a { float: inline-start; }',
		},
		{
			code: 'a { caption-side: block-end; }',
		},
		{
			code: 'a { resize: inline; }',
		},
		{
			code: 'a { text-align: start; }',
		},
		{
			code: 'a { float: var(--left); }',
		},
		{
			code: 'a { text-align: -webkit-left; }',
		},
		{
			code: 'a { margin-left: 0; }',
		},
	],

	reject: [
		{
			code: 'a { float: left; }',
			message: messages.rejected('physical', 'left'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { caption-side: top; }',
			message: messages.rejected('physical', 'top'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { resize: horizontal; }',
			message: messages.rejected('physical', 'horizontal'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { text-align: left; }',
			message: messages.rejected('physical', 'left'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { box-orient: horizontal; }',
			message: messages.rejected('physical', 'horizontal'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { offset-anchor: top left; }',
			warnings: [
				{
					message: messages.rejected('physical', 'top'),
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 23,
				},
				{
					message: messages.rejected('physical', 'left'),
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 28,
				},
			],
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
	computeEditInfo: true,

	accept: [
		{
			code: 'a { float: inline-start; }',
		},
		{
			code: 'a { caption-side: block-end; }',
		},
	],

	reject: [
		{
			code: 'a { float: left; }',
			fixed: 'a { float: inline-start; }',
			fix: {
				range: [11, 14],
				text: 'inline-star',
			},
			message: messages.expected('left', 'inline-start'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { float: right; }',
			fixed: 'a { float: inline-end; }',
			fix: {
				range: [11, 16],
				text: 'inline-end',
			},
			message: messages.expected('right', 'inline-end'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { caption-side: top; }',
			fixed: 'a { caption-side: block-start; }',
			fix: {
				range: [18, 21],
				text: 'block-start',
			},
			message: messages.expected('top', 'block-start'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { caption-side: left; }',
			fixed: 'a { caption-side: inline-start; }',
			fix: {
				range: [18, 21],
				text: 'inline-star',
			},
			message: messages.expected('left', 'inline-start'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { resize: horizontal; }',
			fixed: 'a { resize: inline; }',
			fix: {
				range: [12, 22],
				text: 'inline',
			},
			message: messages.expected('horizontal', 'inline'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { text-align: right; }',
			fixed: 'a { text-align: end; }',
			fix: {
				range: [16, 21],
				text: 'end',
			},
			message: messages.expected('right', 'end'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { box-orient: vertical; }',
			fixed: 'a { box-orient: block-axis; }',
			fix: {
				range: [16, 24],
				text: 'block-axis',
			},
			message: messages.expected('vertical', 'block-axis'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { offset-anchor: top left; }',
			fixed: 'a { offset-anchor: block-start inline-start; }',
			warnings: [
				{
					message: messages.expected('top', 'block-start'),
					fix: {
						range: [19, 22],
						text: 'block-start',
					},
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 23,
				},
				{
					message: messages.expected('left', 'inline-start'),
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 28,
				},
			],
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
	computeEditInfo: true,

	reject: [
		{
			code: 'a { float: left; }',
			fixed: 'a { float: inline-end; }',
			fix: {
				range: [11, 15],
				text: 'inline-end',
			},
			message: messages.expected('left', 'inline-end'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { text-align: left; }',
			fixed: 'a { text-align: end; }',
			fix: {
				range: [16, 20],
				text: 'end',
			},
			message: messages.expected('left', 'end'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { caption-side: right; }',
			fixed: 'a { caption-side: inline-start; }',
			fix: {
				range: [18, 22],
				text: 'inline-star',
			},
			message: messages.expected('right', 'inline-start'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 24,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],
	languageOptions: {
		directionality: {
			block: 'left-to-right',
			inline: 'top-to-bottom',
		},
	},
	fix: true,
	computeEditInfo: true,

	reject: [
		{
			code: 'a { resize: vertical; }',
			fixed: 'a { resize: inline; }',
			fix: {
				range: [12, 20],
				text: 'inline',
			},
			message: messages.expected('vertical', 'inline'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { box-orient: vertical; }',
			fixed: 'a { box-orient: inline-axis; }',
			fix: {
				range: [16, 24],
				text: 'inline-axis',
			},
			message: messages.expected('vertical', 'inline-axis'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { caption-side: top; }',
			fixed: 'a { caption-side: inline-start; }',
			fix: {
				range: [18, 21],
				text: 'inline-start',
			},
			message: messages.expected('top', 'inline-start'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { clear: left; }',
			unfixable: true,
			message: messages.rejected('physical', 'left'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { float: right; }',
			unfixable: true,
			message: messages.rejected('physical', 'right'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { text-align: left; }',
			unfixable: true,
			message: messages.rejected('physical', 'left'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 21,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative', { ignoreProperties: ['text-align', /^caption-/] }],

	accept: [
		{
			code: 'a { text-align: left; }',
		},
		{
			code: 'a { caption-side: top; }',
		},
	],

	reject: [
		{
			code: 'a { float: left; }',
			message: messages.rejected('physical', 'left'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative', { ignoreKeywords: ['left', /^hor/] }],

	accept: [
		{
			code: 'a { float: left; }',
		},
		{
			code: 'a { resize: horizontal; }',
		},
	],

	reject: [
		{
			code: 'a { float: right; }',
			message: messages.rejected('physical', 'right'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 17,
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
			code: 'a { float: left; }',
			message: messages.rejected('physical', 'left'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '$foo: left;',
		},
		{
			code: 'a { float: $foo; }',
		},
		{
			code: 'a { float: #{$foo}; }',
		},
	],
});
