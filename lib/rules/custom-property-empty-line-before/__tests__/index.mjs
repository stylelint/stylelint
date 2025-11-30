import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.cjs';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['always'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {\n\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n}',
		},
		{
			code: 'a{\n\n --custom-prop: value; }',
		},
		{
			code: 'a{\n\n --custom-prop: value;\r\n\r\n --custom-prop2: value;}',
		},
		{
			code: 'a{\n\n --custom-prop: value;\n\r\n --custom-prop2: value;}',
		},
		{
			code: 'a{\n top: 10px;\n\r\n --custom-prop: value;}',
		},
		{
			code: 'a{\n @extends .class;\n\r\n --custom-prop: value;}',
		},
		{
			code: 'a{\n $var: value;\n\r\n --custom-prop: value;}',
		},
	],

	reject: [
		{
			code: 'a {\n--custom-prop: value;\n}',
			fixed: 'a {\n\n--custom-prop: value;\n}',
			message: messages.expected,
			line: 2,
			column: 1,
			fix: { range: [3, 4], text: '\n\n' },
		},
		{
			code: 'a {\r\n --custom-prop: value;\r\n}',
			fixed: 'a {\r\n\r\n --custom-prop: value;\r\n}',
			message: messages.expected,
			line: 2,
			column: 2,
			fix: { range: [4, 5], text: '\n\r\n' },
		},
		{
			code: 'a{\n\n --custom-prop: value; \n --custom-prop2: value;}',
			fixed: 'a{\n\n --custom-prop: value; \n\n --custom-prop2: value;}',
			message: messages.expected,
			line: 4,
			column: 2,
			fix: { range: [27, 28], text: '\n\n' },
		},
		{
			code: 'a{\r\n\r\n --custom-prop: value;\r\n --custom-prop2: value;}',
			fixed: 'a{\r\n\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;}',
			message: messages.expected,
			line: 4,
			column: 2,
			fix: { range: [29, 30], text: '\n\r\n' },
		},
		{
			code: 'a{\n top: 10px;\n --custom-prop: value;}',
			fixed: 'a{\n top: 10px;\n\n --custom-prop: value;}',
			message: messages.expected,
			line: 3,
			column: 2,
			fix: { range: [14, 15], text: '\n\n' },
		},
		{
			code: 'a{\r\n @extends .class;\r\n --custom-prop: value;}',
			fixed: 'a{\r\n @extends .class;\r\n\r\n --custom-prop: value;}',
			message: messages.expected,
			line: 3,
			column: 2,
			fix: { range: [22, 23], text: '\n\r\n' },
		},
		{
			code: 'a{\n $var: value;\n --custom-prop: value;}',
			fixed: 'a{\n $var: value;\n\n --custom-prop: value;}',
			message: messages.expected,
			line: 3,
			column: 2,
			fix: { range: [16, 17], text: '\n\n' },
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
			code: 'a {\n/* comment */\n--custom-prop: value;\n}',
		},
		{
			code: 'a {\r\n/* comment */\r\nn--custom-prop: value;\r\n}',
		},
	],

	reject: [
		{
			code: 'a {\n --custom-prop: value;\n}',
			fixed: 'a {\n\n --custom-prop: value;\n}',
			message: messages.expected,
			line: 2,
			column: 2,
			fix: { range: [3, 4], text: '\n\n' },
		},
		{
			code: 'a {\ncolor: pink; /* comment */\n--custom-prop: value;\n}',
			fixed: 'a {\ncolor: pink; /* comment */\n\n--custom-prop: value;\n}',
			message: messages.expected,
			line: 3,
			column: 1,
			fix: { range: [30, 31], text: '\n\n' },
			description: 'shared-line comments do not apply',
		},
		{
			code: 'a {\n/* comment */ --custom-prop: value;\n}',
			fixed: 'a {\n/* comment */\n\n --custom-prop: value;\n}',
			message: messages.expected,
			line: 2,
			column: 15,
			fix: { range: [16, 17], text: '/\n\n' },
			description: 'shared-line comments do not apply',
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['after-custom-property'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {\n\n --custom-prop: value; --custom-prop2: value;\n}',
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value; --custom-prop2: value;\r\n}',
		},
		{
			code: 'a {\n\n --custom-prop: value;\n --custom-prop2: value;\n}',
		},
		{
			code: 'a {\n\n --custom-prop: value; /* comment */\n --custom-prop2: value;\n}',
			description: 'shared-line comment accepted',
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n --custom-prop2: value;\r\n}',
		},
		{
			code: 'a {\n\n --custom-prop: value;\n\n --custom-prop2: value;\n}',
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;\r\n}',
		},
	],

	reject: [
		{
			code: 'a{\n @extends .class;\n --custom-prop: value;\n}',
			fixed: 'a{\n @extends .class;\n\n --custom-prop: value;\n}',
			fix: {
				range: [20, 21],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\r\n @extends .class;\r\n --custom-prop: value;\r\n}',
			fixed: 'a{\r\n @extends .class;\r\n\r\n --custom-prop: value;\r\n}',
			fix: {
				range: [22, 23],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\n @include mixin;\n --custom-prop: value;\n}',
			fixed: 'a{\n @include mixin;\n\n --custom-prop: value;\n}',
			fix: {
				range: [19, 20],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a{\r\n @include mixin;\r\n --custom-prop: value;\r\n}',
			fixed: 'a{\r\n @include mixin;\r\n\r\n --custom-prop: value;\r\n}',
			fix: {
				range: [21, 22],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 3,
			column: 2,
		},
		{
			code: 'a {\n --custom-prop: value;\n}',
			fixed: 'a {\n\n --custom-prop: value;\n}',
			fix: {
				range: [3, 4],
				text: '\n\n',
			},
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\r\n --custom-prop: value;\r\n}',
			fixed: 'a {\r\n\r\n --custom-prop: value;\r\n}',
			fix: {
				range: [4, 5],
				text: '\n\r\n',
			},
			message: messages.expected,
			line: 2,
			column: 2,
		},
		{
			code: 'a {\n  top: 15px;\n  --custom-prop: value;\n}',
			fixed: 'a {\n  top: 15px;\n\n  --custom-prop: value;\n}',
			fix: {
				range: [16, 17],
				text: '\n\n',
			},
			message: messages.expected,
			line: 3,
			column: 3,
			description: "standard properties don't count",
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
			code: 'a {\n --custom-prop: value;\n\n --custom-prop2: value;\n}',
		},
		{
			code: 'a {\n\n --custom-prop: value;\n\n --custom-prop2: value;\n}',
		},
		{
			code: 'a {\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;\r\n}',
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;\r\n}',
		},
	],

	reject: [
		{
			code: 'a {\n --custom-prop: value;\n --custom-prop2: value;\n}',
			fixed: 'a {\n --custom-prop: value;\n\n --custom-prop2: value;\n}',
			message: messages.expected,
			line: 3,
			column: 2,
			fix: { range: [26, 27], text: '\n\n' },
		},
		{
			code: 'a {\n\n --custom-prop: value;\n --custom-prop2: value;\n}',
			fixed: 'a {\n\n --custom-prop: value;\n\n --custom-prop2: value;\n}',
			message: messages.expected,
			line: 4,
			column: 2,
			fix: { range: [27, 28], text: '\n\n' },
		},
		{
			code: 'a {\r\n --custom-prop: value;\r\n --custom-prop2: value;\r\n}',
			fixed: 'a {\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;\r\n}',
			message: messages.expected,
			line: 3,
			column: 2,
			fix: { range: [28, 29], text: '\n\r\n' },
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n --custom-prop2: value;\r\n}',
			fixed: 'a {\r\n\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;\r\n}',
			message: messages.expected,
			line: 4,
			column: 2,
			fix: { range: [30, 31], text: '\n\r\n' },
		},
	],
});

