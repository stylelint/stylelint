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
			code: '@media (color: 1.1) {}',
			description: 'Float value when only integers are allowed',
			message: messages.rejected('color', '1.1'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 18,
		},
	],
});
