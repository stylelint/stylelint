'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['numeric'],

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
			message: messages.expected('numeric'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { fOnT-wEiGhT: normal; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { FONT-WEIGHT: normal; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-weight: nOrMaL; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-weight: NORMAL; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font: italic small-caps bolder 16px/3 cursive; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 29,
		},
		{
			code: 'a { font: normal 16px/3 cursive; }',
			description: 'one normal and no numbered weight',
			message: messages.expected('numeric'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: normal normal 16px/3 cursive; }',
			description: 'two normals and no numbered weight',
			message: messages.expected('numeric'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: normal normal normal 16px/3 cursive; }',
			description: 'three normals and no numbered weight',
			message: messages.expected('numeric'),
			line: 1,
			column: 11,
		},
		{
			code: '@font-face { font-weight: normal bold; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 27,
		},
		{
			code: '@font-face { font-weight: 400 bold; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 27,
		},
		{
			code: '@font-face { font-weight: normal 700; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 27,
		},
		{
			code: '@font-face { font-weight: /* 400 */ normal 700; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 37,
		},
		{
			code: '@font-face { font-weight: normal /* 400 */700; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 27,
		},
		{
			code: '@font-face { font-weight: normal/* 400 */ 700; }',
			message: messages.expected('numeric'),
			line: 1,
			column: 27,
		},
	],
});

testRule({
	ruleName,
	config: ['numeric', { ignore: ['relative'] }],

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
			message: messages.expected('numeric'),
			line: 1,
			column: 18,
		},
	],
});

testRule({
	ruleName,
	config: ['named-where-possible'],

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
			message: messages.expected('named'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-weight: boldd; }',
			description: 'invalid font-weight value',
			message: messages.invalidNamed('boldd'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font: italic small-caps 700 16px/3 cursive; }',
			message: messages.expected('named'),
			line: 1,
			column: 29,
		},
		{
			code: 'a { font: normal 400 normal 16px serif; }',
			description: 'two normals and a numbered weight',
			message: messages.expected('named'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font: 400 normal 16px serif; }',
			description: 'one normal and a numbered weight',
			message: messages.expected('named'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: 400 16px serif; }',
			description: 'no normals and a numbered weight',
			message: messages.expected('named'),
			line: 1,
			column: 11,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
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
	],
});
