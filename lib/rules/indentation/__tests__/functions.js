'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [2],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: '.foo {\n' + '  color: rgb(0, 0, 0);\n' + '}',
		},
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'    0,\n' +
				'    0,\n' +
				'    0\n' +
				'  );\n' +
				'  top: 0;\n' +
				'}',
		},
		{
			code: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + ');',
			description: 'sass-list',
		},
		{
			code:
				'$colors: (\n' +
				'  primary: (\n' +
				'    base: $route;\n' +
				'    contrast: $white\n' +
				'  )\n' +
				');',
			description: 'nested Sass map',
		},
		{
			code:
				'background:\n' +
				'  linear-gradient(\n' +
				'    to bottom,\n' +
				'    transparentize($gray-dark, 1) 0%,\n' +
				'    transparentize($gray-dark, 0.1) 100%\n' +
				'  );',
			description: 'nested parenthetical inside multiline value',
		},
		{
			code: '.foo {\r\n' + '  color: rgb(0, 0, 0);\r\n' + '}',
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'    0,\r\n' +
				'    0,\r\n' +
				'    0\r\n' +
				'  );\r\n' +
				'  top: 0;\r\n' +
				'}',
		},
		{
			code: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + ');',
			description: 'sass-list',
		},
		{
			code:
				'$colors: (\r\n' +
				'  primary: (\r\n' +
				'    base: $route;\r\n' +
				'    contrast: $white\r\n' +
				'  )\r\n' +
				');',
			description: 'nested Sass map',
		},
		{
			code:
				'background:\r\n' +
				'  linear-gradient(\r\n' +
				'    to bottom,\r\n' +
				'    transparentize($gray-dark, 1) 0%,\r\n' +
				'    transparentize($gray-dark, 0.1) 100%\r\n' +
				'  );',
			description: 'nested parenthetical inside multiline value',
		},
	],

	reject: [
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'    0,\n' +
				'0,\n' +
				'    0\n' +
				'  );\n' +
				'  top: 0;\n' +
				'}',
			fixed:
				'.foo {\n' +
				'  color: rgb(\n' +
				'    0,\n' +
				'    0,\n' +
				'    0\n' +
				'  );\n' +
				'  top: 0;\n' +
				'}',
			message: messages.expected('4 spaces'),
			line: 4,
			column: 1,
		},
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'    0,\n' +
				'    0,\n' +
				'    0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
			fixed:
				'.foo {\n' +
				'  color: rgb(\n' +
				'    0,\n' +
				'    0,\n' +
				'    0\n' +
				'  );\n' +
				'  top: 0;\n' +
				'}',
			message: messages.expected('2 spaces'),
			line: 6,
			column: 5,
		},
		{
			code: '$some-list: (\n' + '  0,\n' + '  0,\n' + ' 0\n' + ');',
			fixed: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + ');',
			description: 'sass-list',
			message: messages.expected('2 spaces'),
			line: 4,
			column: 2,
		},
		{
			code: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + '  );',
			fixed: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + ');',
			description: 'sass-list',
			message: messages.expected('0 spaces'),
			line: 5,
			column: 3,
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'    0,\r\n' +
				'0,\r\n' +
				'    0\r\n' +
				'  );\r\n' +
				'  top: 0;\r\n' +
				'}',
			fixed:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'    0,\r\n' +
				'    0,\r\n' +
				'    0\r\n' +
				'  );\r\n' +
				'  top: 0;\r\n' +
				'}',
			message: messages.expected('4 spaces'),
			line: 4,
			column: 1,
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'    0,\r\n' +
				'    0,\r\n' +
				'    0\r\n' +
				'    );\r\n' +
				'  top: 0;\r\n' +
				'}',
			fixed:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'    0,\r\n' +
				'    0,\r\n' +
				'    0\r\n' +
				'  );\r\n' +
				'  top: 0;\r\n' +
				'}',
			message: messages.expected('2 spaces'),
			line: 6,
			column: 5,
		},
		{
			code: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + ' 0\r\n' + ');',
			fixed: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + ');',
			description: 'sass-list',
			message: messages.expected('2 spaces'),
			line: 4,
			column: 2,
		},
		{
			code: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + '  );',
			fixed: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + ');',
			description: 'sass-list',
			message: messages.expected('0 spaces'),
			line: 5,
			column: 3,
		},
		{
			code:
				'background:\n' +
				'linear-gradient(\n' +
				'    to bottom,\n' +
				'    transparentize($gray-dark, 1) 0%,\n' +
				'    transparentize($gray-dark, 0.1) 100%\n' +
				'  );',
			fixed:
				'background:\n' +
				'  linear-gradient(\n' +
				'    to bottom,\n' +
				'    transparentize($gray-dark, 1) 0%,\n' +
				'    transparentize($gray-dark, 0.1) 100%\n' +
				'  );',

			message: messages.expected('2 spaces'),
			line: 2,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [2, { ignore: ['inside-parens'] }],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: '.foo {\n' + '  color: rgb(\n' + '    0,\n' + '    0,\n' + '    0\n' + '  );\n' + '}',
		},
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'    );\n' +
				'}',
		},
		{
			code: '.foo {\n' + '  color: rgb(\n' + '0,\n' + '0,\n' + '0\n' + '    );\n' + '}',
		},
		{
			code:
				'.foo {\n' +
				'  color: bar(\n' +
				'    rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'    )\n' +
				'  );\n' +
				'}',
		},
		{
			code:
				'.foo {\n' +
				'  color: bar(\n' +
				'      rgb(\n' +
				'        0,\n' +
				'        0,\n' +
				'        0\n' +
				'      )\n' +
				'    );\n' +
				'}',
		},
		{
			code:
				'$tooltip-default-settings: (\n' +
				'    tooltip-gutter: 8px 10px,\n' +
				'  tooltip-border: 1px solid,\n' +
				');',
			description: 'Sass maps ignored',
		},
	],
});

