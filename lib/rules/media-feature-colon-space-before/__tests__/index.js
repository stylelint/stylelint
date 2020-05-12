'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: '@media (max-width :600px) {}',
		},
		{
			code: '@mEdIa (max-width :600px) {}',
		},
		{
			code: '@MEDIA (max-width :600px) {}',
		},
		{
			code: '@media (max-width : 600px) {}',
		},
		{
			code: '@media (max-width :600px) and (min-width :3em) {}',
		},
		{
			code: '@custom-selector:--enter :hover;',
		},
	],

	reject: [
		{
			code: '@media (max-width:600px) {}',
			fixed: '@media (max-width :600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 18,
		},
		{
			code: '@mEdIa (max-width:600px) {}',
			fixed: '@mEdIa (max-width :600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 18,
		},
		{
			code: '@MEDIA (max-width:600px) {}',
			fixed: '@MEDIA (max-width :600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 18,
		},
		{
			code: '@media (max-width  :600px) {}',
			fixed: '@media (max-width :600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 20,
		},
		{
			code: '@media (max-width\t:600px) {}',
			fixed: '@media (max-width :600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 19,
		},
		{
			code: '@media (max-width\n:600px) {}',
			fixed: '@media (max-width :600px) {}',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: '@media (max-width\r\n:600px) {}',
			fixed: '@media (max-width :600px) {}',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: '@media (max-width:600px) and (min-width :3em) {}',
			fixed: '@media (max-width :600px) and (min-width :3em) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 18,
		},
		{
			code: '@media (max-width :600px) and (min-width:3em) {}',
			fixed: '@media (max-width :600px) and (min-width :3em) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 41,
		},
		{
			code: '@media (max-width:600px) and (min-width:3em) {}',
			fixed: '@media (max-width :600px) and (min-width :3em) {}',
			warnings: [
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 18,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 40,
				},
			],
		},
		{
			code: '@media (max-width/*comment*/:600px) {}',
			fixed: '@media (max-width/*comment*/ :600px) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 29,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: '@media (max-width:600px) {}',
		},
		{
			code: '@mEdIa (max-width:600px) {}',
		},
		{
			code: '@MEDIA (max-width:600px) {}',
		},
		{
			code: '@media (max-width: 600px) {}',
		},
		{
			code: '@media (max-width:600px) and (min-width:3em) {}',
		},
		{
			code: '@custom-selector :--enter :hover;',
		},
	],

	reject: [
		{
			code: '@media (max-width :600px) {}',
			fixed: '@media (max-width:600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 19,
		},
		{
			code: '@mEdIa (max-width :600px) {}',
			fixed: '@mEdIa (max-width:600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 19,
		},
		{
			code: '@MEDIA (max-width :600px) {}',
			fixed: '@MEDIA (max-width:600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 19,
		},
		{
			code: '@media (max-width  :600px) {}',
			fixed: '@media (max-width:600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 20,
		},
		{
			code: '@media (max-width\t:600px) {}',
			fixed: '@media (max-width:600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 19,
		},
		{
			code: '@media (max-width\n:600px) {}',
			fixed: '@media (max-width:600px) {}',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: '@media (max-width\r\n:600px) {}',
			fixed: '@media (max-width:600px) {}',
			description: 'CRLF',
			message: messages.rejectedBefore(),
			line: 2,
			column: 1,
		},
		{
			code: '@media (max-width:600px) and (min-width :3em) {}',
			fixed: '@media (max-width:600px) and (min-width:3em) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 41,
		},
		{
			code: '@media (max-width :600px) and (min-width:3em) {}',
			fixed: '@media (max-width:600px) and (min-width:3em) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 19,
		},
		{
			code: '@media (max-width :600px) and (min-width :3em) {}',
			fixed: '@media (max-width:600px) and (min-width:3em) {}',
			warnings: [
				{
					message: messages.rejectedBefore(),
					line: 1,
					column: 19,
				},
				{
					message: messages.rejectedBefore(),
					line: 1,
					column: 42,
				},
			],
		},
		{
			code: '@media (max-width /*comment*/ :600px) {}',
			fixed: '@media (max-width /*comment*/:600px) {}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 31,
		},
	],
});
