import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@media screen {}',
		},
		{
			code: '@media print {}',
		},
		{
			code: '@media all {}',
		},
		{
			code: '@media {}',
		},
		{
			code: '@media screen and (color) {}',
		},
		{
			code: '@media only screen and (color) {}',
		},
		{
			code: '@media speech and (device-aspect-ratio: 16/9) {}',
		},
		{
			code: '@media (width >= 600px) {}',
		},
		{
			code: '@media (width: 600px) {}',
		},
		{
			code: '@media not (width <= -100px) {}',
		},
		{
			code: '@media not (resolution: -300dpi) {}',
		},
		{
			code: '@media (min-width: 320.01px) {}',
		},
		{
			code: '@media not (color) {}',
		},
		{
			code: '@media (width < 600px) and (height < 600px) {}',
		},
		{
			code: '@media (width < 600px) and (height < 600px) {}',
		},
		{
			code: '@media (not (color)) or (hover) {}',
		},
		{
			code: '@media (not (color)) and (not (hover)) {}',
		},
		{
			code: '@media (not (color)) and (not (hover)) {}',
		},
		{
			code: '@media screen and (max-weight: 3kg) and (color), (color) {}',
		},
		{
			code: '@media not unknown {}',
		},
	],

	reject: [
		{
			code: '@media @foo {}',
			message: messages.rejected('@foo'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '@media screen or (min-width > 500px) {}',
			message: messages.rejected('screen or (min-width > 500px)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: '@media ((min-width: 300px) and (hover: hover) or (aspect-ratio: 1 / 1)) {}',
			message: messages.rejected(
				'((min-width: 300px) and (hover: hover) or (aspect-ratio: 1 / 1))',
			),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 72,
		},
		{
			code: '@media (min-width: var(--foo)) {}',
			message: messages.rejected('(min-width: var(--foo))'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: '@media (min-width: 50%) {}',
			message: messages.rejected('(min-width: 50%)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media ((color: 2) and (min-width: 50%)) {}',
			message: messages.rejected('(min-width: 50%)'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: '@media ((color: foo(--bar)) and (min-width: 50%)) {}',
			warnings: [
				{
					message: messages.rejected('(color: foo(--bar))'),
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 28,
				},
				{
					message: messages.rejected('(min-width: 50%)'),
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 49,
				},
			],
		},
		{
			code: '@media (color: foo(--bar)), (min-width: 50%) {}',
			warnings: [
				{
					message: messages.rejected('(color: foo(--bar))'),
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 27,
				},
				{
					message: messages.rejected('(min-width: 50%)'),
					line: 1,
					column: 29,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
		{
			code: '@media (--foo: 2) {}',
			message: messages.rejected('(--foo: 2)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '@media (min-width < 500px) {}',
			message: messages.rejected('(min-width < 500px)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '@media (min-width) {}',
			message: messages.rejected('(min-width)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@media (grid < 0) {}',
			message: messages.rejected('(grid < 0)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '@media (not (color) and (hover)) {}',
			message: messages.rejected('(not (color) and (hover))'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 33,
		},

		{
			code: '@media (color) and (hover) or (width) {}',
			message: messages.rejected('(color) and (hover) or (width)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 38,
		},
		{
			code: '@media (width => 100px) {}',
			message: messages.rejected('(width => 100px)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media (width == 100px) {}',
			message: messages.rejected('(width == 100px)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@media not(min-width: 100px) {}',
			message: messages.rejected('not(min-width: 100px)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '@media foo screen {}',
			message: messages.rejected('foo screen'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '@media not screen foo (min-width: 300px) {}',
			message: messages.rejected('not screen foo (min-width: 300px)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: '@media (--foo: 300px) {}',
			message: messages.rejected('(--foo: 300px)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@media (--foo < 300px) {}',
			message: messages.rejected('(--foo < 300px)'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 23,
		},
	],
});
