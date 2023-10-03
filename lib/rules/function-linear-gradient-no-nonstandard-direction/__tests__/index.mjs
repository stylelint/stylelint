import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '.foo { background: linear-gradient(to top, #fff, #000); }',
		},
		{
			code: '.foo { background: lInEaR-gRaDiEnT(to top, #fff, #000); }',
		},
		{
			code: '.foo { background: LINEAR-GRADIENT(to top, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(to bottom, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(  to right, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(to left  , #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient( to top left, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(\n\tto left top, \n\t#fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(to bottom right, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(to right bottom, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(45deg, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(100grad, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(0.25turn, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(1.57rad, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(#fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(black, white); }',
		},
		{
			code: '.foo { background: linear-gradient(in srgb to top, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(to top in srgb, #fff, #000); }',
		},
		{
			code: '.foo { background: linear-gradient(rgba(255, 255, 255, 0.5) 0%, #000); }',
		},
		{
			code: '.foo { background: -webkit-linear-gradient(top, #fff, #000); }',
		},
		{
			code: '.foo { background: -moz-linear-gradient(top, #fff, #000); }',
		},
		{
			code: '.foo { background: -o-linear-gradient(top, #fff, #000); }',
		},
		{
			code: '.foo { background: url(foo.png), -webkit-linear-gradient(bottom, #fff, #000 ); }',
		},
		{
			code: '.foo { background: -webkit-linear-gradient(bottom, #fff, #000 ), url(foo.png); }',
		},
		{
			code: '.foo { background: url(foo.png), -moz-linear-gradient(bottom, #fff, #000 ); }',
		},
		{
			code: '.foo { background: -moz-linear-gradient(bottom, #fff, #000 ), url(foo.png); }',
		},
		{
			code: '.foo { background: url(foo.png), -o-linear-gradient(bottom, #fff, #000 ); }',
		},
		{
			code: '.foo { background: -o-linear-gradient(bottom, #fff, #000 ), url(foo.png); }',
		},
		{
			code: '.foo { background: url(foo.png), -webkit-linear-gradient(bottom, #fff, #000 ), url(bar.png); }',
		},
		{
			code: '.foo { background: url(foo.png), -moz-linear-gradient(bottom, #fff, #000 ), url(bar.png); }',
		},
		{
			code: '.foo { background: url(foo.png), -o-linear-gradient(bottom, #fff, #000 ), url(bar.png); }',
		},
		{
			code: '.foo { background: url(foo.png), -ms-linear-gradient(bottom, #fff, #000 ), url(bar.png); }',
		},
	],

	reject: [
		{
			code: '.foo { background: linear-gradient(bottom, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '.foo { background: lInEaR-gRaDiEnT(bottom, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '.foo { background: LINEAR-GRADIENT(bottom, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '.foo { background: linear-gradient(bOtToM, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '.foo { background: linear-gradient(BOTTOM, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '.foo { background: linear-gradient(top, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: '.foo { background: linear-gradient(left, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: '.foo { background: linear-gradient(right, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: '.foo { background: linear-gradient(to top top, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: '.foo { background: linear-gradient(45, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 38,
		},
		{
			code: '.foo { background: linear-gradient(0.25, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: '.foo { background: linear-gradient(1.577, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: '.foo { background: linear-gradient(topin, #fff, #000); }',
			description:
				'An incorrect direction that contains the word "in", only "in" as a word on its own is ignored by this rule.',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: '.foo { background: -webkit-linear-gradient(to bottom, #fff, #000 ); }',
			message: messages.rejected,
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: '.foo { background: -moz-linear-gradient(to bottom, #fff, #000 ); }',
			message: messages.rejected,
			line: 1,
			column: 41,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: '.foo { background: -o-linear-gradient(to bottom, #fff, #000 ); }',
			message: messages.rejected,
			line: 1,
			column: 39,
			endLine: 1,
			endColumn: 48,
		},
		{
			code: '.foo { background: url(foo.png), -webkit-linear-gradient(to bottom, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 58,
			endLine: 1,
			endColumn: 67,
		},
		{
			code: '.foo { background: url(foo.png), -moz-linear-gradient(to bottom, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 55,
			endLine: 1,
			endColumn: 64,
		},
		{
			code: '.foo { background: url(foo.png), -o-linear-gradient(to bottom, #fff, #000); }',
			message: messages.rejected,
			line: 1,
			column: 53,
			endLine: 1,
			endColumn: 62,
		},
		{
			code: '.foo { background: -webkit-linear-gradient(to bottom, #fff, #000), url(foo.png); }',
			message: messages.rejected,
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: '.foo { background: url(foo.png), -moz-linear-gradient(to bottom, #fff, #000), url(foo.png); }',
			message: messages.rejected,
			line: 1,
			column: 55,
			endLine: 1,
			endColumn: 64,
		},
		{
			code: '.foo { background: -o-linear-gradient(to bottom, #fff, #000 ), url(foo.png); }',
			message: messages.rejected,
			line: 1,
			column: 39,
			endLine: 1,
			endColumn: 48,
		},
		{
			code: '.foo { background: url(foo.png), -webkit-linear-gradient(to bottom, #fff, #000), url(bar.png); }',
			message: messages.rejected,
			line: 1,
			column: 58,
			endLine: 1,
			endColumn: 67,
		},
		{
			code: '.foo { background: url(foo.png), -moz-linear-gradient(to bottom, #fff, #000), url(bar.png); }',
			message: messages.rejected,
			line: 1,
			column: 55,
			endLine: 1,
			endColumn: 64,
		},
		{
			code: '.foo { background: url(foo.png), -o-linear-gradient(to bottom, #fff, #000), url(bar.png); }',
			message: messages.rejected,
			line: 1,
			column: 53,
			endLine: 1,
			endColumn: 62,
		},
		{
			code: '.foo { background: url(foo.png), -ms-linear-gradient(to bottom, #fff, #000), url(bar.png); }',
			message: messages.rejected,
			line: 1,
			column: 54,
			endLine: 1,
			endColumn: 63,
		},
	],
});

// SCSS tests
testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '.foo { background: linear-gradient($purple-top, $purple-bottom); }',
			description: 'scss: ignore variable names',
		},
		{
			code: '.foo { background: linear-gradient(    $purple-top, $purple-bottom); }',
		},
		{
			code: '.foo { background: linear-gradient($to-top, $purple-bottom); }',
		},
	],

	reject: [
		{
			code: '.foo { background: linear-gradient(top, $purple-bottom); }',
			message: messages.rejected,
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 39,
		},
	],
});
