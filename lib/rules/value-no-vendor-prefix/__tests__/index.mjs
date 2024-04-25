import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,

	accept: [
		{
			code: 'a { display: flex; }',
		},
		{
			code: 'a { background: linear-gradient(to top, #000, #fff); }',
		},
		{
			code: 'a { max-width: max-content; }',
		},
		{
			code: 'a { -webkit-transform: translate(0, 0); }',
			description: 'ignores property vendor prefixes',
		},
		{
			code: 'a { -wEbKiT-tRaNsFoRm: translate(0, 0); }',
			description: 'ignores property vendor prefixes',
		},
		{
			code: 'a { -WEBKIT-TRANSFORM: translate(0, 0); }',
			description: 'ignores property vendor prefixes',
		},
		{
			code: 'a { white-space: -pre-wrap; }',
			description: 'ignores non-vendor prefixed values',
		},
		{
			code: 'a { background-color: -apple-wireless-playback-target-active; }',
			description: '-apple-: ignores unfixable',
		},
		{
			code: 'a { display: -wap-marquee; }',
			description: '-wap-: ignores unfixable',
		},
		{
			code: 'a { list-style-type: -moz-ethiopic-halehame; }',
			description: '-moz-: ignores unfixable',
		},
	],

	reject: [
		{
			code: '.foo { display: -webkit-flex; }',
			fixed: '.foo { display: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.foo { display: -wEbKiT-fLeX; }',
			fixed: '.foo { display: fLeX; }',
			message: messages.rejected('-wEbKiT-fLeX'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.foo { display: -WEBKIT-FLEX; }',
			fixed: '.foo { display: FLEX; }',
			message: messages.rejected('-WEBKIT-FLEX'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.foo { dIsPlAy: -webkit-flex; }',
			fixed: '.foo { dIsPlAy: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.foo { DISPLAY: -webkit-flex; }',
			fixed: '.foo { DISPLAY: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.foo { color: pink; display: -webkit-flex; }',
			fixed: '.foo { color: pink; display: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '.foo { display: -webkit-box; }',
			fixed: '.foo { display: box; }',
			message: messages.rejected('-webkit-box'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: '.foo { display: -khtml-box; }',
			fixed: '.foo { display: box; }',
			message: messages.rejected('-khtml-box'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '.foo { background: -webkit-linear-gradient(bottom, #000, #fff); }',
			fixed: '.foo { background: linear-gradient(bottom, #000, #fff); }',
			message: messages.rejected('-webkit-linear-gradient'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 43,
		},
		{
			code: '.foo { max-width: -moz-max-content; }',
			fixed: '.foo { max-width: max-content; }',
			message: messages.rejected('-moz-max-content'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '.foo { speak: -xv-digits; }',
			fixed: '.foo { speak: digits; }',
			message: messages.rejected('-xv-digits'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '.foo { white-space: -o-pre-wrap; }',
			fixed: '.foo { white-space: pre-wrap; }',
			message: messages.rejected('-o-pre-wrap'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: '.foo { -webkit-user-select: -moz-all; }',
			fixed: '.foo { -webkit-user-select: all; }',
			message: messages.rejected('-moz-all'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 37,
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
			code: 'a { $margin: -webkit-box; }',
		},
		{
			code: 'a { margin: $variable-webkit-variable; }',
		},
		{
			code: 'a { margin: #{$variable-webkit-variable}; }',
		},
		{
			code: 'a { #{$display}: -webkit-box; }',
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
			code: '@new-color: -webkit-function(@color, 10%);',
		},
		{
			code: 'a { margin: @variable-webkit-variable; }',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreValues: ['grab', 'hangul', '/^-webkit-linear-/', /^-moz-all$/] }],
	fix: true,

	accept: [
		{
			code: 'a { cursor: -webkit-grab; }',
		},
		{
			code: 'a { list-style-type: -moz-hangul; }',
		},
		{
			code: 'a { background: -webkit-linear-gradient(bottom, #000, #fff); }',
		},
		{
			code: 'a { -moz-user-select: -moz-all; }',
			description: 'RegExp: exact match',
		},
	],
	reject: [
		{
			code: '.foo { display: -webkit-flex; }',
			fixed: '.foo { display: flex; }',
			message: messages.rejected('-webkit-flex'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.foo { display: -wEbKiT-fLeX; }',
			fixed: '.foo { display: fLeX; }',
			message: messages.rejected('-wEbKiT-fLeX'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.foo { display: -WEBKIT-FLEX; }',
			fixed: '.foo { display: FLEX; }',
			message: messages.rejected('-WEBKIT-FLEX'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '.foo { list-style-type: -moz-hangul-consonant; }',
			fixed: '.foo { list-style-type: hangul-consonant; }',
			message: messages.rejected('-moz-hangul-consonant'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 46,
		},
	],
});
