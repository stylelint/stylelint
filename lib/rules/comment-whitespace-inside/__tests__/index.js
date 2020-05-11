'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

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
			code: '/*!\ncopyright */',
		},
		{
			code: '/*#\nsourcemap */',
		},
	],

	reject: [
		{
			code: '/*comment */',
			fixed: '/* comment */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/**comment **/',
			fixed: '/** comment **/',
			message: messages.expectedOpening,
			line: 1,
			column: 4,
		},
		{
			code: '/* comment*/',
			fixed: '/* comment */',
			message: messages.expectedClosing,
			line: 1,
			column: 10,
		},
		{
			code: '/*comment comment */',
			fixed: '/* comment comment */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/* comment comment*/',
			fixed: '/* comment comment */',
			message: messages.expectedClosing,
			line: 1,
			column: 18,
		},
		{
			code: '/*comment\n\ncomment */',
			fixed: '/* comment\n\ncomment */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/* comment\n\ncomment*/',
			fixed: '/* comment\n\ncomment */',
			message: messages.expectedClosing,
			line: 3,
			column: 7,
		},
		{
			code: '/*!copyright */',
			fixed: '/* !copyright */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/*comment\n *comment\n *comment\n */',
			fixed: '/* comment\n *comment\n *comment\n */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: '/*comment*/',
		},
		{
			code: '/*comment comment*/',
		},
		{
			code: '/*comment\ncomment*/',
		},
		{
			code: '/*comment\n\ncomment*/',
		},
		{
			code: '/**comment*/',
		},
		{
			code: '/****comment***/',
		},
		{
			code: '/*! copyright */',
		},
		{
			code: '/*# sourcemap */',
		},
	],

	reject: [
		{
			code: '/* comment*/',
			fixed: '/*comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/** comment*/',
			fixed: '/**comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 4,
		},
		{
			code: '/*comment */',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 10,
		},
		{
			code: '/*  comment*/',
			fixed: '/*comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/*comment  */',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 11,
		},
		{
			code: '/*\ncomment*/',
			fixed: '/*comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/*comment\n*/',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 10,
		},
		{
			code: '/* comment comment*/',
			fixed: '/*comment comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/*comment comment */',
			fixed: '/*comment comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 18,
		},
		{
			code: '/* comment\n\ncomment*/',
			fixed: '/*comment\n\ncomment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: '/*comment\n\ncomment */',
			fixed: '/*comment\n\ncomment*/',
			message: messages.rejectedClosing,
			line: 3,
			column: 8,
		},
		{
			code: '/*comment\n *comment\n *comment\n */',
			fixed: '/*comment\n *comment\n *comment*/',
			message: messages.rejectedClosing,
			line: 4,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	syntax: 'scss',

	accept: [
		{
			code: '//comment',
			description: 'single-line comment ignored',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	skipBasicChecks: true,
	syntax: 'scss',

	accept: [
		{
			code: '// comment',
			description: 'single-line comment ignored',
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	syntax: 'less',

	accept: [
		{
			code: '//comment',
			description: 'single-line comment ignored',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	skipBasicChecks: true,
	syntax: 'less',

	accept: [
		{
			code: '// comment',
			description: 'single-line comment ignored',
		},
	],
});
