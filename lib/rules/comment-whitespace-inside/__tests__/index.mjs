import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['always'],
	fix: true,
	computeEditInfo: true,

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
			fix: { range: [1, 2], text: '* ' },
		},
		{
			code: '/**comment **/',
			fixed: '/** comment **/',
			message: messages.expectedOpening,
			line: 1,
			column: 4,
			fix: { range: [2, 3], text: '* ' },
		},
		{
			code: '/* comment*/',
			fixed: '/* comment */',
			message: messages.expectedClosing,
			line: 1,
			column: 10,
			fix: { range: [9, 10], text: 't ' },
		},
		{
			code: '/*comment comment */',
			fixed: '/* comment comment */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
			fix: { range: [1, 2], text: '* ' },
		},
		{
			code: '/* comment comment*/',
			fixed: '/* comment comment */',
			message: messages.expectedClosing,
			line: 1,
			column: 18,
			fix: { range: [17, 18], text: 't ' },
		},
		{
			code: '/*comment\n\ncomment */',
			fixed: '/* comment\n\ncomment */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
			fix: { range: [1, 2], text: '* ' },
		},
		{
			code: '/* comment\n\ncomment*/',
			fixed: '/* comment\n\ncomment */',
			message: messages.expectedClosing,
			line: 3,
			column: 7,
			fix: { range: [18, 19], text: 't ' },
		},
		{
			code: '/*!copyright */',
			fixed: '/* !copyright */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
			fix: { range: [1, 2], text: '* ' },
		},
		{
			code: '/*comment\n *comment\n *comment\n */',
			fixed: '/* comment\n *comment\n *comment\n */',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
			fix: { range: [1, 2], text: '* ' },
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
					fix: { range: [1, 2], text: '* ' },
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 10,
					fix: undefined,
				},
			],
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
			fix: { range: [2, 3], text: '' },
		},
		{
			code: '/** comment*/',
			fixed: '/**comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 4,
			fix: { range: [3, 4], text: '' },
		},
		{
			code: '/*comment */',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 10,
			fix: { range: [9, 10], text: '' },
		},
		{
			code: '/*  comment*/',
			fixed: '/*comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 5,
			fix: { range: [2, 4], text: '' },
		},
		{
			code: '/*comment  */',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 12,
			fix: { range: [9, 11], text: '' },
		},
		{
			code: '/*\ncomment*/',
			fixed: '/*comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
			fix: { range: [2, 3], text: '' },
		},
		{
			code: '/*comment\n*/',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 10,
			fix: { range: [9, 10], text: '' },
		},
		{
			code: '/* comment comment*/',
			fixed: '/*comment comment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
			fix: { range: [2, 3], text: '' },
		},
		{
			code: '/*comment comment */',
			fixed: '/*comment comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 18,
			fix: { range: [17, 18], text: '' },
		},
		{
			code: '/* comment\n\ncomment*/',
			fixed: '/*comment\n\ncomment*/',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
			fix: { range: [2, 3], text: '' },
		},
		{
			code: '/*comment\n\ncomment */',
			fixed: '/*comment\n\ncomment*/',
			message: messages.rejectedClosing,
			line: 3,
			column: 8,
			fix: { range: [18, 19], text: '' },
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
			fix: { range: [29, 31], text: '' },
		},
		{
			code: '/*comment\n \t*/',
			fixed: '/*comment*/',
			message: messages.rejectedClosing,
			line: 1,
			column: 10,
			endLine: 2,
			endColumn: 3,
			fix: { range: [9, 12], text: '' },
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
