import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,
	fix: true,
	accept: [
		{
			code: 'a { color: red; }',
		},
		{
			code: 'a { scrollbar-color: red Background; border-color: green yellow blue WindowFrame; }',
			description: 'properties that accept multiple keywords are not yet supported',
		},
	],

	reject: [
		{
			code: 'a { appearance: searchfield; }',
			fixed: 'a { appearance: auto; }',
			message: messages.expected('searchfield', 'auto'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { color: InactiveCaptionText; }',
			fixed: 'a { color: GrayText; }',
			message: messages.expected('InactiveCaptionText', 'GrayText'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { zOom: /*qux*/reset/*baz*/; }',
			fixed: 'a { zOom: /*qux*/1/*baz*/; }',
			message: messages.expected('reset', '1'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
		},
	],
});

testRule({
	ruleName,

	config: [
		true,
		{
			ignoreKeywords: [/intrinsic$/, 'padding-box'],
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
			message: messages.rejected('box-sizing', 'PADDING-BOX'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { text-decoration-line: /* foo */blink/* bar */; }',
			message: messages.rejected('text-decoration-line', 'blink'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: true,
	accept: [
		{
			code: `
				$prefix: info;
				a { background-color: $prefix + background; }
			`,
		},
		{
			code: `
				$postfix: text;
				a { background-color: menu + $postfix; }
			`,
		},
	],
});
