'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,
	accept: [
		{
			code: '@media ( max-width: 300px ) {}',
		},
		{
			code: '@mEdIa ( max-width: 300px ) {}',
		},
		{
			code: '@MEDIA ( max-width: 300px ) {}',
		},
		{
			code: '@media screen and ( color ), projection and ( color ) {}',
		},
		{
			code: '@media ( grid ) and ( max-width: 15em ) {}',
		},
		{
			code: '@media ( max-width: /*comment*/ ) {}',
		},
	],

	reject: [
		{
			code: '@media (max-width: 300px ) {}',
			fixed: '@media ( max-width: 300px ) {}',
			message: messages.expectedOpening,
			line: 1,
			column: 9,
		},
		{
			code: '@mEdIa (max-width: 300px ) {}',
			fixed: '@mEdIa ( max-width: 300px ) {}',
			message: messages.expectedOpening,
			line: 1,
			column: 9,
		},
		{
			code: '@MEDIA (max-width: /*comment*/ ) {}',
			fixed: '@MEDIA ( max-width: /*comment*/ ) {}',
			message: messages.expectedOpening,
			line: 1,
			column: 9,
		},
		{
			code: '@MEDIA (max-width: 300px ) {}',
			fixed: '@MEDIA ( max-width: 300px ) {}',
			message: messages.expectedOpening,
			line: 1,
			column: 9,
		},
		{
			code: '@media ( max-width: 300px) {}',
			fixed: '@media ( max-width: 300px ) {}',
			message: messages.expectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: '@media ( max-width: /*comment*/) {}',
			fixed: '@media ( max-width: /*comment*/ ) {}',
			message: messages.expectedClosing,
			line: 1,
			column: 31,
		},
		{
			code: '@media screen and (color ), projection and ( color ) {}',
			fixed: '@media screen and ( color ), projection and ( color ) {}',
			message: messages.expectedOpening,
			line: 1,
			column: 20,
		},
		{
			code: '@media screen and ( color), projection and ( color ) {}',
			fixed: '@media screen and ( color ), projection and ( color ) {}',
			message: messages.expectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: '@media screen and ( color ), projection and (color ) {}',
			fixed: '@media screen and ( color ), projection and ( color ) {}',
			message: messages.expectedOpening,
			line: 1,
			column: 46,
		},
		{
			code: '@media screen and ( color ), projection and ( color) {}',
			fixed: '@media screen and ( color ), projection and ( color ) {}',
			message: messages.expectedClosing,
			line: 1,
			column: 51,
		},
		{
			code: '@media ( grid ) and (max-width: 15em ) {}',
			fixed: '@media ( grid ) and ( max-width: 15em ) {}',
			message: messages.expectedOpening,
			line: 1,
			column: 22,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,
	accept: [
		{
			code: '@media (max-width: 300px) {}',
		},
		{
			code: '@mEdIa (max-width: 300px) {}',
		},
		{
			code: '@MEDIA (max-width: 300px) {}',
		},
		{
			code: '@MEDIA (max-width: /*comment*/) {}',
		},
		{
			code: '@media screen and (color), projection and (color) {}',
		},
		{
			code: '@media (grid) and (max-width: 15em) {}',
		},
	],

	reject: [
		{
			code: '@media (  min-width: 700px) {}',
			fixed: '@media (min-width: 700px) {}',
			message: messages.rejectedOpening,
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: 700px  ) {}',
			fixed: '@media (min-width: 700px) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 26,
		},
		{
			code: '@media (\t  min-width: 700px) {}',
			fixed: '@media (min-width: 700px) {}',
			message: messages.rejectedOpening,
			line: 1,
			column: 9,
		},
		{
			code: '@media (min-width: 700px\t) {}',
			fixed: '@media (min-width: 700px) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: '@media (max-width: 300px ) {}',
			fixed: '@media (max-width: 300px) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: '@mEdIa (max-width: 300px ) {}',
			fixed: '@mEdIa (max-width: 300px) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: '@MEDIA (max-width: /*comment*/ ) {}',
			fixed: '@MEDIA (max-width: /*comment*/) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 31,
		},
		{
			code: '@MEDIA (max-width: 300px ) {}',
			fixed: '@MEDIA (max-width: 300px) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: '@media ( max-width: 300px) {}',
			fixed: '@media (max-width: 300px) {}',
			message: messages.rejectedOpening,
			line: 1,
			column: 9,
		},
		{
			code: '@media ( max-width: /*comment*/) {}',
			fixed: '@media (max-width: /*comment*/) {}',
			message: messages.rejectedOpening,
			line: 1,
			column: 9,
		},
		{
			code: '@media screen and (color ), projection and (color) {}',
			fixed: '@media screen and (color), projection and (color) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: '@media screen and ( color), projection and (color) {}',
			fixed: '@media screen and (color), projection and (color) {}',
			message: messages.rejectedOpening,
			line: 1,
			column: 20,
		},
		{
			code: '@media screen and (color), projection and (color ) {}',
			fixed: '@media screen and (color), projection and (color) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 49,
		},
		{
			code: '@media screen and (color), projection and ( color) {}',
			fixed: '@media screen and (color), projection and (color) {}',
			message: messages.rejectedOpening,
			line: 1,
			column: 44,
		},
		{
			code: '@media (grid) and (max-width: 15em ) {}',
			fixed: '@media (grid) and (max-width: 15em) {}',
			message: messages.rejectedClosing,
			line: 1,
			column: 35,
		},
	],
});
