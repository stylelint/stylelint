import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: ':root { --foo-bar: 1px; }',
		},
		{
			code: 'a { color: pink; --webkit-transform: 1px; }',
		},
		{
			code: 'a { transform: scale(1); }',
		},
		{
			code: 'a { box-sizing: border-box; }',
		},
		{
			code: 'a { -webkit-font-smoothing: antialiased; }',
			description: 'non-standard prefixed property',
		},
		{
			code: 'a { -webkit-touch-callout: none; }',
			description: 'another non-standard prefixed property',
		},
		{
			code: 'a { -wEbKiT-tOuCh-CaLlOuT: none; }',
			description: 'another non-standard prefixed property',
		},
		{
			code: 'a { -WEBKIT-TOUCH-CALLOUT: none; }',
			description: 'another non-standard prefixed property',
		},
		{
			code: 'a { -webkit-background-size: 1px; }',
			description:
				'height would default to auto instead of duplicating the first value (single background)',
		},
		{
			code: 'a { -webkit-background-size: 1px   2px ,   1px; }',
			description:
				'height would default to auto instead of duplicating the first value (multiple backgrounds)',
		},
	],

	reject: [
		{
			code: 'a { -webkit-background-size: 1px 2px; }',
			fixed: 'a { background-size: 1px 2px; }',
			fix: {
				range: [4, 12],
				text: '',
			},
			description: 'webkit: unprefixing with 2 values (single background)',
			message: messages.rejected('-webkit-background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { -webkit-background-size: 1px 2px, 2px 1px; }',
			fixed: 'a { background-size: 1px 2px, 2px 1px; }',
			fix: {
				range: [4, 12],
				text: '',
			},
			description: 'webkit: unprefixing with 2 values (multiple backgrounds)',
			message: messages.rejected('-webkit-background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { -webkit-background-size: inherit; }',
			fixed: 'a { background-size: inherit; }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-webkit-background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { -webkit-background-size: initial; }',
			fixed: 'a { background-size: initial; }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-webkit-background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { -webkit-background-size: auto; }',
			fixed: 'a { background-size: auto; }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-webkit-background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { -moz-background-size: contain; }',
			fixed: 'a { background-size: contain; }',
			fix: {
				range: [4, 9],
				text: '',
			},
			message: messages.rejected('-moz-background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { -o-background-size: cover; }',
			fixed: 'a { background-size: cover; }',
			fix: {
				range: [4, 7],
				text: '',
			},
			message: messages.rejected('-o-background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { -webkit-transform: scale(1); }',
			fixed: 'a { transform: scale(1); }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-webkit-transform'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { -wEbKiT-tRaNsFoRm: scale(1); }',
			fixed: 'a { tRaNsFoRm: scale(1); }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-wEbKiT-tRaNsFoRm'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { -WEBKIT-TRANSFORM: scale(1); }',
			fixed: 'a { TRANSFORM: scale(1); }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-WEBKIT-TRANSFORM'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { -webkit-transform: scale(1); transform: scale(1); }',
			fixed: 'a { transform: scale(1); transform: scale(1); }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-webkit-transform'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { transform: scale(1); -webkit-transform: scale(1); }',
			fixed: 'a { transform: scale(1); transform: scale(1); }',
			fix: {
				range: [25, 33],
				text: '',
			},
			message: messages.rejected('-webkit-transform'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 43,
		},
		{
			code: 'a { -moz-transition: all 3s; }',
			fixed: 'a { transition: all 3s; }',
			fix: {
				range: [4, 9],
				text: '',
			},
			message: messages.rejected('-moz-transition'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { -moz-columns: 2; }',
			fixed: 'a { columns: 2; }',
			fix: {
				range: [4, 9],
				text: '',
			},
			message: messages.rejected('-moz-columns'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { -o-columns: 2; }',
			fixed: 'a { columns: 2; }',
			fix: {
				range: [4, 7],
				text: '',
			},
			description: 'mistaken prefix',
			message: messages.rejected('-o-columns'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreProperties: ['transform', 'columns', '/^animation-/i'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { -webkit-transform: scale(1); }',
		},
		{
			code: 'a { -moz-columns: 2; }',
		},
		{
			code: 'a { -webkit-animation-delay: 0.5s; }',
		},
		{
			code: 'a { -webkit-ANIMATION-DeLaY: 0.5s; }',
		},
		{
			code: 'a { width: 320px; }',
		},
	],
	reject: [
		{
			code: 'a { -webkit-border-radius: 10px; }',
			fixed: 'a { border-radius: 10px; }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-webkit-border-radius'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { -moz-background-size: cover; }',
			fixed: 'a { background-size: cover; }',
			fix: {
				range: [4, 9],
				text: '',
			},
			message: messages.rejected('-moz-background-size'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { -WEBKIT-tranSFoRM: translateY(-50%); }',
			fixed: 'a { tranSFoRM: translateY(-50%); }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-WEBKIT-tranSFoRM'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreProperties: [/^animation-/i] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { -webkit-animation-delay: 0.5s; }',
		},
	],
	reject: [
		{
			code: 'a { -webkit-border-radius: 10px; }',
			fixed: 'a { border-radius: 10px; }',
			fix: {
				range: [4, 12],
				text: '',
			},
			message: messages.rejected('-webkit-border-radius'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 26,
		},
	],
});
