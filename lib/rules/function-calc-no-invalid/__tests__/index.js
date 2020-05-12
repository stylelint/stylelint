'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '.foo {width: calc(100% - 80px);}',
		},
		{
			code: '.foo {width: calc(100% + 80px);}',
		},
		{
			code: '.foo {width: calc(100px + 80%);}',
		},
		{
			code: '.foo {width: calc(100px * 80);}',
		},
		{
			code: '.foo {width: calc(100 * 80px);}',
		},
		{
			code: '.foo {width: calc(100px / 80);}',
		},
		{
			code: '.foo {width: calc(100% - var(--bar));}',
		},
		{
			code: '.foo {width: calc(100px / var(--bar));}',
		},
		{
			code: '.foo {width: calc(var(--bar) - var(--baz));}',
		},
		{
			code: '.foo {width: calc((100% - 80px) / 2);}',
		},
		{
			code: '.foo {width: calc(100px / (2 * var(--bar)));}',
		},
		{
			code: '.foo {width: calc(100px / (var(--bar) * 2));}',
		},
		{
			code: '.foo {width: fn(100% 80px);}',
		},
		{
			code: '.foo {width: calc(100px - calc(80px * 2));}',
		},
		{
			code: 'a { margin-left: calc(-6 * 20px); }',
		},
		{
			code: 'a { margin-left: calc(+6 * 20px); }',
		},
		{
			code: 'a { margin-left: calc(-6 * -20px); }',
		},
		{
			code: 'a { margin-left: calc(+6 * +20px); }',
		},
	],

	reject: [
		{
			code: '.foo {width: calc();}',
			description: 'empty',
			message: messages.expectedExpression(),
			line: 1,
			column: 19,
		},
		{
			code: '.foo {width: calc(100% + ());}',
			description: 'empty parentheses',
			message: messages.expectedExpression(),
			line: 1,
			column: 27,
		},
		{
			code: '.foo {width: calc(- 80px);}',
			description: 'invalid',
			message: messages.expectedExpression(),
			line: 1,
			column: 21,
		},
		{
			code: '.foo {width: calc(100% - - 80px);}',
			description: 'invalid',
			message: messages.expectedExpression(),
			line: 1,
			column: 28,
		},
		{
			code: '.foo {width: calc(100% -);}',
			description: 'invalid',
			message: messages.expectedExpression(),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100% 80px);}',
			description: 'missing operator',
			message: messages.expectedExpression(),
			line: 1,
			column: 24,
		},
		{
			code: '.foo {width: calc(100% -80px);}',
			description: 'expected space after',
			message: messages.expectedSpaceAfterOperator('-'),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100% +80px);}',
			description: 'expected space after',
			message: messages.expectedSpaceAfterOperator('+'),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100%- 80px);}',
			description: 'expected space before',
			message: messages.expectedSpaceBeforeOperator('-'),
			line: 1,
			column: 23,
		},
		{
			code: '.foo {width: calc(100%+ 80px);}',
			description: 'expected space before',
			message: messages.expectedSpaceBeforeOperator('+'),
			line: 1,
			column: 23,
		},
		{
			code: '.foo {width: calc(100px -calc(80px * 2));}',
			description: 'expected space after',
			message: messages.expectedSpaceAfterOperator('-'),
			line: 1,
			column: 26,
		},
		{
			code: '.foo {width: calc(100% / 0);}',
			description: 'division by zero',
			message: messages.rejectedDivisionByZero(),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(80px * (10 / 0));}',
			message: messages.rejectedDivisionByZero(),
			line: 1,
			column: 31,
		},
		{
			code: '.foo {width: calc(80px / ((10 + 20 * 3 - 70) / 4));}',
			message: messages.rejectedDivisionByZero(),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100px + 80);}',
			description: 'the `resolved type` is invalid',
			message: messages.expectedValidResolvedType('+'),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100% + 80);}',
			description: 'the `resolved type` is invalid',
			message: messages.expectedValidResolvedType('+'),
			line: 1,
			column: 24,
		},
		{
			code: '.foo {width: calc(100px + 80s);}',
			description: 'the `resolved type` is invalid',
			message: messages.expectedValidResolvedType('+'),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100px - 80);}',
			description: 'the `resolved type` is invalid',
			message: messages.expectedValidResolvedType('-'),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100px * 80px);}',
			description: 'the `resolved type` is invalid',
			message: messages.expectedValidResolvedType('*'),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100px / 80px);}',
			description: 'the `resolved type` is invalid',
			message: messages.expectedValidResolvedType('/'),
			line: 1,
			column: 25,
		},
		{
			code: '.foo {width: calc(100 / 80px);}',
			description: 'the `resolved type` is invalid',
			message: messages.expectedValidResolvedType('/'),
			line: 1,
			column: 23,
		},
		{
			code: '.foo {width: calc((10 * 10) / 80px);}',
			message: messages.expectedValidResolvedType('/'),
			line: 1,
			column: 29,
		},
		{
			code: '.foo {width: calc(80px * (10px * 10px));}',
			message: messages.expectedValidResolvedType('*'),
			line: 1,
			column: 32,
		},
		{
			code: '.foo {width: calc( calc(100px * 100px) / 2);}',
			message: messages.expectedValidResolvedType('*'),
			line: 1,
			column: 31,
		},
		{
			code: '.foo {width: calc( calc(100px * 100) / 20px);}',
			message: messages.expectedValidResolvedType('/'),
			line: 1,
			column: 38,
		},
		{
			code: '.foo {width: calc( fn(calc(100px * 100px)) + 30px);}',
			warnings: [
				{
					message: messages.expectedValidResolvedType('*'),
					line: 1,
					column: 34,
				},
			],
		},
		{
			code: '.foo {width: calc( fn(calc(100px * 100px)) / 30px);}',
			warnings: [
				{
					message: messages.expectedValidResolvedType('/'),
					line: 1,
					column: 44,
				},
				{
					message: messages.expectedValidResolvedType('*'),
					line: 1,
					column: 34,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'scss',

	accept: [
		{
			code: 'a { top: calc(100% - #{$foo}); }',
		},
		{
			code: 'a { top: calc(100% * #{$foo}); }',
		},
		{
			code: 'a { top: calc(100% *#{$foo}); }',
		},
		{
			code: 'a { top: calc(100% - $foo); }',
		},
		{
			code: 'a { top: calc(100% - foo()); }',
		},
		{
			code: `
				a {
					width: calc(
						#{$min-value} +
						#{strip-unit($max-value - $min-value)} *
						(100vw - #{$min-vw})
					);
				}
			`,
		},
		{
			code: `
				a {
					width: calc(#{$min-value} + #{$max-value}*(100vw - #{$min-vw}));
				}
     		 `,
		},
		{
			code: 'a { top: calc(100% -#{$foo}); }',
		},
		{
			code: 'a { top: calc(100% -$foo); }',
		},
		{
			code: '.foo {width: calc(100% - -#{$foo});}',
		},
		{
			code: '.foo {width: calc(-#{$foo});}',
		},
		{
			code: '.foo {width: calc(100% - - -#{$foo});}',
		},
		{
			code: `
				a {
					width: calc(#{$min-value} + #{$max-value}*(100vw -#{$min-vw}));
				}
			`,
		},
	],

	reject: [
		{
			code: 'a { top: calc(100% -foo()); }',
			message: messages.expectedSpaceAfterOperator('-'),
			line: 1,
			column: 21,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'less',

	accept: [
		{
			code: 'a { top: calc(100% - @foo); }',
		},
		{
			code: 'a { top: calc(100% * @foo); }',
		},
		{
			code: 'a { top: calc(100% *@foo); }',
		},
		{
			code: 'a { top: calc(100% - @foo[bar]); }',
		},
		{
			code: 'a { top: calc(100% - foo()); }',
		},
		{
			code: `
				a {
					width: calc(@min-value + @max-value*100vw - @min-vw));
				}
			`,
		},
		{
			code: 'a { top: calc(100% -@foo); }',
		},
		{
			code: 'a { top: calc(100% -@foo[bar]); }',
		},
		{
			code: '.foo {width: calc(100% - -@foo);}',
		},
		{
			code: '.foo {width: calc(-@foo);}',
		},
		{
			code: '.foo {width: calc(100% - - -@foo);}',
		},
		{
			code: `
				a {
					width: calc(@min-value + @max-value*(100vw -@min-vw));
				}
			`,
		},
	],

	reject: [
		{
			code: 'a { top: calc(100% -foo()); }',
			message: messages.expectedSpaceAfterOperator('-'),
			line: 1,
			column: 21,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'css-in-js',

	accept: [
		{
			code: "export default <a style={{ width: 'calc(100% - 80px)' }} />;",
		},
		{
			code: "export default <a style={{ width: 'calc(100% - 80px)' }} />;",
		},
	],

	reject: [
		{
			code: "export default <a style={{ width: 'calc(100% -80px)' }} />;",
			message: messages.expectedSpaceAfterOperator('-'),
			line: 1,
			column: 46,
		},
		{
			code: "export default <a style={{ width: 'calc(100% - - 80px)' }} />;",
			message: messages.expectedExpression(),
			line: 1,
			column: 49,
		},
	],
});
