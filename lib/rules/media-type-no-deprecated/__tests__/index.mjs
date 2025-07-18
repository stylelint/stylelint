import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@media all {}',
		},
		{
			code: '@media screen {}',
		},
		{
			code: '@media print {}',
		},
		{
			code: '@media {}',
		},
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
			message: messages.rejected('tty'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 11,
		},
		{
			code: '@media tv {}',
			message: messages.rejected('tv'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 10,
		},
		{
			code: '@media handheld and (max-width: 800px), projection and (min-width: 1200px) {}',
			description: 'two queries',
			warnings: [
				{
					message: messages.rejected('handheld'),
					line: 1,
					endLine: 1,
					column: 8,
					endColumn: 16,
				},
				{
					message: messages.rejected('projection'),
					line: 1,
					endLine: 1,
					column: 41,
					endColumn: 51,
				},
			],
		},
		{
			code: '@media braille {}',
			message: messages.rejected('braille'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 15,
		},
		{
			code: '@media embossed {}',
			message: messages.rejected('embossed'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 16,
		},
		{
			code: '@media aural {}',
			message: messages.rejected('aural'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 13,
		},
		{
			code: '@media speech {}',
			message: messages.rejected('speech'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 14,
		},
		{
			code: '@media screen, print, tty {}',
			message: messages.rejected('tty'),
			line: 1,
			endLine: 1,
			column: 23,
			endColumn: 26,
		},
		{
			code: '@media screen, tty, print, tv {}',
			warnings: [
				{
					message: messages.rejected('tty'),
					line: 1,
					endLine: 1,
					column: 16,
					endColumn: 19,
				},
				{
					message: messages.rejected('tv'),
					line: 1,
					endLine: 1,
					column: 28,
					endColumn: 30,
				},
			],
		},
		{
			code: '@media tty, all, tv {}',
			warnings: [
				{
					message: messages.rejected('tty'),
					line: 1,
					endLine: 1,
					column: 8,
					endColumn: 11,
				},
				{
					message: messages.rejected('tv'),
					line: 1,
					endLine: 1,
					column: 18,
					endColumn: 20,
				},
			],
		},
		{
			code: '@media tty, all, tty {}',
			warnings: [
				{
					message: messages.rejected('tty'),
					line: 1,
					endLine: 1,
					column: 8,
					endColumn: 11,
				},
				{
					message: messages.rejected('tty'),
					line: 1,
					endLine: 1,
					column: 18,
					endColumn: 21,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreMediaTypes: ['speech', '/^t/'] }],

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
			message: messages.rejected('aural'),
			line: 1,
			endLine: 1,
			column: 8,
			endColumn: 13,
		},
	],
});
