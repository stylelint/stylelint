import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	computeEditInfo: true,

	accept: [
		{
			code: '@media screen and (min-width: 600px) {}',
		},
		{
			code: '@media all and (color: 8) {} ',
		},
		{
			code: '@media screen and (min-width: 600px), print and (max-width: 800px) {}',
		},
	],

	reject: [
		{
			code: '@media tty {}',
			unfixable: true,
			message: messages.rejected('tty'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 11,
		},
		{
			code: '@media tv {}',
			unfixable: true,
			message: messages.rejected('tv'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 10,
		},
		{
			code: '@media handheld and (max-width: 800px), projection and (min-width: 1200px) {}',
			description: 'two queries',
			unfixable: true,
			warnings: [
				{
					message: messages.rejected('handheld'),
					line: 1,
					column: 8,
					endColumn: 16,
				},
				{
					message: messages.rejected('projection'),
					line: 1,
					column: 8,
					endColumn: 18,
				},
			],
		},
		{
			code: '@media braille {}',
			unfixable: true,
			message: messages.rejected('braille'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 15,
		},
		{
			code: '@media embossed {}',
			unfixable: true,
			message: messages.rejected('embossed'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 16,
		},
		{
			code: '@media aural {}',
			unfixable: true,
			message: messages.rejected('aural'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 13,
		},
		{
			code: '@media speech {}',
			unfixable: true,
			message: messages.rejected('speech'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 14,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreMediaType: ['speech', '/^t/'] }],

	accept: [
		{
			code: '@media speech {}',
		},
		{
			code: '@media tty {}',
		},
		{
			code: '@media tv {}',
		},
	],

	reject: [
		{
			code: '@media aural {}',
			unfixable: true,
			message: messages.rejected('aural'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 13,
		},
	],
});
