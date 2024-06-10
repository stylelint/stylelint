import rule from '../index.mjs';
const { messages, ruleName } = rule;

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
		{
			code: '/*comment*/',
			fixed: '/* comment */',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 4,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 10,
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
			endLine: 1,
			endColumn: 5,
		},
		{
			code: '/*comment  */',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 12,
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
			endLine: 3,
			endColumn: 9,
		},
		{
			code: '/*comment\n *comment\n *comment\n */',
			fixed: '/*comment\n *comment\n *comment*/',
			message: messages.rejectedClosing,
			line: 3,
			column: 10,
			endLine: 4,
			endColumn: 2,
		},
		{
			code: '/*comment\n \t*/',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 10,
			endLine: 2,
			endColumn: 3,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-scss',

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
	customSyntax: 'postcss-scss',

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
	customSyntax: 'postcss-less',

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
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '// comment',
			description: 'single-line comment ignored',
		},
	],
});
