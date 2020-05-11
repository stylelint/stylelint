'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; } b { color: red; }',
		},
		{
			code: 'a { color: pink; }b { color: red; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink;}',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: pink;  }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink;\n}',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;\r\n}',
			fixed: 'a { color: pink; }',
			description: 'CRLF',
			message: messages.expectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;\t}',
			fixed: 'a { color: pink; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; } b { color: red;}',
			fixed: 'a { color: pink; } b { color: red; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 34,
		},
		{
			code: 'a { color: pink;} b { color: red;}',
			fixed: 'a { color: pink; } b { color: red; }',
			warnings: [
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 16,
				},
				{
					message: messages.expectedBefore(),
					line: 1,
					column: 33,
				},
			],
		},
		{
			code: 'a { color: pink;/*comment*/}',
			fixed: 'a { color: pink;/*comment*/ }',
			message: messages.expectedBefore(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { color: pink;;;}',
			fixed: 'a { color: pink;;; }',
			message: messages.expectedBefore(),
			line: 1,
			column: 18,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;}',
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
			code: 'a { color: pink; }',
			fixed: 'a { color: pink;}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;  }',
			fixed: 'a { color: pink;}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink;\n}',
			fixed: 'a { color: pink;}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;\r\n}',
			fixed: 'a { color: pink;}',
			description: 'CRLF',
			message: messages.rejectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;\t}',
			fixed: 'a { color: pink;}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;} b { color: red; }',
			fixed: 'a { color: pink;} b { color: red;}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 34,
		},
		{
			code: 'a { color: pink; } b { color: red; }',
			fixed: 'a { color: pink;} b { color: red;}',
			warnings: [
				{
					message: messages.rejectedBefore(),
					line: 1,
					column: 17,
				},
				{
					message: messages.rejectedBefore(),
					line: 1,
					column: 35,
				},
			],
		},
		{
			code: 'a { color: pink; /*comment*/ }',
			fixed: 'a { color: pink; /*comment*/}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 29,
		},
		{
			code: 'a { color: pink ; ; ; }',
			fixed: 'a { color: pink ; ; ;}',
			message: messages.rejectedBefore(),
			line: 1,
			column: 22,
		},
	],
});

testRule({
	ruleName,
	config: ['always-single-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; } b { color: red; }',
		},
		{
			code: 'a { color: pink; }b { color: red; }',
		},
		{
			code: 'a,\nb { color: pink; } c { color: red; }',
			description: 'multi-line rule, single-line block',
		},
		{
			code: 'a { color: pink;\ntop: 0;}',
		},
		{
			code: 'a { color: pink;\n\ntop: 0;}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0;  } b { color: red; }',
		},
		{
			code: 'a { color: pink;\ntop: 0;\n}b { color: red; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink;}',
			fixed: 'a { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 16,
		},
		{
			code: 'a,\nb { color: pink;}',
			fixed: 'a,\nb { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 2,
			column: 16,
		},
		{
			code: 'a,\r\nb { color: pink;}',
			fixed: 'a,\r\nb { color: pink; }',
			description: 'CRLF',
			message: messages.expectedBeforeSingleLine(),
			line: 2,
			column: 16,
		},
		{
			code: 'a { color: pink;  }',
			fixed: 'a { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink;\t}',
			fixed: 'a { color: pink; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; } b { color: red;}',
			fixed: 'a { color: pink; } b { color: red; }',
			message: messages.expectedBeforeSingleLine(),
			line: 1,
			column: 34,
		},
	],
});