testRule({
	ruleName,
	config: ['tab', { indentClosingBrace: false }],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: '$some-list: (\n' + '\tvar: value,\n' + '\tvar: value,\n' + '\tvar: value\n' + ');',
			description: 'tabbed sass-list with property value pairs',
		},
	],

	reject: [
		{
			code: '$some-list: (\n' + '\tvar: value,\n' + '\tvar: value,\n' + '\t\tvar: value\n' + ');',
			fixed: '$some-list: (\n' + '\tvar: value,\n' + '\tvar: value,\n' + '\tvar: value\n' + ');',
			description: 'tabbed sass-list with property value pairs',
			message: messages.expected('1 tab'),
			line: 4,
			column: 3,
		},
	],
});

testRule({
	ruleName,
	config: [2, { indentInsideParens: 'twice' }],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
		},
		{
			code: '$some-list: (\n' + '    0,\n' + '    0,\n' + '    0\n' + '  );',
			description: 'sass-list',
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'      0,\r\n' +
				'      0\r\n' +
				'    );\r\n' +
				'  top: 0;\r\n' +
				'}',
		},
		{
			code: '$some-list: (\r\n' + '    0,\r\n' + '    0,\r\n' + '    0\r\n' + '  );',
			description: 'sass-list',
		},
	],

	reject: [
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'    0,\n' +
				'      0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
			fixed:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
			message: messages.expected('6 spaces'),
			line: 4,
			column: 5,
		},
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'     );\n' +
				'  top: 0;\n' +
				'}',
			fixed:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
			message: messages.expected('4 spaces'),
			line: 6,
			column: 6,
		},
		{
			code: '$some-list: (\n' + '    0,\n' + '    0,\n' + '   0\n' + '  );',
			fixed: '$some-list: (\n' + '    0,\n' + '    0,\n' + '    0\n' + '  );',
			description: 'sass-list',
			message: messages.expected('4 spaces'),
			line: 4,
			column: 4,
		},
		{
			code: '$some-list: (\n' + '    0,\n' + '    0,\n' + '    0\n' + ' );',
			fixed: '$some-list: (\n' + '    0,\n' + '    0,\n' + '    0\n' + '  );',
			description: 'sass-list',
			message: messages.expected('2 spaces'),
			line: 5,
			column: 2,
		},
		{
			code: '$some-list: (\r\n' + '    0,\r\n' + '    0,\r\n' + '   0\r\n' + '  );',
			fixed: '$some-list: (\r\n' + '    0,\r\n' + '    0,\r\n' + '    0\r\n' + '  );',
			description: 'sass-list',
			message: messages.expected('4 spaces'),
			line: 4,
			column: 4,
		},
		{
			code: '$some-list: (\r\n' + '    0,\r\n' + '    0,\r\n' + '    0\r\n' + ' );',
			fixed: '$some-list: (\r\n' + '    0,\r\n' + '    0,\r\n' + '    0\r\n' + '  );',
			description: 'sass-list',
			message: messages.expected('2 spaces'),
			line: 5,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: [2, { indentInsideParens: 'once-at-root-twice-in-block' }],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
		},
		{
			code: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + ');',
			description: 'sass-list',
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'      0,\r\n' +
				'      0\r\n' +
				'    );\r\n' +
				'  top: 0;\r\n' +
				'}',
		},
		{
			code: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + ');',
			description: 'sass-list',
		},
	],

	reject: [
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'    0,\n' +
				'      0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
			fixed:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
			message: messages.expected('6 spaces'),
			line: 4,
			column: 5,
		},
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'     );\n' +
				'  top: 0;\n' +
				'}',
			fixed:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'    );\n' +
				'  top: 0;\n' +
				'}',
			message: messages.expected('4 spaces'),
			line: 6,
			column: 6,
		},
		{
			code: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + '  );',
			fixed: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + ');',
			description: 'sass-list',
			message: messages.expected('0 spaces'),
			line: 5,
			column: 3,
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'    0,\r\n' +
				'      0\r\n' +
				'    );\r\n' +
				'  top: 0;\r\n' +
				'}',
			fixed:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'      0,\r\n' +
				'      0\r\n' +
				'    );\r\n' +
				'  top: 0;\r\n' +
				'}',
			message: messages.expected('6 spaces'),
			line: 4,
			column: 5,
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'      0,\r\n' +
				'      0\r\n' +
				'     );\r\n' +
				'  top: 0;\r\n' +
				'}',
			fixed:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'      0,\r\n' +
				'      0\r\n' +
				'    );\r\n' +
				'  top: 0;\r\n' +
				'}',
			message: messages.expected('4 spaces'),
			line: 6,
			column: 6,
		},
		{
			code: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + '  );',
			fixed: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + ');',
			description: 'sass-list',
			message: messages.expected('0 spaces'),
			line: 5,
			column: 3,
		},
	],
});

