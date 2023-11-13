import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,
	accept: [
		{
			code: 'a { top: 0; }',
			description: 'unitless zero',
		},
		{
			code: 'a { padding: calc(0px +\n 0px); }',
			description: 'ignore calc',
		},
		{
			code: 'a { padding: cAlc(0px + 0px); }',
			description: 'ignore calc. insensitive',
		},
		{
			code: 'a { padding: calc(); }',
			description: 'ignore calc. empty calc',
		},
		{
			code: 'a { padding: calc(1in + 0in * 2)) 0 calc(0px) 0 }',
			description: 'ignore calc. several `calc`s',
		},
		{
			code: 'a { padding: abs(0px) acos(0px) asin(0px) atan(0px) atan2(0px) calc(0px) clamp(0px) cos(0px) exp(0px) hypot(0px) log(0px) max(0px) min(0px) mod(0px) pow(0px) rem(0px) round(0px) sign(0px) sin(0px) sqrt(0px) tan(0px) }',
			description: 'ignore new math functions.',
		},
		{
			code: 'padding: calc(var(--foo, 0px) + 10px) 0',
			description: 'ignore calc, and inner functions',
		},
		{
			code: 'padding: max(10px, var(--foo, 0px)) 0',
			description: 'ignore max, and inner functions',
		},
		{
			code: 'a { right: max(100vw, 0rem)); }',
			description: 'ignore max',
		},
		{
			code: 'a { right: calc(max(100vw, 0rem))); }',
			description: 'ignore max inside calc',
		},
		{
			code: 'a { right: min(100vw, 0rem)); }',
			description: 'ignore min',
		},
		{
			code: 'a { right: calc(min(100vw, 0rem))); }',
			description: 'ignore min inside calc',
		},
		{
			code: 'a { right: clamp(50rem, 50vw, 0rem))); }',
			description: 'ignore clamp',
		},
		{
			code: 'a { right: calc(clamp(50rem, 50vw, 0rem)))); }',
			description: 'ignore clamp inside calc',
		},
		{
			code: 'a { padding: 0 /* 0px */; }',
			description: 'united zero in comment',
		},
		{
			code: 'a { top: 10px; }',
			description: 'zero at end of non-zero value',
		},
		{
			code: 'a { top: 100.00px; }',
			description: 'zero at end of non-zero value after decimal',
		},
		{
			code: 'a { top: 100.010px; }',
		},
		{
			code: 'a { top: 0.10em; }',
			description: 'zero at end of non-zero factional value after decimal',
		},
		{
			code: 'a { top: .1em; }',
			description: 'no leading zero factional value',
		},
		{
			code: 'a { top: 0.01em; }',
			description: 'leading zero factional value',
		},
		{
			code: 'a { padding: 1px 0 2px 3px; }',
			description: 'unitless zero in list',
		},
		{
			code: 'a { padding: 1px 1px 2px 0; }',
			description: 'unitless zero in list',
		},
		{
			code: 'a { color: pink; }',
			description: 'no zero',
		},
		{
			code: 'a { color: #0ac0ac; }',
			description: 'hex color value',
		},
		{
			code: 'a::before { content: "0px 0em 0cm"; }',
			description: 'zero with units within a string',
		},
		{
			code: 'a { color: color(rgb(0,0,0) lightness(50%)); }',
			description: 'zero in functions',
		},
		{
			code: 'a { color: color(rgb(0,0,0) lightness(0%)); }',
			description: '% is ok',
		},
		{
			code: 'a { transition-delay: 0s; }',
			description: 'dimension unit is ok',
		},
		{
			code: '@media (min-width: 0)',
			description: 'media feature',
		},
		{
			code: 'a { transform: translate(0); }',
			description: 'transform function',
		},
		{
			code: 'a { transition-duration: 0s; }',
			description: 'ignore seconds',
		},
		{
			code: 'a { transition-duration: 0ms; }',
			description: 'ignore milliseconds',
		},
		{
			code: 'a { transition: top 0s; }',
			description: 'ignore seconds',
		},
		{
			code: 'a { transition: top 0ms; }',
			description: 'ignore milliseconds',
		},
		{
			code: 'a { margin: 0%; }',
			description: 'ignore percent unit',
		},
		{
			code: '@media print and (min-resolution: 0dpi) { }',
			description: 'ignore dpi',
		},
		{
			code: '@media print and (min-resolution: 0dPi) { }',
			description: 'ignore dpi',
		},
		{
			code: '@media print and (min-resolution: 0DPI) { }',
			description: 'ignore dpi',
		},
		{
			code: '@media print and (min-resolution: 0dpcm) { }',
			description: 'ignore dpcm',
		},
		{
			code: '@media print and (min-resolution: 0dppx) { }',
			description: 'ignore dppx',
		},
		{
			code: 'a { background: linear-gradient(0deg, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }',
			description: 'ignore deg',
		},
		{
			code: 'a { background: linear-gradient(0grad, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }',
			description: 'ignore grad',
		},
		{
			code: 'a { background: linear-gradient(0turn, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }',
			description: 'ignore turn',
		},
		{
			code: 'a { background: linear-gradient(0rad, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }',
			description: 'ignore rad',
		},
		{
			code: 'a { margin:0; }',
			description: 'no space after colon',
		},
		{
			code: 'a { margin:\n0; }',
			description: 'newline after colon',
		},
		{
			code: 'a { margin:\r\n0; }',
			description: 'CRLF after colon',
		},
		{
			code: 'a { margin:\t0; }',
			description: 'tab after colon',
		},
		{
			code: 'a { margin :0; }',
			description: 'space before colon',
		},
		{
			code: 'a { margin : 0; }',
			description: 'space before and after colon',
		},
		{
			code: 'a { line-height : 0px; }',
			description: 'ignore line-height property',
		},
		{
			code: 'a { lIne-hEight: 0px; }',
		},
		{
			code: 'a { flex: 0px; }',
			description: 'ignore flex property',
		},
		{
			code: 'a { Flex: 0px; }',
			description: 'ignore cased flex property',
		},
		{
			code: 'a { grid-auto-columns: 0fr; }',
			description: 'ignore some grid properties with `fr`',
		},
		{
			code: 'a { grid-Auto-cOlUmns: 0fr; }',
			description: 'ignore some grid properties with `fr`',
		},
		{
			code: 'a { grid-template-columns: repeat(10, 0fr); }',
			description: 'ignore some grid properties with `fr`',
		},
		{
			code: 'a { Grid-TEMplate-cOlumns : repeat( 10, 0fr ); }',
			description: 'ignore some grid properties with `fr`',
		},
		{
			code: 'a { grid-template-rows: 0fr 1fr; }',
			description: 'ignore some grid properties with `fr`',
		},
		{
			code: 'a { grId-tEMplate-Rows:0fr  1fr; }',
			description: 'ignore some grid properties with `fr`',
		},
		{
			code: 'a { font: normal normal 400 16px/0px cursive; }',
			description: 'ignore line-height in font declaration',
		},
		{
			code: 'a { font: normal normal 400 16px/0 cursive; }',
			description: 'ignore line-height in font declaration',
		},
		{
			code: 'a { font: normal normal 400 0 / 0px cursive; }',
			description: 'ignore line-height in font declaration',
		},
		{
			code: 'a { font: normal normal 400 16px / 0px cursive; }',
			description: 'ignore line-height in font declaration',
		},
		{
			code: 'a { font: normal normal 400 16px/ 0px cursive; }',
			description: 'ignore line-height in font declaration',
		},
		{
			code: 'a { font: normal normal 400 16px /0px cursive; }',
			description: 'ignore line-height in font declaration',
		},
		{
			code: 'a { font: var(--foo, normal normal 400 16px/0px cursive); }',
			description: 'ignore line-height in font declaration within var function',
		},
		{
			code: 'a { font: normal normal 400 1.2em cursive; }',
			description: 'do not fail if no line-height in font declaration',
		},
	],

	reject: [
		{
			code: 'a { top: 0px; }',
			fixed: 'a { top: 0; }',

			message: messages.rejected,
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { top: 0px /* comment */; }',
			fixed: 'a { top: 0 /* comment */; }',

			message: messages.rejected,
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { tOp: 0px; }',
			fixed: 'a { tOp: 0; }',

			message: messages.rejected,
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { TOP: 0px; }',
			fixed: 'a { TOP: 0; }',

			message: messages.rejected,
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { top: 0pX; }',
			fixed: 'a { top: 0; }',

			message: messages.rejected,
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { top: 0PX; }',
			fixed: 'a { top: 0; }',

			message: messages.rejected,
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { top: 0.000px; }',
			fixed: 'a { top: 0.000; }',

			message: messages.rejected,
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { padding: 0px 1px 2px 3px; }',
			fixed: 'a { padding: 0 1px 2px 3px; }',

			message: messages.rejected,
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { padding: 1px 0vmax 2px 3px; }',
			fixed: 'a { padding: 1px 0 2px 3px; }',

			message: messages.rejected,
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { padding: 1px 2px 0rem 3px; }',
			fixed: 'a { padding: 1px 2px 0 3px; }',

			message: messages.rejected,
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { padding: 1px 2px 3px 0em; }',
			fixed: 'a { padding: 1px 2px 3px 0; }',

			message: messages.rejected,
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 29,
		},
		{
			description: 'ignore calc, and inner functions',
			code: 'padding: calc(var(--foo, 0in) + 10px) 0px;',
			fixed: 'padding: calc(var(--foo, 0in) + 10px) 0;',

			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 40,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
		{
			description: 'ignore calc. has another zero units',
			code: 'a { padding: calc(1in + 0in * 2)) 0in calc(0px) 0px; }',
			fixed: 'a { padding: calc(1in + 0in * 2)) 0 calc(0px) 0; }',

			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 36,
					endLine: 1,
					endColumn: 38,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 50,
					endLine: 1,
					endColumn: 52,
				},
			],
		},
		{
			description: 'ignore min, max, clamp. has another zero units',
			code: 'padding: min(1vw, 0in) max(1vw, 0px) clamp(0em, 1vw, 10px) 0px;',
			fixed: 'padding: min(1vw, 0in) max(1vw, 0px) clamp(0em, 1vw, 10px) 0;',

			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 61,
					endLine: 1,
					endColumn: 63,
				},
			],
		},
		{
			code: '@media (min-width: 0px) {}',
			fixed: '@media (min-width: 0) {}',

			description: 'simple media feature',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@media (min-width: 0px /* comment */) {}',
			fixed: '@media (min-width: 0 /* comment */) {}',

			description: 'simple media feature with comment',
			message: messages.rejected,
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@media screen and (min-width: 0px) {}',
			fixed: '@media screen and (min-width: 0) {}',

			description: 'more complicated media feature',
			message: messages.rejected,
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { transform: translate(0px); }',
			fixed: 'a { transform: translate(0); }',

			description: 'transform function',
			message: messages.rejected,
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { margin: 0q; }',
			fixed: 'a { margin: 0; }',

			description: 'work with q unit',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { margin:0px; }',
			fixed: 'a { margin:0; }',

			description: 'no space after colon',
			message: messages.rejected,
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { margin:\n0px; }',
			fixed: 'a { margin:\n0; }',

			description: 'newline after colon',
			message: messages.rejected,
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 4,
		},
		{
			code: 'a { margin:\r\n0px; }',
			fixed: 'a { margin:\r\n0; }',

			description: 'CRLF after colon',
			message: messages.rejected,
			line: 2,
			column: 2,
			endLine: 2,
			endColumn: 4,
		},
		{
			code: 'a { margin:\t0px; }',
			fixed: 'a { margin:\t0; }',

			description: 'tab after colon',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin :0px; }',
			fixed: 'a { margin :0; }',

			description: 'space before colon',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { margin : 0px; }',
			fixed: 'a { margin : 0; }',

			description: 'space before and after colon',
			message: messages.rejected,
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { --x: 0px; }',
			fixed: 'a { --x: 0; }',

			message: messages.rejected,
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { grid-template-columns: 0px 0fr 1fr };',
			fixed: 'a { grid-template-columns: 0 0fr 1fr };',

			message: messages.rejected,
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { grid-template-colUMns: 0px  0fr 1fr };',
			fixed: 'a { grid-template-colUMns: 0  0fr 1fr };',

			message: messages.rejected,
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { grid-template-rows: 40px 4fr 0px; };',
			fixed: 'a { grid-template-rows: 40px 4fr 0; };',

			message: messages.rejected,
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: 'a { grid-auto-columns: 0px };',
			fixed: 'a { grid-auto-columns: 0 };',

			message: messages.rejected,
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { grid-template-columns: repeat(2, 50px 0px) 100px; };',
			fixed: 'a { grid-template-columns: repeat(2, 50px 0) 100px; };',

			message: messages.rejected,
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: 'a { font: normal normal 400 0px / 0px cursive; }',
			fixed: 'a { font: normal normal 400 0 / 0px cursive; }',

			message: messages.rejected,
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { font: normal normal 400 0px /0px cursive; }',
			fixed: 'a { font: normal normal 400 0 /0px cursive; }',

			message: messages.rejected,
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { font: normal normal 400 0px/0px cursive; }',
			fixed: 'a { font: normal normal 400 0/0px cursive; }',

			message: messages.rejected,
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { font: normal normal 400 0px/ 0px cursive; }',
			fixed: 'a { font: normal normal 400 0/ 0px cursive; }',

			message: messages.rejected,
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { margin: var(--foo, 0px); }',
			fixed: 'a { margin: var(--foo, 0); }',
			message: messages.rejected,
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { right: .0rem; }',
			fixed: 'a { right: 0; }',
			message: messages.rejected,
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: stripIndent`
 				a {
 					box-shadow: -0.25rem 0rem 0rem rgba(0, 0, 0, 0), /* comment */
 						inset -0.25rem 0rem 0rem rgba(0, 0, 0, 0); /* comment */
 				}`,
			fixed: stripIndent`
				a {
					box-shadow: -0.25rem 0 0 rgba(0, 0, 0, 0), /* comment */
						inset -0.25rem 0 0 rgba(0, 0, 0, 0); /* comment */
				}`,
			warnings: [
				{
					message: messages.rejected,
					line: 2,
					column: 24,
					endLine: 2,
					endColumn: 27,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 29,
					endLine: 2,
					endColumn: 32,
				},
				{
					message: messages.rejected,
					line: 3,
					column: 19,
					endLine: 3,
					endColumn: 22,
				},
				{
					message: messages.rejected,
					line: 3,
					column: 24,
					endLine: 3,
					endColumn: 27,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreFunctions: ['var', /^--/] }],
	fix: true,
	accept: [
		{
			code: 'a { top: var(--foo, 0px); }',
		},
		{
			code: 'a { top: --bar(0px); }',
		},
	],
	reject: [
		{
			code: 'a { margin: var(--foo, 0px) 0px --bar(0px); }',
			fixed: 'a { margin: var(--foo, 0px) 0 --bar(0px); }',

			message: messages.rejected,
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 32,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	fix: true,
	customSyntax: 'postcss-scss',

	reject: [
		{
			code: '@include border-left-radius($input-top-left-radius: 0px);',
			fixed: '@include border-left-radius($input-top-left-radius: 0);',

			message: messages.rejected,
			line: 1,
			column: 54,
			endLine: 1,
			endColumn: 56,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['custom-properties'] }],
	accept: [
		{
			code: 'a { --x: 0px; }',
			description: 'custom properties',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	fix: true,
	customSyntax: 'postcss-less',
	accept: [
		{
			code: '@variable: 0px;',
			description: 'ignore Less variables',
		},
		{
			code: '@detached-ruleset: { line-height: 0px; };',
			description: 'ignore Less detached ruleset with line-height',
		},
		{
			code: '@detached-ruleset: { font: normal normal 400 0/0px cursive; };',
			description: 'ignore Less detached ruleset with font',
		},
	],

	reject: [
		{
			code: '@detached-ruleset: { font-size: 0px; };',
			fixed: '@detached-ruleset: { font-size: 0; };',

			message: messages.rejected,
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: '@detached-ruleset: { grid-template-columns: 0fr; font-size: 0px; line-height: 0px; };',
			fixed: '@detached-ruleset: { grid-template-columns: 0fr; font-size: 0; line-height: 0px; };',

			message: messages.rejected,
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 64,
		},
		{
			code: '@detached-ruleset: { font: normal normal 400 0px/0px cursive; };',
			fixed: '@detached-ruleset: { font: normal normal 400 0/0px cursive; };',

			message: messages.rejected,
			line: 1,
			column: 47,
			endLine: 1,
			endColumn: 49,
		},
	],
});