testRule({
	ruleName,
	config: ['always', { ignore: ['inside-single-line-block'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { --custom-prop: value; }',
		},
		{
			code: 'a {\n\n --custom-prop: value;\n}',
		},
	],

	reject: [
		{
			code: 'a {\n --custom-prop: value;\n}',
			fixed: 'a {\n\n --custom-prop: value;\n}',
			message: messages.expected,
			line: 2,
			column: 2,
			fix: { range: [3, 4], text: '\n\n' },
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
			code: 'a { --custom-prop: value;\n}',
		},
		{
			code: 'a {\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\r\n --custom-prop: value;\r\n}',
		},
		{
			code: 'a { /* comment */\n --custom-prop: value;\n}',
			description: 'shared-line comment',
		},
	],

	reject: [
		{
			code: 'a {\n\n --custom-prop: value;\n}',
			fixed: 'a {\n --custom-prop: value;\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
			fix: { range: [4, 5], text: '' },
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n}',
			fixed: 'a {\r\n --custom-prop: value;\r\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
			fix: { range: [5, 7], text: '' },
		},
		{
			code: 'a { /* comment*/\n\n --custom-prop: value;\n}',
			fixed: 'a { /* comment*/\n --custom-prop: value;\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
			fix: { range: [17, 18], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {\n\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\n\n /* I am a comment */ \n --custom-prop2: value;}',
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n --custom-prop2: value;}',
		},
	],

	reject: [
		{
			code: 'a {\n\n --custom-prop: value;\n /* I am a comment */ \n\n --custom-prop2: value;}',
			fixed: 'a {\n\n --custom-prop: value;\n /* I am a comment */ \n --custom-prop2: value;}',
			message: messages.rejected,
			line: 6,
			column: 2,
			fix: { range: [51, 52], text: '' },
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n\r\n --custom-prop2: value;}',
			fixed: 'a {\r\n /* I am a comment */ \r\n --custom-prop2: value;}',
			message: messages.rejected,
			line: 4,
			column: 2,
			fix: { range: [29, 31], text: '' },
		},
		{
			code: 'a {\ncolor: pink; /* I am a comment */\n--custom-prop2: value;}',
			fixed: 'a {\ncolor: pink; /* I am a comment */\n\n--custom-prop2: value;}',
			message: messages.expected,
			line: 3,
			column: 1,
			fix: { range: [37, 38], text: '\n\n' },
			description: 'shared-line comments do not apply',
		},
		{
			code: 'a {/* I am a comment */ \n --custom-prop2: value;}',
			fixed: 'a {/* I am a comment */ \n\n --custom-prop2: value;}',
			message: messages.expected,
			line: 2,
			column: 2,
			fix: { range: [24, 25], text: '\n\n' },
			description: 'shared-line comments still do not apply',
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-custom-property'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {\n\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\n\n --custom-prop:value; \n --custom-prop2: value;}',
		},
		{
			code: 'a {\n\n --custom-prop:value; \r\n --custom-prop2: value;}',
		},
	],

	reject: [
		{
			code: 'a {\n\n --custom-prop:value;\n\n --custom-prop2: value;}',
			fixed: 'a {\n\n --custom-prop:value;\n --custom-prop2: value;}',
			message: messages.rejected,
			line: 5,
			column: 2,
			fix: { range: [27, 28], text: '' },
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;}',
			fixed: 'a {\r\n\r\n --custom-prop: value;\r\n --custom-prop2: value;}',
			message: messages.rejected,
			line: 5,
			column: 2,
			fix: { range: [31, 33], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['after-comment', 'first-nested'] }],

	accept: [
		{
			code: 'a {\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\n\n /* I am a comment */ \n --custom-prop2: value;}',
		},
		{
			code: 'a { /* comment */\n --custom-prop: value;\n}',
			description: 'shared-line comment',
		},
	],
});

