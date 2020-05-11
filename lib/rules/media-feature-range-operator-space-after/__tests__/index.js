'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
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
			code: '@media (width > 600px) {}',
		},
		{
			code: '@media (width>= 600px) and (width<= 3em) {}',
		},
		{
			code: '@media /*(width>=600px) and*/ (width <= 3em) {}',
		},
		{
			code: '@media (width >= 600px) /*and (width<3em)*/ {}',
		},
		{
			code: '@media (width >= /*>*/ 600px) {}',
		},
	],

	reject: [
		{
			code: '@media (width<600px) {}',
			fixed: '@media (width< 600px) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 15,
		},
		{
			code: '@mEdIa (width<600px) {}',
			fixed: '@mEdIa (width< 600px) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 15,
		},
		{
			code: '@MEDIA (width<600px) {}',
			fixed: '@MEDIA (width< 600px) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 15,
		},
		{
			code: '@media (width<=  600px) {}',
			fixed: '@media (width<= 600px) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 16,
		},
		{
			code: '@media (width=\t600px) {}',
			fixed: '@media (width= 600px) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 15,
		},
		{
			code: '@media (width>\n600px) {}',
			fixed: '@media (width> 600px) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 15,
		},
		{
			code: '@media (width>\r\n600px) {}',
			fixed: '@media (width> 600px) {}',
			description: 'CRLF',
			message: messages.expectedAfter(),
			line: 1,
			column: 15,
		},
		{
			code: '@media (width>=600px) and (width< 3em) {}',
			fixed: '@media (width>= 600px) and (width< 3em) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 16,
		},
		{
			code: '@media (width> 600px) and (width=3em) {}',
			fixed: '@media (width> 600px) and (width= 3em) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 34,
		},
		{
			code: '@media (width>=600px) and (width<3em) {}',
			fixed: '@media (width>= 600px) and (width< 3em) {}',
			warnings: [
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 16,
				},
				{
					message: messages.expectedAfter(),
					line: 1,
					column: 34,
				},
			],
		},
		{
			code: '@media (width</**/600px) {}',
			fixed: '@media (width< /**/600px) {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 15,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: '@media (width =600px) {}',
		},
		{
			code: '@mEdIa (width =600px) {}',
		},
		{
			code: '@MEDIA (width =600px) {}',
		},
		{
			code: '@media (width>600px) {}',
		},
		{
			code: '@media (width >=600px) and (width <=3em) {}',
		},
		{
			code: '@media /*(width >= 600px) and*/ (width<=3em) {}',
		},
		{
			code: '@media (width>=600px) /*and (width < 3em)*/ {}',
		},
		{
			code: '@media (width>=/* > */ 600px) {}',
		},
	],

	reject: [
		{
			code: '@media (width < 600px) {}',
			fixed: '@media (width <600px) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 16,
		},
		{
			code: '@mEdIa (width < 600px) {}',
			fixed: '@mEdIa (width <600px) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 16,
		},
		{
			code: '@MEDIA (width < 600px) {}',
			fixed: '@MEDIA (width <600px) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 16,
		},
		{
			code: '@media (width <=  600px) {}',
			fixed: '@media (width <=600px) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 17,
		},
		{
			code: '@media (width =\t600px) {}',
			fixed: '@media (width =600px) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 16,
		},
		{
			code: '@media (width >\n600px) {}',
			fixed: '@media (width >600px) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 16,
		},
		{
			code: '@media (width >\r\n600px) {}',
			fixed: '@media (width >600px) {}',
			description: 'CRLF',
			message: messages.rejectedAfter(),
			line: 1,
			column: 16,
		},
		{
			code: '@media (width >= 600px) and (width <3em) {}',
			fixed: '@media (width >=600px) and (width <3em) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 17,
		},
		{
			code: '@media (width >600px) and (width = 3em) {}',
			fixed: '@media (width >600px) and (width =3em) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 35,
		},
		{
			code: '@media (width >= 600px) and (width < 3em) {}',
			fixed: '@media (width >=600px) and (width <3em) {}',
			warnings: [
				{
					message: messages.rejectedAfter(),
					line: 1,
					column: 17,
				},
				{
					message: messages.rejectedAfter(),
					line: 1,
					column: 37,
				},
			],
		},
		{
			code: '@media (width = /**/ 600px) {}',
			fixed: '@media (width =/**/ 600px) {}',
			message: messages.rejectedAfter(),
			line: 1,
			column: 16,
		},
	],
});
