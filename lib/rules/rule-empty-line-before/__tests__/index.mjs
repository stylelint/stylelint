import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['always'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {}',
			description: 'first node ignored',
		},
		{
			code: 'b {}\n\na {}',
		},
		{
			code: 'b {}\r\n\r\na {}',
			description: 'CRLF',
		},
		{
			code: 'b {}\n\r\na {}',
			description: 'Mixed',
		},
		{
			code: 'b {}\n  \t\n\na {}',
		},
		{
			code: 'b {}\n\n\ta {}',
		},
		{
			code: 'b {}\r\n\r\n\ta {}',
			description: 'CRLF',
		},
		{
			code: '@media {\n\na {} }',
			description: 'nested',
		},
	],

	reject: [
		{
			code: 'b {} a {}',
			fixed: 'b {}\n\n a {}',
			fix: {
				range: [3, 4],
				text: '}\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'b {}\na {}',
			fixed: 'b {}\n\na {}',
			fix: {
				range: [4, 5],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'b {}\n\n/* comment here*/\na {}',
			fixed: 'b {}\n\n/* comment here*/\n\na {}',
			fix: {
				range: [23, 24],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'b {}\r\n\r\n/* comment here*/\r\na {}',
			fixed: 'b {}\r\n\r\n/* comment here*/\r\n\r\na {}',
			fix: {
				range: [26, 27],
				text: '\n\r\n',
			},
			description: 'CRLF',
			message: messages.expected,
		},
		{
			code: '@media { b {}\n\n/* comment here*/\na {} }',
			fixed: '@media {\n\n b {}\n\n/* comment here*/\n\na {} }',
			description: 'nested',
			warnings: [
				{
					message: messages.expected,
					line: 1,
					column: 10,
					fix: {
						range: [7, 8],
						text: '{\n\n',
					},
				},
				{
					message: messages.expected,
					line: 4,
					column: 1,
					fix: undefined,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['after-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '/* foo */\na {}',
		},
		{
			code: '/* foo */\n\na {}',
		},
		{
			code: '/* foo */\r\n\r\na {}',
			description: 'CRLF',
		},
		{
			code: '@media { /* foo */\na {} }',
			description: 'nested',
		},
	],

	reject: [
		{
			code: 'b {} a {}',
			fixed: 'b {}\n\n a {}',
			fix: {
				range: [3, 4],
				text: '}\n\n',
			},
			message: messages.expected,
		},
		{
			code: '@media { b {} a {} }',
			fixed: '@media {\n\n b {}\n\n a {} }',
			warnings: [
				{
					message: messages.expected,
					line: 1,
					column: 10,
					fix: {
						range: [7, 8],
						text: '{\n\n',
					},
				},
				{
					message: messages.expected,
					line: 1,
					column: 15,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['first-nested'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@media {\n b {} }',
		},
		{
			code: '@media {\n\n b {} }',
		},
	],

	reject: [
		{
			code: '@media {\n b {}\n c {}\n}',
			fixed: '@media {\n b {}\n\n c {}\n}',
			fix: {
				range: [14, 15],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['inside-block'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'b {}\n\na {}',
		},
		{
			code: '@media { b {} a {} }',
		},
	],

	reject: [
		{
			code: 'b {} a {}',
			fixed: 'b {}\n\n a {}',
			fix: {
				range: [3, 4],
				text: '}\n\n',
			},
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-rule'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {} \nb {}',
		},
		{
			code: '$var: pink;\n\nb {}',
			description: 'scss variable',
		},
		{
			code: '@media {}\n\na{}',
			description: 'media rule',
		},
		{
			code: '@media {\n\na {}\nb {} }',
			description: 'nested',
		},
		{
			code: 'a {} /* comment */\nb {}',
			description: 'shared-line comment',
		},
	],

	reject: [
		{
			code: 'a {}\n\nb {}',
			fixed: 'a {}\nb {}',
			fix: {
				range: [5, 6],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '$var: pink;\nb {}',
			fixed: '$var: pink;\n\nb {}',
			fix: {
				range: [11, 12],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: '@media {}\na{}',
			fixed: '@media {}\n\na{}',
			fix: {
				range: [9, 10],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: '@media {\n\na{}\n\nb{}}',
			fixed: '@media {\n\na{}\nb{}}',
			fix: {
				range: [14, 15],
				text: '',
			},
			message: messages.rejected,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-single-line-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '/**\n * comment\n*/\n\na {}',
		},
		{
			code: '/* comment */\na {}',
		},
		{
			code: '/* comment */\na {}',
		},
		{
			code: '@media { /* comment */\n\na {} }',
			description: 'nested shared-line comment',
		},
	],

	reject: [
		{
			code: '/**\n * comment\n*/\na {}',
			fixed: '/**\n * comment\n*/\n\na {}',
			fix: {
				range: [17, 18],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: '/* comment */\n\na {}',
			fixed: '/* comment */\na {}',
			fix: {
				range: [14, 15],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media { /* comment */\na {} }',
			fixed: '@media { /* comment */\n\na {} }',
			fix: {
				range: [22, 23],
				text: '\n\n',
			},
			message: messages.expected,
			description: 'nested shared-line comment',
		},
		{
			code: 'a {} /* comment */\nb {}',
			fixed: 'a {} /* comment */\n\nb {}',
			fix: {
				range: [18, 19],
				text: '\n\n',
			},
			message: messages.expected,
			description: 'shared-line comment',
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['first-nested'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '@media {\n  a {}\n\n}',
		},
		{
			code: '@media {\r\n  a {}\r\n\r\n}',
			description: 'CRLF',
		},
		{
			code: '@media { /* comment */\n  a {}\n\n}',
			description: 'shared-line comment',
		},
		{
			code: '@media {\n  a {}\n\n  b{}\n\n}',
		},
		{
			code: '@media {\n\ta {}\n\n\tb{}\n}',
		},
		{
			code: '@media {\n\ta {}}',
		},
		{
			code: '@media {\r\n\ta {}}',
			description: 'CRLF',
		},
		{
			code: '@media {\na {}\n/* comment */\n\nb {}}',
		},
		{
			code: '@media {\r\na {}\r\n/* comment */\r\n\r\nb {}}',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'b {} a {}',
			fixed: 'b {}\n\n a {}',
			fix: {
				range: [3, 4],
				text: '}\n\n',
			},
			message: messages.expected,
		},
		{
			code: '@media {\n\n  a {}\n}',
			fixed: '@media {\n  a {}\n}',
			fix: {
				range: [9, 10],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media { /* comment */\n\n  a {}\n}',
			fixed: '@media { /* comment */\n  a {}\n}',
			fix: {
				range: [23, 24],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media { /* comment */\n\n  a {}\n}',
			fixed: '@media { /* comment */\n  a {}\n}',
			fix: {
				range: [23, 24],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media {\n\n  a {}\n\n  b{}\n}',
			fixed: '@media {\n  a {}\n\n  b{}\n}',
			fix: {
				range: [9, 10],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media {\r\n\r\n  a {}\r\n\r\n  b{}\r\n}',
			fixed: '@media {\r\n  a {}\r\n\r\n  b{}\r\n}',
			fix: {
				range: [10, 12],
				text: '',
			},
			description: 'CRLF',
			message: messages.rejected,
		},
		{
			code: '@media {\n  b {} a {} }',
			fixed: '@media {\n  b {}\n\n a {} }',
			fix: {
				range: [14, 15],
				text: '}\n\n',
			},
			message: messages.expected,
		},
		{
			code: '@media {\r\n  b {} a {} }',
			fixed: '@media {\r\n  b {}\r\n\r\n a {} }',
			fix: {
				range: [15, 16],
				text: '}\r\n\r\n',
			},
			description: 'CRLF',
			message: messages.expected,
		},
		{
			code: '@media {\n  b {}\n  a {}\n\n}',
			fixed: '@media {\n  b {}\n\n  a {}\n\n}',
			fix: {
				range: [15, 16],
				text: '\n\n',
			},
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-single-line-comment', 'first-nested'] }],

	accept: [
		{
			code: '@media screen { /* comment */\n  .foo {\n    display: none;\n  }\n}',
			description: 'shared-line comment - issue #2919',
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['inside-block-and-after-rule'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {\n color: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
			description: 'css property',
		},
		{
			code: 'a {\n $var: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
			description: 'scss variable',
		},
		{
			code: 'a {\n --custom-prop: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
			description: 'custom property',
		},
		{
			code: 'a {\n @media {\n\n   b {}\n }\n\n c {}\n d {}\n}',
			description: 'media rule',
		},
		{
			code: 'a {\n color: pink; \r\n\r\n b {color: red; } \n c {color: blue; }\n}',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'a {} b {}',
			fixed: 'a {}\n\n b {}',
			fix: {
				range: [3, 4],
				text: '}\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'a {}\nb {}',
			fixed: 'a {}\n\nb {}',
			fix: {
				range: [4, 5],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'a {\n color: pink; b {color: red; }\n c {color: blue; }\n}',
			fixed: 'a {\n color: pink;\n\n b {color: red; }\n c {color: blue; }\n}',
			fix: {
				range: [16, 17],
				text: ';\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'a {\n color: pink;\n b {color: red; }\n c {color: blue; }\n}',
			fixed: 'a {\n color: pink;\n\n b {color: red; }\n c {color: blue; }\n}',
			fix: {
				range: [17, 18],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'a {\n color: pink;\n\n b {color: red; }\n\n c {color: blue; }\n}',
			fixed: 'a {\n color: pink;\n\n b {color: red; }\n c {color: blue; }\n}',
			fix: {
				range: [37, 38],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: 'a {\n @media {\n\n   b {}\n }\n c {}\n d {}\n}',
			fixed: 'a {\n @media {\n\n   b {}\n }\n\n c {}\n d {}\n}',
			fix: {
				range: [25, 26],
				text: '\n\n',
			},
			description: 'media rule',
			message: messages.expected,
		},
		{
			code: 'a {\r\n color: pink;\r\n b {\r\ncolor: red; \r\n}\r\n c {\r\ncolor: blue; \r\n}\r\n}',
			fixed:
				'a {\r\n color: pink;\r\n\r\n b {\r\ncolor: red; \r\n}\r\n c {\r\ncolor: blue; \r\n}\r\n}',
			fix: {
				range: [19, 20],
				text: '\n\r\n',
			},
			description: 'CRLF',
			message: messages.expected,
		},
		{
			code: '.foo {\r\n text-align: center;\r\n.bar {\r\nfont-style: italic;\r\n}\r\n}',
			fixed: '.foo {\r\n text-align: center;\r\n\r\n.bar {\r\nfont-style: italic;\r\n}\r\n}',
			fix: {
				range: [29, 30],
				text: '\n\r\n',
			},
			description: 'selector after declaration',
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['inside-block'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '.foo {\n text-align: center;\n.bar {\nfont-style: italic;\n}\n}',
		},
	],
	reject: [
		{
			code: '.foo {\r\n text-align: center;\r\n\r\n.bar {\r\nfont-style: italic;\r\n}\r\n}',
			fixed: '.foo {\r\n text-align: center;\r\n.bar {\r\nfont-style: italic;\r\n}\r\n}',
			fix: {
				range: [30, 32],
				text: '',
			},
			message: messages.rejected,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '\n\na {}',
			description: 'first node ignored',
		},
		{
			code: '\r\n\r\na {}',
			description: 'first node ignored and CRLF',
		},
		{
			code: 'b {}\na {}',
		},
		{
			code: 'b {}\ta {}',
		},
	],

	reject: [
		{
			code: 'b {}\n\na {}',
			fixed: 'b {}\na {}',
			fix: {
				range: [5, 6],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: 'b {}\t\n\n\ta {}',
			fixed: 'b {}\t\n\ta {}',
			fix: {
				range: [6, 7],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: 'b {}\t\r\n\r\n\ta {}',
			fixed: 'b {}\t\r\n\ta {}',
			fix: {
				range: [7, 9],
				text: '',
			},
			description: 'CRLF',
			message: messages.rejected,
		},
		{
			code: 'b {}\n  \t\na {}',
			fixed: 'b {}\na {}',
			fix: {
				range: [5, 9],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: 'b {}\r\n  \t\r\na {}',
			fixed: 'b {}\r\na {}',
			fix: {
				range: [6, 11],
				text: '',
			},
			description: 'CRLF',
			message: messages.rejected,
		},
		{
			code: 'b {}\n\n/* comment here*/\n\na {}',
			fixed: 'b {}\n\n/* comment here*/\na {}',
			fix: {
				range: [24, 25],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media {\n\na {} }',
			fixed: '@media {\na {} }',
			fix: {
				range: [9, 10],
				text: '',
			},
			message: messages.rejected,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['after-rule'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {}\n\nb {}',
		},
		{
			code: '$var: pink;\nb {}',
			description: 'scss variable',
		},
		{
			code: '@media {}\na{}',
			description: 'media rule',
		},
		{
			code: '@media {\na {}\n\nb {} }',
			description: 'nested',
		},
		{
			code: 'a {} /* comment */\n\nb {}',
			description: 'shared-line comment',
		},
	],

	reject: [
		{
			code: 'a {}\nb {}',
			fixed: 'a {}\n\nb {}',
			fix: {
				range: [4, 5],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: '$var: pink;\n\nb {}',
			fixed: '$var: pink;\nb {}',
			fix: {
				range: [12, 13],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media {}\n\na{}',
			fixed: '@media {}\na{}',
			fix: {
				range: [10, 11],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media {\na{}\nb{}}',
			fixed: '@media {\na{}\n\nb{}}',
			fix: {
				range: [12, 13],
				text: '\n\n',
			},
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['after-single-line-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '/**\n * comment\n*/\na {}',
		},
		{
			code: '/* comment */\n\na {}',
		},
		{
			code: '@media { /* comment */\na {} }',
			description: 'nested shared-line comment',
		},
	],

	reject: [
		{
			code: '/**\n * comment\n*/\n\na {}',
			fixed: '/**\n * comment\n*/\na {}',
			fix: {
				range: [18, 19],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '/* comment */\na {}',
			fixed: '/* comment */\n\na {}',
			fix: {
				range: [13, 14],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: '@media { /* comment */\n\na {} }',
			fixed: '@media { /* comment */\na {} }',
			fix: {
				range: [23, 24],
				text: '',
			},
			message: messages.rejected,
			description: 'nested shared-line comment',
		},
		{
			code: 'a {} /* comment */\n\nb {}',
			fixed: 'a {} /* comment */\nb {}',
			fix: {
				range: [19, 20],
				text: '',
			},
			message: messages.rejected,
			description: 'shared-line comment',
		},
	],
});

testRule({
	ruleName,
	config: ['never', { ignore: ['after-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '/* foo */\na {}',
		},
		{
			code: '/* foo */\r\na {}',
			description: 'CRLF',
		},
		{
			code: '/* foo */\n\na {}',
		},
	],

	reject: [
		{
			code: 'b {}\n\na {}',
			fixed: 'b {}\na {}',
			fix: {
				range: [5, 6],
				text: '',
			},
			message: messages.rejected,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {}',
			description: 'first node ignored',
		},
		{
			code: 'b {}\na {}',
			description: 'single-line ignored',
		},
		{
			code: 'b\n{}\n\na\n{}',
		},
		{
			code: 'b\r\n{}\r\n\r\na\r\n{}',
			description: 'CRLF',
		},
		{
			code: 'b\n{}\n  \t\n\na\n{}',
		},
		{
			code: 'b {}\n\n\ta\n{}',
		},
		{
			code: 'b {}\r\n\r\n\ta\r\n{}',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: 'b {} a\n{}',
			fixed: 'b {}\n\n a\n{}',
			fix: {
				range: [3, 4],
				text: '}\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'b\n{}\na\n{}',
			fixed: 'b\n{}\n\na\n{}',
			fix: {
				range: [4, 5],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: 'b\r\n{}\r\na\r\n{}',
			fixed: 'b\r\n{}\r\n\r\na\r\n{}',
			fix: {
				range: [6, 7],
				text: '\n\r\n',
			},
			description: 'CRLF',
			message: messages.expected,
		},
		{
			code: 'b {}\n\n/* comment here*/\na\n{}',
			fixed: 'b {}\n\n/* comment here*/\n\na\n{}',
			fix: {
				range: [23, 24],
				text: '\n\n',
			},
			message: messages.expected,
		},
		{
			code: '@media { a\n{} }',
			fixed: '@media {\n\n a\n{} }',
			fix: {
				range: [7, 8],
				text: '{\n\n',
			},
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '\n\na\n{}',
			description: 'first node ignored',
		},
		{
			code: 'b {}\n\na {}',
			description: 'single-line ignored',
		},
		{
			code: 'b {}\ta\n{}',
		},
	],

	reject: [
		{
			code: 'b {}\n\na\n{}',
			fixed: 'b {}\na\n{}',
			fix: {
				range: [5, 6],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: 'b {}\t\n\n\ta\n{}',
			fixed: 'b {}\t\n\ta\n{}',
			fix: {
				range: [6, 7],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: 'b {}\t\r\n\r\n\ta\r\n{}',
			fixed: 'b {}\t\r\n\ta\r\n{}',
			fix: {
				range: [7, 9],
				text: '',
			},
			description: 'CRLF',
			message: messages.rejected,
		},
		{
			code: 'b\n{}\n  \t\na\n{}',
			fixed: 'b\n{}\na\n{}',
			fix: {
				range: [5, 9],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: 'b\r\n{}\r\n  \t\r\na\r\n{}',
			fixed: 'b\r\n{}\r\na\r\n{}',
			fix: {
				range: [7, 12],
				text: '',
			},
			description: 'CRLF',
			message: messages.rejected,
		},
		{
			code: 'b {}\n\n/* comment here*/\n\na\n{}',
			fixed: 'b {}\n\n/* comment here*/\na\n{}',
			fix: {
				range: [24, 25],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: 'b {}\r\n\r\n/* comment here*/\r\n\r\na\r\n{}',
			fixed: 'b {}\r\n\r\n/* comment here*/\r\na\r\n{}',
			fix: {
				range: [27, 29],
				text: '',
			},
			description: 'CRLF',
			message: messages.rejected,
		},
		{
			code: '@media\n{\n\na\n{} }',
			fixed: '@media\n{\na\n{} }',
			fix: {
				range: [9, 10],
				text: '',
			},
			message: messages.rejected,
		},
		{
			code: '@media\r\n{\r\n\r\na\r\n{} }',
			fixed: '@media\r\n{\r\na\r\n{} }',
			fix: {
				range: [11, 13],
				text: '',
			},
			message: messages.rejected,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a {}\n.mixin-call() {}',
			description: 'ignore non-outputting Less class mixin definition',
		},
		{
			code: '@foo: {};\n@bar: {};',
			description: 'ignore non-outputting Less class mixin definition',
		},
	],
});
