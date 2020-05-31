'use strict';

const mergeTestDescriptions = require('../../../testUtils/mergeTestDescriptions');

const { messages, ruleName } = require('..');

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
			message: messages.expected,
			description: 'one newline between comments',
		},
		{
			code: '/** comment */\r\n/** comment */',
			fixed: '/** comment */\r\n\r\n/** comment */',
			message: messages.expected,
			description: 'CRLF newline between comments',
		},
		{
			code: 'a { color: pink;\n/** comment */\ntop: 0; }',
			fixed: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
			message: messages.expected,
		},
		{
			code: 'a { color: pink;\r\n/** comment */\r\ntop: 0; }',
			fixed: 'a { color: pink;\r\n\r\n/** comment */\r\ntop: 0; }',
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
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(alwaysTests, {
		ruleName,
		config: ['always', { except: ['first-nested'] }],
		fix: true,

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
			},
			{
				code: 'a { /* shared-line comment */\n\n  /* comment */\n  color: pink;\n}',
				fixed: 'a { /* shared-line comment */\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested with empty line before',
				message: messages.rejected,
				line: 3,
				column: 3,
			},
		],
	}),
);

testRule(
	mergeTestDescriptions(alwaysTests, {
		ruleName,
		config: ['always', { ignore: ['stylelint-commands'] }],
		fix: true,

		accept: [
			{
				code: 'a {\ncolor: pink;\n/* stylelint-disable something */\ntop: 0;\n}',
				description: 'no newline before a stylelint command comment',
			},
		],
	}),
);

testRule({
	ruleName,
	config: ['always', { ignore: ['after-comment'] }],
	fix: true,

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
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

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
		},
		{
			code: 'a {}\n\n\n/** comment */',
			fixed: 'a {}\n/** comment */',
			message: messages.rejected,
		},
		{
			code: 'a {}\r\n\r\n\r\n/** comment */',
			fixed: 'a {}\r\n/** comment */',
			description: 'CRLF',
			message: messages.rejected,
		},
		{
			code: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
			fixed: 'a { color: pink;\n/** comment */\ntop: 0; }',
			message: messages.rejected,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\n// comment\ntop: 0; }',
			description: 'single-line comment ignored',
		},
		{
			code: '// first line\n// second line\na { color: pink; }',
			description: 'subsequent single-line comments ingnored',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	syntax: 'sugarss',
	skipBasicChecks: true,
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
	syntax: 'less',
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\n// comment\ntop: 0; }',
			description: 'single-line comment ignored',
		},
		{
			code: '// first line\n// second line\na { color: pink; }',
			description: 'subsequent single-line comments ingnored',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	syntax: 'less',
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\n\n// comment\ntop: 0; }',
			description: 'single-line comment ignored',
		},
	],
});
