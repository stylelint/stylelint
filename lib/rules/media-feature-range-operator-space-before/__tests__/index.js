'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: '@media (width = 600px) {}',
		},
		{
			code: '@mEdIa (width = 600px) {}',
		},
		{
			code: '@MEDIA (width = 600px) {}',
		},
		{
			code: '@media (width >600px) {}',
		},
		{
			code: '@media (width >= 600px) and (width <= 3em) {}',
		},
		{
			code: '@media /*(width>=600px) and*/ (width <= 3em) {}',
		},
		{
			code: '@media (width >= 600px) /*and (width<=3em)*/ {}',
		},
		{
			code: '@media (width >= /*>*/ 600px) {}',
		},
	],

	reject: [
		{
			code: '@media (width< 600px) {}',
			fixed: '@media (width < 600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: '@mEdIa (width< 600px) {}',
			fixed: '@mEdIa (width < 600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: '@MEDIA (width< 600px) {}',
			fixed: '@MEDIA (width < 600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: '@media (width  <= 600px) {}',
			fixed: '@media (width <= 600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 15,
		},
		{
			code: '@media (width\t= 600px) {}',
			fixed: '@media (width = 600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 14,
		},
		{
			code: '@media (width\n> 600px) {}',
			fixed: '@media (width > 600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 14,
		},
		{
			code: '@media (width\r\n> 600px) {}',
			fixed: '@media (width > 600px) {}',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 1,
			column: 15,
		},
		{
			code: '@media (width>= 600px) and (width < 3em) {}',
			fixed: '@media (width >= 600px) and (width < 3em) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 13,
		},
		{
			code: '@media (width > 600px) and (width= 3em) {}',
			fixed: '@media (width > 600px) and (width = 3em) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 33,
		},
		{
			code: '@media (width> 600px) and (width= 3em) {}',
			fixed: '@media (width > 600px) and (width = 3em) {}',
			warnings: [
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 13,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 32,
				},
			],
		},
		{
			code: '@media (width/**/< 600px) {}',
			fixed: '@media (width/**/ < 600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 17,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: '@media (width= 600px) {}',
		},
		{
			code: '@mEdIa (width= 600px) {}',
		},
		{
			code: '@MEDIA (width= 600px) {}',
		},
		{
			code: '@media (width>600px) {}',
		},
		{
			code: '@media (width>= 600px) and (width<= 3em) {}',
		},
		{
			code: '@media /*(width >= 600px) and*/ (width<= 3em) {}',
		},
		{
			code: '@media (width>= 600px) /*and (width <= 3em)*/ {}',
		},
		{
			code: '@media (width>= /* > */ 600px) {}',
		},
	],

	reject: [
		{
			code: '@media (width < 600px) {}',
			fixed: '@media (width< 600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 14,
		},
		{
			code: '@mEdIa (width < 600px) {}',
			fixed: '@mEdIa (width< 600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 14,
		},
		{
			code: '@MEDIA (width < 600px) {}',
			fixed: '@MEDIA (width< 600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 14,
		},
		{
			code: '@media (width  <= 600px) {}',
			fixed: '@media (width<= 600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 15,
		},
		{
			code: '@media (width\t= 600px) {}',
			fixed: '@media (width= 600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 14,
		},
		{
			code: '@media (width\n> 600px) {}',
			fixed: '@media (width> 600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 14,
		},
		{
			code: '@media (width\r\n> 600px) {}',
			fixed: '@media (width> 600px) {}',
			description: 'CRLF',
			message: messages.rejectedBefore(),
			line: 1,
			column: 15,
		},
		{
			code: '@media (width>= 600px) and (width < 3em) {}',
			fixed: '@media (width>= 600px) and (width< 3em) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 34,
		},
		{
			code: '@media (width > 600px) and (width= 3em) {}',
			fixed: '@media (width> 600px) and (width= 3em) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 14,
		},
		{
			code: '@media (width >= 600px) and (width < 3em) {}',
			fixed: '@media (width>= 600px) and (width< 3em) {}',
			warnings: [
				{
					message: messages.rejectedBefore(),
					line: 1,
					column: 14,
				},
				{
					message: messages.rejectedBefore(),
					line: 1,
					column: 35,
				},
			],
		},
		{
			code: '@media (width /**/ = 600px) {}',
			fixed: '@media (width /**/= 600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 19,
		},
	],
});