testRule({
	ruleName,
	config: ['never-single-line'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink;}',
		},
		{
			code: 'a { color: pink;} b { color: red;}',
		},
		{
			code: 'a { color: pink;}b { color: red;}',
		},
		{
			code: 'a,\nb { color: pink;} b { color: red;}',
			description: 'multi-line rule, single-line block',
		},
		{
			code: 'a { color: pink;\ntop: 0; }',
		},
		{
			code: 'a { color: pink;\r\ntop: 0; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0;  } b { color: red;}',
		},
		{
			code: 'a { color: pink;\ntop: 0;\n}b { color: red;}',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a { color: pink;}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 17,
		},
		{
			code: 'a,\nb { color: pink; }',
			fixed: 'a,\nb { color: pink;}',
			message: messages.rejectedBeforeSingleLine(),
			line: 2,
			column: 17,
		},
		{
			code: 'a,\r\nb { color: pink; }',
			fixed: 'a,\r\nb { color: pink;}',
			description: 'CRLF',
			message: messages.rejectedBeforeSingleLine(),
			line: 2,
			column: 17,
		},
		{
			code: 'a { color: pink;  }',
			fixed: 'a { color: pink;}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink;\t}',
			fixed: 'a { color: pink;}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink;} b { color: red;\t}',
			fixed: 'a { color: pink;} b { color: red;}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
			column: 34,
		},
		{
			code: 'a { color: pink;  } b { color: red;}',
			fixed: 'a { color: pink;} b { color: red;}',
			message: messages.rejectedBeforeSingleLine(),
			line: 1,
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
			code: 'a { color: pink;\ntop: 0; }',
		},
		{
			code: 'a { color: pink;\ntop: 0; } b { color: red; }',
		},
		{
			code: 'a { color: pink;\ntop: 0; }b { color: red; }',
		},
		{
			code: 'a { color: pink;\r\ntop: 0; }b { color: red; }',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;}',
		},
		{
			code: 'a { color: pink;  } b { color: red; }',
		},
		{
			code: 'a { color: pink;\t}b { color: red; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\ntop: 0;}',
			fixed: 'a { color: pink;\ntop: 0; }',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 7,
		},
		{
			code: 'a { color: pink;\ntop: 0;  }',
			fixed: 'a { color: pink;\ntop: 0; }',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;\ntop: 0;\t}',
			fixed: 'a { color: pink;\ntop: 0; }',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink; } b { color: red;\ntop: 0;}',
			fixed: 'a { color: pink; } b { color: red;\ntop: 0; }',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 7,
		},
		{
			code: 'a { color: pink;\ntop: 0;} b { color: red; }',
			fixed: 'a { color: pink;\ntop: 0; } b { color: red; }',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 7,
		},
		{
			code: 'a { color: pink;\r\ntop: 0;} b { color: red; }',
			fixed: 'a { color: pink;\r\ntop: 0; } b { color: red; }',
			description: 'CRLF',
			message: messages.expectedBeforeMultiLine(),
			line: 2,
			column: 7,
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
			code: 'a { color: pink;\ntop: 0;} b { color: red;}',
		},
		{
			code: 'a { color: pink;\r\ntop: 0;} b { color: red;}',
			description: 'CRLF',
		},
		{
			code: 'a { color: pink;\ntop: 0;}b { color: red;}',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink;  } b { color: red; }',
		},
		{
			code: 'a { color: pink;\t}b { color: red; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink;\ntop: 0; }',
			fixed: 'a { color: pink;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;\ntop: 0;  }',
			fixed: 'a { color: pink;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 9,
		},
		{
			code: 'a { color: pink;\ntop: 0;\t}',
			fixed: 'a { color: pink;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;\r\ntop: 0;\t}',
			fixed: 'a { color: pink;\r\ntop: 0;}',
			description: 'CRLF',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink; } b { color: red;\ntop: 0; }',
			fixed: 'a { color: pink; } b { color: red;\ntop: 0;}',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 8,
		},
		{
			code: 'a { color: pink;\ntop: 0; } b { color: red; }',
			fixed: 'a { color: pink;\ntop: 0;} b { color: red; }',
			message: messages.rejectedBeforeMultiLine(),
			line: 2,
			column: 8,
		},
	],
});
