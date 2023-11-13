import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: 'always',
	accept: [
		{
			code: 'a { color: #ffff; }',
		},
		{
			code: 'a { color: #ffffffff; }',
		},
		{
			code: 'a { background: linear-gradient(to left, #fffa, #000000aa 100%); }',
		},
		{
			code: 'a { background: url(#fff); }',
		},
	],
	reject: [
		{
			code: 'a { color: #fff; }',
			message: messages.expected('#fff'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a { color: #ffffff; }',
			message: messages.expected('#ffffff'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { background: linear-gradient(to left, #fff, #000000 100%); }',
			warnings: [
				{ message: messages.expected('#fff'), line: 1, column: 42, endLine: 1, endColumn: 46 },
				{ message: messages.expected('#000000'), line: 1, column: 48, endLine: 1, endColumn: 55 },
			],
		},
	],
});

testRule({
	ruleName,
	config: 'never',
	accept: [
		{
			code: 'a { color: #fff; }',
		},
		{
			code: 'a { color: #ffffff; }',
		},
	],
	reject: [
		{
			code: 'a { color: #ffff; }',
			message: messages.unexpected('#ffff'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 17,
		},
	],
});

testRule({
	ruleName,
	config: 'always',
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: 'a { color: #{f}; }',
			description: 'scss interpolation of 3 characters',
		},
		{
			code: '$var: #ffff;',
			description: 'alpha channel scss variable',
		},
	],
	reject: [
		{
			code: '$var: #fff',
			message: messages.expected('#fff'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 11,
			description: 'no alpha channel scss variable',
		},
	],
});
