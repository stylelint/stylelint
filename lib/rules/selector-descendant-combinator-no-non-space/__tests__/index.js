'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	fix: true,

	accept: [
		{
			code: '.foo.bar {}',
		},
		{
			code: '.foo .bar {}',
		},
		{
			code: '.foo>.bar {}',
		},
		{
			code: '.foo > .bar {}',
		},
		{
			code: '.foo  >  .bar {}',
		},
		{
			code: '.foo\n>\n.bar {}',
		},
		{
			code: '.foo\r\n>\r\n.bar {}',
		},
		{
			code: '.foo >>> .bar {}',
			description: 'shadow-piercing descendant combinator',
		},
		{
			code: '.foo  >>>  .bar {}',
			description: 'shadow-piercing descendant combinator',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
		{
			code: 'div > :nth-child(2n + 1) {}',
		},
		{
			code: '.foo > .bar {}',
		},
		{
			code: '.foo  /*comment*/  >  .bar {}',
		},
		{
			code: '.foo >\n/*comment*/\n.bar {}',
		},
		{
			code: '.foo /*c*/ /*c*/ > /*c*/ /*c*/ .bar {}',
		},
		{
			code: `
      button,
      html [type="button"], /* 1 */
      [type="reset"],
      [type="submit"] {
        -webkit-appearance: button; /* 2 */
      }
      `,
		},
		{
			code: 'a[b=#{c}] { }',
			description: 'ignore "invalid" selector (see #3130)',
		},
		// Tests for workaround for parser incompatibility
		{
			code: '.foo >    /*comment*/    .bar {}',
		},
		{
			code: '.foo >\n/**/\n.bar {}',
		},
	],

	reject: [
		{
			code: '.foo  .bar {}',
			fixed: '.foo .bar {}',
			message: messages.rejected('  '),
			line: 1,
			column: 5,
		},
		{
			code: '.foo\t.bar {}',
			fixed: '.foo .bar {}',
			message: messages.rejected('\t'),
			line: 1,
			column: 5,
		},
		{
			code: '.foo\n.bar {}',
			fixed: '.foo .bar {}',
			message: messages.rejected('\n'),
			line: 1,
			column: 5,
		},
		{
			code: '.foo\r\n.bar {}',
			fixed: '.foo .bar {}',
			message: messages.rejected('\r\n'),
			line: 1,
			column: 5,
		},
		{
			skip: true,
			code: '.foo /*comment*/  /*comment*/ .bar > /*comment*/   .buz {}',
			fixed: '.foo /*comment*/ /*comment*/ .bar > /*comment*/   .buz {}',

			warnings: [
				{
					message: messages.rejected(' '),
					line: 1,
					column: 17,
				},
				{
					message: messages.rejected('    '),
					line: 1,
					column: 47,
				},
			],
		},
		{
			skip: true,
			code: '.foo (  ) .bar {}',
			unfixable: true, // can't fix
			description: 'illegal combinator',
			message: messages.rejected(' (  )'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'scss',

	accept: [
		{
			code: 'div > :nth-child(#{$i + ($column - 1)}) {}',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'less',

	accept: [
		{
			code: ':hover when (@variable = true) { color: red; }',
		},
		{
			code: 'a:hover when (@variable = true) { color: red; }',
		},
	],
});
