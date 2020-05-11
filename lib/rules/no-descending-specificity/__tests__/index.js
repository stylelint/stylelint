'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,

	accept: [
		{
			code: 'a {} b a {}',
		},
		{
			code: 'a b {} a b a b a b a b a b a b {}',
			description: '2 is less than 12 (type checking)',
		},
		{
			code: 'a {} a b {}',
		},
		{
			code: 'a {} a + a {}',
		},
		{
			code: 'a {} a[foo] {}',
		},
		{
			code: 'a[foo] {} a {}',
			description: 'only checks matching last compound selectors',
		},
		{
			code: 'a { b {} } c + b {}',
		},
		{
			code: 'b a {} @media print { a {} }',
		},
		{
			code: 'a {} a::after {}',
			description: 'pseudo-element last',
		},
		{
			code: 'a {} a:hover {}',
			description: 'pseudo-class last',
		},
		{
			code: 'a:hover {} a:hover::before {}',
		},
		{
			code: 'a:hover::before {} a:hover {}',
		},
		{
			code: 'a:not(.foo):hover {} a::before {}',
		},
		{
			code: 'a::before {} a:not(.foo):hover {} ',
		},
		{
			code: 'a::before {} a {} a:hover a:hover::before {} ',
		},
		{
			code: '.m:hover {} .b {}',
		},
		{
			code: '.menu:hover {} .burger {}',
		},
		{
			code: '.foo.bar, .foo.bar:focus { @mixin: foo; } .baz.bar, .baz.bar:focus {}',
		},
		{
			code: '.selector, { }',
		},
		{
			code: '.a:not(.b) .c:matches(.d, .e) .f:unknown(.g, .h) {} .a {}',
		},
		{
			code: ':root { --foo: {}; }',
		},
		{
			code: ':root { foo: {}; }',
		},
		{
			code:
				':global(.buildResultsSummaryTable) span {} :global(.buildResultsSummaryTable) span:nth-child(2) {}',
		},
		{
			code: 'a:hover {} a::before {}',
		},
		{
			code: 'a:hover {} a::-webkit-slider-thumb {}',
		},
	],

	reject: [
		{
			code: 'b a {} a {}',
			message: messages.rejected('a', 'b a'),
			line: 1,
			column: 8,
		},
		{
			code: 'b a, {} a, {}',
			message: messages.rejected('a', 'b a'),
			line: 1,
			column: 9,
		},
		{
			code: 'a + a {} a {}',
			message: messages.rejected('a', 'a + a'),
			line: 1,
			column: 10,
		},
		{
			code: 'b > a[foo] {} a[foo] {}',
			message: messages.rejected('a[foo]', 'b > a[foo]'),
			line: 1,
			column: 15,
		},
		{
			code: 'e > f, b + e + a {} c {} a d {} z, f + a, y {}',
			message: messages.rejected('f + a', 'b + e + a'),
			line: 1,
			column: 36,
		},
		{
			code: 'e > f, b + e + a {} c {} a d {} z, f + a, y {}',
			message: messages.rejected('f + a', 'b + e + a'),
			line: 1,
			column: 36,
		},
		{
			code: 'a { & > b {} } b {}',
			message: messages.rejected('b', 'a > b'),
			line: 1,
			column: 16,
		},
		{
			code: 'b a {} @media print { #c a {} a {} }',
			message: messages.rejected('a', '#c a'),
			line: 1,
			column: 31,
		},
		{
			code: 'a:hover {} a {} ',
			description: 'pseudo-class first',
			message: messages.rejected('a', 'a:hover'),
			line: 1,
			column: 12,
		},
		{
			code: 'a:hover::before {} a::before {} a {} a:hover ',
			description: 'pseudo-element with pseudo-class',
			message: messages.rejected('a::before', 'a:hover::before'),
			line: 1,
			column: 20,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: [true],

	accept: [
		{
			code: '.foo { &--a, &--a#{&}--b {  div {} } }',
		},
	],
});

testRule({
	ruleName,
	syntax: 'css-in-js',
	config: [true],

	accept: [
		{
			description: 'css-in-js',
			code: `
        export const a = styled.div\`
          &:hover {
            svg { }
          }
        \`;

        export const b = styled.div\`
          svg { }
        \`;
      `,
		},
		{
			description: 'css-in-js',
			code: `
        export const a = styled.div\`
          &.active {
            svg { }
          }
        \`;

        export const b = styled.div\`
          svg { }
        \`;
      `,
		},
	],

	reject: [
		{
			description: 'css-in-js',
			code: `
        export const a = styled.div\`
          &:hover {
            svg { }
          }

          svg { }
        \`;
      `,
			message: messages.rejected('svg', '&:hover svg'),
			line: 7,
			column: 11,
		},
		{
			description: 'css-in-js',
			code: `
        export const a = styled.div\`
          &.active {
            svg { }
          }

          svg { }
        \`;
      `,
			message: messages.rejected('svg', '&.active svg'),
			line: 7,
			column: 11,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['selectors-within-list'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'b a {} h1, h2, h3, a {}',
		},
		{
			code: 'b a {} a, h1, h2, h3 {}',
		},
	],

	reject: [
		{
			code: 'b a {} h1 {} h2 {} h3 {} a {}',
			message: messages.rejected('a', 'b a'),
			line: 1,
			column: 26,
		},
	],
});
