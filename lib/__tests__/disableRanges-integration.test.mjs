import blockNoEmpty from '../rules/block-no-empty/index.mjs';
import declarationValueChangeLength from './fixtures/plugin-declaration-value-change-length.mjs';
import noDuplicateSelectors from '../rules/no-duplicate-selectors/index.mjs';
import numberMaxPrecision from '../rules/number-max-precision/index.mjs';
import stringNoNewline from '../rules/string-no-newline/index.mjs';

// disabling all rules
testRule({
	ruleName: blockNoEmpty.ruleName,
	config: [true],

	accept: [
		{
			code: '/* stylelint-disable */\na {}',
		},
		{
			code: '/* stylelint-disable-line */ a {}',
		},
		{
			code: 'a {} /* stylelint-disable-line */ ',
		},
		{
			code: '/* stylelint-disable-next-line */\na {}',
		},
		{
			code: 'b { color: pink;}\n/* stylelint-disable */\na {}',
		},
		// Command comment descriptions.
		{
			code: '/* stylelint-disable -- Description */\na {}',
		},
		{
			code: '/* stylelint-disable-line -- Description */ a {}',
		},
		{
			code: 'a {} /* stylelint-disable-line -- Description */ ',
		},
		{
			code: '/* stylelint-disable-next-line -- Description */\na {}',
		},
		{
			code: 'b { color: pink;}\n/* stylelint-disable -- Description */\na {}',
		},
	],

	reject: [
		{
			code: 'a {}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: 'a {}\n/* stylelint-disable */',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: 'a {}\n/* stylelint-disable-line */',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: '/* stylelint-disable-line */\na {}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: '/* stylelint-disable-next-line */\na{}\nb {}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: '/* stylelint-disable-next-line */ a{}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: 'a {}\n/* stylelint-disable-next-line */',
			message: blockNoEmpty.messages.rejected,
		},
		// Command comment descriptions.
		{
			code: '/* stylelint-disable--Description */\na {}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: '/* stylelint-disable-- Description */\na {}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: '/* stylelint-disable --Description */\na {}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: '/* stylelint-disable - - Description */\na {}',
			message: blockNoEmpty.messages.rejected,
		},
	],
});

testRule({
	ruleName: noDuplicateSelectors.ruleName,
	config: true,

	reject: [
		{
			code: 'a, a {}',
			message: noDuplicateSelectors.messages.rejected('a', 1),
		},
	],
});

testRule({
	ruleName: blockNoEmpty.ruleName,
	config: [true],

	accept: [
		{
			code: `/* stylelint-disable ${blockNoEmpty.ruleName} */\na {}`,
		},
		{
			code: `/* stylelint-disable-line ${blockNoEmpty.ruleName} */ a {}`,
		},
		{
			code: `a {} /* stylelint-disable-line ${blockNoEmpty.ruleName} */`,
		},
		{
			code: `/* stylelint-disable-next-line ${blockNoEmpty.ruleName} */\na {}`,
		},
	],

	reject: [
		{
			code: '/* stylelint-disable declaration-no-important */\na {}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: '/* stylelint-disable-line declaration-no-important */\na {}',
			message: blockNoEmpty.messages.rejected,
		},
		{
			code: `/* stylelint-disable-line ${blockNoEmpty.ruleName} */ a {}\nb {}`,
			message: blockNoEmpty.messages.rejected,
			line: 2,
			column: 3,
		},
	],
});

testRule({
	ruleName: noDuplicateSelectors.ruleName,
	config: true,

	accept: [
		{
			code: '/* stylelint-disable declaration-no-important, no-duplicate-selectors */ a, a {}',
		},
		{
			code: '/* stylelint-disable-line declaration-no-important, no-duplicate-selectors */ a, a {}',
		},
		{
			code: 'a, a {} /* stylelint-disable-line declaration-no-important, no-duplicate-selectors */',
		},
	],

	reject: [
		{
			code: '/* stylelint-disable declaration-no-important */ a, a {}',
			message: noDuplicateSelectors.messages.rejected('a', 1),
		},
		{
			code: '/* stylelint-disable-line declaration-no-important */\na, a {}',
			message: noDuplicateSelectors.messages.rejected('a', 2),
		},
	],
});

testRule({
	ruleName: blockNoEmpty.ruleName,
	config: [true],

	accept: [
		{
			code: `
      /* stylelint-disable */
      a {}
      /* stylelint-enable */
      /* stylelint-disable */
      a {}
    `,
		},
	],

	reject: [
		{
			code: `
      /* stylelint-disable */
      a {}
      /* stylelint-enable */
      a {}
    `,

			message: blockNoEmpty.messages.rejected,
		},
	],
});

