import mergeTestDescriptions from '../../../testUtils/mergeTestDescriptions.mjs';
import rule from '../index.mjs';
const { messages, ruleName } = rule;

const alwaysTests = {
	accept: [
		{
			code: '/** comment */',
			description: 'first node ignored',
		},
		{
			code: 'a { color: pink; /** comment */\ntop: 0; }',
			description: 'shared-line comment ignored',
		},
		{
			code: 'a { /** shared-line comment */\n color: pink; }',
			description: 'shared-line comment ignored',
		},
		{
			code: 'a,\n b { /** shared-line comment */\n color: pink; }',
			description: 'shared-line comment ignored',
		},
		{
			code: 'a {} /** comment */',
			description: 'shared-line comment ignored',
		},
		{
			code: 'a {}\n\n/** comment */',
		},
		{
			code: 'a {}\r\n\r\n/** comment */',
			description: 'CRLF',
		},
		{
			code: 'a {}\n\r\n/** comment */',
			description: 'Mixed',
		},
		{
			code: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
		},
	],

	reject: [
		{
			code: '/** comment */\n/** comment */',
			fixed: '/** comment */\n\n/** comment */',
			fix: { range: [14, 15], text: '\n\n' },
			message: messages.expected,
			description: 'one newline between comments',
		},
		{
			code: '/** comment */\r\n/** comment */',
			fixed: '/** comment */\r\n\r\n/** comment */',
			fix: { range: [15, 16], text: '\n\r\n' },
			message: messages.expected,
			description: 'CRLF newline between comments',
		},
		{
			code: 'a { color: pink;\n/** comment */\ntop: 0; }',
			fixed: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
			fix: { range: [16, 17], text: '\n\n' },
			message: messages.expected,
		},
		{
			code: 'a { color: pink;\r\n/** comment */\r\ntop: 0; }',
			fixed: 'a { color: pink;\r\n\r\n/** comment */\r\ntop: 0; }',
			fix: { range: [17, 18], text: '\n\r\n' },
			description: 'CRLF',
			message: messages.expected,
		},
	],
};

testRule(
	mergeTestDescriptions(alwaysTests, {
		ruleName,
		config: ['always'],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested with empty line before',
			},
		],

		reject: [
			{
				code: 'a {\n  /* comment */\n  color: pink;\n}',
				fixed: 'a {\n\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested without empty line before',
				message: messages.expected,
				line: 2,
				column: 3,
				endLine: 2,
				endColumn: 16,
				fix: { range: [3, 4], text: '\n\n' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(alwaysTests, {
		ruleName,
		config: ['always', { except: ['first-nested'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested without empty line before',
			},
			{
				code: 'a { /* shared-line comment */\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested without empty line before and shared-line comment',
			},
		],

		reject: [
			{
				code: 'a {\n\n  /* comment */\n  color: pink;\n}',
				fixed: 'a {\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested with empty line before',
				message: messages.rejected,
				line: 3,
				column: 3,
				fix: { range: [4, 5], text: '' },
			},
			{
				code: 'a { /* shared-line comment */\n\n  /* comment */\n  color: pink;\n}',
				fixed: 'a { /* shared-line comment */\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested with empty line before',
				message: messages.rejected,
				line: 3,
				column: 3,
				fix: { range: [30, 31], text: '' },
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(alwaysTests, {
		ruleName,
		config: ['always', { ignore: ['stylelint-commands'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\ncolor: pink;\n/* stylelint-disable something */\ntop: 0;\n}',
				description: 'no newline before a stylelint command comment',
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(alwaysTests, {
		ruleName,
		config: ['always', { ignoreComments: [/^ignore/u, '/ignore$/', 'string-ignored-comment'] }],
		fix: true,
		computeEditInfo: true,

		accept: [
			{
				code: 'a {\ncolor: pink;\n/*ignore-at-start*/\ntop: 0;\n}',
				description: 'regex literal ignore value can be used',
			},
			{
				code: 'a {\ncolor: pink;\n/*at-end-ignore*/\ntop: 0;\n}',
				description: 'string regex ignore value can be used',
			},
			{
				code: 'a {\ncolor: pink;\n/*string-ignored-comment*/\ntop: 0;\n}',
				description: 'string ignore value can be used',
			},
			{
				code: 'a {\ncolor: pink;\n/* ignore-at-start */\ntop: 0;\n}',
				description: 'regex literal ignore works with spaces',
			},
			{
				code: 'a {\ncolor: pink;\n/* at-end-ignore */\ntop: 0;\n}',
				description: 'string regex ignore works with spaces',
			},
			{
				code: 'a {\ncolor: pink;\n/* string-ignored-comment */\ntop: 0;\n}',
				description: 'string ignore works with spaces',
			},
		],
	}),
);

testRule({
	ruleName,
	config: ['always', { ignore: ['after-comment'] }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '/* a */\n/* b */\n/* c */\nbody {\n}',
			description: 'no newline between comments',
		},
		{
			code: 'a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }',
			description: 'no newline between comments',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\n/** comment */\n/** comment */\ntop: 0; }',
			fixed: 'a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }',
			message: messages.expected,
			fix: { range: [16, 17], text: '\n\n' },
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
			code: '\n\n/** comment */',
			description: 'first node ignored',
		},
		{
			code: '\r\n\r\n/** comment */',
			description: 'first node ignored and CRLF',
		},
		{
			code: 'a { color: pink; /** comment */\ntop: 0; }',
			description: 'shared-line comment ignored',
		},
		{
			code: 'a {} /** comment */',
		},
		{
			code: 'a { color: pink;\n/** comment */\n\ntop: 0; }',
		},
		{
			code: 'a { color: pink;\r\n/** comment */\r\n\r\ntop: 0; }',
			description: 'CRLF',
		},
	],

	reject: [
		{
			code: '/** comment */\n\n/** comment */',
			fixed: '/** comment */\n/** comment */',
			message: messages.rejected,
			line: 3,
			column: 1,
			endLine: 3,
			endColumn: 15,
			fix: { range: [15, 16], text: '' },
		},
		{
			code: 'a {}\n\n\n/** comment */',
			fixed: 'a {}\n/** comment */',
			message: messages.rejected,
			fix: { range: [5, 7], text: '' },
		},
		{
			code: 'a {}\r\n\r\n\r\n/** comment */',
			fixed: 'a {}\r\n/** comment */',
			description: 'CRLF',
			message: messages.rejected,
			fix: { range: [6, 10], text: '' },
		},
		{
			code: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
			fixed: 'a { color: pink;\n/** comment */\ntop: 0; }',
			message: messages.rejected,
			fix: { range: [17, 18], text: '' },
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-scss',
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\n// comment\ntop: 0; }',
			description: 'single-line comment ignored',
		},
		{
			code: '// first line\n// second line\na { color: pink; }',
			description: 'subsequent single-line comments ignored',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	customSyntax: 'sugarss',
	fix: true,

	accept: [
		{
			code: 'a\n  color: pink\n\n  // single-line comment\n  top: 0',
			description: 'single-line comment ignored',
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-less',
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\n// comment\ntop: 0; }',
			description: 'single-line comment ignored',
		},
		{
			code: '// first line\n// second line\na { color: pink; }',
			description: 'subsequent single-line comments ignored',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	customSyntax: 'postcss-less',
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\n\n// comment\ntop: 0; }',
			description: 'single-line comment ignored',
		},
	],
});
