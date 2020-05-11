'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [2],
	fix: true,

	accept: [
		{
			code: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',
		},
		{
			code: '@media\n' + '  print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',
		},
		{
			code:
				'@media print {\n' +
				'  a {\n' +
				'    color: pink;\n' +
				'  }\n' +
				'}\n' +
				'\n' +
				'@media screen {\n' +
				'  b { color: orange; }\n' +
				'}',
		},
		{
			code: '@media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',
		},
		{
			code: '@media\r\n' + '  print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',
		},
		{
			code:
				'@media print {\r\n' +
				'  a {\r\n' +
				'    color: pink;\r\n' +
				'  }\r\n' +
				'}\r\n' +
				'\r\n' +
				'@media screen {\r\n' +
				'  b { color: orange; }\r\n' +
				'}',
		},
	],

	reject: [
		{
			code: '\n' + '  @media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',
			fixed: '\n' + '@media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',

			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
		{
			code: '@media print {\n' + 'a {\n' + '    color: pink;\n' + '  }\n' + '}',
			fixed: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
		{
			code: '@media print {\n' + '  a {\n' + '  color: pink;\n' + '  }\n' + '}',
			fixed: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',

			message: messages.expected('4 spaces'),
			line: 3,
			column: 3,
		},
		{
			code: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '}\n' + '}',
			fixed: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',

			message: messages.expected('2 spaces'),
			line: 4,
			column: 1,
		},
		{
			code: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '\t}',
			fixed: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',

			message: messages.expected('0 spaces'),
			line: 5,
			column: 2,
		},
		{
			code:
				'\r\n' + '  @media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',
			fixed: '\r\n' + '@media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',

			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
		{
			code: '@media print {\r\n' + 'a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',
			fixed: '@media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
		{
			code: '@media print {\r\n' + '  a {\r\n' + '  color: pink;\r\n' + '  }\r\n' + '}',
			fixed: '@media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',

			message: messages.expected('4 spaces'),
			line: 3,
			column: 3,
		},
		{
			code: '@media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '}\r\n' + '}',
			fixed: '@media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 4,
			column: 1,
		},
		{
			code: '@media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '\t}',
			fixed: '@media print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',

			message: messages.expected('0 spaces'),
			line: 5,
			column: 2,
		},
		{
			code: '@media\n' + ' print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',
			fixed: '@media\n' + '  print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',
			description: 'at-rule parameters on the next line',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 2,
		},
		{
			code: '@media\r\n' + ' print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',
			fixed:
				'@media\r\n' + '  print {\r\n' + '  a {\r\n' + '    color: pink;\r\n' + '  }\r\n' + '}',
			description: 'at-rule parameters on the next line (CRLF)',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['tab', { except: ['block'] }],
	fix: true,

	accept: [
		{
			code: '@media print {\n' + '\n' + 'a {\n' + '\tcolor: pink;\n' + '}\n' + '\n' + '}',
		},
		{
			code:
				'@media print,\n' +
				'\t(-webkit-min-device-pixel-ratio: 1.25),\n' +
				'\t(min-resolution: 120dpi) {}',
		},
	],

	reject: [
		{
			code: '@media print {\n' + '\n' + '\ta {\n' + '\tcolor: pink;\n' + '}\n' + '\n' + '}',
			fixed: '@media print {\n' + '\n' + 'a {\n' + '\tcolor: pink;\n' + '}\n' + '\n' + '}',

			message: messages.expected('0 tabs'),
			line: 3,
			column: 2,
		},
		{
			code: '@media print {\n' + '\n' + 'a {\n' + 'color: pink;\n' + '}\n' + '\n' + '}',
			fixed: '@media print {\n' + '\n' + 'a {\n' + '\tcolor: pink;\n' + '}\n' + '\n' + '}',

			message: messages.expected('1 tab'),
			line: 4,
			column: 1,
		},
		{
			code:
				'@media print,\n' +
				'  (-webkit-min-device-pixel-ratio: 1.25),\n' +
				'\t(min-resolution: 120dpi) {}',
			fixed:
				'@media print,\n' +
				'\t(-webkit-min-device-pixel-ratio: 1.25),\n' +
				'\t(min-resolution: 120dpi) {}',

			description: 'multi-line at-rule params',
			message: messages.expected('1 tab'),
			line: 2,
			column: 3,
		},
		{
			code:
				'@media print,\r\n' +
				'  (-webkit-min-device-pixel-ratio: 1.25),\r\n' +
				'\t(min-resolution: 120dpi) {}',
			fixed:
				'@media print,\r\n' +
				'\t(-webkit-min-device-pixel-ratio: 1.25),\r\n' +
				'\t(min-resolution: 120dpi) {}',

			description: 'multi-line at-rule params (CRLF)',
			message: messages.expected('1 tab'),
			line: 2,
			column: 3,
		},
	],
});

testRule({
	ruleName,
	config: [4, { except: ['param'] }],
	fix: true,

	accept: [
		{
			code:
				'@media print,\n' +
				'(-webkit-min-device-pixel-ratio: 1.25),\n' +
				'(min-resolution: 120dpi) {}',
		},
	],

	reject: [
		{
			code:
				'@media print,\n' +
				'  (-webkit-min-device-pixel-ratio: 1.25),\n' +
				'(min-resolution: 120dpi) {}',
			fixed:
				'@media print,\n' +
				'(-webkit-min-device-pixel-ratio: 1.25),\n' +
				'(min-resolution: 120dpi) {}',

			description: 'multi-line at-rule params, no params indent',
			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
		{
			code:
				'@media print,\r\n' +
				'  (-webkit-min-device-pixel-ratio: 1.25),\r\n' +
				'(min-resolution: 120dpi) {}',
			fixed:
				'@media print,\r\n' +
				'(-webkit-min-device-pixel-ratio: 1.25),\r\n' +
				'(min-resolution: 120dpi) {}',

			description: 'multi-line at-rule params, no params indent (CRLF)',
			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
	],
});

testRule({
	ruleName,
	config: [2, { ignore: ['param'] }],
	fix: true,

	accept: [
		{
			code:
				'@media print,\n' +
				'(-webkit-min-device-pixel-ratio: 1.25),\n' +
				'(min-resolution: 120dpi) {}',
		},
		{
			code:
				'@media print,\n' +
				'  (-webkit-min-device-pixel-ratio: 1.25),\n' +
				'(min-resolution: 120dpi) {}',
		},
	],

	reject: [
		{
			code: '\n' + '  @media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',
			fixed: '\n' + '@media print {\n' + '  a {\n' + '    color: pink;\n' + '  }\n' + '}',

			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
	],
});

testRule({
	ruleName,
	config: [
		2,
		{
			indentClosingBrace: true,
		},
	],
	fix: true,

	accept: [
		{
			code: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '    }\n' + '  }',
		},
		{
			code:
				'@media print {\n' +
				'  a {\n' +
				'    color: pink;\n' +
				'    }\n' +
				'  }\n' +
				'\n' +
				'@media screen {\n' +
				'  b { color: orange; }\n' +
				'  }',
		},
	],

	reject: [
		{
			code: '\n' + '@media print {\n' + '  a {\n' + '    color: pink;\n' + '    }\n' + ' }',
			fixed: '\n' + '@media print {\n' + '  a {\n' + '    color: pink;\n' + '    }\n' + '  }',

			message: messages.expected('2 spaces'),
			line: 6,
			column: 2,
		},
		{
			code: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '   }\n' + '  }',
			fixed: '@media print {\n' + '  a {\n' + '    color: pink;\n' + '    }\n' + '  }',

			message: messages.expected('4 spaces'),
			line: 4,
			column: 4,
		},
	],
});
