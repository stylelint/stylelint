'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@media screen and (min-width: 768px) {}',
			description: 'Basic media feature',
		},
		{
			code: '@media screen and ( min-resolution :  2dpcm ) {}',
			description: 'A resolution',
		},
		{
			code: '@media screen and (resolution: 10.1dpcm) {}',
			description: 'A resolution with a floating point value',
		},
		{
			code: '@media screen and (min-width: $sm) {}',
			description: 'Non-standard syntax is not checked by this rule',
		},
		{
			code: '@media (color) {}',
			description: 'Boolean context',
		},
		{
			code: '@media (color : 1) {}',
			description: 'Integer value',
		},
		{
			code: '@media (aspect-ratio : 1 / 1) {}',
			description: 'Aspect ratio value',
		},
		{
			code: '@media (aspect-ratio : 1.2) {}',
			description: 'Float value for aspect ratio',
		},
		{
			code: '@media (aspect-ratio : 1 / calc(Pi)) {}',
			description: 'Math expression in aspect ratio',
		},
		{
			code: '@media screen and (min-width <= 768px) {}',
			description: 'Range context, media feature in allowed list',
		},
	],

	reject: [
		{
			code: '@media screen and (min-width: 1000khz) {}',
			description: 'Frequency value when only lengths are allowed',
			message: messages.rejected('min-width', '1000khz'),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: '@media screen and (width <= 1000khz) {}',
			description: 'Frequency value when only lengths are allowed in a range context',
			message: messages.rejected('width', '1000khz'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '@media screen and (-webkit-width = 1000khz) {}',
			description: 'Validates vendor-prefixed media features',
			message: messages.rejected('-webkit-width', '1000khz'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '@media (color: 1.1) {}',
			description: 'Float value when only integers are allowed',
			message: messages.rejected('color', '1.1'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '@media (color: 1 / 1) {}',
			description: 'Aspect ratio value when only integers are allowed',
			message: messages.rejected('color', '1 / 1'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '@media (hover: 10px) {}',
			description: 'Dimensions when only keywords are allowed',
			message: messages.rejected('hover', '10px'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@media (hover: sin(90deg)) {}',
			description: 'Math expressions when only keywords are allowed',
			message: messages.rejected('hover', 'sin(90deg)'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '@media (color: purple) and (hover: pointer) {}',
			description: 'Incorrect keywords',
			warnings: [
				{
					message: messages.rejected('color', 'purple'),
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 21,
				},
				{
					message: messages.rejected('hover', 'pointer'),
					line: 1,
					column: 36,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
	],
});
