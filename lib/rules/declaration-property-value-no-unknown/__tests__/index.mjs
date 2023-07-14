import { stripIndent } from 'common-tags';

import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { top: 0; }',
		},
		{
			code: 'a { margin: auto 10em; }',
		},
		{
			code: 'a { margin-inline: calc(100% - 10px); }',
		},
		{
			code: 'a { top: var(--foo); }',
		},
		{
			code: 'a { top: env(titlebar-area-height); }',
		},
		{
			code: 'a { foo: 1px; }',
		},
		{
			code: 'a { --foo: 1px; }',
		},
		{
			code: 'a { color: lightgrey; }',
		},
		{
			code: 'a { color: lightgray; }',
		},
		{
			code: 'a { display: -moz-inline-stack; }',
		},
		{
			code: 'a { color: -moz-initial; }',
		},
		{
			code: 'a { font-size: clamp(1rem, 1vw + 1rem, 3rem); }',
		},
		{
			code: 'a { font-size: min(1rem, 3rem); }',
		},
		{
			code: 'a { font-size: max(1rem, 3rem); }',
		},
		{
			code: stripIndent`
				a { font-weight: bolder; }
				@font-face { font-weight: 100 200; }
			`,
			description: 'at-rule descriptor and property with the same name but different syntaxes',
		},
		{
			code: stripIndent`
				a { --foo: red; }

				@property --foo {
					syntax: "<color>";
					inherits: false;
					initial-value: #c0ffee;
				}
			`,
		},
		{
			code: stripIndent`
				a { --foo: 10px; }
				a { --foo: 10%; }

				@property --foo {
					syntax: "<length> | <percentage>";
					inherits: false;
					initial-value: 10px;
				}
			`,
		},
		{
			code: stripIndent`
				a { --foo: bigger; }
				a { --foo: BIGGER; }

				@property --foo {
					syntax: "big | bigger | BIGGER";
					inherits: false;
					initial-value: big;
				}
			`,
		},
		{
			code: stripIndent`
				a { --foo: 10px; }
				a { --foo: 10px 10vh; }

				@property --foo {
					syntax: "<length>+";
					inherits: false;
					initial-value: 10px;
				}
			`,
		},
		{
			code: stripIndent`
				a { --foo: red; }
				a { --foo: 10px 10vh; }

				@property --foo {
					syntax: "*";
					inherits: false;
					initial-value: 10px;
				}
			`,
		},
		{
			code: stripIndent`
				a { --foo: var(--bar); }
				@property --foo {
					syntax: "<color>";
					inherits: false;
					initial-value: #c0ffee;
				}
			`,
		},
	],

	reject: [
		{
			code: 'a { top: unknown; }',
			message: messages.rejected('top', 'unknown'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { top: red; }',
			message: messages.rejected('top', 'red'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { color: ; }',
			message: messages.rejected('color', ''),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'a { padding: auto; }',
			message: messages.rejected('padding', 'auto'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a { display: fixed }',
			message: messages.rejected('display', 'fixed'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { color: rgb(67 67 67 70%); }',
			message: messages.rejected('color', '70%'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { transition: background-color 0.6s ease-in-out 0; }',
			message: messages.rejected('transition', '0'),
			line: 1,
			column: 51,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: 'a { margin-top: "10px"; }',
			message: messages.rejected('margin-top', '"10px"'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { color: greem; }',
			message: messages.rejected('color', 'greem'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a { filter: alpha(opacity=30); }',
			message: messages.rejectedParseError('filter', 'alpha(opacity=30)'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: stripIndent`
				a { --foo: 10px; }
				@property --foo {
					syntax: "<color>";
					inherits: false;
					initial-value: #c0ffee;
				}
			`,
			message: messages.rejected('--foo', '10px'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: stripIndent`
				a { --foo: 10px; }
				@property --foo {
					syntax: not-a-string;
					inherits: false;
					initial-value: #c0ffee;
				}
			`,
			message: messages.rejected('syntax', 'not-a-string'),
			line: 3,
			column: 10,
			endLine: 3,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,
	config: [
		true,
		{
			ignoreProperties: {
				top: '/.+/',
				padding: ['auto'],
				'/.+/': /--foo/,
			},
		},
	],

	accept: [
		{
			code: 'a { top: 0; }',
		},
		{
			code: 'a { top: red; }',
		},
		{
			code: 'a { padding: auto; }',
		},
		{
			code: 'a { margin: 10px --foo; }',
		},
	],

	reject: [
		{
			code: 'a { color: 1; }',
			message: messages.rejected('color', '1'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'a { padding-left: auto; }',
			message: messages.rejected('padding-left', 'auto'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { padding: 10px --bar; }',
			message: messages.rejected('padding', '--bar'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 24,
		},
	],
});

testRule({
	ruleName,
	config: [true, { propertiesSyntax: { size: '<length-percentage>' } }],

	accept: [
		{
			code: 'a { size: 10px; }',
		},
	],

	reject: [
		{
			code: 'a { size: red; }',
			message: messages.rejected('size', 'red'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 14,
		},
	],
});

testRule({
	ruleName,
	config: [
		true,
		{
			propertiesSyntax: { top: '| <--foo()>' },
			typesSyntax: { '--foo()': '--foo( <length-percentage> )' },
		},
	],

	accept: [
		{
			code: 'a { top: 10px; }',
		},
		{
			code: 'a { top: --foo(5px); }',
		},
	],

	reject: [
		{
			code: 'a { top: red; }',
			message: messages.rejected('top', 'red'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 13,
		},
	],
});

testRule({
	ruleName,
	config: true,
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: 'a { $foo: bar; }',
		},
		{
			code: 'a { top: #{foo}; }',
		},
	],
});
