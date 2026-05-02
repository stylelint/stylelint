import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['physical'],

	accept: [
		{
			code: 'a { margin-top: 0vh; }',
		},
		{
			code: 'a { width: 0vmin; }',
		},
	],

	reject: [
		{
			code: 'a { margin-top: 0vb; }',
			message: messages.rejected('flow-relative', 'vb'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { margin-top: 0vi; }',
			message: messages.rejected('flow-relative', 'vi'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative'],

	accept: [
		{
			code: 'a { margin-inline-start: 0vb; }',
		},
		{
			code: 'a { width: 0vmin; }',
		},
		{
			code: 'a { margin-inline-start: 0px; }',
		},
		{
			code: 'a { width: 0cqmin; }',
		},
	],

	reject: [
		{
			code: 'a { margin-inline-start: 0vh; }',
			message: messages.rejected('physical', 'vh'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { margin-inline-start: calc(100vw - 10px); }',
			message: messages.rejected('physical', 'vw'),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: 'a { padding-inline: 0vw 0vh; }',
			warnings: [
				{
					message: messages.rejected('physical', 'vw'),
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 24,
				},
				{
					message: messages.rejected('physical', 'vh'),
					line: 1,
					column: 26,
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
			code: 'a { margin-inline-start: 0vi; }',
		},
		{
			code: 'a { block-size: 0vb; }',
		},
	],

	reject: [
		{
			code: 'a { margin-inline-start: 0vw; }',
			fixed: 'a { margin-inline-start: 0vi; }',
			fix: {
				range: [27, 28],
				text: 'i',
			},
			message: messages.expected('vw', 'vi'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { block-size: 0vh; }',
			fixed: 'a { block-size: 0vb; }',
			fix: {
				range: [18, 19],
				text: 'b',
			},
			message: messages.expected('vh', 'vb'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { min-inline-size: 0cqw; }',
			fixed: 'a { min-inline-size: 0cqi; }',
			fix: {
				range: [24, 25],
				text: 'i',
			},
			message: messages.expected('cqw', 'cqi'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { margin-inline-start: 0svw; }',
			fixed: 'a { margin-inline-start: 0svi; }',
			fix: {
				range: [28, 29],
				text: 'i',
			},
			message: messages.expected('svw', 'svi'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { padding-inline: 0vw /* foo */ 0vh; }',
			fixed: 'a { padding-inline: 0vi /* foo */ 0vb; }',
			warnings: [
				{
					message: messages.expected('vw', 'vi'),
					fix: {
						range: [22, 23],
						text: 'i',
					},
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 24,
				},
				{
					message: messages.expected('vh', 'vb'),
					line: 1,
					column: 36,
					endLine: 1,
					endColumn: 38,
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
			block: 'right-to-left',
			inline: 'top-to-bottom',
		},
	},
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { margin-inline-start: 0vb; }',
		},
		{
			code: 'a { block-size: 0vi; }',
		},
	],

	reject: [
		{
			code: 'a { margin-inline-start: 0vw; }',
			fixed: 'a { margin-inline-start: 0vb; }',
			fix: {
				range: [27, 28],
				text: 'b',
			},
			message: messages.expected('vw', 'vb'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { block-size: 0vh; }',
			fixed: 'a { block-size: 0vi; }',
			fix: {
				range: [18, 19],
				text: 'i',
			},
			message: messages.expected('vh', 'vi'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { padding-inline: 0vw /* foo */ 0vh; }',
			fixed: 'a { padding-inline: 0vb /* foo */ 0vi; }',
			warnings: [
				{
					message: messages.expected('vw', 'vb'),
					fix: {
						range: [22, 23],
						text: 'b',
					},
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 24,
				},
				{
					message: messages.expected('vh', 'vi'),
					line: 1,
					column: 36,
					endLine: 1,
					endColumn: 38,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative', { ignoreUnits: ['vh', /^cq/] }],

	accept: [
		{
			code: 'a { margin-inline-start: 0vh; }',
		},
		{
			code: 'a { min-inline-size: 0cqw; }',
		},
	],

	reject: [
		{
			code: 'a { margin-inline-start: 0vw; }',
			message: messages.rejected('physical', 'vw'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 29,
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
			code: 'a { margin-inline-start: 0vw; }',
			message: messages.rejected('physical', 'vw'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 29,
		},
	],
});