testRule({
	ruleName,
	config: [
		'always',
		{
			except: ['first-nested', 'after-comment', 'after-custom-property'],
		},
	],
	fix: true,

	accept: [
		{
			code: "a {\n --custom-prop: value; \n --custom-prop2: value; \n /* comment */ \n --custom-prop3: value;\n\n @extends 'x';\n\n --custom-prop4: value; \n & b {\n prop: value;\n } \n\n --custom-prop5: value; \n }",
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
			code: 'a {\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\r\n --custom-prop: value;\r\n}',
		},
		{
			code: "a {\n --custom-prop: value; \n --custom-prop2: value; \n\n /* comment */ \n --custom-prop3: value; \n\n @extends 'x'; \n --custom-prop4: value; \n\n & b {\n prop: value; \n } \n --custom-prop5: value;\n }",
		},
		{
			code: 'a{\n top: 10px;\n --custom-prop: value;}',
		},
		{
			code: 'a{\n @extends .class;\n --custom-prop: value;}',
		},
		{
			code: 'a{\n $var: value;\n --custom-prop: value;}',
		},
	],

	reject: [
		{
			code: 'a {\n\n --custom-prop: value;\n}',
			fixed: 'a {\n --custom-prop: value;\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
			fix: { range: [4, 5], text: '' },
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n}',
			fixed: 'a {\r\n --custom-prop: value;\r\n}',
			message: messages.rejected,
			line: 3,
			column: 2,
			fix: { range: [5, 7], text: '' },
		},
		{
			code: 'a{\n top: 10px;\n\n --custom-prop: value;}',
			fixed: 'a{\n top: 10px;\n --custom-prop: value;}',
			message: messages.rejected,
			line: 4,
			column: 2,
			fix: { range: [15, 16], text: '' },
		},
		{
			code: 'a{\r\n @extends .class;\r\n\r\n --custom-prop: value;}',
			fixed: 'a{\r\n @extends .class;\r\n --custom-prop: value;}',
			message: messages.rejected,
			line: 4,
			column: 2,
			fix: { range: [23, 25], text: '' },
		},
		{
			code: 'a{\n $var: value;\n\n --custom-prop: value;}',
			fixed: 'a{\n $var: value;\n --custom-prop: value;}',
			message: messages.rejected,
			line: 4,
			column: 2,
			fix: { range: [17, 18], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['first-nested'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {\n\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\n\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\r\n\r\n --custom-prop: value;\r\n}',
		},
	],

	reject: [
		{
			code: 'a {\n --custom-prop: value;\n}',
			fixed: 'a {\n\n --custom-prop: value;\n}',
			message: messages.expected,
			line: 2,
			column: 2,
			fix: { range: [3, 4], text: '\n\n' },
		},
		{
			code: 'a {\r\n --custom-prop: value;\r\n}',
			fixed: 'a {\r\n\r\n --custom-prop: value;\r\n}',
			message: messages.expected,
			line: 2,
			column: 2,
			fix: { range: [4, 5], text: '\n\r\n' },
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['after-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\n /* I am a comment */ \n\n --custom-prop2: value;}',
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n\r\n --custom-prop2: value;}',
		},
	],

	reject: [
		{
			code: 'a {\n --custom-prop: value;\n /* I am a comment */ \n --custom-prop2: value;}',
			fixed: 'a {\n --custom-prop: value;\n /* I am a comment */ \n\n --custom-prop2: value;}',
			message: messages.expected,
			line: 4,
			column: 2,
			fix: { range: [49, 50], text: '\n\n' },
		},
		{
			code: 'a {\r\n /* I am a comment */ \r\n --custom-prop2: value;}',
			fixed: 'a {\r\n /* I am a comment */ \r\n\r\n --custom-prop2: value;}',
			message: messages.expected,
			line: 3,
			column: 2,
			fix: { range: [28, 29], text: '\n\r\n' },
		},
		{
			code: 'a {/* I am a comment */ \n\n --custom-prop2: value;}',
			fixed: 'a {/* I am a comment */ \n --custom-prop2: value;}',
			message: messages.rejected,
			line: 3,
			column: 2,
			fix: { range: [25, 26], text: '' },
			description: 'shared-line comments do not apply',
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['after-custom-property'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {\n --custom-prop: value;\n}',
		},
		{
			code: 'a {\n --custom-prop:value; \n\n --custom-prop2: value;}',
		},
		{
			code: 'a {\n --custom-prop:value; /* comment */\n\n --custom-prop2: value;}',
			description: 'shared-line comments accepted',
		},
		{
			code: 'a {\n --custom-prop:value; \r\n\r\n --custom-prop2: value;}',
		},
	],

	reject: [
		{
			code: 'a {\n --custom-prop:value;\n--custom-prop2: value;}',
			fixed: 'a {\n --custom-prop:value;\n\n--custom-prop2: value;}',
			message: messages.expected,
			line: 3,
			column: 1,
			fix: { range: [25, 26], text: '\n\n' },
		},
		{
			code: 'a {\n --custom-prop: value;\n --custom-prop2: value;}',
			fixed: 'a {\n --custom-prop: value;\n\n --custom-prop2: value;}',
			message: messages.expected,
			line: 3,
			column: 2,
			fix: { range: [26, 27], text: '\n\n' },
		},
	],
});

testRule({
	ruleName,
	config: [
		'never',
		{
			except: ['first-nested', 'after-comment', 'after-custom-property'],
		},
	],
	fix: true,

	accept: [
		{
			code: "a {\n\n --custom-prop: value; \n\n --custom-prop2: value; \n /* comment */ \n\n --custom-prop3: value;\n\n @extends 'x';\n --custom-prop4: value; \n & b {\n prop: value;\n } \n --custom-prop5: value; \n }",
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['first-nested'] }],
	customSyntax: naiveCssInJs,

	accept: [
		{
			code: 'css` --foo: 100px; `;',
		},
	],
});
