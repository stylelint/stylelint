import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,
	computeEditInfo: true,
	accept: [
		{
			code: 'a { margin: 1px; }',
		},
		{
			code: 'a { margin: -1px; }',
		},
		{
			code: 'a { margin: 1px 2px; }',
		},
		{
			code: 'a { margin: 1px 1px 2px; }',
		},
		{
			code: 'a { margin: 1px 2px 2px; }',
		},
		{
			code: 'a { margin: 1px 2px 3px; }',
		},
		{
			code: 'a { margin: 1px 1px 2px 2px; }',
		},
		{
			code: 'a { margin: 1px 1px 1px 2px; }',
		},
		{
			code: 'a { margin: 1px 2px 2px 1px; }',
		},
		{
			code: 'a { margin: 1px 2px 3px 1px; }',
		},
		{
			code: 'a { margin: 1px 2px 2px 3px; }',
		},
		{
			code: 'a { margin: 1px 2px 3px 3px; }',
		},
		{
			code: 'a { margin: 1px 2px 3px 4px; }',
		},
		{
			code: 'a { margin: 1px 1em 1pt 1pc; }',
		},
		{
			code: 'a { padding: 1px 2px 3px 4px; }',
		},
		{
			code: 'a { padding: 1px 1em 1pt 1pc; }',
		},
		{
			code: 'a { margin: calc(2px + 1px) calc(1px + 1px); }',
		},
		{
			code: 'a { inset: 0; }',
		},
		{
			code: 'a { inset: 1px 2px; }',
		},
		{
			code: 'a { inset: 1px 2px 3px; }',
		},
		{
			code: 'a { inset: 1px 2px 3px 4px; }',
		},
		{
			code: 'a { margin: 1px 1px 1px 1px 1px; }',
			description: 'ignore wrong value',
		},
		{
			code: 'a { property: 1px 1px 1px 1px; }',
			description: 'ignore not shorthandable property',
		},
		{
			code: 'a { border-radius: 1px / 1px; }',
		},
		{
			code: 'a { margin: var(--margin) var(--margin); }',
			description: 'ignore variables',
		},
		{
			code: 'a { border-radius: var(--foo) var(--foo) / var(--foo) var(--foo); }',
			description: 'ignore variables with slash in shorthand',
		},
		{
			code: 'a { border-radius: 1px 1px , 1px 1px; }',
			description: 'ignore invalid divider in border-radius (comma)',
		},
		{
			code: 'a { border-color: #FFFFFF transparent transparent; }',
			description: 'ignore upper case value',
		},
		{
			code: 'a { background: url(img.gif), url(img.gif); }',
			description: 'ignore background property',
		},
		{
			code: "a { font: 12pt/10pt 'Font', 'Font', 'Font'; }",
			description: 'ignore font property',
		},
		{
			code: 'a { border: 5px solid red; }',
			description: 'ignore border property',
		},
		{
			code: 'a { list-style: square outside; }',
			description: 'ignore list-style property',
		},
		{
			code: 'a { transition: opacity 0.35s, transform 0.35s; }',
			description: 'ignore transition property',
		},
	],

	reject: [
		{
			code: 'a { overflow: scroll scroll; }',
			fixed: 'a { overflow: scroll; }',
			fix: {
				range: [20, 27],
				text: '',
			},
			message: messages.expected('scroll scroll', 'scroll'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { gap: 1rem 1rem; }',
			fixed: 'a { gap: 1rem; }',
			fix: {
				range: [13, 18],
				text: '',
			},
			message: messages.expected('1rem 1rem', '1rem'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { margin: 1px 1px; }',
			fixed: 'a { margin: 1px; }',
			fix: {
				range: [15, 19],
				text: '',
			},
			message: messages.expected('1px 1px', '1px'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { margin: 1Px 1pX; }',
			fixed: 'a { margin: 1Px; }',
			fix: {
				range: [15, 19],
				text: '',
			},
			message: messages.expected('1Px 1pX', '1Px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1PX 1PX; }',
			fixed: 'a { margin: 1PX; }',
			fix: {
				range: [15, 19],
				text: '',
			},
			message: messages.expected('1PX 1PX', '1PX'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { mArGiN: 1px 1px; }',
			fixed: 'a { mArGiN: 1px; }',
			fix: {
				range: [15, 19],
				text: '',
			},
			message: messages.expected('1px 1px', '1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { MARGIN: 1px 1px; }',
			fixed: 'a { MARGIN: 1px; }',
			fix: {
				range: [15, 19],
				text: '',
			},
			message: messages.expected('1px 1px', '1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 1px 1px; }',
			fixed: 'a { margin: 1px; }',
			fix: {
				range: [15, 23],
				text: '',
			},
			message: messages.expected('1px 1px 1px', '1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 2px 1px; }',
			fixed: 'a { margin: 1px 2px; }',
			fix: {
				range: [19, 23],
				text: '',
			},
			message: messages.expected('1px 2px 1px', '1px 2px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 2pX 1px; }',
			fixed: 'a { margin: 1px 2pX; }',
			fix: {
				range: [19, 23],
				text: '',
			},
			message: messages.expected('1px 2pX 1px', '1px 2pX'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 2PX 1px; }',
			fixed: 'a { margin: 1px 2PX; }',
			fix: {
				range: [19, 23],
				text: '',
			},
			message: messages.expected('1px 2PX 1px', '1px 2PX'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 1px 1px 1px; }',
			fixed: 'a { margin: 1px; }',
			fix: {
				range: [15, 27],
				text: '',
			},
			message: messages.expected('1px 1px 1px 1px', '1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 2px 1px 2px; }',
			fixed: 'a { margin: 1px 2px; }',
			fix: {
				range: [19, 27],
				text: '',
			},
			message: messages.expected('1px 2px 1px 2px', '1px 2px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 2px 2px 2px; }',
			fixed: 'a { margin: 1px 2px 2px; }',
			fix: {
				range: [23, 27],
				text: '',
			},
			message: messages.expected('1px 2px 2px 2px', '1px 2px 2px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 2px 3px 2px; }',
			fixed: 'a { margin: 1px 2px 3px; }',
			fix: {
				range: [23, 27],
				text: '',
			},
			message: messages.expected('1px 2px 3px 2px', '1px 2px 3px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px  1px   1px    1px; }',
			fixed: 'a { margin: 1px; }',
			fix: {
				range: [15, 33],
				text: '',
			},
			message: messages.expected('1px  1px   1px    1px', '1px'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { margin: 100% 100% 100% 100%; }',
			fixed: 'a { margin: 100%; }',
			fix: {
				range: [16, 31],
				text: '',
			},
			message: messages.expected('100% 100% 100% 100%', '100%'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 1px !important; }',
			fixed: 'a { margin: 1px !important; }',
			fix: {
				range: [16, 20],
				text: '',
			},
			message: messages.expected('1px 1px', '1px'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { margin: 1px 1px 1px 1px !important; }',
			fixed: 'a { margin: 1px !important; }',
			fix: {
				range: [16, 28],
				text: '',
			},
			message: messages.expected('1px 1px 1px 1px', '1px'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { padding: 1px 1px 1px 1px; }',
			fixed: 'a { padding: 1px; }',
			fix: {
				range: [16, 28],
				text: '',
			},
			message: messages.expected('1px 1px 1px 1px', '1px'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { border-color: transparent transparent transparent transparent; }',
			fixed: 'a { border-color: transparent; }',
			fix: {
				range: [29, 65],
				text: '',
			},
			message: messages.expected('transparent transparent transparent transparent', 'transparent'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-color: transparent tRaNsPaReNt TRANSPARENT transparent; }',
			fixed: 'a { border-color: transparent; }',
			fix: {
				range: [29, 65],
				text: '',
			},
			message: messages.expected('transparent tRaNsPaReNt TRANSPARENT transparent', 'transparent'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-color: tRaNsPaReNt TRANSPARENT TRANSPARENT transparent; }',
			fixed: 'a { border-color: tRaNsPaReNt; }',
			fix: {
				range: [29, 65],
				text: '',
			},
			message: messages.expected('tRaNsPaReNt TRANSPARENT TRANSPARENT transparent', 'tRaNsPaReNt'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-color: tRaNsPaReNt tRaNsPaReNt tRaNsPaReNt tRaNsPaReNt; }',
			fixed: 'a { border-color: tRaNsPaReNt; }',
			fix: {
				range: [29, 65],
				text: '',
			},
			message: messages.expected('tRaNsPaReNt tRaNsPaReNt tRaNsPaReNt tRaNsPaReNt', 'tRaNsPaReNt'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-color: TRANSPARENT TRANSPARENT TRANSPARENT TRANSPARENT; }',
			fixed: 'a { border-color: TRANSPARENT; }',
			fix: {
				range: [29, 65],
				text: '',
			},
			message: messages.expected('TRANSPARENT TRANSPARENT TRANSPARENT TRANSPARENT', 'TRANSPARENT'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-color: inherit inherit inherit inherit; }',
			fixed: 'a { border-color: inherit; }',
			fix: {
				range: [25, 49],
				text: '',
			},
			message: messages.expected('inherit inherit inherit inherit', 'inherit'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-color: #fff #fff #fff #fff; }',
			fixed: 'a { border-color: #fff; }',
			fix: {
				range: [22, 37],
				text: '',
			},
			message: messages.expected('#fff #fff #fff #fff', '#fff'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-radius: 1px 1px 1px 1px; }',
			fixed: 'a { border-radius: 1px; }',
			fix: {
				range: [22, 34],
				text: '',
			},
			message: messages.expected('1px 1px 1px 1px', '1px'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { -webkit-border-radius: 1px 1px 1px 1px; }',
			fixed: 'a { -webkit-border-radius: 1px; }',
			fix: {
				range: [30, 42],
				text: '',
			},
			message: messages.expected('1px 1px 1px 1px', '1px'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { border-style: solid solid solid solid; }',
			fixed: 'a { border-style: solid; }',
			fix: {
				range: [23, 41],
				text: '',
			},
			message: messages.expected('solid solid solid solid', 'solid'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-width: 1px 1px 1px 1px; }',
			fixed: 'a { border-width: 1px; }',
			fix: {
				range: [21, 33],
				text: '',
			},
			message: messages.expected('1px 1px 1px 1px', '1px'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { border-width: thin thin thin thin; }',
			fixed: 'a { border-width: thin; }',
			fix: {
				range: [22, 37],
				text: '',
			},
			message: messages.expected('thin thin thin thin', 'thin'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { margin: 1em 0 2em 0; }',
			fixed: 'a { margin: 1em 0 2em; }',
			fix: {
				range: [21, 23],
				text: '',
			},
			message: messages.expected('1em 0 2em 0', '1em 0 2em'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: -1px -1px -1px -1px; }',
			fixed: 'a { margin: -1px; }',
			fix: {
				range: [16, 31],
				text: '',
			},
			message: messages.expected('-1px -1px -1px -1px', '-1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: -1px -1px -1px; }',
			fixed: 'a { margin: -1px; }',
			fix: {
				range: [16, 26],
				text: '',
			},
			message: messages.expected('-1px -1px -1px', '-1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 0 -1px 0 -1px; }',
			fixed: 'a { margin: 0 -1px; }',
			fix: {
				range: [18, 25],
				text: '',
			},
			message: messages.expected('0 -1px 0 -1px', '0 -1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: -1em 0 2em 0; }',
			fixed: 'a { margin: -1em 0 2em; }',
			fix: {
				range: [22, 24],
				text: '',
			},
			message: messages.expected('-1em 0 2em 0', '-1em 0 2em'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { inset: 0 0 0 0; }',
			fixed: 'a { inset: 0; }',
			fix: {
				range: [12, 18],
				text: '',
			},
			message: messages.expected('0 0 0 0', '0'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { inset: 1px 0 1px 0; }',
			fixed: 'a { inset: 1px 0; }',
			fix: {
				range: [16, 22],
				text: '',
			},
			message: messages.expected('1px 0 1px 0', '1px 0'),
			line: 1,
			column: 12,
		},
		{
			code: 'a { margin: calc(1px + 1px) calc(1px + 1px); }',
			fixed: 'a { margin: calc(1px + 1px); }',
			fix: {
				range: [27, 43],
				text: '',
			},
			message: messages.expected('calc(1px + 1px) calc(1px + 1px)', 'calc(1px + 1px)'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 44,
		},
		{
			code: 'a { margin: some-function(1px + 1px) some-function(1px + 1px); }',
			fixed: 'a { margin: some-function(1px + 1px); }',
			fix: {
				range: [36, 61],
				text: '',
			},
			message: messages.expected(
				'some-function(1px + 1px) some-function(1px + 1px)',
				'some-function(1px + 1px)',
			),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 62,
		},
		{
			code: 'a { border-radius: 1px 1px / 1px; }',
			fixed: 'a { border-radius: 1px / 1px; }',
			fix: {
				range: [23, 27],
				text: '',
			},
			message: messages.expected('1px 1px / 1px', '1px / 1px'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { border-radius: 1px 1px 1px 1px / 2px 2px 2px 2px; }',
			fixed: 'a { border-radius: 1px / 2px; }',
			fix: {
				range: [23, 48],
				text: '/',
			},
			message: messages.expected('1px 1px 1px 1px / 2px 2px 2px 2px', '1px / 2px'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: 'a { border-radius: 1px 1px 1px 1px / 2px; }',
			fixed: 'a { border-radius: 1px / 2px; }',
			description: 'Horizontal side redundant - vertical already shortest',
			fix: {
				range: [23, 35],
				text: '',
			},
			message: messages.expected('1px 1px 1px 1px / 2px', '1px / 2px'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: 'a { border-radius: 1px 2px / 2px 2px 2px 2px; }',
			fixed: 'a { border-radius: 1px 2px / 2px; }',
			description: 'Vertical side redundant - horizontal mixed',
			fix: {
				range: [32, 44],
				text: '',
			},
			message: messages.expected('1px 2px / 2px 2px 2px 2px', '1px 2px / 2px'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: 'a { border-radius: calc(1px + 1px) calc(1px + 1px) / calc(1px + 1px) calc(1px + 1px); }',
			fixed: 'a { border-radius: calc(1px + 1px) / calc(1px + 1px); }',
			description: 'slash with value functions',
			fix: {
				range: [35, 68],
				text: '/',
			},
			message: messages.expected(
				'calc(1px + 1px) calc(1px + 1px) / calc(1px + 1px) calc(1px + 1px)',
				'calc(1px + 1px) / calc(1px + 1px)',
			),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 85,
		},
		{
			code: 'a { border-radius: 1px 1px / calc(1px + 1px) calc(1px + 1px); }',
			fixed: 'a { border-radius: 1px / calc(1px + 1px); }',
			description: 'slash with value words and value functions',
			fix: {
				range: [23, 44],
				text: '/',
			},
			message: messages.expected(
				'1px 1px / calc(1px + 1px) calc(1px + 1px)',
				'1px / calc(1px + 1px)',
			),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 61,
		},
		{
			code: 'a { border-radius: 1px 1px / var(--foo) var(--foo); }',
			fixed: 'a { border-radius: 1px / var(--foo) var(--foo); }',
			description: 'slash with value words and variable functions',
			fix: {
				range: [23, 27],
				text: '',
			},
			message: messages.expected('1px 1px / var(--foo) var(--foo)', '1px / var(--foo) var(--foo)'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 51,
		},
		{
			code: 'a { border-radius: var(--foo) var(--foo) / calc(1px + 1px) calc(1px + 1px); }',
			fixed: 'a { border-radius: var(--foo) var(--foo) / calc(1px + 1px); }',
			description: 'slash with value functions and variable functions',
			fix: {
				range: [58, 74],
				text: '',
			},
			message: messages.expected(
				'var(--foo) var(--foo) / calc(1px + 1px) calc(1px + 1px)',
				'var(--foo) var(--foo) / calc(1px + 1px)',
			),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 75,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-less',
	fix: true,
	accept: [
		{
			code: '@margin: 1px 1px 1px 1px;',
		},
		{
			code: 'a { margin: @variable @variable @variable @variable; }',
		},
		{
			code: 'a { @margin: 1px 1px 1px 1px; }',
		},
		{
			code: 'a { @margin: @variable + 10 @variable + 10; }',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',
	fix: true,
	accept: [
		{
			code: '$margin: 1px 1px 1px 1px;',
		},
		{
			code: 'a { margin: $variable $variable $variable $variable; }',
		},
		{
			code: 'a { $margin: 1px 1px 1px 1px; }',
		},
		{
			code: 'a { $margin: $variable + 10 $variable + 10; }',
		},
		{
			code: 'a { #{$margin}: 1px 1px 1px 1px; }',
		},
		{
			code: 'a { margin-#{$margin}: 1px 1px 1px 1px; }',
		},
		{
			code: 'a { #{$margin}-margin: 1px 1px 1px 1px; }',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['four-into-three-edge-values'] }],
	fix: true,
	accept: [
		{
			code: 'a { margin: 1px 2px 3px 2px; }',
		},
		{
			code: 'a { inset: auto 0 0 0; }',
		},
	],
	reject: [
		{
			code: 'a { margin: 1px 1px; }',
			fixed: 'a { margin: 1px; }',
			message: messages.expected('1px 1px', '1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 1px 1px 1px; }',
			fixed: 'a { margin: 1px; }',
			message: messages.expected('1px 1px 1px 1px', '1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 2px 1px 2px; }',
			fixed: 'a { margin: 1px 2px; }',
			message: messages.expected('1px 2px 1px 2px', '1px 2px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { margin: 1px 1px 1px; }',
			fixed: 'a { margin: 1px; }',
			message: messages.expected('1px 1px 1px', '1px'),
			line: 1,
			column: 13,
		},
		{
			code: 'a { border-radius: 1px 2px 3px 2px; }',
			fixed: 'a { border-radius: 1px 2px 3px; }',
			message: messages.expected('1px 2px 3px 2px', '1px 2px 3px'),
			line: 1,
			column: 20,
			description: 'Corner properties are reported',
		},
	],
});
