import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: red; }',
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
			fix: {
				range: [16, 27],
				text: 'auto',
			},
		},
		{
			code: 'a { color: InactiveCaptionText; }',
			fixed: 'a { color: GrayText; }',
			message: messages.expected('InactiveCaptionText', 'GrayText'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 31,
			fix: {
				range: [11, 26],
				text: 'Gray',
			},
		},
		{
			code: 'a { zOom: /*qux*/reset/*baz*/; }',
			fixed: 'a { zOom: /*qux*/1/*baz*/; }',
			message: messages.expected('reset', '1'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 23,
			fix: {
				range: [17, 22],
				text: '1',
			},
		},
		{
			code: 'a { overflow-x: overlay; }',
			fixed: 'a { overflow-x: auto; }',
			message: messages.expected('overlay', 'auto'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 24,
			fix: {
				range: [16, 23],
				text: 'auto',
			},
		},
		{
			code: 'a { border-color: green yellow WindowFrame blue; }',
			fixed: 'a { border-color: green yellow ButtonBorder blue; }',
			message: messages.expected('WindowFrame', 'ButtonBorder'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 43,
			fix: {
				range: [31, 42],
				text: 'ButtonBorder',
			},
		},
		{
			code: 'a { scrollbar-color: red Background; }',
			fixed: 'a { scrollbar-color: red canvas; }',
			message: messages.expected('Background', 'canvas'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 36,
			fix: {
				range: [25, 35],
				text: 'canvas',
			},
		},
		{
			code: 'a { overflow: overlay; }',
			fixed: 'a { overflow: auto; }',
			message: messages.expected('overlay', 'auto'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 22,
			fix: {
				range: [14, 21],
				text: 'auto',
			},
		},
		{
			code: 'a { overflow: hidden overlay; }',
			fixed: 'a { overflow: hidden auto; }',
			message: messages.expected('overlay', 'auto'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 29,
			fix: {
				range: [21, 28],
				text: 'auto',
			},
		},
		{
			code: 'a { overflow: hidden /* comment */ overlay; }',
			fixed: 'a { overflow: hidden /* comment */ auto; }',
			message: messages.expected('overlay', 'auto'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 43,
			fix: {
				range: [35, 42],
				text: 'auto',
			},
		},
		{
			code: 'a { text-decoration-line: /* foo */blink/* bar */; }',
			message: messages.rejected('text-decoration-line', 'blink'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
			unfixable: true,
		},
		{
			code: 'a { text-decoration: foo blink bar qux baz; }',
			message: messages.rejected('text-decoration', 'blink'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 31,
			unfixable: true,
		},
	],
});

testRule({
	ruleName,
	fix: true,
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
			unfixable: true,
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
				$prefix: info;
				a { background-color: /* a */ $prefix /* b */ + /* c */ background /* d */; }
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
