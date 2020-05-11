'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "var(--hoot)color(blue)"; }',
		},
		{
			code: "a::before { background: url('var(--hoot)color(blue)'); }",
		},
		{
			code: 'a::before { content: attr(data-foo); }',
		},
		{
			code: 'a { transform: translate(1, 1); }',
		},
		{
			code: 'a { transform: translate(1, 1) }',
		},
		{
			code: 'a { transform: translate(1, 1)}',
		},
		{
			code: 'a { transform: translate(1, 1) scale(3); }',
		},
		{
			code: 'a { color: color(rgb(0,0,0) lightness(50%)) };',
		},
		{
			code: 'a { background-image: linear-gradient(#f3c, #4ec), linear-gradient(#f3c, #4ec); }',
			description: 'multiple comma-separated functions ',
		},
		{
			code: 'a { border-color: color(rgb(0,0,0) lightness(50%)) red pink orange; }',
			description: 'function within a function as one of multiple space-separated values',
		},
		{
			code: 'a { transform: translate(1, 1)  scale(3); }',
		},
		{
			code: 'a { transform: translate(1, 1)\nscale(3); }',
		},
		{
			code: 'a { transform: translate(1, 1)\r\nscale(3); }',
		},
		{
			code: 'a { color: color(rgb(0,0,0)  lightness(50%)) };',
		},
		{
			code: 'a { color: color(rgb(0,0,0)\nlightness(50%)) };',
		},
		{
			code: 'a { color: color(rgb(0,0,0)\r\nlightness(50%)) };',
		},
		{
			code: '@import url(example.css) screen;',
		},
		{
			code: '$list: (value, value2);$thingTwo: 0px',
			description: 'Sass list ignored',
		},
		{
			code: '.foo { $(x): calc(1px + 0px); }',
			description: 'postcss-simple-vars interpolation as property name',
		},
		{
			code: '.foo { border-$(x)-left: 10px; }',
			description: 'postcss-simple-vars interpolation within property name',
		},
		{
			code: '.foo { font: calc(16px + .2vw)/1 }',
			description: 'after calc in `font` property (line-height shorthand value)',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(1, 1)scale(3); }',
			fixed: 'a { transform: translate(1, 1) scale(3); }',
			message: messages.expected,
			line: 1,
			column: 31,
		},
		{
			code: 'a { color: color(rgb(0,0,0)lightness(50%)) };',
			fixed: 'a { color: color(rgb(0,0,0) lightness(50%)) };',
			message: messages.expected,
			line: 1,
			column: 28,
		},
		{
			code: '@import url(example.css)screen;',
			fixed: '@import url(example.css) screen;',
			message: messages.expected,
			line: 1,
			column: 25,
		},
		{
			code: 'a { transform: translateX(1)translateY(1)scale(3); }',
			fixed: 'a { transform: translateX(1) translateY(1) scale(3); }',
			warnings: [
				{
					message: messages.expected,
					line: 1,
					column: 29,
				},
				{
					message: messages.expected,
					line: 1,
					column: 42,
				},
			],
		},
		{
			code: '@import url(example.css)scree/**/n;',
			fixed: '@import url(example.css) scree/**/n;',
			message: messages.expected,
			line: 1,
			column: 25,
		},
		{
			code: 'a { transform: translate(1/**/, 1)scale(3); }',
			fixed: 'a { transform: translate(1/**/, 1) scale(3); }',
			message: messages.expected,
			line: 1,
			column: 35,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a::before { content: "var(--hoot) color(blue)"; }',
		},
		{
			code: "a::before { background: url('var(--hoot) color(blue)'); }",
		},
		{
			code: 'a::before { content: attr(data-foo); }',
		},
		{
			code: 'a { transform: translate(1, 1); }',
		},
		{
			code: 'a { transform: translate(1, 1) }',
		},
		{
			code: 'a { transform: translate(1, 1)}',
		},
		{
			code: 'a { transform: translate(1, 1)scale(3); }',
		},
		{
			code: 'a { color: color(rgb(0,0,0)lightness(50%)) };',
		},
		{
			code: '.foo { font: calc(16px + .2vw)/1 }',
			description: 'after calc in `font` property (line-height shorthand value)',
		},
	],

	reject: [
		{
			code: 'a { transform: translate(1, 1) scale(3); }',
			fixed: 'a { transform: translate(1, 1)scale(3); }',
			message: messages.rejected,
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: translate(1, 1)  scale(3); }',
			fixed: 'a { transform: translate(1, 1)scale(3); }',
			message: messages.rejected,
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: translate(1, 1)\nscale(3); }',
			fixed: 'a { transform: translate(1, 1)scale(3); }',
			message: messages.rejected,
			line: 1,
			column: 31,
		},
		{
			code: 'a { transform: translate(1, 1)\r\nscale(3); }',
			fixed: 'a { transform: translate(1, 1)scale(3); }',
			description: 'CRLF',
			message: messages.rejected,
			line: 1,
			column: 31,
		},
		{
			code: 'a { color: color(rgb(0,0,0) lightness(50%)) };',
			fixed: 'a { color: color(rgb(0,0,0)lightness(50%)) };',
			message: messages.rejected,
			line: 1,
			column: 28,
		},
		{
			code: 'a { color: color(rgb(0,0,0)  lightness(50%)) };',
			fixed: 'a { color: color(rgb(0,0,0)lightness(50%)) };',
			message: messages.rejected,
			line: 1,
			column: 28,
		},
		{
			code: 'a { color: color(rgb(0,0,0)\nlightness(50%)) };',
			fixed: 'a { color: color(rgb(0,0,0)lightness(50%)) };',
			message: messages.rejected,
			line: 1,
			column: 28,
		},
		{
			code: 'a { transform: translateX(1) translateY(1) scale(3); }',
			fixed: 'a { transform: translateX(1)translateY(1)scale(3); }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 29,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 43,
				},
			],
		},
		{
			code: 'a { transform: /**/ translateX(1) /**/ translateY(1) /**/ scale(3); }',
			fixed: 'a { transform: /**/ translateX(1)/**/ translateY(1)/**/ scale(3); }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 34,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 53,
				},
			],
		},
		{
			code: '@import url(example.css) screen;',
			fixed: '@import url(example.css)screen;',
			message: messages.rejected,
			line: 1,
			column: 25,
		},
		{
			code: '@import url(example.css) /**/ screen;',
			fixed: '@import url(example.css)/**/ screen;',
			message: messages.rejected,
			line: 1,
			column: 25,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: 'h1 { max-height: #{($line-height) * ($lines-to-show)}em; }',
			description: 'Sass-style interpolation with curly braces',
		},
	],

	reject: [
		{
			code: 'a { padding:\n  10px\n  /* comment one*/\n  /* comment two*/\n  var(--boo)orange}',
			fixed: 'a { padding:\n  10px\n  /* comment one*/\n  /* comment two*/\n  var(--boo) orange}',
			message: messages.expected,
			line: 5,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	syntax: 'scss',

	reject: [
		{
			code: 'a { padding:\n  10px\n  // comment one\n  // comment two\n  var(--boo)orange}',
			// can't fix on scss
			// fixed:
			//   "a { padding:\n  10px\n  // comment one\n  // comment two\n  var(--boo) orange}",
			message: messages.expected,
			line: 5,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	syntax: 'less',
	fix: true,

	accept: [
		// temporarily disable this test until this is fully supported in stylelint
		// {
		//   code: "h1 { max-height: ((@line-height) * (@lines-to-show))em; }",
		//   description: "Less-style interpolation",
		// },
	],

	reject: [
		{
			code: 'a { padding:\n  10px\n  // comment one\n  // comment two\n  var(--boo)orange}',
			fixed: 'a { padding:\n  10px\n  // comment one\n  // comment two\n  var(--boo) orange}',
			message: messages.expected,
			line: 5,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: "export default <img style={{ transform: 'translate(1, 1)' }} />;",
		},
	],

	reject: [
		{
			code: "export default <img style={{ ['transform']: 'translate(1, 1)scale(3)' }} />;",
			fixed: "export default <img style={{ ['transform']: 'translate(1, 1) scale(3)' }} />;",
			message: messages.expected,
			line: 1,
			column: 60,
		},
	],
});
