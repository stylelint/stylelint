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
			code: 'a { margin-block-start: 10px; }',
		},
		{
			code: 'a { padding-inline-end: 5px; }',
		},
		{
			code: 'a { border-block-end: 1px solid red; }',
		},
		{
			code: 'a { inset-inline-start: 0; }',
		},
		{
			code: 'a { inline-size: 100px; }',
		},
		{
			code: 'a { block-size: 50px; }',
		},
		{
			code: 'a { min-inline-size: 200px; }',
		},
		{
			code: 'a { max-block-size: 300px; }',
		},
		{
			code: 'a { scroll-margin-inline-start: 10px; }',
		},
		{
			code: 'a { scroll-padding-block-end: 5px; }',
		},
		{
			code: 'a { border-start-start-radius: 5px; }',
		},
		{
			code: 'a { border-end-end-radius: 10px; }',
		},
		{
			code: 'a { --foo: 10px; }',
			description: 'custom properties ignored',
		},
		{
			code: '@media all { a { margin-inline-start: 10px; } }',
			description: 'within at-rule',
		},
		{
			code: 'a { margin-inline-start: var(--foo); }',
			description: 'with CSS variable',
		},
		{
			code: 'a { margin-inline-start: initial; }',
			description: 'with CSS-wide keyword',
		},
		{
			code: 'div { .nested { margin-inline-start: 10px; } }',
			description: 'with nesting',
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
			code: 'a { margin-right: 5px; }',
			fixed: 'a { margin-inline-end: 5px; }',
			message: messages.expected('margin-right', 'margin-inline-end'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { margin-top: 15px; }',
			fixed: 'a { margin-block-start: 15px; }',
			message: messages.expected('margin-top', 'margin-block-start'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { margin-bottom: 20px; }',
			fixed: 'a { margin-block-end: 20px; }',
			message: messages.expected('margin-bottom', 'margin-block-end'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { padding-left: 8px; }',
			fixed: 'a { padding-inline-start: 8px; }',
			message: messages.expected('padding-left', 'padding-inline-start'),
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
			code: 'a { right: 10px; }',
			fixed: 'a { inset-inline-end: 10px; }',
			message: messages.expected('right', 'inset-inline-end'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { top: 5px; }',
			fixed: 'a { inset-block-start: 5px; }',
			message: messages.expected('top', 'inset-block-start'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { bottom: 15px; }',
			fixed: 'a { inset-block-end: 15px; }',
			message: messages.expected('bottom', 'inset-block-end'),
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
			code: 'a { height: 100px; }',
			fixed: 'a { block-size: 100px; }',
			message: messages.expected('height', 'block-size'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { min-width: 50px; }',
			fixed: 'a { min-inline-size: 50px; }',
			message: messages.expected('min-width', 'min-inline-size'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { max-height: 300px; }',
			fixed: 'a { max-block-size: 300px; }',
			message: messages.expected('max-height', 'max-block-size'),
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
			code: 'a { scroll-padding-top: 5px; }',
			fixed: 'a { scroll-padding-block-start: 5px; }',
			message: messages.expected('scroll-padding-top', 'scroll-padding-block-start'),
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
		{
			code: 'a { border-bottom-right-radius: 10px; }',
			fixed: 'a { border-end-end-radius: 10px; }',
			message: messages.expected('border-bottom-right-radius', 'border-end-end-radius'),
			line: 1,
			column: 5,
		},
		{
			code: 'a {\n  margin-left: 10px;\n}',
			fixed: 'a {\n  margin-inline-start: 10px;\n}',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 2,
			column: 3,
		},
		{
			code: 'a { margin-left: 10px; margin-right: 5px; }',
			fixed: 'a { margin-inline-start: 10px; margin-inline-end: 5px; }',
			warnings: [
				{
					message: messages.expected('margin-left', 'margin-inline-start'),
					line: 1,
					column: 5,
				},
				{
					message: messages.expected('margin-right', 'margin-inline-end'),
					line: 1,
					column: 24,
				},
			],
		},
		{
			code: 'a { -webkit-margin-start: 10px; }',
			fixed: 'a { -webkit-margin-inline-start: 10px; }',
			message: messages.expected('-webkit-margin-start', '-webkit-margin-inline-start'),
			line: 1,
			column: 5,
			description: 'with vendor prefix',
		},
		{
			code: 'a { margin-left: 10px; /* comment */ }',
			fixed: 'a { margin-inline-start: 10px; /* comment */ }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			description: 'with comment after declaration',
		},
		{
			code: 'a { margin-left /* comment */: 10px; }',
			fixed: 'a { margin-inline-start /* comment */: 10px; }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			description: 'with comment in property',
		},
		{
			code: 'a { margin-left: inherit; }',
			fixed: 'a { margin-inline-start: inherit; }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			description: 'with CSS-wide keyword',
		},
		{
			code: 'div { .nested { margin-left: 10px; } }',
			fixed: 'div { .nested { margin-inline-start: 10px; } }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 17,
			description: 'with nesting',
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
			code: 'a { margin-top: 10px; }',
		},
		{
			code: 'a { padding-right: 5px; }',
		},
		{
			code: 'a { border-bottom: 1px solid red; }',
		},
		{
			code: 'a { left: 0; }',
		},
		{
			code: 'a { width: 100px; }',
		},
		{
			code: 'a { height: 50px; }',
		},
		{
			code: 'a { min-width: 200px; }',
		},
		{
			code: 'a { max-height: 300px; }',
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
			code: 'a { margin-inline-end: 5px; }',
			fixed: 'a { margin-right: 5px; }',
			message: messages.expected('margin-inline-end', 'margin-right'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { margin-block-start: 15px; }',
			fixed: 'a { margin-top: 15px; }',
			message: messages.expected('margin-block-start', 'margin-top'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { padding-inline-start: 8px; }',
			fixed: 'a { padding-left: 8px; }',
			message: messages.expected('padding-inline-start', 'padding-left'),
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
			code: 'a { block-size: 100px; }',
			fixed: 'a { height: 100px; }',
			message: messages.expected('block-size', 'height'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { scroll-margin-inline-start: 10px; }',
			fixed: 'a { scroll-margin-left: 10px; }',
			message: messages.expected('scroll-margin-inline-start', 'scroll-margin-left'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { scroll-padding-block-start: 5px; }',
			fixed: 'a { scroll-padding-top: 5px; }',
			message: messages.expected('scroll-padding-block-start', 'scroll-padding-top'),
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
		{
			code: 'a { border-end-end-radius: 10px; }',
			fixed: 'a { border-bottom-right-radius: 10px; }',
			message: messages.expected('border-end-end-radius', 'border-bottom-right-radius'),
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
		{
			code: 'a { margin-top: 15px; }',
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
