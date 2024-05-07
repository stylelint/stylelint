import rule from '../index.mjs';
const { messages, ruleName } = rule;

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
			code: 'a { top: calc(1px*2); }',
		},
		{
			code: 'a { top: calc(1px *2); }',
		},
		{
			code: 'a { top: calc(1px* 2); }',
		},
		{
			code: 'a { top: calc(1px / 2); }',
		},
		{
			code: 'a { top: calc(1px/2); }',
		},
		{
			code: 'a { top: calc(1px /2); }',
		},
		{
			code: 'a { top: calc(1px/ 2); }',
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
			code: 'a { top: calc(+1px); }',
			description: 'sign',
		},
		{
			code: 'a { top: calc(1px + -1px); }',
			description: 'sign after operator',
		},
		{
			code: 'a { top: calc(-1px * -1); }',
			description: 'sign after operator and at start',
		},
		{
			code: 'a { top: calc(    +1px); }',
			description: 'multiple spaces before sign at start',
		},
		{
			code: 'a { top: calc(\t+1px); }',
			description: 'tab before sign at start',
		},
		{
			code: 'a { top: calc(100% - --my-custom-function(1rem)); }',
			description: 'custom function with hyphens in name',
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
			code: 'a { top: calc(@x-y * 2); }',
			description: 'Less variable syntax with hyphens',
		},
		{
			code: 'a { top: calc(-@x-y * 2); }',
			description: 'Less variable syntax with hyphens and a unary operator',
		},
		{
			code: 'a { top: calc(100% * @x-y); }',
			description: 'Less variable syntax with hyphens at the end',
		},
		{
			code: 'a { top: calc($x-y-z - 2rem); }',
			description: 'postcss-simple-vars and SCSS variable with hyphens',
		},
		{
			code: 'a { top: calc(2rem + @fh+dsf-as); }',
			description: 'Less variable with symbols',
		},
		{
			code: 'a { top: calc(100% - #{$foo}); }',
			description: 'Scss interpolation',
		},
		{
			code: 'a { top: calc(#{$foo-bar} * 5); }',
			description: 'Scss interpolation with hyphens',
		},
		{
			code: 'a { top: calc(-#{$foo-bar} * 5); }',
			description: 'Scss interpolation with hyphens and a unary operator',
		},
		{
			code: 'a { top: calc(100% * #{$foo-bar}); }',
			description: 'Scss interpolation with hyphens at the end',
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
			code: 'a { margin-top: calc(var(--some-variable) +\n  var(--some-other-variable)); }',
			description: 'newline and spaces after operator',
		},
		{
			code: 'a { margin-top: calc(var(--some-variable) +\r\n  var(--some-other-variable)); }',
			description: 'CRLF newline and spaces after operator',
		},
		{
			code: 'a { margin-top: calc(var(--some-variable) +\n\tvar(--some-other-variable)); }',
			description: 'newline and tab after operator',
		},
		{
			code: 'a { margin-top: calc(var(--some-variable) +\r\n\tvar(--some-other-variable)); }',
			description: 'CRLF newline and tab after operator',
		},
		{
			code: 'a { margin-top: calc(var(--some-variable)\n  + var(--some-other-variable)); }',
			description: 'newline and spaces before operator',
		},
		{
			code: 'a { margin-top: calc(var(--some-variable)\r\n  + var(--some-other-variable)); }',
			description: 'CRLF newline and spaces before operator',
		},
		{
			code: 'a { margin-top: calc(var(--some-variable)\n\t+ var(--some-other-variable)); }',
			description: 'newline and tab before operator',
		},
		{
			code: 'a { margin-top: calc(var(--some-variable)\r\n\t+ var(--some-other-variable)); }',
			description: 'CRLF newline and tab before operator',
		},
		{
			code: 'a { padding: 10px calc(calc(1px + 2px)* 3px); }',
		},
		{
			code: 'a { padding: 10px calc(calc(1px* 2px) + 3px); }',
		},
		{
			code: 'a { padding: 10px calc(1px /2); }',
		},
		{
			code: 'a { padding: 10px calc(1px/ 2); }',
		},
		{
			code: 'a { padding: 10px calc(1px *2); }',
		},
		{
			code: 'a { padding: 10px calc(1px* 2); }',
		},
		{
			code: 'a { top: calc(calc(1px + 2px)* 3px); }',
		},
		{
			code: 'a { top: calc(calc(1px* 2px) + 3px); }',
		},
		{
			code: 'a { top: calc(10px*var(--foo)); }',
		},
		{
			code: 'a { top: calc(10px/var(--foo)); }',
		},
		{
			code: 'a { padding: calc(); }',
		},
		{
			code: 'a { padding: calc(1px --2px); }',
			description: '"--" prefixed token is considered as <ident-token>',
		},
		{
			code: 'a { padding: calc(1px + 2px-); }',
		},
		{
			code: 'a { padding: calc(1px + 2- ); }',
		},
		{
			code: 'a { padding: 10px calc([10px+5px]); }',
			description: 'simple blocks with square brackets are ignored',
		},
		{
			code: 'a { padding: 10px calc({10px+5px}); }',
			description: 'simple blocks with curly braces are ignored',
		},
		{
			code: 'a { top: calc(5--6px-7px); }',
			description: 'custom units',
		},
		{
			code: 'a { top: calc(10px*var(--foo, 10px 20px)); }',
		},
		{
			code: 'a { top: calc(10px*var(--foo, 10px+20px)); }',
		},
	],

	reject: [
		{
			code: 'a { top: calc(2px+1px); }',
			fixed: 'a { top: calc(2px + 1px); }',
			description: 'no space before or after operator',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, column: 18, endLine: 1, endColumn: 19 },
				{ message: messages.expectedAfter('+'), line: 1, column: 18, endLine: 1, endColumn: 19 },
			],
		},
		{
			code: 'a { transform: rotate(acos(2+1)); }',
			fixed: 'a { transform: rotate(acos(2 + 1)); }',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, column: 29, endLine: 1, endColumn: 30 },
				{ message: messages.expectedAfter('+'), line: 1, column: 29, endLine: 1, endColumn: 30 },
			],
		},
		{
			code: 'a { scale: rem(10+2, 1.7); }',
			fixed: 'a { scale: rem(10 + 2, 1.7); }',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, column: 18, endLine: 1, endColumn: 19 },
				{ message: messages.expectedAfter('+'), line: 1, column: 19, endLine: 1, endColumn: 20 },
			],
			skip: true,
		},
		{
			code: 'a { rotate: rem(10turn, 2turn+1turn); }',
			fixed: 'a { rotate: rem(10turn, 2turn + 1turn); }',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1 },
			],
			skip: true,
		},
		{
			code: 'a { top: calc(1px +\t-1px); }',
			fixed: 'a { top: calc(1px + -1px); }',
			description: 'tab before sign after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(1px +  -1px); }',
			fixed: 'a { top: calc(1px + -1px); }',
			description: 'multiple spaces before sign after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(1px+ 2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { top: cAlC(1px+ 2px); }',
			fixed: 'a { top: cAlC(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { top: CALC(1px+ 2px); }',
			fixed: 'a { top: CALC(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { top: calc(1px  + 2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { top: calc(1px\t+ 2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(1px +  2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(1px +\t2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(1px- 2px); }',
			fixed: 'a { top: calc(1px - 2px); }',
			message: messages.expectedBefore('-'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { top: calc(1px +2px); }',
			fixed: 'a { top: calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(1px -2px); }',
			fixed: 'a { top: calc(1px - 2px); }',
			message: messages.expectedAfter('-'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { padding: 10px calc(1px +\t-1px); }',
			fixed: 'a { padding: 10px calc(1px + -1px); }',
			description: 'tab before sign after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { padding: 10px calc(1px +  -1px); }',
			fixed: 'a { padding: 10px calc(1px + -1px); }',
			description: 'multiple spaces before sign after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { padding: 10px calc(1px+ 2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { padding: 10px calc(1px  + 2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { padding: 10px calc(1px\t+ 2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { padding: 10px calc(1px +  2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { padding: 10px calc(1px +\t2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { padding: 10px calc(1px- 2px); }',
			fixed: 'a { padding: 10px calc(1px - 2px); }',
			message: messages.expectedBefore('-'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { padding: 10px calc(1px +2px); }',
			fixed: 'a { padding: 10px calc(1px + 2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { padding: 10px calc(1px -2px); }',
			fixed: 'a { padding: 10px calc(1px - 2px); }',
			message: messages.expectedAfter('-'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { padding: calc(1rem\t + 1em); }',
			fixed: 'a { padding: calc(1rem + 1em); }',
			description: 'several whitespace characters before operator starting from space',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: 'a { padding: calc(1rem  \t+ 1em); }',
			fixed: 'a { padding: calc(1rem + 1em); }',
			description: 'several whitespace characters before operator starting from tab',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { padding: calc(1rem\t\f\r\t+ 1em); }',
			fixed: 'a { padding: calc(1rem + 1em); }',
			description: 'several incorrect whitespace characters before operator',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { padding: calc(1rem +  \t1em); }',
			fixed: 'a { padding: calc(1rem + 1em); }',
			description: 'several whitespace characters after operator starting from space',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { padding: calc(1rem +\t \t1em); }',
			fixed: 'a { padding: calc(1rem + 1em); }',
			description: 'several whitespace characters after operator starting from tab',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { padding: calc(1rem +\t\r\f\t1em); }',
			fixed: 'a { padding: calc(1rem + 1em); }',
			description: 'several incorrect whitespace characters after operator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { padding: calc(1rem +\t \t\f\n\f\t1em); }',
			fixed: 'a { padding: calc(1rem +\n\f\t1em); }',
			description: 'several whitespace characters after operator but before the \\n',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { padding: calc(1rem +  \t\r\n  1em); }',
			fixed: 'a { padding: calc(1rem +\r\n  1em); }',
			description: 'several whitespace characters after operator but before the \\r\\n',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'a { padding: calc(1px +-2px); }',
			fixed: 'a { padding: calc(1px + -2px); }',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { padding: calc(1px+2px+3px); }',
			fixed: 'a { padding: calc(1px + 2px + 3px); }',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 22, endColumn: 23 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 22, endColumn: 23 },
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 26, endColumn: 27 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 26, endColumn: 27 },
			],
		},
		{
			code: 'a { padding: calc(1px+2px-3px); }',
			fixed: 'a { padding: calc(1px + 2px - 3px); }',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 22, endColumn: 23 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 22, endColumn: 23 },
				{ message: messages.expectedBefore('-'), line: 1, endLine: 1, column: 26, endColumn: 27 },
				{ message: messages.expectedAfter('-'), line: 1, endLine: 1, column: 26, endColumn: 27 },
			],
		},
		{
			code: 'a { padding: calc(1px+2px-3px-4px); }',
			fixed: 'a { padding: calc(1px + 2px - 3px - 4px); }',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 22, endColumn: 23 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 22, endColumn: 23 },
				{ message: messages.expectedBefore('-'), line: 1, endLine: 1, column: 26, endColumn: 27 },
				{ message: messages.expectedAfter('-'), line: 1, endLine: 1, column: 26, endColumn: 27 },
				{ message: messages.expectedBefore('-'), line: 1, endLine: 1, column: 30, endColumn: 31 },
				{ message: messages.expectedAfter('-'), line: 1, endLine: 1, column: 30, endColumn: 31 },
			],
		},
		{
			code: 'a { top: calc((1px+ 1px)); }',
			fixed: 'a { top: calc((1px + 1px)); }',
			description: 'nested math expression',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(calc(1px+ 1px)); }',
			fixed: 'a { top: calc(calc(1px + 1px)); }',
			description: 'nested math expression',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { top: calc(((1px+ 1px))); }',
			fixed: 'a { top: calc(((1px + 1px))); }',
			description: 'nested math expression',
			message: messages.expectedBefore('+'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { font-size: clamp(1rem, 2.5vw, 1rem+1rem); }',
			fixed: 'a { font-size: clamp(1rem, 2.5vw, 1rem + 1rem); }',
			description: 'multiple argument functions',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 39, endColumn: 40 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 39, endColumn: 40 },
			],
		},
		{
			code: 'a { top: clamp(1px +2px, 3px-4px, none); }',
			fixed: 'a { top: clamp(1px + 2px, 3px - 4px, none); }',
			description: 'multiple argument functions',
			warnings: [
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 20, endColumn: 21 },
				{ message: messages.expectedBefore('-'), line: 1, endLine: 1, column: 29, endColumn: 30 },
				{ message: messages.expectedAfter('-'), line: 1, endLine: 1, column: 29, endColumn: 30 },
			],
		},
		{
			code: 'a { width: min(25vw+25vw); }',
			fixed: 'a { width: min(25vw + 25vw); }',
			description: 'multiple argument functions',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 20, endColumn: 21 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 20, endColumn: 21 },
			],
		},
		{
			code: 'a { padding: calc(1px+ 2px) calc(3px+ 4px); }',
			fixed: 'a { padding: calc(1px + 2px) calc(3px + 4px); }',
			description: 'nested math expression',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 22, endColumn: 23 },
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 37, endColumn: 38 },
			],
		},
		{
			code: 'a { top: rgb(from red calc(r+1) calc(g-+2) calc(clamp(10px+2px, g+2, none))); }',
			fixed:
				'a { top: rgb(from red calc(r + 1) calc(g - +2) calc(clamp(10px + 2px, g + 2, none))); }',
			description: 'nested math expression',
			warnings: [
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 29, endColumn: 30 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 29, endColumn: 30 },
				{ message: messages.expectedBefore('-'), line: 1, endLine: 1, column: 39, endColumn: 40 },
				{ message: messages.expectedAfter('-'), line: 1, endLine: 1, column: 39, endColumn: 40 },
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 59, endColumn: 60 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 59, endColumn: 60 },
				{ message: messages.expectedBefore('+'), line: 1, endLine: 1, column: 66, endColumn: 67 },
				{ message: messages.expectedAfter('+'), line: 1, endLine: 1, column: 66, endColumn: 67 },
			],
		},
		{
			code: 'a { padding: calc(1\\23 - 2px) calc(1\\23 a- 2px) calc(1\\23g- 2px); }',
			fixed: 'a { padding: calc(1\\23  - 2px) calc(1\\23 a - 2px) calc(1\\23g - 2px); }',
			description: 'escape sequences as units',
			warnings: [
				{ message: messages.expectedBefore('-'), line: 1, endLine: 1, column: 24, endColumn: 25 },
				{ message: messages.expectedBefore('-'), line: 1, endLine: 1, column: 42, endColumn: 43 },
				{ message: messages.expectedBefore('-'), line: 1, endLine: 1, column: 59, endColumn: 60 },
			],
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
			code: 'a { top: calc(100%*#{$foo}); }',
		},
		{
			code: 'a { top: calc(100% *#{$foo}); }',
		},
		{
			code: 'a { top: calc(100%* #{$foo}); }',
		},
		{
			code: 'a { top: calc(100% * #{$foo}); }',
		},
		{
			code: 'a { top: calc(100%/#{$foo}); }',
		},
		{
			code: 'a { top: calc(100% /#{$foo}); }',
		},
		{
			code: 'a { top: calc(100%/ #{$foo}); }',
		},
		{
			code: 'a { top: calc(100% / #{$foo}); }',
		},
	],

	reject: [
		{
			code: 'a { top: calc(100%- #{$foo}); }',
			fixed: 'a { top: calc(100% - #{$foo}); }',
			message: messages.expectedBefore('-'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { top: calc(100% -#{$foo}); }',
			fixed: 'a { top: calc(100% - #{$foo}); }',
			message: messages.expectedAfter('-'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 21,
		},
	],
});
