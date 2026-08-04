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
		{
			code: 'a { transition: margin-inline-start 0 ease; }',
		},
		{
			code: 'a { transition: all 0 ease; }',
		},
		{
			code: 'a { transition: none; }',
		},
		{
			code: 'a { transition: var(--foo) 0 ease; }',
		},
		{
			code: 'a { transition: var(--foo, margin-block-start) 0 ease; }',
		},
		{
			code: 'a { will-change: padding-block-end; }',
		},
		{
			code: 'a { will-change: auto; }',
		},
		{
			code: 'a { margin: 1em; }',
			description: 'single-value shorthand applies to every side',
		},
		{
			code: 'a { inset: 0; }',
			description: 'single-value shorthand applies to every side',
		},
		{
			code: 'a { border-width: thin; }',
			description: 'single-value shorthand applies to every side',
		},
		{
			code: 'a { margin: var(--gap); }',
			description: 'single var() value',
		},
		{
			code: 'a { margin: logical 1em 2em; }',
			description: 'the `logical` keyword is still in flux in the css-logical spec',
		},
		{
			code: 'a { transition: margin 0s ease; }',
			description: 'shorthand in transition-property means all margins',
		},
		{
			code: '@page { margin-left: 0; }',
		},
		{
			code: '@page { @top-left { margin-left: 0; } }',
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
		{
			code: 'a { transition: margin-left 0 ease; }',
			message: messages.rejected('physical', 'margin-left'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { transition: var(--foo, left) 0 ease; }',
			message: messages.rejected('physical', 'left'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { transition-property: margin-left; }',
			message: messages.rejected('physical', 'margin-left'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: 'a { will-change: margin-left, /* foo */ width; }',
			warnings: [
				{
					message: messages.rejected('physical', 'margin-left'),
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 29,
				},
				{
					message: messages.rejected('physical', 'width'),
					line: 1,
					column: 41,
					endLine: 1,
					endColumn: 46,
				},
			],
		},
		{
			code: '@media print { a { margin-left: 0; } }',
			message: messages.rejected('physical', 'margin-left'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { margin: 1em 2em; }',
			message: messages.rejected('physical', 'margin'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'physical shorthand without directionality config',
		},
		{
			code: 'a { inset: 0 1em; }',
			message: messages.rejected('physical', 'inset'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
			description: 'physical shorthand without directionality config',
		},
		{
			code: 'a { border-width: thin thick; }',
			message: messages.rejected('physical', 'border-width'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
			description: 'physical shorthand without directionality config',
		},
		{
			code: 'a { margin: var(--gap) 1em; }',
			message: messages.rejected('physical', 'margin'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'var() can hold any number of values, so expanding is unsafe',
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
		{
			code: 'a { margin: 1em 2em; }',
			description: 'physical shorthand',
		},
		{
			code: 'a { transition-property: margin-left; }',
		},
		{
			code: '@page { margin-inline-start: 0; }',
		},
		{
			code: '@page { @top-left { margin-inline-start: 0; } }',
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
		{
			code: 'a { transition-property: margin-inline-start, inline-size; }',
			warnings: [
				{
					message: messages.rejected('flow-relative', 'margin-inline-start'),
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 45,
				},
				{
					message: messages.rejected('flow-relative', 'inline-size'),
					line: 1,
					column: 47,
					endLine: 1,
					endColumn: 58,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative', { ignoreProperties: ['/^margin/', 'width', 'transition'] }],

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
		{
			code: 'a { transition-property: margin-left, width; }',
		},
		{
			code: 'a { transition: padding-left 0 ease; }',
		},
		{
			code: 'a { margin: 1em 2em; }',
			description: 'ignored physical shorthand',
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
	computeEditInfo: true,

	accept: [
		{
			code: 'a { margin-inline-start: 0; }',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			fix: {
				range: [11, 14],
				text: 'inline-star',
			},
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-start: 0; }',
			fix: {
				range: [12, 15],
				text: 'block-start',
			},
			message: messages.expected('padding-top', 'padding-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { left: 0; }',
			fixed: 'a { inset-inline-start: 0; }',
			fix: {
				range: [4, 7],
				text: 'inset-inline-star',
			},
			message: messages.expected('left', 'inset-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: 'a { width: 0; }',
			fixed: 'a { inline-size: 0; }',
			fix: {
				range: [4, 9],
				text: 'inline-size',
			},
			message: messages.expected('width', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { height: 0; }',
			fixed: 'a { block-size: 0; }',
			fix: {
				range: [4, 10],
				text: 'block-size',
			},
			message: messages.expected('height', 'block-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a { overflow-x: hidden; }',
			fixed: 'a { overflow-inline: hidden; }',
			fix: {
				range: [13, 14],
				text: 'inline',
			},
			message: messages.expected('overflow-x', 'overflow-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { overflow-y: hidden; }',
			fixed: 'a { overflow-block: hidden; }',
			fix: {
				range: [13, 14],
				text: 'block',
			},
			message: messages.expected('overflow-y', 'overflow-block'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { border-top-left-radius: 0; }',
			fixed: 'a { border-start-start-radius: 0; }',
			fix: {
				range: [11, 18],
				text: 'start-star',
			},
			message: messages.expected('border-top-left-radius', 'border-start-start-radius'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { transition: margin-left 0 ease; }',
			fixed: 'a { transition: margin-inline-start 0 ease; }',
			fix: {
				range: [23, 26],
				text: 'inline-star',
			},
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { transition: var(--foo, left) 0 ease; }',
			fixed: 'a { transition: var(--foo, inset-inline-start) 0 ease; }',
			fix: {
				range: [27, 30],
				text: 'inset-inline-star',
			},
			message: messages.expected('left', 'inset-inline-start'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { will-change: margin-left, /* foo */ width; }',
			fixed: 'a { will-change: margin-inline-start, /* foo */ inline-size; }',
			warnings: [
				{
					message: messages.expected('margin-left', 'margin-inline-start'),
					fix: {
						range: [24, 27],
						text: 'inline-star',
					},
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 29,
				},
				{
					message: messages.expected('width', 'inline-size'),
					line: 1,
					column: 41,
					endLine: 1,
					endColumn: 46,
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
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-end: 0; }',
			fix: {
				range: [11, 15],
				text: 'inline-end',
			},
			message: messages.expected('margin-left', 'margin-inline-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-right: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			fix: {
				range: [11, 15],
				text: 'inline-star',
			},
			message: messages.expected('margin-right', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-start: 0; }',
			fix: {
				range: [12, 15],
				text: 'block-start',
			},
			message: messages.expected('padding-top', 'padding-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { width: 0; }',
			fixed: 'a { inline-size: 0; }',
			fix: {
				range: [4, 9],
				text: 'inline-size',
			},
			message: messages.expected('width', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { height: 0; }',
			fixed: 'a { block-size: 0; }',
			fix: {
				range: [4, 10],
				text: 'block-size',
			},
			message: messages.expected('height', 'block-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a { overflow-x: hidden; }',
			fixed: 'a { overflow-inline: hidden; }',
			fix: {
				range: [13, 14],
				text: 'inline',
			},
			message: messages.expected('overflow-x', 'overflow-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { overflow-y: hidden; }',
			fixed: 'a { overflow-block: hidden; }',
			fix: {
				range: [13, 14],
				text: 'block',
			},
			message: messages.expected('overflow-y', 'overflow-block'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { border-top-left-radius: 0; }',
			fixed: 'a { border-start-end-radius: 0; }',
			fix: {
				range: [11, 19],
				text: 'start-end',
			},
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
	computeEditInfo: true,

	reject: [
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-end: 0; }',
			fix: {
				range: [12, 15],
				text: 'block-end',
			},
			message: messages.expected('padding-top', 'padding-block-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-bottom: 0; }',
			fixed: 'a { margin-block-start: 0; }',
			fix: {
				range: [12, 17],
				text: 'lock-start',
			},
			message: messages.expected('margin-bottom', 'margin-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			fix: {
				range: [11, 14],
				text: 'inline-star',
			},
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { width: 0; }',
			fixed: 'a { inline-size: 0; }',
			fix: {
				range: [4, 9],
				text: 'inline-size',
			},
			message: messages.expected('width', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { height: 0; }',
			fixed: 'a { block-size: 0; }',
			fix: {
				range: [4, 10],
				text: 'block-size',
			},
			message: messages.expected('height', 'block-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a { overflow-x: hidden; }',
			fixed: 'a { overflow-inline: hidden; }',
			fix: {
				range: [13, 14],
				text: 'inline',
			},
			message: messages.expected('overflow-x', 'overflow-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { overflow-y: hidden; }',
			fixed: 'a { overflow-block: hidden; }',
			fix: {
				range: [13, 14],
				text: 'block',
			},
			message: messages.expected('overflow-y', 'overflow-block'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { border-top-left-radius: 0; }',
			fixed: 'a { border-end-start-radius: 0; }',
			fix: {
				range: [11, 18],
				text: 'end-star',
			},
			message: messages.expected('border-top-left-radius', 'border-end-start-radius'),
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
			inline: 'right-to-left',
		},
	},
	fix: true,
	computeEditInfo: true,

	reject: [
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-inline-end: 0; }',
			fix: {
				range: [11, 15],
				text: 'inline-end',
			},
			message: messages.expected('margin-left', 'margin-inline-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-right: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			fix: {
				range: [11, 15],
				text: 'inline-star',
			},
			message: messages.expected('margin-right', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-block-end: 0; }',
			fix: {
				range: [12, 15],
				text: 'block-end',
			},
			message: messages.expected('padding-top', 'padding-block-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-bottom: 0; }',
			fixed: 'a { margin-block-start: 0; }',
			fix: {
				range: [12, 17],
				text: 'lock-start',
			},
			message: messages.expected('margin-bottom', 'margin-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { width: 0; }',
			fixed: 'a { inline-size: 0; }',
			fix: {
				range: [4, 9],
				text: 'inline-size',
			},
			message: messages.expected('width', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { height: 0; }',
			fixed: 'a { block-size: 0; }',
			fix: {
				range: [4, 10],
				text: 'block-size',
			},
			message: messages.expected('height', 'block-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a { overflow-x: hidden; }',
			fixed: 'a { overflow-inline: hidden; }',
			fix: {
				range: [13, 14],
				text: 'inline',
			},
			message: messages.expected('overflow-x', 'overflow-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { overflow-y: hidden; }',
			fixed: 'a { overflow-block: hidden; }',
			fix: {
				range: [13, 14],
				text: 'block',
			},
			message: messages.expected('overflow-y', 'overflow-block'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { border-top-left-radius: 0; }',
			fixed: 'a { border-end-end-radius: 0; }',
			fix: {
				range: [11, 19],
				text: 'end-end',
			},
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
	computeEditInfo: true,

	reject: [
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-block-end: 0; }',
			fix: {
				range: [11, 15],
				text: 'block-end',
			},
			message: messages.expected('margin-left', 'margin-block-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-inline-start: 0; }',
			fix: {
				range: [12, 15],
				text: 'inline-start',
			},
			message: messages.expected('padding-top', 'padding-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-bottom: 0; }',
			fixed: 'a { margin-inline-end: 0; }',
			fix: {
				range: [11, 17],
				text: 'inline-end',
			},
			message: messages.expected('margin-bottom', 'margin-inline-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { width: 0; }',
			fixed: 'a { block-size: 0; }',
			fix: {
				range: [4, 9],
				text: 'block-size',
			},
			message: messages.expected('width', 'block-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { height: 0; }',
			fixed: 'a { inline-size: 0; }',
			fix: {
				range: [4, 10],
				text: 'inline-size',
			},
			message: messages.expected('height', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a { overflow-x: hidden; }',
			fixed: 'a { overflow-block: hidden; }',
			fix: {
				range: [13, 14],
				text: 'block',
			},
			message: messages.expected('overflow-x', 'overflow-block'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { overflow-y: hidden; }',
			fixed: 'a { overflow-inline: hidden; }',
			fix: {
				range: [13, 14],
				text: 'inline',
			},
			message: messages.expected('overflow-y', 'overflow-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { border-top-left-radius: 0; }',
			fixed: 'a { border-end-start-radius: 0; }',
			fix: {
				range: [11, 18],
				text: 'end-star',
			},
			message: messages.expected('border-top-left-radius', 'border-end-start-radius'),
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
			block: 'left-to-right',
			inline: 'bottom-to-top',
		},
	},
	fix: true,
	computeEditInfo: true,

	reject: [
		{
			code: 'a { margin-left: 0; }',
			fixed: 'a { margin-block-start: 0; }',
			fix: {
				range: [11, 14],
				text: 'block-star',
			},
			message: messages.expected('margin-left', 'margin-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { padding-top: 0; }',
			fixed: 'a { padding-inline-end: 0; }',
			fix: {
				range: [12, 15],
				text: 'inline-end',
			},
			message: messages.expected('padding-top', 'padding-inline-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin-bottom: 0; }',
			fixed: 'a { margin-inline-start: 0; }',
			fix: {
				range: [11, 17],
				text: 'inline-start',
			},
			message: messages.expected('margin-bottom', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { width: 0; }',
			fixed: 'a { block-size: 0; }',
			fix: {
				range: [4, 9],
				text: 'block-size',
			},
			message: messages.expected('width', 'block-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { overflow-x: hidden; }',
			fixed: 'a { overflow-block: hidden; }',
			fix: {
				range: [13, 14],
				text: 'block',
			},
			message: messages.expected('overflow-x', 'overflow-block'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { height: 0; }',
			fixed: 'a { inline-size: 0; }',
			fix: {
				range: [4, 10],
				text: 'inline-size',
			},
			message: messages.expected('height', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'a { overflow-y: hidden; }',
			fixed: 'a { overflow-inline: hidden; }',
			fix: {
				range: [13, 14],
				text: 'inline',
			},
			message: messages.expected('overflow-y', 'overflow-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { border-top-left-radius: 0; }',
			fixed: 'a { border-start-end-radius: 0; }',
			fix: {
				range: [11, 19],
				text: 'start-end',
			},
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
			code: 'a { margin: 1em; }',
			description: 'single-value shorthand applies to every side',
		},
		{
			code: 'a { inset: 0; }',
			description: 'single-value shorthand applies to every side',
		},
		{
			code: 'a { margin: var(--gap); }',
			description: 'single var() value',
		},
		{
			code: 'a { margin: logical 1em 2em; }',
			description: 'the `logical` keyword is still in flux in the css-logical spec',
		},
		{
			code: 'a { transition: margin 0s ease; }',
			description: 'shorthand in transition-property means all margins',
		},
		{
			code: 'a { margin: 1em 2em 3em 4em 5em; }',
			description: 'invalid number of values is left to syntax-checking rules',
		},
		{
			code: '@page { margin: 1em 2em; }',
		},
	],

	reject: [
		{
			code: 'a { margin: 1em 2em; }',
			fixed: 'a { margin-block: 1em; margin-inline: 2em; }',
			fix: {
				range: [19, 20],
				text: '',
			},
			message: messages.expected('margin', 'margin-block, margin-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'two-value physical shorthand',
		},
		{
			code: 'a { margin: 1em 2em 3em; }',
			fixed: 'a { margin-block-start: 1em; margin-inline: 2em; margin-block-end: 3em; }',
			fix: {
				range: [23, 24],
				text: '',
			},
			message: messages.expected('margin', 'margin-block-start, margin-inline, margin-block-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'three-value physical shorthand',
		},
		{
			code: 'a { margin: 1em 2em 3em 4em; }',
			fixed:
				'a { margin-block-start: 1em; margin-inline-end: 2em; margin-block-end: 3em; margin-inline-start: 4em; }',
			fix: {
				range: [27, 28],
				text: '',
			},
			message: messages.expected(
				'margin',
				'margin-block-start, margin-inline-end, margin-block-end, margin-inline-start',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'four-value physical shorthand',
		},
		{
			code: 'a { margin: 1em 2em 3em 4em; transition: margin-left 0 ease; }',
			fixed:
				'a { margin-block-start: 1em; margin-inline-end: 2em; margin-block-end: 3em; margin-inline-start: 4em; transition: margin-inline-start 0 ease; }',
			warnings: [
				{
					message: messages.expected(
						'margin',
						'margin-block-start, margin-inline-end, margin-block-end, margin-inline-start',
					),
					fix: {
						range: [27, 28],
						text: '',
					},
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 11,
				},
				{
					message: messages.expected('margin-left', 'margin-inline-start'),
					fix: {
						range: [48, 51],
						text: 'inline-star',
					},
					line: 1,
					column: 42,
					endLine: 1,
					endColumn: 53,
				},
			],
			description: 'motivating example from the issue',
		},
		{
			code: 'a { inset: 0 1em 2em 3em; }',
			fixed:
				'a { inset-block-start: 0; inset-inline-end: 1em; inset-block-end: 2em; inset-inline-start: 3em; }',
			fix: {
				range: [24, 25],
				text: '',
			},
			message: messages.expected(
				'inset',
				'inset-block-start, inset-inline-end, inset-block-end, inset-inline-start',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a { border-width: thin thick; }',
			fixed: 'a { border-block-width: thin; border-inline-width: thick; }',
			fix: {
				range: [28, 29],
				text: '',
			},
			message: messages.expected('border-width', 'border-block-width, border-inline-width'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { border-style: solid dashed dotted double; }',
			fixed:
				'a { border-block-start-style: solid; border-inline-end-style: dashed; border-block-end-style: dotted; border-inline-start-style: double; }',
			fix: {
				range: [44, 45],
				text: '',
			},
			message: messages.expected(
				'border-style',
				'border-block-start-style, border-inline-end-style, border-block-end-style, border-inline-start-style',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { border-color: red blue; }',
			fixed: 'a { border-block-color: red; border-inline-color: blue; }',
			fix: {
				range: [26, 27],
				text: '',
			},
			message: messages.expected('border-color', 'border-block-color, border-inline-color'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { scroll-margin: 1em 2em; }',
			fixed: 'a { scroll-margin-block: 1em; scroll-margin-inline: 2em; }',
			fix: {
				range: [26, 27],
				text: '',
			},
			message: messages.expected('scroll-margin', 'scroll-margin-block, scroll-margin-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { scroll-padding: 1em 2em 3em; }',
			fixed:
				'a { scroll-padding-block-start: 1em; scroll-padding-inline: 2em; scroll-padding-block-end: 3em; }',
			fix: {
				range: [31, 32],
				text: '',
			},
			message: messages.expected(
				'scroll-padding',
				'scroll-padding-block-start, scroll-padding-inline, scroll-padding-block-end',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { padding: 0 1em; }',
			fixed: 'a { padding-block: 0; padding-inline: 1em; }',
			fix: {
				range: [18, 19],
				text: '',
			},
			message: messages.expected('padding', 'padding-block, padding-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'a { margin: calc(1em + 2px) 2em !important; }',
			fixed: 'a { margin-block: calc(1em + 2px) !important; margin-inline: 2em !important; }',
			fix: {
				range: [42, 43],
				text: '',
			},
			message: messages.expected('margin', 'margin-block, margin-inline'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'function values and !important are preserved',
		},
		{
			code: 'a { margin: var(--gap) 1em; }',
			unfixable: true,
			message: messages.rejected('physical', 'margin'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'var() can hold any number of values, so expanding is unsafe',
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
			code: 'a { margin: 1em 2em 3em 4em; }',
			fixed:
				'a { margin-block-start: 1em; margin-inline-start: 2em; margin-block-end: 3em; margin-inline-end: 4em; }',
			fix: {
				range: [27, 28],
				text: '',
			},
			message: messages.expected(
				'margin',
				'margin-block-start, margin-inline-start, margin-block-end, margin-inline-end',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'four-value physical shorthand with right-to-left inline direction',
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

	reject: [
		{
			code: 'a { margin: 1em 2em; }',
			fixed: 'a { margin-inline: 1em; margin-block: 2em; }',
			fix: {
				range: [19, 20],
				text: '',
			},
			message: messages.expected('margin', 'margin-inline, margin-block'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
			description: 'two-value physical shorthand with vertical inline direction',
		},
		{
			code: 'a { inset: 0 1em 2em 3em; }',
			fixed:
				'a { inset-inline-start: 0; inset-block-start: 1em; inset-inline-end: 2em; inset-block-end: 3em; }',
			fix: {
				range: [24, 25],
				text: '',
			},
			message: messages.expected(
				'inset',
				'inset-inline-start, inset-block-start, inset-inline-end, inset-block-end',
			),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
			description: 'four-value physical shorthand with vertical inline direction',
		},
	],
});
