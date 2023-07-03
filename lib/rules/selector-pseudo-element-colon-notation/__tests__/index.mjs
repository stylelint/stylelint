import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['single'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a:before { color: pink; }',
		},
		{
			code: 'a:after { color: pink; }',
		},
		{
			code: 'a:first-letter { color: pink; }',
		},
		{
			code: 'a:first-line { color: pink; }',
		},
		{
			code: "a:before, a[data-before='before'] { color: pink; }",
		},
		{
			code: '::selection { color: pink; }',
		},
		{
			code: 'a::spelling-error { color: pink; }',
		},
		{
			code: 'a::grammar-error { color: pink; }',
		},
		{
			code: 'a\\:before { color: pink; }',
		},
		{
			code: 'li::marker { font-variant-numeric: tabular-nums; }',
		},
		{
			code: 'input::placeholder { color: pink; }',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
	],

	reject: [
		{
			code: 'a::before { color: pink; }',
			fixed: 'a:before { color: pink; }',
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::bEfOrE { color: pink; }',
			fixed: 'a:bEfOrE { color: pink; }',
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::BEFORE { color: pink; }',
			fixed: 'a:BEFORE { color: pink; }',
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::after { color: pink; }',
			fixed: 'a:after { color: pink; }',
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::first-line { color: pink; }',
			fixed: 'a:first-line { color: pink; }',
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a::first-letter { color: pink; }',
			fixed: 'a:first-letter { color: pink; }',
			message: messages.expected('single'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a\\:before-none::before { color: pink; }',
			fixed: 'a\\:before-none:before { color: pink; }',
			message: messages.expected('single'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a::before, a::after, a::first-letter { color: pink; }',
			fixed: 'a:before, a:after, a:first-letter { color: pink; }',
			warnings: [
				{
					message: messages.expected('single'),
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
				{
					message: messages.expected('single'),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 15,
				},
				{
					message: messages.expected('single'),
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['double'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a::before { color: pink; }',
		},
		{
			code: 'a::after { color: pink; }',
		},
		{
			code: 'a::first-letter { color: pink; }',
		},
		{
			code: 'a::first-line { color: pink; }',
		},
		{
			code: "a::before, a[data-before='before'] { color: pink; }",
		},
		{
			code: '::selection { color: pink; }',
		},
		{
			code: 'a::spelling-error { color: pink; }',
		},
		{
			code: 'a::grammar-error { color: pink; }',
		},
		{
			code: 'li::marker { font-variant-numeric: tabular-nums; }',
		},
		{
			code: 'input::placeholder { color: pink; }',
		},
	],

	reject: [
		{
			code: 'a:before { color: pink; }',
			fixed: 'a::before { color: pink; }',
			message: messages.expected('double'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a:after { color: pink; }',
			fixed: 'a::after { color: pink; }',
			message: messages.expected('double'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a:first-line { color: pink; }',
			fixed: 'a::first-line { color: pink; }',
			message: messages.expected('double'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a:first-letter { color: pink; }',
			fixed: 'a::first-letter { color: pink; }',
			message: messages.expected('double'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 3,
		},
		{
			code: 'a:before, a:after, a:first-letter { color: pink; }',
			fixed: 'a::before, a::after, a::first-letter { color: pink; }',
			warnings: [
				{
					message: messages.expected('double'),
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 3,
				},
				{
					message: messages.expected('double'),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 13,
				},
				{
					message: messages.expected('double'),
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
	],
});