testRule({
	ruleName: numberMaxPrecision.ruleName,
	config: [2],

	accept: [
		{
			code: `
      /* stylelint-disable */
      a { top: 0.123px; }
      /* stylelint-enable */
    `,
		},
		{
			code: `
      /* stylelint-disable-line */ a { top: 0.123px; }
    `,
		},
		{
			code: `
      /* stylelint-disable number-max-precision */
      a { top: 0.123px; }
      /* stylelint-enable number-max-precision */
    `,
		},
		{
			code: `
      a { top: 0.123px; } /* stylelint-disable-line number-max-precision */
    `,
		},
		{
			code: `
      /* stylelint-disable-next-line number-max-precision */
      a { top: 0.123px; }
    `,
		},
	],

	reject: [
		{
			code: `
      /* stylelint-disable block-no-empty */
      a { top: 0.123px; }
      /* stylelint-enable block-no-empty */
    `,

			message: numberMaxPrecision.messages.expected('0.123', '0.12'),
		},
		{
			code: `
      /* stylelint-disable-line */
      a { top: 0.123px; }
    `,

			message: numberMaxPrecision.messages.expected('0.123', '0.12'),
		},
		{
			code: `
      a { top: 0.123px; }
      /* stylelint-disable-line */
    `,

			message: numberMaxPrecision.messages.expected('0.123', '0.12'),
		},
		{
			code: `
      /* stylelint-disable number-max-precision */
      a { top: 0.123px; }
      /* stylelint-enable number-max-precision */
      a { top: 0.123px; }
    `,

			message: numberMaxPrecision.messages.expected('0.123', '0.12'),
		},
		{
			code: `
      /* stylelint-disable-next-line number-max-precision */
      a { top: 0.123px; }
      a { top: 0.123px; }
    `,

			message: numberMaxPrecision.messages.expected('0.123', '0.12'),
		},
	],
});

testRule({
	ruleName: stringNoNewline.ruleName,
	config: true,

	accept: [
		{
			code: `
      /* stylelint-disable */
      .foo { content: "horse \n"; }
      /* stylelint-enable */
    `,
		},
		{
			code: `
      /* stylelint-disable string-no-newline */
      .foo { content: "horse \n"; }
      /* stylelint-enable string-no-newline */
    `,
		},
	],

	reject: [
		{
			code: `
      /* stylelint-disable block-no-empty */
      .foo { content: "horse \n"; }
      /* stylelint-enable block-no-empty */
    `,

			message: stringNoNewline.messages.rejected,
		},
		{
			code: `
      /* stylelint-disable string-no-newline */
      .foo { content: "horse \n"; }
      /* stylelint-enable string-no-newline */
      .foo { content: "horse \n"; }
    `,

			message: stringNoNewline.messages.rejected,
		},
	],
});

testRule({
	ruleName: declarationValueChangeLength.ruleName,
	plugins: ['./lib/__tests__/fixtures/plugin-declaration-value-change-length.mjs'],
	config: ['long'],
	fix: true,

	accept: [
		{
			code: `
      .foo {
        /* stylelint-disable-next-line plugin/declaration-value-change-length */
        z-index: 99999
          /* stylelint-disable-next-line plugin/declaration-value-change-length */
          99999 /* stylelint-disable-next-line plugin/declaration-value-change-length */
          99999
          ;
      }
    `,
		},
	],

	reject: [
		{
			code: `
      .foo {
        /* a comment */
        z-index: 99999
          /* stylelint-disable-next-line plugin/declaration-value-change-length */
          99999 /* a comment */
          99999;
      }
    `,
			fixed: `
      .foo {
        /* a comment */
        z-index: 99999999999999999999
          /* stylelint-disable-next-line plugin/declaration-value-change-length */
          99999 /* a comment */
          99999999999999999999;
      }
    `,
			warnings: [
				{
					message: declarationValueChangeLength.rule.messages.rejected('99999'),
					line: 4,
					column: 18,
					endLine: 4,
					endColumn: 23,
				},
				{
					message: declarationValueChangeLength.rule.messages.rejected('99999'),
					line: 7,
					column: 11,
					endLine: 7,
					endColumn: 16,
				},
			],
		},
	],
});

testRule({
	ruleName: declarationValueChangeLength.ruleName,
	plugins: ['./lib/__tests__/fixtures/plugin-declaration-value-change-length.mjs'],
	config: ['short'],
	fix: true,

	accept: [
		{
			code: `
.foo {
/* stylelint-disable-next-line plugin/declaration-value-change-length */
z-index: 99999999999999999
/* stylelint-disable-next-line plugin/declaration-value-change-length */
99999999999999999 /* stylelint-disable-next-line plugin/declaration-value-change-length */
99999999999999999
;
}
`,
		},
	],

	reject: [
		{
			code: `
.foo {
z-index:
99999999999999999
99999999999999999
99999999999999999
/* stylelint-disable-next-line */
99999999999999999
99999999999999999
99999999999999999
99999999999999999;
}
`,
			fixed: `
.foo {
z-index:
9
9
9
/* stylelint-disable-next-line */
99999999999999999
9
9
9;
}
`,
			warnings: [
				{
					message: declarationValueChangeLength.rule.messages.rejected('99999999999999999'),
					line: 4,
					column: 1,
					endLine: 4,
					endColumn: 18,
				},
				{
					message: declarationValueChangeLength.rule.messages.rejected('99999999999999999'),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 18,
				},
				{
					message: declarationValueChangeLength.rule.messages.rejected('99999999999999999'),
					line: 6,
					column: 1,
					endLine: 6,
					endColumn: 18,
				},
				{
					message: declarationValueChangeLength.rule.messages.rejected('99999999999999999'),
					line: 9,
					column: 1,
					endLine: 9,
					endColumn: 18,
				},
				{
					message: declarationValueChangeLength.rule.messages.rejected('99999999999999999'),
					line: 10,
					column: 1,
					endLine: 10,
					endColumn: 18,
				},
				{
					message: declarationValueChangeLength.rule.messages.rejected('99999999999999999'),
					line: 11,
					column: 1,
					endLine: 11,
					endColumn: 18,
				},
			],
		},
	],
});
