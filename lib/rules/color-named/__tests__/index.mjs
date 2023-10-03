import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['never'],

	accept: [
		{
			code: 'a { color: #000; }',
		},
		{
			code: 'a { color: #ababab; }',
		},
		{
			code: 'a { color: #AbAbAb; }',
		},
		{
			code: 'a { color: #ABABAB; }',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0); }',
		},
		{
			code: 'a { background: #000, #fff, #333; }',
		},
		{
			code: '/** color: black; */',
			description: 'ignore color names within comments',
		},
		{
			code: 'a::before { content: "orange" }',
			description: 'ignore color names within double quotes',
		},
		{
			code: "a::before { content: 'orange' }",
			description: 'ignore color names within single quotes',
		},
		{
			code: 'a { background-image: url(./black.png); }',
			description: 'ignore color names within urls',
		},
		{
			code: 'a { padding: 000; }',
		},
		{
			code: 'a::before { content: "#ababa"; }',
		},
		{
			code: 'a { color: $black; }',
			description: 'ignore sass variable named with color',
		},
		{
			code: 'a { color: var(--some-color-blue); }',
			description: 'ignore css variable named with color',
		},
		{
			code: 'a { animation: spin-blue 2s linear; }',
			description: 'ignore keyframe animation name that includes colors',
		},
		{
			code: 'a { animation: blue 2s linear; }',
			description: 'ignore keyframe animation name that are colors',
		},
		{
			code: 'a { font-family: blue; }',
			description: 'ignore font family names that are colors',
		},
		{
			code: 'a { font: 10px/14px Brown, sans-serif; }',
			description: 'ignore font family names that are colors',
		},
		{
			code: '$colors: (white: #fff, blue: #00f);',
			description: 'ignore non-standard list and map syntax',
		},
		{
			code: 'a { color: transparent; }',
			description: 'ignore transparent',
		},
	],

	reject: [
		{
			code: 'a { color: red; }',
			message: messages.rejected('red'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { color: rEd; }',
			message: messages.rejected('rEd'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { color: RED; }',
			message: messages.rejected('RED'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { color: rebeccapurple; }',
			message: messages.rejected('rebeccapurple'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { background: #00c, red, #fff; }',
			message: messages.rejected('red'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { background: #fff1a1, rgb(250, 250, 0), black; }',
			message: messages.rejected('black'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 49,
		},
		{
			code: 'a { background:#cccccc,white,#12345a; }',
			message: messages.rejected('white'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { background: color(green); }',
			message: messages.rejected('green'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 28,
		},
	],
});

testRule({
	ruleName,
	config: ['always-where-possible'],

	accept: [
		{
			code: 'a { color: black; }',
		},
		{
			code: 'a { color: bLaCk; }',
		},
		{
			code: 'a { color: BLACK; }',
		},
		{
			code: 'a { color: rgb(0,0,1); }',
		},
		{
			code: 'a { color: rgba(0,0,0,0.5); }',
		},
		{
			code: 'a { color: rgb(0,0,0,50%); }',
		},
		{
			code: 'a { color: color(black, a(50%)) }',
		},
		{
			code: 'a { color: rgb(0, calc(0 + 0), 0, 0) }',
		},
		{
			code: '/** color: #000; */',
			description: 'ignore representations within comments',
		},
		{
			code: 'a::before { content: "#000" }',
			description: 'ignore representations within double quotes',
		},
		{
			code: "a::before { content: '#000' }",
			description: 'ignore representations within single quotes',
		},
		{
			code: 'a { background-image: url(./thing.png#000); }',
			description: 'ignore representations within urls',
		},
		{
			code: '.a { color: #fff0ffff; };',
			description: 'https://github.com/stylelint/stylelint/issues/5716',
		},
		{
			code: 'a { color: rgba(0, 0, 0, 0); }',
			description: 'ignore transparent',
		},
	],

	reject: [
		{
			code: 'a { color: #000 }',
			message: messages.expected('black', '#000'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { color: #fFfFfF }',
			message: messages.expected('white', '#fFfFfF'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { color: #FFFFFF }',
			message: messages.expected('white', '#FFFFFF'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { background: #000f }',
			message: messages.expected('black', '#000f'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { color: #000000ff }',
			message: messages.expected('black', '#000000ff'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { color: rgb(0, 0, 0) }',
			message: messages.expected('black', 'rgb(0,0,0)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { color: rGb(0, 0, 0) }',
			message: messages.expected('black', 'rGb(0,0,0)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { color: RGB(0, 0, 0) }',
			message: messages.expected('black', 'RGB(0,0,0)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 1) }',
			message: messages.expected('black', 'rgba(0,0,0,1)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { color: rgba(0 0 0 / 1) }',
			message: messages.expected('black', 'rgba(0 0 0/1)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { color: rgba(0, 0, 0, 100%) }',
			message: messages.expected('black', 'rgba(0,0,0,100%)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { color: rgb(0%,0%, 0%) }',
			message: messages.expected('black', 'rgb(0%,0%,0%)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { color: rgba(0%,0%, 0%  ,1) }',
			message: messages.expected('black', 'rgba(0%,0%,0%,1)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { color: rgba(0%,0%, 0%\n,100%) }',
			message: messages.expected('black', 'rgba(0%,0%,0%,100%)'),
			line: 1,
			column: 12,
			endLine: 2,
			endColumn: 7,
		},
		{
			code: 'a { color: hsl(0,0%, 0%) }',
			message: messages.expected('black', 'hsl(0,0%,0%)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { color: hsla(0,0%, 0%  ,1) }',
			message: messages.expected('black', 'hsla(0,0%,0%,1)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { color: hsla(0,0%, 0%\n,100%) }',
			message: messages.expected('black', 'hsla(0,0%,0%,100%)'),
			line: 1,
			column: 12,
			endLine: 2,
			endColumn: 7,
		},
		{
			code: 'a { color: hwb(0,0%, 0%) }',
			message: messages.expected('red', 'hwb(0,0%,0%)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { color: hwb(0,0%, 0%  ,1) }',
			message: messages.expected('red', 'hwb(0,0%,0%,1)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { color: hwb(0,0%, 0%\n,100%) }',
			message: messages.expected('red', 'hwb(0,0%,0%,100%)'),
			line: 1,
			column: 12,
			endLine: 2,
			endColumn: 7,
		},
		{
			code: 'a { color: gray(0) }',
			message: messages.expected('black', 'gray(0)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { color: gray(0%) }',
			message: messages.expected('black', 'gray(0%)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { color: gray(0, 1) }',
			message: messages.expected('black', 'gray(0,1)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: 'a { color: gray(0, 100%) }',
			message: messages.expected('black', 'gray(0,100%)'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { color: rgb(\n0 ,\n 0 ,\r\n 0) }',
			message: messages.expected('black', 'rgb(0,0,0)'),
			line: 1,
			column: 12,
			endLine: 4,
			endColumn: 4,
		},
		{
			code: 'a { background: #302, rgb(\n0 ,\n 0 ,\r\n 0) }',
			message: messages.expected('black', 'rgb(0,0,0)'),
			line: 1,
			column: 23,
			endLine: 4,
			endColumn: 4,
		},
		{
			code: 'a { color: color(#000 a(50%)) }',
			message: messages.expected('black', '#000'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { ignoreProperties: ['composes', '/^my-/'] }],

	accept: [
		{
			code: "a { composes: blue from 'lib/index.css'; }",
		},
		{
			code: "a { composes: grey blue from 'lib/index.css'; }",
		},
		{
			code: 'a { my-property: red; }',
		},
		{
			code: 'a { my-other-property: blue; }',
		},
	],

	reject: [
		{
			code: 'a { color: rebeccapurple; }',
			message: messages.rejected('rebeccapurple'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { not-my-property: red; }',
			message: messages.rejected('red'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 25,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { ignoreProperties: [/^my-/] }],

	accept: [
		{
			code: 'a { my-property: red; }',
		},
	],

	reject: [
		{
			code: 'a { color: rebeccapurple; }',
			message: messages.rejected('rebeccapurple'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 25,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { ignore: ['inside-function'] }],

	accept: [
		{
			code: 'a { color: #000; }',
		},
		{
			code: 'a { color: gray(70%); }',
		},
		{
			code: 'a { background-image: url(red); }',
		},
		{
			code: 'a { color: map-get($color, blue(60%)); }',
		},
		{
			code: 'a { color: map-get($color, blue); }',
		},
		{
			code: 'a { background: color(blue); }',
		},
	],

	reject: [
		{
			code: 'a { background: url(red) no-repeat rebeccapurple; }',
			message: messages.rejected('rebeccapurple'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 49,
		},
		{
			code: 'a { color: red; }',
			message: messages.rejected('red'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
		},
	],
});
