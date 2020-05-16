'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
			description: 'single declaration block with trailing semicolon',
		},
		{
			code: 'a { background: orange; color: pink; }',
			description: 'multi declaration block with trailing semicolon',
		},
		{
			code: 'a { &:hover { color: pink; }}',
			description: 'nesting without first-level decl',
		},
		{
			code: 'a { color: red; &:hover { color: pink; }}',
			description: 'nesting with first-level decl',
		},
	],

	reject: [
		{
			code: 'a { color: pink }',
			fixed: 'a { color: pink; }',
			description: 'single declaration block without trailing semicolon',
			message: messages.expected,
			line: 1,
			column: 15,
		},
		{
			code: 'a { background: orange; color: pink }',
			fixed: 'a { background: orange; color: pink; }',
			description: 'multi declaration block without trailing semicolon',
			message: messages.expected,
			line: 1,
			column: 35,
		},
		{
			code: 'a { &:hover { color: pink }}',
			fixed: 'a { &:hover { color: pink; }}',
			description: 'nesting without first-level decl',
			message: messages.expected,
			line: 1,
			column: 25,
		},
		{
			code: 'a { color: red; &:hover { color: pink }}',
			fixed: 'a { color: red; &:hover { color: pink; }}',
			description: 'nesting with first-level decl',
			message: messages.expected,
			line: 1,
			column: 37,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink }',
			description: 'single-line declaration block without trailing semicolon',
		},
		{
			code: 'a { background: orange; color: pink }',
			description: 'multi-line declaration block without trailing semicolon',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a { color: pink }',
			description: 'single-line declaration block with trailing semicolon',
			message: messages.rejected,
			line: 1,
			column: 15,
		},
		{
			code: 'a { background: orange; color: pink; }',
			fixed: 'a { background: orange; color: pink }',
			description: 'multi-line declaration block with trailing semicolon',
			message: messages.rejected,
			line: 1,
			column: 35,
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
			code: 'a { @includes foo; }',
			description: 'at-rule with trailing semicolon',
		},
		{
			code: 'a { @foo { color: pink; } }',
			description: 'at-rule with decl block with trailing semicolon',
		},
	],

	reject: [
		{
			code: 'a { @includes foo }',
			fixed: 'a { @includes foo; }',
			description: 'at-rule without trailing semicolon',
			message: messages.expected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { @foo { color: pink } }',
			fixed: 'a { @foo { color: pink; } }',
			description: 'at-rule with decl block without trailing semicolon',
			message: messages.expected,
			line: 1,
			column: 22,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: 'a { @includes foo }',
			description: 'at-rule without trailing semicolon',
		},
		{
			code: 'a { @foo { color: pink } }',
			description: 'at-rule with decl block without trailing semicolon',
		},
	],

	reject: [
		{
			code: 'a { @includes foo; }',
			fixed: 'a { @includes foo }',
			description: 'at-rule with trailing semicolon',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { @foo { color: pink; } }',
			fixed: 'a { @foo { color: pink } }',
			description: 'at-rule with decl block with trailing semicolon',
			message: messages.rejected,
			line: 1,
			column: 22,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: 'const C = () => { return <a style={{ color: "red" }}></a> }',
			description: 'css-in-js object',
		},
	],

	reject: [
		{
			code: 'const C = styled.a`color: red`;',
			fixed: 'const C = styled.a`color: red;`;',
			description: 'css-in-js template literal',
			message: messages.expected,
			line: 1,
			column: 29,
		},
	],
});
