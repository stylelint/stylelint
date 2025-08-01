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
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
			description: 'no autofix without languageOptions.directionality configuration',
		},
		{
			code: 'a { padding-top: 8px; }',
			message: messages.expected('padding-top', 'padding-block-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
			description: 'no autofix without languageOptions.directionality configuration',
		},
		{
			code: 'a { border-right: 1px solid red; }',
			message: messages.expected('border-right', 'border-inline-end'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
			description: 'no autofix without languageOptions.directionality configuration',
		},
		{
			code: 'a { left: 0; }',
			message: messages.expected('left', 'inset-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 9,
			description: 'no autofix without languageOptions.directionality configuration',
		},
		{
			code: 'a { width: 200px; }',
			message: messages.expected('width', 'inline-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 10,
			description: 'no autofix without languageOptions.directionality configuration',
		},
		{
			code: 'a { scroll-margin-left: 10px; }',
			message: messages.expected('scroll-margin-left', 'scroll-margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 23,
			description: 'no autofix without languageOptions.directionality configuration',
		},
		{
			code: 'a { border-top-left-radius: 5px; }',
			message: messages.expected('border-top-left-radius', 'border-start-start-radius'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 27,
			description: 'no autofix without languageOptions.directionality configuration',
		},
	],
});

testRule({
	ruleName,
	config: ['physical'],

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
			message: messages.expected('margin-inline-start', 'margin-left'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 24,
			description: 'physical mode does not autofix to avoid layout consequences',
		},
		{
			code: 'a { padding-block-start: 8px; }',
			message: messages.expected('padding-block-start', 'padding-top'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 24,
			description: 'physical mode does not autofix to avoid layout consequences',
		},
		{
			code: 'a { inset-inline-start: 0; }',
			message: messages.expected('inset-inline-start', 'left'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 23,
			description: 'physical mode does not autofix to avoid layout consequences',
		},
		{
			code: 'a { inline-size: 200px; }',
			message: messages.expected('inline-size', 'width'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
			description: 'physical mode does not autofix to avoid layout consequences',
		},
		{
			code: 'a { border-start-start-radius: 5px; }',
			message: messages.expected('border-start-start-radius', 'border-top-left-radius'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 30,
			description: 'physical mode does not autofix to avoid layout consequences',
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative', { exceptProperties: ['/^margin/', 'width'] }],

	accept: [
		{
			code: 'a { margin-left: 10px; }',
			description: 'except property allowed',
		},
		{
			code: 'a { margin-right: 5px; }',
			description: 'regex except property allowed',
		},
		{
			code: 'a { width: 100px; }',
			description: 'except property allowed',
		},
	],

	reject: [
		{
			code: 'a { padding-left: 8px; }',
			message: messages.expected('padding-left', 'padding-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { height: 50px; }',
			message: messages.expected('height', 'block-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 11,
		},
	],
});

testRule({
	ruleName,
	config: ['flow-relative', { dir: 'rtl' }],

	accept: [
		{
			code: 'a { margin-inline-start: 10px; }',
			description: 'flow-relative properties allowed in RTL context',
		},
		{
			code: 'a { padding-block-end: 5px; }',
			description: 'flow-relative properties allowed in RTL context',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 10px; }',
			message: messages.expected('margin-left', 'margin-inline-start'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 16,
			description:
				'physical properties flagged in RTL context (no autofix without languageOptions.directionality)',
		},
	],
});

testRule({
	ruleName,
	config: ['physical', { dir: 'ltr' }],

	accept: [
		{
			code: 'a { margin-left: 10px; }',
			description: 'physical properties allowed in LTR context',
		},
		{
			code: 'a { padding-top: 5px; }',
			description: 'physical properties allowed in LTR context',
		},
	],

	reject: [
		{
			code: 'a { margin-inline-start: 10px; }',
			message: messages.expected('margin-inline-start', 'margin-left'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 24,
			description: 'flow-relative properties flagged in LTR context (no autofix in physical mode)',
		},
	],
});