testRule({
	ruleName,
	config: [
		2,
		{
			indentInsideParens: 'once-at-root-twice-in-block',
			indentClosingBrace: true,
		},
	],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'      );\n' +
				'  top: 0;\n' +
				'  }',
		},
		{
			code: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + '  );',
			description: 'sass-list',
		},
		{
			code: '$some-list: (\r\n' + '  0,\r\n' + '  0\r\n' + '  );',
			description: 'sass-list',
		},
	],

	reject: [
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'    0,\n' +
				'      0\n' +
				'      );\n' +
				'  top: 0;\n' +
				'  }',
			fixed:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'      );\n' +
				'  top: 0;\n' +
				'  }',
			message: messages.expected('6 spaces'),
			line: 4,
			column: 5,
		},
		{
			code:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'     );\n' +
				'  top: 0;\n' +
				'  }',
			fixed:
				'.foo {\n' +
				'  color: rgb(\n' +
				'      0,\n' +
				'      0,\n' +
				'      0\n' +
				'      );\n' +
				'  top: 0;\n' +
				'  }',
			message: messages.expected('6 spaces'),
			line: 6,
			column: 6,
		},
		{
			code: '$some-list: (\n' + '  0,\n' + '  0,\n' + ' 0\n' + '  );',
			fixed: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + '  );',
			description: 'sass-list',
			message: messages.expected('2 spaces'),
			line: 4,
			column: 2,
		},
		{
			code: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + ');',
			fixed: '$some-list: (\n' + '  0,\n' + '  0,\n' + '  0\n' + '  );',
			description: 'sass-list',
			message: messages.expected('2 spaces'),
			line: 5,
			column: 1,
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'    0,\r\n' +
				'      0\r\n' +
				'      );\r\n' +
				'  top: 0;\r\n' +
				'  }',
			fixed:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'      0,\r\n' +
				'      0\r\n' +
				'      );\r\n' +
				'  top: 0;\r\n' +
				'  }',
			message: messages.expected('6 spaces'),
			line: 4,
			column: 5,
		},
		{
			code:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'      0,\r\n' +
				'      0\r\n' +
				'     );\r\n' +
				'  top: 0;\r\n' +
				'  }',
			fixed:
				'.foo {\r\n' +
				'  color: rgb(\r\n' +
				'      0,\r\n' +
				'      0,\r\n' +
				'      0\r\n' +
				'      );\r\n' +
				'  top: 0;\r\n' +
				'  }',
			message: messages.expected('6 spaces'),
			line: 6,
			column: 6,
		},
		{
			code: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + ' 0\r\n' + '  );',
			fixed: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + '  );',
			description: 'sass-list',
			message: messages.expected('2 spaces'),
			line: 4,
			column: 2,
		},
		{
			code: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + ');',
			fixed: '$some-list: (\r\n' + '  0,\r\n' + '  0,\r\n' + '  0\r\n' + '  );',
			description: 'sass-list',
			message: messages.expected('2 spaces'),
			line: 5,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [2],
	syntax: 'less',
	skipBasicChecks: true,
	// fix: true,

	accept: [
		{
			code:
				'.foo {\n' + '  .mixin(\n' + '    @foo,\n' + '    @bar,\n' + '    @baz\n' + '  );\n' + '}',
			description: 'Less mixin with multi-line arguments',
		},
		{
			code:
				'.foo {\r\n' +
				'  .mixin(\r\n' +
				'    @foo,\r\n' +
				'    @bar,\r\n' +
				'    @baz\r\n' +
				'  );\r\n' +
				'}',
			description: 'Less mixin with multi-line arguments',
		},
		{
			code:
				'.foo {\r\n' +
				'  .mixin(\r\n' +
				'    {\r\n' +
				'      @baz\r\n' +
				'    }\r\n' +
				'  );\r\n' +
				'}',
			description: 'Less mixin with multi-line arguments with rule parameter',
		},
		{
			code: '.foo {\r\n' + '  .mixin(@foo, {\r\n' + '    @baz\r\n' + '  });\r\n' + '}',
			description: 'Less mixin with multi-line arguments with rule parameter 2',
		},
		{
			code: '.mixin({\r\n' + '  @foo\r\n' + '}, @bar);',
			description: 'Less mixin with multi-line arguments with rule parameter 3',
		},
	],
});
