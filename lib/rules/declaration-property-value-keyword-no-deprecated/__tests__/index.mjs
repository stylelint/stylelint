import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: true,
	accept: [
		{
			code: 'a { color: red; }',
		},
	],

	reject: [
		{
			code: 'a { color: InactiveCaptionText; }',
			fixed: 'a { color: GrayText; }',
			message: messages.rejected('InactiveCaptionText', 'color'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { width: min-intrinsic; }',
			message: messages.rejected('min-intrinsic', 'width'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { zOom: /*qux*/reset/*baz*/; }',
			fixed: 'a { zOom: /*qux*/1/*baz*/; }',
			message: messages.rejected('reset', 'zOom'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { text-decoration-line: /* foo */blink/* bar */; }',
			message: messages.rejected('blink', 'text-decoration-line'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: 'a { word-break: break-word; }',
			fixed: 'a { word-break: normal; overflow-wrap: anywhere; }',
			message: messages.rejected('break-word', 'word-break'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 27,
			skip: true,
		},
	],
});

testRule({
	ruleName,

	config: [
		true,
		{
			ignoreValues: [/intrinsic$/, 'padding-box'],
		},
	],

	accept: [
		{
			code: 'a { box-sizing: padding-box; }',
		},
		{
			code: 'a { width: min-intrinsic; }',
		},
		{
			code: 'a { appearance: textfield; }',
		},
	],

	reject: [
		{
			code: 'a { box-sizing: PADDING-BOX; }',
			message: messages.rejected('PADDING-BOX', 'box-sizing'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 28,
		},
	],
});
