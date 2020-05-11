'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],

	accept: [
		{
			code: '@import url(x.com?a=b,c=d)',
		},
		{
			code: '@media (max-width: 600px) {}',
		},
		{
			code: '@mEdIa (max-width: 600px) {}',
		},
		{
			code: '@MEDIA (max-width: 600px) {}',
		},
		{
			code: '@media screen and (color)\n, projection and (color) {}',
		},
		{
			code: '@media screen and (color)\n\n, projection and (color) {}',
		},
		{
			code: '@media screen and (color)\r\n, projection and (color) {}',
			description: 'CRLF',
		},
		{
			code: '@media screen and (color)\r\n\r\n, projection and (color) {}',
			description: 'CRLF',
		},
		{
			code: '@media screen and (color)\n     ,  projection and (color) {}',
		},
		{
			code: '@media screen and (color)\n\t\t,\nprojection and (color) {}',
			description: 'indentation after the newline before the comma',
		},
		{
			code: '@media screen and (color)\r\n\t\t,\r\nprojection and (color) {}',
			description: 'indentation after the CRLF before the comma',
		},
		{
			code: '@media screen and (color)\n\n, projection and (color)',
		},
		{
			code: '@non-media screen and (color), projection and (color) {}',
			description: 'ignore at-rules contain media in name',
		},
		{
			code: '@media-non screen and (color), projection and (color) {}',
			description: 'ignore at-rules contain media in name',
		},
	],

	reject: [
		{
			code: '@media screen and (color), projection and (color) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 26,
		},
		{
			code: '@mEdIa screen and (color), projection and (color) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 26,
		},
		{
			code: '@MEDIA screen and (color), projection and (color) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 26,
		},
		{
			code: '@media screen and (color)  , projection and (color) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 28,
		},
		{
			code: '@media screen and (color)\t, projection and (color) {}',
			message: messages.expectedBefore(),
			line: 1,
			column: 27,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],

	accept: [
		{
			code: '@media screen and (color)\n, projection and (color) {}',
			description: 'multi-line list, single-line block',
		},
		{
			code: '@mEdIa screen and (color)\n, projection and (color) {}',
			description: 'multi-line list, single-line block',
		},
		{
			code: '@MEDIA screen and (color)\n, projection and (color) {}',
			description: 'multi-line list, single-line block',
		},
		{
			code: '@media screen and (color)\r\n, projection and (color) {}',
			description: 'multi-line list, single-line block and CRLF',
		},
		{
			code: '@media screen and (color)\n, projection and (color) {\n}',
			description: 'multi-line list, multi-line block',
		},
		{
			code: '@media screen and (color),projection and (color) {}',
			description: 'ignore single line list, single-lint block',
		},
		{
			code: '@media screen and (color),projection and (color) {\n}',
			description: 'ignore single line list, multi-line block',
		},
		{
			code: '@non-media screen and (color),projection and (color)\n, print {}',
			description: 'ignore at-rules contain media in name',
		},
		{
			code: '@media-non screen and (color),projection and (color)\n, print {}',
			description: 'ignore at-rules contain media in name',
		},
	],

	reject: [
		{
			code: '@media screen and (color),projection and (color)\n, print {}',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 26,
		},
		{
			code: '@mEdIa screen and (color),projection and (color)\n, print {}',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 26,
		},
		{
			code: '@MEDIA screen and (color),projection and (color)\n, print {}',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 26,
		},
		{
			code: '@media screen and (color),projection and (color)\r\n, print {}',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 26,
		},
		{
			code: '@media screen and (color),projection and (color)\n, print {\n}',
			message: messages.expectedBeforeMultiLine(),
			line: 1,
			column: 26,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],

	accept: [
		{
			code: '@media screen and (color),\nprojection and (color) {}',
			description: 'multi-line list, single-line block',
		},
		{
			code: '@mEdIa screen and (color),\nprojection and (color) {}',
			description: 'multi-line list, single-line block',
		},
		{
			code: '@MEDIA screen and (color),\nprojection and (color) {}',
			description: 'multi-line list, single-line block',
		},
		{
			code: '@media screen and (color),\nprojection and (color) {\n}',
			description: 'multi-line list, multi-line block',
		},
		{
			code: '@media screen and (color),\r\nprojection and (color) {\r\n}',
			description: 'multi-line list, multi-line block and CRLF',
		},
		{
			code: '@media screen and (color) ,projection and (color) {}',
			description: 'ignore single line list, single-lint block',
		},
		{
			code: '@media screen and (color) ,projection and (color) {\n}',
			description: 'ignore single line list, multi-line block',
		},
		{
			code: '@non-media screen and (color) ,projection and (color),\nprint {}',
			description: 'ignore at-rules contain media in name',
		},
		{
			code: '@media-non screen and (color) ,projection and (color),\nprint {}',
			description: 'ignore at-rules contain media in name',
		},
	],

	reject: [
		{
			code: '@media screen and (color) ,projection and (color),\nprint {}',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 27,
		},
		{
			code: '@mEdIa screen and (color) ,projection and (color),\nprint {}',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 27,
		},
		{
			code: '@MEDIA screen and (color) ,projection and (color),\nprint {}',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 27,
		},
		{
			code: '@media screen and (color) ,projection and (color),\nprint {\n}',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 27,
		},
		{
			code: '@media screen and (color) ,projection and (color),\r\nprint {\r\n}',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine(),
			line: 1,
			column: 27,
		},
	],
});
