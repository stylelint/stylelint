'use strict';

const postcssScss = require('postcss-scss');

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	fix: true,

	accept: [
		{
			code: 'a { padding: 0 /* calc(1px+2px) */ 0; }',
		},
		{
			code: 'a { color: color(red s(-10%)); }',
		},
		{
			code: 'a { color: color(red s( -10%)); }',
		},
		{
			code: 'a { top: calc(1px + 2px); }',
		},
		{
			code: 'a { top: cAlC(1px + 2px); }',
		},
		{
			code: 'a { top: CALC(1px + 2px); }',
		},
		{
			code: 'a { top: calc(1px - 2px); }',
		},
		{
			code: 'a { top: calc(1px * 2); }',
		},
		{
			code: 'a { top: calc(1px / 2); }',
		},
		{
			code: 'a { top: calc(1px * -0.2); }',
		},
		{
			code: 'a { top: calc(1px * -.2); }',
		},
		{
			code: 'a { top: calc(1px * (-.2)); }',
		},
		{
			code: 'a { top: calc(1px * (-0.2)); }',
		},
		{
			code: 'a { top: calc(calc(1em * 2) / 3); }',
		},
		{
			code: 'a { padding: calc(1px + 2px) calc(1px + 2px); }',
		},
		{
			code: 'a { padding: calc(1px - 2px) calc(1px - 2px); }',
		},
		{
			code: 'a { padding: calc(1px * 2) calc(1px * 2); }',
		},
		{
			code: 'a { padding: calc(1px / 2) calc(1px / 2); }',
		},
		{
			code: 'a { padding: calc(calc(1em * 2) / 3) calc(calc(1em * 2) / 3); }',
		},
		{
			code: 'a { top: calc(+1px)}',
			description: 'sign',
		},
		{
			code: 'a { top: calc(1px + -1px)}',
			description: 'sign after operator',
		},
		{
			code: 'a { top: calc(-1px * -1)}',
			description: 'sign after operator and at start',
		},
		{
			code: 'a { top: calc(    +1px)}',
			description: 'multiple spaces before sign at start',
		},
		{
			code: 'a { top: calc(\t+1px)}',
			description: 'tab before sign at start',
		},
		{
			code: 'a { top: calc(-$x - 2rem); }',
			description: 'postcss-simple-vars and SCSS variable syntax',
		},
		{
			code: 'a { top: calc(-@x - 2rem); }',
			description: 'Less variable syntax',
		},
		{
			code: 'a { top: calc($x-y-z - 2rem); }',
			description: 'postcss-simple-vars and SCSS variable with hyphens',
		},
		{
			code: 'a { top: calc(2rem + @fh+d*sf-as); }',
			description: 'Less variable with symbols',
		},
		{
			code: 'a { top: calc(100% - #{$foo}); }',
			description: 'Scss interpolation',
		},
		{
			code: 'a { top: calc(100% - #{map-get($container-max-widths, xl)}); }',
			description: 'Scss interpolation with function',
		},
		{
			code: 'a { top: rem-calc(10px+ 10px); }',
			description: 'ignore function have calc in name',
		},
		{
			code: 'a { padding: rem-calc(10px+ 10px) rem-calc(10px+ 10px); }',
			description: 'ignore function have calc in name',
		},
		{
			code: 'margin-top: calc(var(--some-variable) +\n  var(--some-other-variable));',
			description: 'newline and spaces after operator',
		},
		{
			code: 'margin-top: calc(var(--some-variable) +\r\n  var(--some-other-variable));',
			description: 'CRLF newline and spaces after operator',
		},
		{
			code: 'margin-top: calc(var(--some-variable) +\n\tvar(--some-other-variable));',
			description: 'newline and tab after operator',
		},
		{
			code: 'margin-top: calc(var(--some-variable) +\r\n\tvar(--some-other-variable));',
			description: 'CRLF newline and tab after operator',
		},
		{
			code: 'margin-top: calc(var(--some-variable)\n  + var(--some-other-variable));',
			description: 'newline and spaces before operator',
		},
		{
			code: 'margin-top: calc(var(--some-variable)\r\n  + var(--some-other-variable));',
			description: 'CRLF newline and spaces before operator',
		},
		{
			code: 'margin-top: calc(var(--some-variable)\n\t+ var(--some-other-variable));',
			description: 'newline and tab before operator',
		},
		{
			code: 'margin-top: calc(var(--some-variable)\r\n\t+ var(--some-other-variable));',
			description: 'CRLF newline and tab before operator',
		},
	],

	reject: [
		{
			code: 'a { top: calc(1px +\t-1px)}',
			fixed: 'a { top: calc(1px + -1px)}',
			description: 'tab before sign after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(1px +  -1px)}',
			fixed: 'a { top: calc(1px + -1px)}',
			description: 'multiple spaces before sign after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(1px+ 2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { top: cAlC(1px+ 2px); }',
			fixed: 'a { top: cAlC(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { top: CALC(1px+ 2px); }',
			fixed: 'a { top: CALC(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { top: calc(1px  + 2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { top: calc(1px\t+ 2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(1px +  2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(1px +\t2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(1px- 2px); }',
			fixed: 'a { top: calc(1px - 2px); }',
			message: messages.expectedBefore('-'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { top: calc(1px* 2); }',
			fixed: 'a { top: calc(1px * 2); }',
			message: messages.expectedBefore('*'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { top: calc(1px *2); }',
			fixed: 'a { top: calc(1px * 2); }',
			message: messages.expectedAfter('*'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(1px/ 2); }',
			fixed: 'a { top: calc(1px / 2); }',
			message: messages.expectedBefore('/'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { top: calc(1px /2); }',
			fixed: 'a { top: calc(1px / 2); }',
			message: messages.expectedAfter('/'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(calc(1px* 2px) + 3px); }',
			fixed: 'a { top: calc(calc(1px * 2px) + 3px); }',
			message: messages.expectedBefore('*'),
			line: 1,
			column: 23,
		},
		{
			code: 'a { top: calc(calc(1px + 2px)* 3px); }',
			fixed: 'a { top: calc(calc(1px + 2px) * 3px); }',
			message: messages.expectedBefore('*'),
			line: 1,
			column: 30,
		},
		{
			code: 'a { top: calc(1px +2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedOperatorBeforeSign('+'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(1px -2px); }',
			fixed: 'a { top: calc(1px - 2px); }',
			message: messages.expectedOperatorBeforeSign('-'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { padding: 10px calc(1px +\t-1px)}',
			fixed: 'a { padding: 10px calc(1px + -1px)}',
			description: 'tab before sign after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: 10px calc(1px +  -1px)}',
			fixed: 'a { padding: 10px calc(1px + -1px)}',
			description: 'multiple spaces before sign after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: 10px calc(1px+ 2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 27,
		},
		{
			code: 'a { padding: 10px calc(1px  + 2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 29,
		},
		{
			code: 'a { padding: 10px calc(1px\t+ 2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: 10px calc(1px +  2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: 10px calc(1px +\t2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: 10px calc(1px- 2px); }',
			fixed: 'a { padding: 10px calc(1px - 2px); }',
			message: messages.expectedBefore('-'),
			line: 1,
			column: 27,
		},
		{
			code: 'a { padding: 10px calc(1px* 2); }',
			fixed: 'a { padding: 10px calc(1px * 2); }',
			message: messages.expectedBefore('*'),
			line: 1,
			column: 27,
		},
		{
			code: 'a { padding: 10px calc(1px *2); }',
			fixed: 'a { padding: 10px calc(1px * 2); }',
			message: messages.expectedAfter('*'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: 10px calc(1px/ 2); }',
			fixed: 'a { padding: 10px calc(1px / 2); }',
			message: messages.expectedBefore('/'),
			line: 1,
			column: 27,
		},
		{
			code: 'a { padding: 10px calc(1px /2); }',
			fixed: 'a { padding: 10px calc(1px / 2); }',
			message: messages.expectedAfter('/'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: 10px calc(calc(1px* 2px) + 3px); }',
			fixed: 'a { padding: 10px calc(calc(1px * 2px) + 3px); }',
			message: messages.expectedBefore('*'),
			line: 1,
			column: 32,
		},
		{
			code: 'a { padding: 10px calc(calc(1px + 2px)* 3px); }',
			fixed: 'a { padding: 10px calc(calc(1px + 2px) * 3px); }',
			message: messages.expectedBefore('*'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { padding: 10px calc(1px +2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedOperatorBeforeSign('+'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: 10px calc(1px -2px); }',
			fixed: 'a { padding: 10px calc(1px - 2px); }',
			message: messages.expectedOperatorBeforeSign('-'),
			line: 1,
			column: 28,
		},
		{
			code: 'a { padding: calc(1rem\t + 1em)}',
			fixed: 'a { padding: calc(1rem + 1em)}',
			description: 'several whitespace characters before operator starting from space',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 25,
		},
		{
			code: 'a { padding: calc(1rem  \t+ 1em)}',
			fixed: 'a { padding: calc(1rem + 1em)}',
			description: 'several whitespace characters before operator starting from tab',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { padding: calc(1rem\t\f\r\t+ 1em)}',
			fixed: 'a { padding: calc(1rem + 1em)}',
			description: 'several incorrect whitespace characters before operator',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 27,
		},
		{
			code: 'a { padding: calc(1rem +  \t1em)}',
			fixed: 'a { padding: calc(1rem + 1em)}',
			description: 'several whitespace characters after operator starting from space',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { padding: calc(1rem +\t \t1em)}',
			fixed: 'a { padding: calc(1rem + 1em)}',
			description: 'several whitespace characters after operator starting from tab',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { padding: calc(1rem +\t\r\f\t1em)}',
			fixed: 'a { padding: calc(1rem + 1em)}',
			description: 'several incorrect whitespace characters after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { padding: calc(1rem +\t \t\f\n\f\t1em)}',
			fixed: 'a { padding: calc(1rem +\n\f\t1em)}',
			description: 'several whitespace characters after operator but before the \\n',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { padding: calc(1rem +  \t\r\n  1em)}',
			fixed: 'a { padding: calc(1rem +\r\n  1em)}',
			description: 'several whitespace characters after operator but before the \\r\\n',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: postcssScss,
	fix: true,

	reject: [
		{
			code: 'a { top: calc(100%- #{$foo}); }',
			fixed: 'a { top: calc(100% - #{$foo}); }',
			message: messages.expectedBefore('-'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { top: calc(100% *#{$foo}); }',
			fixed: 'a { top: calc(100% * #{$foo}); }',
			message: messages.expectedAfter('*'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { top: calc(100% -#{$foo}); }',
			fixed: 'a { top: calc(100% - #{$foo}); }',
			message: messages.expectedOperatorBeforeSign('-'),
			line: 1,
			column: 20,
		},
	],
});
