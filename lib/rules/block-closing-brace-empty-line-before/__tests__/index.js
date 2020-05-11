'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink;\n\n}',
		},
		{
			code: 'a { color: pink;; ;\n\n}',
		},
		{
			code: 'a { color: pink;;\n\n;}',
		},
		{
			code: 'a {color: pink;\r\n\r\n}',
		},
		{
			code: 'a {\ncolor: pink;\n\n}',
		},
		{
			code: 'a {\r\ncolor: pink;\r\n\r\n}',
		},
		{
			code: 'a { color: pink;\n\n}b { color: red;\n\n}',
		},
		{
			code: 'a {\ncolor: pink;\n\n\n\n}',
			description: 'one *or more* empty lines are allowed',
		},
		{
			code: '@media print {\n  a {\n     color: pink;\n\n  }\n\n}',
			description: 'indentation after the newline before the closing braces',
		},
		{
			code:
				'@media print {\n\ta {\n\t\tcolor: pink;\n\t\t&:hover{\n\t\t\tcolor: red;\n\n\t\t\t}\n\n\t\t}\n\n}',
			description:
				'3 level deep nesting with indentation after the newline before the closing braces',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\n}',
			fixed: 'a { color: pink;\n\n}',
			message: messages.expected,
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: pink;\r\n}',
			fixed: 'a { color: pink;\r\n\r\n}',
			message: messages.expected,
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: pink;\n }',
			fixed: 'a { color: pink;\n\n }',
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a { color: pink;\n\t}',
			fixed: 'a { color: pink;\n\n\t}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a { color: pink;\r\n  }',
			fixed: 'a { color: pink;\r\n\r\n  }',
			message: messages.expected,
			line: 2,
			column: 3,
		},
		{
			code: 'a { color: pink;\n;}',
			fixed: 'a { color: pink;\n;\n\n}',
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\ncolor: pink;\n}',
			fixed: 'a {\ncolor: pink;\n\n}',
			message: messages.expected,
			line: 3,
			column: 1,
		},
		{
			code: 'a {\n\ncolor: pink;\n}',
			fixed: 'a {\n\ncolor: pink;\n\n}',
			message: messages.expected,
			line: 4,
			column: 1,
		},
		{
			code: 'a { color: pink;\n\n/* comment here*/\n}',
			fixed: 'a { color: pink;\n\n/* comment here*/\n\n}',
			message: messages.expected,
			line: 4,
			column: 1,
		},
		{
			code: 'a { color: pink;\r\n\r\n/* comment here*/\r\n}',
			fixed: 'a { color: pink;\r\n\r\n/* comment here*/\r\n\r\n}',
			message: messages.expected,
			line: 4,
			column: 1,
		},
		{
			code: '@media print {\n  a {\n     color: pink;\n/* comment here*/\n  }\n}',
			fixed: '@media print {\n  a {\n     color: pink;\n/* comment here*/\n\n  }\n\n}',
			warnings: [
				{
					message: messages.expected,
					line: 5,
					column: 3,
				},
				{
					message: messages.expected,
					line: 6,
					column: 1,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink;\n}',
		},
		{
			code: 'a { color: pink;; ;\n}',
		},
		{
			code: 'a { color: pink;;\n;}',
		},
		{
			code: 'a {color: pink;\r\n}',
		},
		{
			code: 'a {\ncolor: pink;\n}',
		},
		{
			code: 'a {\r\ncolor: pink;\r\n}',
		},
		{
			code: 'a { color: pink;\n}b { color: red;\n}',
		},
		{
			code: '@media print {\n  a {\n     color: pink;\n  }\n}',
			description: 'indentation after the newline before the closing braces',
		},
		{
			code:
				'@media print {\n\ta {\n\t\tcolor: pink;\n\t\t&:hover{\n\t\t\tcolor: red;\n\t\t\t}\n\t\t}\n}',
			description:
				'3 level deep nesting with indentation after the newline before the closing braces',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\n\n}',
			fixed: 'a { color: pink;\n}',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: 'a { color: pink;\r\n\r\n}',
			fixed: 'a { color: pink;\r\n}',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: 'a { color: pink;\n\n }',
			fixed: 'a { color: pink;\n }',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a { color: pink;\n\n\t}',
			fixed: 'a { color: pink;\n\t}',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a { color: pink;\r\n\r\n  }',
			fixed: 'a { color: pink;\r\n  }',
			message: messages.rejected,
			line: 3,
			column: 3,
		},
		{
			code: 'a { color: pink;\n\n;}',
			fixed: 'a { color: pink;\n;}',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\ncolor: pink;\n\n}',
			fixed: 'a {\ncolor: pink;\n}',
			message: messages.rejected,
			line: 4,
			column: 1,
		},
		{
			code: 'a {\n\ncolor: pink;\n\n}',
			fixed: 'a {\n\ncolor: pink;\n}',
			message: messages.rejected,
			line: 5,
			column: 1,
		},
		{
			code: '@media print {\n  a {\n     color: pink;\n\n  }\n\n}',
			fixed: '@media print {\n  a {\n     color: pink;\n  }\n}',
			warnings: [
				{
					message: messages.rejected,
					line: 5,
					column: 3,
				},
				{
					message: messages.rejected,
					line: 7,
					column: 1,
				},
			],
		},
		{
			code: 'a {\n\ncolor: pink;\n\n/* comment here */\n\n}',
			fixed: 'a {\n\ncolor: pink;\n\n/* comment here */\n}',
			message: messages.rejected,
			line: 7,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['after-closing-brace'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n\tcolor: aquamarine;\n}',
		},
		{
			code: '@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n\n}',
		},
		{
			code:
				'@font-face {\n\tfont-family: "MyFont";\n\tsrc: url("myfont.woff2") format("woff2");\n}',
		},
		{
			code: '@supports (animation-name: test) {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n\n}',
		},
		{
			code: '@keyframes test {\n\n\t100% {\n\t\tcolor: aquamarine;\n\t}\n\n}',
		},
	],

	reject: [
		{
			code: 'a {\n\tcolor: aquamarine;\n\n}',
			fixed: 'a {\n\tcolor: aquamarine;\n}',
			message: messages.rejected,
			line: 4,
			column: 1,
		},
		{
			code: '@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n}',
			fixed: '@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n\n}',
			message: messages.expected,
			line: 6,
			column: 1,
		},
		{
			code:
				'@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n\n\tb {\n\t\tcolor: hotpink;\n\t}\n}',
			fixed:
				'@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n\n\tb {\n\t\tcolor: hotpink;\n\t}\n\n}',
			warnings: [
				{
					message: messages.expected,
					line: 10,
					column: 1,
				},
			],
		},
		{
			code:
				'@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n\n\tb {\n\t\tcolor: hotpink;\n\n\t}\n}',
			fixed:
				'@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n\n\tb {\n\t\tcolor: hotpink;\n\t}\n\n}',
			warnings: [
				{
					message: messages.rejected,
					line: 10,
					column: 2,
				},
				{
					message: messages.expected,
					line: 11,
					column: 1,
				},
			],
		},
		{
			code: '@supports (animation-name: test) {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n}',
			fixed: '@supports (animation-name: test) {\n\n\ta {\n\t\tcolor: aquamarine;\n\t}\n\n}',
			message: messages.expected,
			line: 6,
			column: 1,
		},
		{
			code: '@keyframes test {\n\n\t100% {\n\t\tcolor: aquamarine;\n\t}\n}',
			fixed: '@keyframes test {\n\n\t100% {\n\t\tcolor: aquamarine;\n\t}\n\n}',
			message: messages.expected,
			line: 6,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line', { except: ['after-closing-brace'] }],
	fix: true,

	accept: [
		{
			code: 'a {\n\tcolor: aquamarine;\n\n}',
		},
		{
			code: 'a { color: aquamarine; }',
		},
		{
			code: '@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n}',
		},
		{
			code:
				'@font-face {\n\tfont-family: "MyFont";\n\tsrc: url("myfont.woff2") format("woff2");\n\n}',
		},
		{
			code: '@supports (animation-name: test) {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n}',
		},
		{
			code: '@keyframes test {\n\n\t100% {\n\t\tcolor: aquamarine;\n\n\t}\n}',
		},
	],

	reject: [
		{
			code: 'a {\n\tcolor: aquamarine;\n}',
			fixed: 'a {\n\tcolor: aquamarine;\n\n}',
			message: messages.expected,
			line: 3,
			column: 1,
		},
		{
			code: '@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n\n}',
			fixed: '@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n}',
			message: messages.rejected,
			line: 8,
			column: 1,
		},
		{
			code:
				'@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n\n\tb {\n\t\tcolor: hotpink;\n\n\t}\n\n}',
			fixed:
				'@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n\n\tb {\n\t\tcolor: hotpink;\n\n\t}\n}',
			message: messages.rejected,
			line: 13,
			column: 1,
		},
		{
			code:
				'@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n\n\tb {\n\t\tcolor: hotpink;\n\n\t}\n\n}',
			fixed:
				'@media print {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n\n\tb {\n\t\tcolor: hotpink;\n\n\t}\n}',
			message: messages.rejected,
			line: 13,
			column: 1,
		},
		{
			code: '@supports (animation-name: test) {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n\n}',
			fixed: '@supports (animation-name: test) {\n\n\ta {\n\t\tcolor: aquamarine;\n\n\t}\n}',
			message: messages.rejected,
			line: 8,
			column: 1,
		},
		{
			code: '@keyframes test {\n\n\t100% {\n\t\tcolor: aquamarine;\n\n\t}\n\n}',
			fixed: '@keyframes test {\n\n\t100% {\n\t\tcolor: aquamarine;\n\n\t}\n}',
			message: messages.rejected,
			line: 8,
			column: 1,
		},
	],
});
