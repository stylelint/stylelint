import rule from '../index.mjs';
const { messages, ruleName } = rule;

const addition = 'a number and a dimension or percentage cannot be added';
const subtraction = 'a number and a dimension or percentage cannot be subtracted';

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { top: 0; }',
		},
		{
			code: 'a { top: var(--foo); }',
		},
		{
			code: 'a { --foo: {a: b}; }',
			description: 'custom property values are not parsed',
		},
		{
			code: 'a { color: red /* ) */; }',
		},
		{
			code: 'a { content: attr(data-foo type(<string>)); }',
			description: 'ignore csstree parse errors for `attr()` function',
		},
		{
			code: 'a { color: if(media(all): red;); }',
			description: 'ignore csstree parse errors for `if()` function',
		},
		{
			code: 'a { top: --foo(1; 2); }',
			description: 'ignore csstree parse errors for custom functions',
		},
		{
			code: '@font-face { unicode-range: U+0025-00FF; }',
		},
		{
			code: 'a { top: calc(1px + 2px); }',
		},
		{
			code: 'a { top: calc(100% - 10px); }',
		},
		{
			code: 'a { top: calc(2 * 3px); }',
		},
		{
			code: 'a { top: calc(var(--foo) + 2); }',
		},
		{
			code: 'a { top: calc(env(--foo) + 10px); }',
		},
		{
			code: 'a { top: min(1px + 2px, 5px); }',
		},
		{
			code: 'a { top: clamp(1rem, 1vw + 1rem, 3rem); }',
		},
		{
			code: 'a { top: calc(); }',
		},
		{
			code: 'a { height: calc-size(max-content, size + 2rem); }',
		},
	],

	reject: [
		{
			code: 'a { top: ); }',
			message: messages.rejected(')', 'unexpected input'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 11,
			description: 'stray closing parenthesis',
		},
		{
			code: 'a { filter: alpha(opacity=30); }',
			message: messages.rejected('alpha(opacity=30)', '")" is expected'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 27,
			description: 'legacy filter',
		},
		{
			code: 'a { filter: alpha(opacity=calc(20px + 10)); }',
			warnings: [
				{
					message: messages.rejected('20px + 10', addition),
					line: 1,
					column: 32,
					endLine: 1,
					endColumn: 41,
				},
				{
					message: messages.rejected('alpha(opacity=calc(20px + 10))', '")" is expected'),
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 27,
				},
			],
			description: 'parse error with invalid math expression',
		},
		{
			code: '@font-face { src: ); }',
			message: messages.rejected(')', 'unexpected input'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 20,
			description: 'descriptor',
		},
		{
			code: 'a { content: attr(data-foo) ); }',
			message: messages.rejected('attr(data-foo) )', 'unexpected input'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 30,
			description: 'parse error outside `attr()` function',
		},
		{
			code: 'a { height: calc(2px + 2); }',
			message: messages.rejected('2px + 2', addition),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 25,
			description: 'dimension + number',
		},
		{
			code: 'a { top: --foo(calc(1px + 2)); }',
			message: messages.rejected('1px + 2', addition),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 28,
			description: 'math expression within custom function',
		},
		{
			code: 'a { --foo: calc(1px + 2); }',
			message: messages.rejected('1px + 2', addition),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 24,
			description: 'custom property',
		},
		{
			code: 'a { height: calc(2 + 2px); }',
			message: messages.rejected('2 + 2px', addition),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 25,
			description: 'number + dimension',
		},
		{
			code: 'a { height: calc(2px - 2); }',
			message: messages.rejected('2px - 2', subtraction),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 25,
			description: 'dimension - number',
		},
		{
			code: 'a { height: calc(2% + 2); }',
			message: messages.rejected('2% + 2', addition),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 24,
			description: 'percentage + number',
		},
		{
			code: 'a { height: calc(min(1px + 1, 2px)); }',
			message: messages.rejected('1px + 1', addition),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 29,
			description: 'nested math function',
		},
		{
			code: 'a { height: min(calc(1px + 1), 2px); }',
			message: messages.rejected('1px + 1', addition),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 29,
			description: 'calc nested inside min function',
		},
		{
			code: 'a { height: calc(max(10px, 5px) + 2 + 3px); }',
			message: messages.rejected('max(10px, 5px) + 2', addition),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 36,
			description: 'nested function, number, and dimension operands',
		},
		{
			code: 'a { height: min(1px + 2, 5px); }',
			message: messages.rejected('1px + 2', addition),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 24,
			description: 'min function',
		},
		{
			code: 'a { height: clamp(1px, 2 + 3px, 10px); }',
			message: messages.rejected('2 + 3px', addition),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 31,
			description: 'clamp function',
		},
		{
			code: 'a { width: calc(10% - 5); }',
			message: messages.rejected('10% - 5', subtraction),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 24,
			description: 'percentage - number',
		},
	],
});
