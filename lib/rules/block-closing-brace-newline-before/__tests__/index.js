'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\n}',
		},
		{
			code: 'a { color: pink;;\n}',
		},
		{
			code: 'a { color: pink;;;\n}',
		},
		{
			code: 'a { color: pink;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\n\n}',
		},
		{
			code: 'a { color: pink;\r\n\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\n\t\t}',
		},
		{
			code: 'a { color: pink;\n} b { color: red;\n}',
		},
		{
			code: 'a { color: pink;\n}b { color: red;\n}',
		},
		{
			code: '@media print {\n  a {\n     color: pink;\n  }\n}',
			description: 'indentation after the newline before the closing braces',
		},
		{
			code: '@media print {\n\ta {\n\t\tcolor: pink;\n\t\t{\n\t\t\t&:hover;\n\t\t\t}\n\t\t}\n}',
			description:
				'3 level deep nesting with indentation after the newline before the closing braces',
		},
	],

	reject: [
		{
			code: 'a { color: pink;}',
			fixed: 'a { color: pink;\n}',
			message: messages.expectedBefore,
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink;;}',
			fixed: 'a { color: pink;;\n}',
			message: messages.expectedBefore,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; }',
			fixed: 'a { color: pink;\n }',
			message: messages.expectedBefore,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; \n}',
			fixed: 'a { color: pink;\n}',
			message: messages.expectedBefore,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink; \r\n}',
			fixed: 'a { color: pink;\r\n}',
			description: 'CRLF',
			message: messages.expectedBefore,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink;  }',
			fixed: 'a { color: pink;\n  }',
			message: messages.expectedBefore,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink;\t}',
			fixed: 'a { color: pink;\n\t}',
			message: messages.expectedBefore,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;\n} b { color: red; }',
			fixed: 'a { color: pink;\n} b { color: red;\n }',
			message: messages.expectedBefore,
			line: 2,
			column: 18,
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\ntop: 0;\n}',
		},
		{
			code: 'a { color: pink;\r\ntop: 0;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;;\ntop: 0;;\n}',
		},
		{
			code: 'a { color: pink;;\r\ntop: 0;;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;;;\ntop: 0;;;\n}',
		},
		{
			code: 'a { color: pink;;;\r\ntop: 0;;;\r\n}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0;\n\t\t}',
		},
		{
			code: 'a { color: pink;\r\ntop: 0;\r\n\t\t}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0;\n} b { color: red;\n}',
		},
		{
			code: 'a { color: pink;\ntop: 0;\n}b { color: red;\n}',
		},
		{
			code: 'a { color: pink;}',
		},
		{
			code: 'a { color: pink;;}',
		},
		{
			code: 'a { color: pink;;;}',
		},
		{
			code: 'a { color: pink;} b { color: red;}',
		},
		{
			code: 'a { color: pink;}b { color: red;}',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\ntop: 0;}',
			fixed: 'a { color: pink;\ntop: 0;\n}',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 7,
		},
		{
			code: 'a { color: pink;\r\ntop: 0;}',
			fixed: 'a { color: pink;\r\ntop: 0;\r\n}',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 7,
		},
		{
			code: 'a { color: pink;;\ntop: 0;;}',
			fixed: 'a { color: pink;;\ntop: 0;;\n}',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;;\r\ntop: 0;;}',
			fixed: 'a { color: pink;;\r\ntop: 0;;\r\n}',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;;;\ntop: 0;;;}',
			fixed: 'a { color: pink;;;\ntop: 0;;;\n}',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;;;\r\ntop: 0;;;}',
			fixed: 'a { color: pink;;;\r\ntop: 0;;;\r\n}',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;\ntop: 0; }',
			fixed: 'a { color: pink;\ntop: 0;\n }',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;\ntop: 0; \n}',
			fixed: 'a { color: pink;\ntop: 0;\n}',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;\ntop: 0;  }',
			fixed: 'a { color: pink;\ntop: 0;\n  }',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;\ntop: 0;\t}',
			fixed: 'a { color: pink;\ntop: 0;\n\t}',
			message: messages.expectedBeforeMultiLine,
			line: 2,
			column: 8,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;\ntop: 0;}',
		},
		{
			code: 'a { color: pink;\r\ntop: 0;}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;;\ntop: 0;;}',
		},
		{
			code: 'a { color: pink;;\r\ntop: 0;;}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;;;\ntop: 0;;;}',
		},
		{
			code: 'a { color: pink;;;\r\ntop: 0;;;}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0;} b { color: red;\ntop: 0;}',
		},
		{
			code: 'a { color: pink;\ntop: 0;}b { color: red;\ntop: 0;}',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink;\t}',
		},
		{
			code: 'a { color: pink;  }',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\ntop: 0; }',
			fixed: 'a { color: pink;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;\r\ntop: 0; }',
			fixed: 'a { color: pink;\r\ntop: 0;}',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;;\ntop: 0;; }',
			fixed: 'a { color: pink;;\ntop: 0;;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;;\r\ntop: 0;; }',
			fixed: 'a { color: pink;;\r\ntop: 0;;}',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;;;\ntop: 0;;; }',
			fixed: 'a { color: pink;;;\ntop: 0;;;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;;;\r\ntop: 0;;; }',
			fixed: 'a { color: pink;;;\r\ntop: 0;;;}',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;\ntop: 0;\n}',
			fixed: 'a { color: pink;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;\ntop: 0;  }',
			fixed: 'a { color: pink;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;\ntop: 0;\t}',
			fixed: 'a { color: pink;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;\ntop: 0;} b { color: red;\ntop: 0;\n}',
			fixed: 'a { color: pink;\ntop: 0;} b { color: red;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine,
			line: 3,
			column: 8,
		},
		{
			code: 'a { color: pink;;;\ntop: 0; ;;}',
			fixed: 'a { color: pink;;;\ntop: 0;;;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;;;\ntop: 0;; ;}',
			fixed: 'a { color: pink;;;\ntop: 0;;;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 10,
		},
		{
			code: 'a { color: pink;;;\ntop: 0; ; ; }',
			fixed: 'a { color: pink;;;\ntop: 0;;;}',
			message: messages.rejectedBeforeMultiLine,
			line: 2,
			column: 12,
		},
	],
});
