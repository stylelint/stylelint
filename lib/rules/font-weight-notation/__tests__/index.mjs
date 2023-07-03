import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['numeric'],
	fix: true,

	accept: [
		{
			code: 'a { font-weight: $sassy-font-weight; }',
			description: 'ignores sass variables',
		},
		{
			code: 'a { font: italic @less-666 20px; }',
			description: 'ignores less variables',
		},
		{
			code: 'a { font-weight: var(--ff1); }',
			description: 'ignores custom properties',
		},
		{
			code: 'a { font-weight: 100; }',
		},
		{
			code: 'a { fOnT-wEiGhT: 100; }',
		},
		{
			code: 'a { FONT-WEIGHT: 100; }',
		},
		{
			code: 'a { font-weight: 700; }',
		},
		{
			code: 'a { font-weight: 850; }',
		},
		{
			code: 'a { font-weight: 900; }',
		},
		{
			code: 'a { font: italic small-caps 400 16px/3 cursive; }',
		},
		{
			code: 'a { fOnT: italic small-caps 400 16px/3 cursive; }',
		},
		{
			code: 'a { FONT: italic small-caps 400 16px/3 cursive; }',
		},
		{
			code: 'a { font: italic small-caps 400 16px/500 cursive; }',
		},
		{
			code: 'a { font: italic small-caps 400 16px/500 "bold font name"; }',
		},
		{
			code: 'a { font: italic small-caps 400 16px/500 boldfontname; }',
		},
		{
			code: 'a { font: normal 400 normal 16px serif; }',
			description: 'two normals and a numbered weight',
		},
		{
			code: 'a { font: 400 normal 16px serif; }',
			description: 'one normal and a numbered weight',
		},
		{
			code: 'a { font: 400 16px serif; }',
			description: 'no normals and a numbered weight',
		},
		{
			code: 'a { font-weight: inherit; }',
			description: 'ignore inherit value',
		},
		{
			code: 'a { font-weight: initial; }',
			description: 'ignore initial value',
		},
		{
			code: 'a { font-weight: iNiTiAl; }',
			description: 'ignore initial value',
		},
		{
			code: 'a { font-weight: INITIAL; }',
			description: 'ignore initial value',
		},
		{
			code: 'a { font-weight: /* bold */ 400; }',
			description: 'ignore comment',
		},
		{
			code: '@font-face { font-weight: 400; }',
		},
		{
			code: '@font-face { font-weight: 400.5; }',
		},
		{
			code: '@font-face { font-weight: 400 700; }',
		},
		{
			code: '@font-face { font-weight: 100.5 400; }',
		},
		{
			code: '@font-face { font-weight: 400.5 700.5; }',
		},
		{
			code: '@font-face { font-weight: 400.5 /* 700 */ 700.5; }',
		},
		{
			code: '@font-face { font-weight: 400.5 /* 700 */700.5; }',
		},
		{
			code: '@font-face { font-weight: 400 /*700*/700; }',
		},
		{
			code: '@font-face { font-weight: 400.5/*700*/ 700.5; }',
		},
	],

	reject: [
		{
			code: 'a { font-weight: normal; }',
			fixed: 'a { font-weight: 400; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { fOnT-wEiGhT: normal; }',
			fixed: 'a { fOnT-wEiGhT: 400; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { FONT-WEIGHT: normal; }',
			fixed: 'a { FONT-WEIGHT: 400; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { font-weight: nOrMaL; }',
			fixed: 'a { font-weight: 400; }',
			message: messages.expectedWithActual('nOrMaL', '400'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { font-weight: NORMAL; }',
			fixed: 'a { font-weight: 400; }',
			message: messages.expectedWithActual('NORMAL', '400'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { font-weight: /* bold */ normal; }',
			fixed: 'a { font-weight: /* bold */ 400; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: 'a { font: italic small-caps bolder 16px/3 cursive; }',
			unfixable: true,
			message: messages.expected('numeric'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: 'a { font: normal 16px/3 cursive; }',
			fixed: 'a { font: 400 16px/3 cursive; }',
			description: 'one normal and no numbered weight',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { font: normal normal 16px/3 cursive; }',
			fixed: 'a { font: 400 normal 16px/3 cursive; }',
			description: 'two normals and no numbered weight',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { font: normal normal normal 16px/3 cursive; }',
			fixed: 'a { font: 400 normal normal 16px/3 cursive; }',
			description: 'three normals and no numbered weight',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: '@font-face { font-weight: normal bold; }',
			fixed: '@font-face { font-weight: 400 700; }',
			warnings: [
				{
					message: messages.expectedWithActual('normal', '400'),
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 33,
				},
				{
					message: messages.expectedWithActual('bold', '700'),
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 38,
				},
			],
		},
		{
			code: '@font-face { font-weight: 400 bold; }',
			fixed: '@font-face { font-weight: 400 700; }',
			message: messages.expectedWithActual('bold', '700'),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '@font-face { font-weight: normal 700; }',
			fixed: '@font-face { font-weight: 400 700; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: '@font-face { font-weight: /* 400 */ normal 700; }',
			fixed: '@font-face { font-weight: /* 400 */ 400 700; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 43,
		},
		{
			code: '@font-face { font-weight: normal /* 400 */700; }',
			fixed: '@font-face { font-weight: 400 /* 400 */700; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: '@font-face { font-weight: normal/* 400 */ 700; }',
			fixed: '@font-face { font-weight: 400/* 400 */ 700; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 33,
		},
	],
});

testRule({
	ruleName,
	config: ['numeric', { ignore: ['relative'] }],
	fix: true,

	accept: [
		{
			code: 'a { font-weight: 700; }',
		},
		{
			code: 'a { font-weight: bolder; }',
		},
		{
			code: 'a { font-weight: bOlDeR; }',
		},
		{
			code: 'a { font-weight: BOLDER; }',
		},
		{
			code: 'a { font-weight: lighter; }',
		},
		{
			code: 'a { font: italic small-caps lighter 16px/3 cursive; }',
		},
	],

	reject: [
		{
			code: 'a { font-weight: normal; }',
			fixed: 'a { font-weight: 400; }',
			message: messages.expectedWithActual('normal', '400'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
		},
	],
});

testRule({
	ruleName,
	config: ['named-where-possible'],
	fix: true,

	accept: [
		{
			code: 'a { font-weight: $sassy-font-weight; }',
			description: 'ignores sass variables',
		},
		{
			code: 'a { font: italic @less-666 20px; }',
			description: 'ignores less variables',
		},
		{
			code: 'a { font-weight: var(--ff1); }',
			description: 'ignores custom properties',
		},
		{
			code: 'a { font-weight: bold; }',
		},
		{
			code: 'a { font-weight: BoLd; }',
		},
		{
			code: 'a { font-weight: BOLD; }',
		},
		{
			code: 'a { font-weight: bolder; }',
		},
		{
			code: 'a { font-weight: normal; }',
		},
		{
			code: 'a { font-weight: lighter; }',
		},
		{
			code: 'a { font: italic small-caps bold 16px/500 cursive; }',
		},
		{
			code: 'a { font: italic small-caps bold 16px/500 "cursive 100 font"; }',
		},
		{
			code: 'a { font: italic small-caps bold 16px/500 100cursivefont; }',
		},
		{
			code: 'a { font: normal 16px/3 cursive; }',
			description: 'one normal and no numbered weight',
		},
		{
			code: 'a { font: normal normal 16px/3 cursive; }',
			description: 'two normals and no numbered weight',
		},
		{
			code: 'a { font: normal normal normal 16px/3 cursive; }',
			description: 'three normals and no numbered weight',
		},
		{
			code: 'a { font-weight: 300; }',
			description: 'number without keyword equivalent',
		},
		{
			code: 'a { font: italic small-caps 600 16px/3 cursive; }',
			description: 'another number without keyword equivalent',
		},
		{
			code: 'a { font-weight: inherit; }',
			description: 'ignore inherit value',
		},
		{
			code: 'a { font-weight: iNhErIt; }',
			description: 'ignore inherit value',
		},
		{
			code: 'a { font-weight: INHERIT; }',
			description: 'ignore inherit value',
		},
	],

	reject: [
		{
			code: 'a { font-weight: 400; }',
			fixed: 'a { font-weight: normal; }',
			message: messages.expectedWithActual('400', 'normal'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { font: italic small-caps 700 16px/3 cursive; }',
			fixed: 'a { font: italic small-caps bold 16px/3 cursive; }',
			message: messages.expectedWithActual('700', 'bold'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { font: normal 400 normal 16px serif; }',
			fixed: 'a { font: normal normal normal 16px serif; }',
			description: 'two normals and a numbered weight',
			message: messages.expectedWithActual('400', 'normal'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { font: 400 normal 16px serif; }',
			fixed: 'a { font: normal normal 16px serif; }',
			description: 'one normal and a numbered weight',
			message: messages.expectedWithActual('400', 'normal'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'a { font: 400 16px serif; }',
			fixed: 'a { font: normal 16px serif; }',
			description: 'no normals and a numbered weight',
			message: messages.expectedWithActual('400', 'normal'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 14,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['numeric'],

	accept: [
		{
			code: '@mixin font-face($weight) { a { font-weight: #{$weight}; } }',
			description: 'ignores sass interpolation',
		},
		{
			code: 'a { font-weight: $foo }',
			description: 'ignore sass variable',
		},
		{
			code: 'a { font-weight: map-deep-get($theme, typography, weight, semibold); }',
			description: 'ignore sass function',
		},
		{
			code: 'a { font-weight: /*comment*/ map-deep-get($theme, typography, weight, semibold); }',
			description: 'ignore sass function with comment',
		},
	],
});
