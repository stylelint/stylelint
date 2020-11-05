'use strict';

const standalone = require('../../../standalone');
const { messages, ruleName, meta } = require('..');

it('warns that the rule is deprecated', () => {
	const config = {
		rules: {
			[ruleName]: ['bad-word'],
		},
	};

	const code = '';

	return standalone({ code, config }).then((output) => {
		const result = output.results[0];

		expect(result.deprecations).toHaveLength(1);
		expect(result.deprecations[0].text).toEqual(
			`'${ruleName}' has been deprecated. Instead use 'comment-word-disallowed-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
		);
	});
});

it('also warns that the rule is deprecated via a meta', () => {
	expect(meta).not.toBeUndefined();
	expect(meta).toHaveProperty('deprecated', true);
});

testRule({
	ruleName,
	config: ['bad-word'],

	accept: [
		{
			code: '/* comment */',
		},
		{
			code: '/*# bad-word */',
		},
	],

	reject: [
		{
			code: '/* Comment with bad-word  */',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
		{
			code: '/* bad-word */',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
		{
			code: '/*** bad-word ***/',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
		{
			code: '/*! bad-word */',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
		{
			code: '/** bad-word **/',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['/^TODO:/', 'bad-word'],

	accept: [
		{
			code: '/* comment */',
		},
		{
			code: '/* comment comment */',
		},
		{
			code: '/* comment\ncomment */',
		},
		{
			code: '/* comment\n\ncomment */',
		},
		{
			code: '/** comment */',
		},
		{
			code: '/**** comment ***/',
		},
		{
			code: '/*\ncomment\n*/',
		},
		{
			code: '/*\tcomment   */',
		},
		{
			code: '/*! copyright */',
		},
		{
			code: '/*# sourcemap */',
		},
		{
			code: '/*# sourcemap bad-word */',
		},
		{
			code: 'a { color: pink; /* comment */\ntop: 0; }',
		},
		{
			code: 'a {} /* comment */',
		},
		{
			code: '/* todo */',
		},
		{
			code: '/* todo: */',
		},
		{
			code: '/* todo: comment */',
		},
		{
			code: '/* tOdO: comment */',
		},
		{
			code: '/* Todo: comment */',
		},
		{
			code: '/*! Todo: comment */',
		},
		{
			code: '/*# Todo: comment */',
		},
		{
			code: '/** TODO: comment **/',
		},
		{
			code: '/*** TODO: comment ***/',
		},
	],

	reject: [
		{
			code: '/* TODO: */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/* TODO: comment */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/* TODO: comment\n next line */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/* TODO: comment\n next line */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/* TODO: comment\r\n next line */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/* TODO: comment\n\n next line */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/*\n TODO: comment */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/*\r\n TODO: comment */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/*\n\n TODO: comment */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/*\r\n\r\n TODO: comment */',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '/* bad-word */',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
		{
			code: '/* Comment with bad-word */',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
		{
			code: '/*! copyright bad-word */',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
		{
			code: '/** bad-word **/',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
		{
			code: '/*** bad-word ***/',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: [['/^TODO:/', 'bad-word']],

	accept: [
		{
			code: '// comment',
		},
		{
			code: '// todo',
		},
		{
			code: '// todo:',
		},
		{
			code: '// Todo:',
		},
		{
			code: '// tOdO:',
		},
	],

	reject: [
		{
			code: '// TODO:',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '// TODO: comment',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '// bad-word',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['/^TODO:/', 'bad-word'],

	accept: [
		{
			code: '// comment',
		},
		{
			code: '// todo:',
		},
		{
			code: '// Todo:',
		},
		{
			code: '// tOdO:',
		},
	],

	reject: [
		{
			code: '// TODO:',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '// TODO: comment',
			message: messages.rejected('/^TODO:/'),
			line: 1,
			column: 1,
		},
		{
			code: '// bad-word',
			message: messages.rejected('bad-word'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [/^TODO:/, 'bad-word'],

	accept: [
		{
			code: '/* comment */',
		},
	],

	reject: [
		{
			code: '/* TODO: */',
			message: messages.rejected(/^TODO:/),
			line: 1,
			column: 1,
		},
	],
});
