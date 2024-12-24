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
			code: 'a { zoom: /*qux*/reset; }',
			fixed: 'a { zoom: /*qux*/1; }',
			message: messages.rejected('reset', 'zoom'),
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
