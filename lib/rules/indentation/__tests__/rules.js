'use strict';

const stripIndent = require('common-tags').stripIndent;
const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [2],
	fix: true,

	accept: [
		{
			code: '/* anything\n' + '    goes\n' + '\t\t\twithin a comment */\n',
		},
		{
			code: 'a { top: 0; } b { top: 1px; }',
		},
		{
			code: 'a {\n' + '  top: 0;\n' + '}\n' + 'b { top: 1px; bottom: 4px; }',
		},
		{
			code: 'a {\n' + '  top: 0;\n' + '} b { top: 1px; }',
		},
		{
			code: 'a {\n' + '  color: pink;\n' + '}',
		},
		{
			code: 'a { color: pink;\n' + '}',
		},
		{
			code: 'a {\n' + '  color: pink;\n' + '} b { top: 0; }',
		},
		{
			code: 'a { color: pink;\n' + '  top: 0; background: orange;\n' + '}',
		},
		{
			code:
				'a {\n' + '  color: pink;\n' + '}\n' + '\n' + '\n' + 'b {\n' + '  color: orange\n' + '}',
		},
		{
			code: 'a {\n' + '  color: pink;}',
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'    top right,\n' +
				'    bottom left;\n' +
				'  color: pink;\n' +
				'}',
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'    top right,\n' +
				'    bottom left\n' +
				'  ;\n' +
				'}',
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'    top right,\n' +
				'\n' +
				'    bottom left\n' +
				'  ;\n' +
				'}',

			description: 'weird empty line',
		},
		{
			code: 'a {\n' + '  *top: 1px;\n' + '}',
		},
		{
			code: 'a {\n' + '  _top: 1px;\n' + '}',
		},
		{
			code: '* { top: 0; }',
		},
		{
			code: '@media print {\n' + '  * { color: pink; }\n' + '}',
		},
		{
			code: 'a {\n' + '  @media print { color: pink; }\n' + '}',
		},
		{
			code: '/* anything\r\n' + '    goes\r\n' + '\t\t\twithin a comment */\r\n',
		},
		{
			code: 'a {\r\n' + '  top: 0;\r\n' + '}\r\n' + 'b { top: 1px; bottom: 4px; }',
		},
		{
			code: 'a {\r\n' + '  top: 0;\r\n' + '} b { top: 1px; }',
		},
		{
			code: 'a {\r\n' + '  color: pink;\r\n' + '}',
		},
		{
			code: 'a { color: pink;\r\n' + '}',
		},
		{
			code: 'a {\r\n' + '  color: pink;\r\n' + '} b { top: 0; }',
		},
		{
			code: 'a { color: pink;\r\n' + '  top: 0; background: orange;\r\n' + '}',
		},
		{
			code:
				'a {\r\n' +
				'  color: pink;\r\n' +
				'}\r\n' +
				'\r\n' +
				'\r\n' +
				'b {\r\n' +
				'  color: orange\r\n' +
				'}',
		},
		{
			code: 'a {\r\n' + '  color: pink;}',
		},
		{
			code:
				'a {\r\n' +
				'  background-position: top left,\r\n' +
				'    top right,\r\n' +
				'    bottom left;\r\n' +
				'  color: pink;\r\n' +
				'}',
		},
		{
			code:
				'a {\r\n' +
				'  background-position: top left,\r\n' +
				'    top right,\r\n' +
				'    bottom left\r\n' +
				'  ;\r\n' +
				'}',
		},
		{
			code:
				'a {\r\n' +
				'  background-position: top left,\r\n' +
				'    top right,\r\n' +
				'\r\n' +
				'    bottom left\r\n' +
				'  ;\r\n' +
				'}',

			description: 'weird empty line',
		},
		{
			code: 'a {\r\n' + '  *top: 1px;\r\n' + '}',
		},
		{
			code: 'a {\r\n' + '  _top: 1px;\r\n' + '}',
		},
		{
			code: '* { top: 0; }',
		},
		{
			code: '@media print {\r\n' + '  * { color: pink; }\r\n' + '}',
		},
		{
			code: '.a[disabled],\n' + '.b {\n' + '  color: pink;\n' + '}',
		},
		{
			code: stripIndent`
			:not(.enabled
			) {
			  color: pink;
			}
			`,
		},
	],

	reject: [
		{
			code: '\ta {\n' + '  color: pink;\n' + '}',
			fixed: 'a {\n' + '  color: pink;\n' + '}',

			message: messages.expected('0 spaces'),
			line: 1,
			column: 2,
		},
		{
			code: 'a {\n' + '  color: pink;\n' + '  }',
			fixed: 'a {\n' + '  color: pink;\n' + '}',

			message: messages.expected('0 spaces'),
			line: 3,
			column: 3,
		},
		{
			code: 'a,\n' + 'b {\n' + '  color: pink;\n' + '  }',
			fixed: 'a,\n' + 'b {\n' + '  color: pink;\n' + '}',

			message: messages.expected('0 spaces'),
			line: 4,
			column: 3,
		},
		{
			code: 'a { color: pink;\n' + '  }',
			fixed: 'a { color: pink;\n' + '}',

			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
		{
			code: 'a {\n' + '  color: pink\n' + '}\n' + ' b {\n' + '  color: orange\n' + '}',
			fixed: 'a {\n' + '  color: pink\n' + '}\n' + 'b {\n' + '  color: orange\n' + '}',

			message: messages.expected('0 spaces'),
			line: 4,
			column: 2,
		},
		{
			code: 'a {\n' + '  color: pink\n' + '}\n' + 'b {\n' + '  color: orange\n' + ' }',
			fixed: 'a {\n' + '  color: pink\n' + '}\n' + 'b {\n' + '  color: orange\n' + '}',

			message: messages.expected('0 spaces'),
			line: 6,
			column: 2,
		},
		{
			code: 'a {\n' + 'color: pink;\n' + '}',
			fixed: 'a {\n' + '  color: pink;\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
		{
			code: 'a {\n' + '\tcolor: pink;\n' + '}',
			fixed: 'a {\n' + '  color: pink;\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 2,
		},
		{
			code: 'a {\n' + '  color: pink;\n' + ' background: orange;\n' + '}',
			fixed: 'a {\n' + '  color: pink;\n' + '  background: orange;\n' + '}',

			message: messages.expected('2 spaces'),
			line: 3,
			column: 2,
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'  top right,\n' +
				'    bottom left;\n' +
				'  color: pink;\n' +
				'}',
			fixed:
				'a {\n' +
				'  background-position: top left,\n' +
				'    top right,\n' +
				'    bottom left;\n' +
				'  color: pink;\n' +
				'}',

			message: messages.expected('4 spaces'),
			line: 3,
			column: 3,
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'    top right,\n' +
				'  bottom left;\n' +
				'  color: pink;\n' +
				'}',
			fixed:
				'a {\n' +
				'  background-position: top left,\n' +
				'    top right,\n' +
				'    bottom left;\n' +
				'  color: pink;\n' +
				'}',

			message: messages.expected('4 spaces'),
			line: 4,
			column: 3,
		},
		{
			code: '@media print {\n' + '   * { color: pink; }\n' + '}',
			fixed: '@media print {\n' + '  * { color: pink; }\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 4,
		},
		{
			code: 'a {\n' + ' @media print { color: pink; }\n' + '}',
			fixed: 'a {\n' + '  @media print { color: pink; }\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 2,
		},
		{
			code: '\ta {\r\n' + '  color: pink;\r\n' + '}',
			fixed: 'a {\r\n' + '  color: pink;\r\n' + '}',

			message: messages.expected('0 spaces'),
			line: 1,
			column: 2,
		},
		{
			code: 'a {\r\n' + '  color: pink;\r\n' + '  }',
			fixed: 'a {\r\n' + '  color: pink;\r\n' + '}',

			message: messages.expected('0 spaces'),
			line: 3,
			column: 3,
		},
		{
			code: 'a,\r\n' + 'b {\r\n' + '  color: pink;\r\n' + '  }',
			fixed: 'a,\r\n' + 'b {\r\n' + '  color: pink;\r\n' + '}',

			message: messages.expected('0 spaces'),
			line: 4,
			column: 3,
		},
		{
			code: 'a { color: pink;\r\n' + '  }',
			fixed: 'a { color: pink;\r\n' + '}',

			message: messages.expected('0 spaces'),
			line: 2,
			column: 3,
		},
		{
			code: 'a {\r\n' + '  color: pink\r\n' + '}\r\n' + ' b {\r\n' + '  color: orange\r\n' + '}',
			fixed: 'a {\r\n' + '  color: pink\r\n' + '}\r\n' + 'b {\r\n' + '  color: orange\r\n' + '}',

			message: messages.expected('0 spaces'),
			line: 4,
			column: 2,
		},
		{
			code: 'a {\r\n' + '  color: pink\r\n' + '}\r\n' + 'b {\r\n' + '  color: orange\r\n' + ' }',
			fixed: 'a {\r\n' + '  color: pink\r\n' + '}\r\n' + 'b {\r\n' + '  color: orange\r\n' + '}',

			message: messages.expected('0 spaces'),
			line: 6,
			column: 2,
		},
		{
			code: 'a {\r\n' + 'color: pink;\r\n' + '}',
			fixed: 'a {\r\n' + '  color: pink;\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
		{
			code: 'a {\r\n' + '\tcolor: pink;\r\n' + '}',
			fixed: 'a {\r\n' + '  color: pink;\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 2,
		},
		{
			code: 'a {\r\n' + '  color: pink;\r\n' + ' background: orange;\r\n' + '}',
			fixed: 'a {\r\n' + '  color: pink;\r\n' + '  background: orange;\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 3,
			column: 2,
		},
		{
			code:
				'a {\r\n' +
				'  background-position: top left,\r\n' +
				'  top right,\r\n' +
				'    bottom left;\r\n' +
				'  color: pink;\r\n' +
				'}',
			fixed:
				'a {\r\n' +
				'  background-position: top left,\r\n' +
				'    top right,\r\n' +
				'    bottom left;\r\n' +
				'  color: pink;\r\n' +
				'}',

			message: messages.expected('4 spaces'),
			line: 3,
			column: 3,
		},
		{
			code:
				'a {\r\n' +
				'  background-position: top left,\r\n' +
				'    top right,\r\n' +
				'  bottom left;\r\n' +
				'  color: pink;\r\n' +
				'}',
			fixed:
				'a {\r\n' +
				'  background-position: top left,\r\n' +
				'    top right,\r\n' +
				'    bottom left;\r\n' +
				'  color: pink;\r\n' +
				'}',

			message: messages.expected('4 spaces'),
			line: 4,
			column: 3,
		},
		{
			code: '@media print {\r\n' + '   * { color: pink; }\r\n' + '}',
			fixed: '@media print {\r\n' + '  * { color: pink; }\r\n' + '}',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 4,
		},
	],
});

testRule({
	ruleName,
	config: ['tab'],
	fix: true,

	accept: [
		{
			code: '',
		},
		{
			code: 'a {color: pink;}',
		},
		{
			code: 'a {\n' + '\tcolor: pink;\n' + '}',
		},
		{
			code: 'a {\n' + '\tcolor: pink;\n' + '}\n' + '\n' + 'b {\n' + '\tcolor: orange\n' + '}',
		},
		{
			code: 'a {\n' + '\tcolor: pink;}',
		},
	],

	reject: [
		{
			code: '\ta {\n' + '\tcolor: pink;\n' + '}',
			fixed: 'a {\n' + '\tcolor: pink;\n' + '}',

			message: messages.expected('0 tabs'),
			line: 1,
			column: 2,
		},
		{
			code: 'a {\n' + '\tcolor: pink;\n' + '  }',
			fixed: 'a {\n' + '\tcolor: pink;\n' + '}',

			message: messages.expected('0 tabs'),
			line: 3,
			column: 3,
		},
		{
			code: 'a {\n' + '\tcolor: pink\n' + '}\n' + ' b {\n' + '\tcolor: orange\n' + '}',
			fixed: 'a {\n' + '\tcolor: pink\n' + '}\n' + 'b {\n' + '\tcolor: orange\n' + '}',

			message: messages.expected('0 tabs'),
			line: 4,
			column: 2,
		},
		{
			code: 'a {\n' + '\tcolor: pink\n' + '}\n' + 'b {\n' + '\tcolor: orange\n' + ' }',
			fixed: 'a {\n' + '\tcolor: pink\n' + '}\n' + 'b {\n' + '\tcolor: orange\n' + '}',

			message: messages.expected('0 tabs'),
			line: 6,
			column: 2,
		},
		{
			code: 'a {\n' + 'color: pink;\n' + '}',
			fixed: 'a {\n' + '\tcolor: pink;\n' + '}',

			message: messages.expected('1 tab'),
			line: 2,
			column: 1,
		},
		{
			code: 'a {\n' + '  color: pink;\n' + '}',
			fixed: 'a {\n' + '\tcolor: pink;\n' + '}',

			message: messages.expected('1 tab'),
			line: 2,
			column: 3,
		},
		{
			code: 'a {\n' + '\tcolor: pink;\n' + ' background: orange;\n' + '}',
			fixed: 'a {\n' + '\tcolor: pink;\n' + '\tbackground: orange;\n' + '}',

			message: messages.expected('1 tab'),
			line: 3,
			column: 2,
		},
		{
			code: 'a { color: pink;\n' + 'top: 0; background: orange;\n' + '}',
			fixed: 'a { color: pink;\n' + '\ttop: 0; background: orange;\n' + '}',

			message: messages.expected('1 tab'),
			line: 2,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [2, { except: ['value'] }],
	fix: true,

	accept: [
		{
			code:
				'a {\n' +
				'  background-position: top left, top right, bottom left;\n' +
				'  color: pink;\n' +
				'}',
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'  top right,\n' +
				'  bottom left;\n' +
				'  color: pink;\n' +
				'}',
		},
	],

	reject: [
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'    top right,\n' +
				'  bottom left;\n' +
				'  color: pink;\n' +
				'}',
			fixed:
				'a {\n' +
				'  background-position: top left,\n' +
				'  top right,\n' +
				'  bottom left;\n' +
				'  color: pink;\n' +
				'}',

			message: messages.expected('2 spaces'),
			line: 3,
			column: 5,
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'  top right,\n' +
				'    bottom left;\n' +
				'  color: pink;\n' +
				'}',
			fixed:
				'a {\n' +
				'  background-position: top left,\n' +
				'  top right,\n' +
				'  bottom left;\n' +
				'  color: pink;\n' +
				'}',

			message: messages.expected('2 spaces'),
			line: 4,
			column: 5,
		},
	],
});

testRule({
	ruleName,
	config: [2, { ignore: ['value'] }],
	fix: true,

	accept: [
		{
			code:
				'a {\n' +
				'  background-position: top left, top right, bottom left;\n' +
				'  color: pink;\n' +
				'}',
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'  top right,\n' +
				'  bottom left;\n' +
				'  color: pink;\n' +
				'}',
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'    top right,\n' +
				'  bottom left;\n' +
				'  color: pink;\n' +
				'}',
		},
		{
			code:
				'a {\n' +
				'  background-position: top left,\n' +
				'  top right,\n' +
				'    bottom left;\n' +
				'  color: pink;\n' +
				'}',
		},
	],

	reject: [
		{
			code: '\ta {\n' + '  color: pink;\n' + '}',
			fixed: 'a {\n' + '  color: pink;\n' + '}',

			message: messages.expected('0 spaces'),
			line: 1,
			column: 2,
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
			code: 'a {\n' + '  color: pink;\n' + '  }',
		},
		{
			code: 'a {\n' + '  color: pink;\n' + '  & b {\n' + '    top: 0;\n' + '    }\n' + '  }',
		},
	],

	reject: [
		{
			code: 'a {\n' + '  color: pink;\n' + '}',
			fixed: 'a {\n' + '  color: pink;\n' + '  }',
			message: messages.expected('2 spaces'),
			line: 3,
			column: 1,
		},
		{
			code: 'a {\n' + '  color: pink;\n' + '  & b {\n' + '    top: 0;\n' + '   }\n' + '  }',
			fixed: 'a {\n' + '  color: pink;\n' + '  & b {\n' + '    top: 0;\n' + '    }\n' + '  }',
			message: messages.expected('4 spaces'),
			line: 5,
			column: 4,
		},
	],
});
