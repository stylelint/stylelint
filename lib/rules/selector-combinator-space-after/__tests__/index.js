'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a + a {}',
			description: 'space before and after + combinator',
		},
		{
			code: 'a > a {}',
			description: 'space before and after > combinator',
		},
		{
			code: 'a ~ a {}',
			description: 'space before and after ~ combinator',
		},
		{
			code: 'a >>> a {}',
			description: 'shadow-piercing descendant combinator',
		},
		{
			code: '.foo ~ a + bar {}',
			description: 'multiple spaced combinators',
		},
		{
			code: 'a+ a {}',
			description: 'no before and one after + combinator',
		},
		{
			code: 'a> a {}',
			description: 'no before and one after > combinator',
		},
		{
			code: 'a~ a {}',
			description: 'no before and one after ~ combinator',
		},
		{
			code: 'a>>> a {}',
			description: 'no before and one after >>> combinator',
		},
		{
			code: 'a\n+ a {}',
			description: 'newline before space after + combinator',
		},
		{
			code: 'a\r\n+ a {}',
			description: 'CRLF before space after + combinator',
		},
		{
			code: 'a\n> a {}',
			description: 'newline before space after > combinator',
		},
		{
			code: 'a\r\n> a {}',
			description: 'CRLF before space after > combinator',
		},
		{
			code: 'a\n~ a {}',
			description: 'newline before space after ~ combinator',
		},
		{
			code: 'a\n>>> a {}',
			description: 'newline before space after >>> combinator',
		},
		{
			code: 'a\r\n>>> a {}',
			description: 'CRLF before space after >>> combinator',
		},
		{
			code: 'a~ a+ bar {}',
			description: 'multiple combinators with no space before and one after',
		},
		{
			code: '.foo:nth-child(2n+1) {}',
			description: 'unspaced + in nth-child argument',
		},
		{
			code: '.foo:nth-child(2n-1) {}',
			description: 'unspaced - in nth-child argument',
		},
		{
			code: "a[rel~='copyright'] {}",
			description: 'attribute selector with ~=',
		},
		{
			code: '.foo\\+bar {}',
			description: 'escaped combinator-like character',
		},
		{
			code: "a [type='button'] {}",
			description: 'combinator between selectors and attribute selector',
		},
		{
			code: 'a  a {}',
			description: 'combinator selector contain multiple spaces',
		},
		{
			code: 'a\na {}',
			description: 'combinator selector contain newline',
		},
		{
			code: 'a\r\na {}',
			description: 'combinator selector contain CRLF',
		},
		{
			code: 'a\n\na {}',
			description: 'combinator selector contain multiple newline',
		},
		{
			code: 'a\r\n\r\na {}',
			description: 'combinator selector contain multiple CRLF',
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
			code: 'namespace|type#id > .foo {}',
			description: 'qualified ID with namespace',
		},
		{
			code: '.a { &.b {} }',
			description: 'nesting and no combinators',
		},
		{
			code: '.a { & .b {} }',
			description: 'nesting and no combinators',
		},
		{
			code: '.a { &:first-child {} }',
			description: 'nesting and no combinators',
		},
		{
			code: 'a[b=#{c}] { }',
			description: 'ignore "invalid" selector (see #3130)',
		},
	],

	reject: [
		{
			code: 'a+  a {}',
			fixed: 'a+ a {}',
			description: 'two spaces after + combinator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 2,
		},
		{
			code: 'a+\na {}',
			fixed: 'a+ a {}',
			description: 'newline after + combinator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 2,
		},
		{
			code: 'a+a {}',
			fixed: 'a+ a {}',
			description: 'no space after + combinator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 2,
		},
		{
			code: 'a>a {}',
			fixed: 'a> a {}',
			description: 'no space after > combinator',
			message: messages.expectedAfter('>'),
			line: 1,
			column: 2,
		},
		{
			code: 'a~a {}',
			fixed: 'a~ a {}',
			description: 'no space after ~ combinator',
			message: messages.expectedAfter('~'),
			line: 1,
			column: 2,
		},
		{
			code: 'a + .foo.bar ~a {}',
			fixed: 'a + .foo.bar ~ a {}',
			description: 'multiple combinators: no space after ~ combinator',
			message: messages.expectedAfter('~'),
			line: 1,
			column: 14,
		},
		{
			code: '#foo +.foo.bar ~ a {}',
			fixed: '#foo + .foo.bar ~ a {}',
			description: 'multiple combinators: no space after + combinator',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 6,
		},
		{
			code: 'a >>>a {}',
			fixed: 'a >>> a {}',
			description: 'shadow-piercing descendant combinator',
			message: messages.expectedAfter('>>>'),
			line: 1,
			column: 3,
		},
		{
			code: 'namespace|type#id >.foo {}',
			fixed: 'namespace|type#id > .foo {}',
			description: 'qualified ID with namespace',
			message: messages.expectedAfter('>'),
			line: 1,
			column: 19,
		},
		{
			code: 'a >a >a {}',
			fixed: 'a > a > a {}',
			warnings: [
				{
					message: messages.expectedAfter('>'),
					line: 1,
					column: 3,
				},
				{
					message: messages.expectedAfter('>'),
					line: 1,
					column: 6,
				},
			],
		},
		{
			code: '.a { &>.b {} }',
			fixed: '.a { &> .b {} }',
			description: 'nesting',
			message: messages.expectedAfter('>'),
			line: 1,
			column: 7,
		},
		{
			code: '.a { &+.b {} }',
			fixed: '.a { &+ .b {} }',
			description: 'nesting',
			message: messages.expectedAfter('+'),
			line: 1,
			column: 7,
		},
		{
			code: 'a/*comment*/>/*comment*/a {}',
			fixed: 'a/*comment*/> /*comment*/a {}',
			description: 'comment',
			message: messages.expectedAfter('>'),
			line: 1,
			column: 13,
		},
		{
			code: 'a/*comment*/>/*comment*/a, b/*comment*/>/*comment*/b {}',
			fixed: 'a/*comment*/> /*comment*/a, b/*comment*/> /*comment*/b {}',
			description: 'comment',
			warnings: [
				{
					message: messages.expectedAfter('>'),
					line: 1,
					column: 13,
				},
				{
					message: messages.expectedAfter('>'),
					line: 1,
					column: 40,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a +a {}',
			description: 'space before none after + combinator',
		},
		{
			code: 'a >a {}',
			description: 'space before none after > combinator',
		},
		{
			code: 'a ~a {}',
			description: 'space before none after ~ combinator',
		},
		{
			code: 'a >>>a {}',
			description: 'space before none after >>> combinator',
		},
		{
			code: '.foo ~a +bar {}',
			description: 'multiple combinators with no space after',
		},
		{
			code: 'a+a {}',
			description: 'no space before or after + combinator',
		},
		{
			code: 'a>a {}',
			description: 'no space before or after > combinator',
		},
		{
			code: 'a~a {}',
			description: 'no space before or after ~ combinator',
		},
		{
			code: 'a\n+a {}',
			description: 'newline before and no space after + combinator',
		},
		{
			code: 'a\r\n+a {}',
			description: 'CRLF before and no space after + combinator',
		},
		{
			code: 'a\n>a {}',
			description: 'newline before and no space after > combinator',
		},
		{
			code: 'a\n~a {}',
			description: 'newline before and no space after ~ combinator',
		},
		{
			code: 'a\r\n~a {}',
			description: 'CRLF before and no space after ~ combinator',
		},
		{
			code: 'a\n>>>a {}',
			description: 'newline before and no space after >>> combinator',
		},
		{
			code: 'a\r\n>>>a {}',
			description: 'CRLF before and no space after >>> combinator',
		},
		{
			code: '.foo:nth-child(2n + 1) {}',
			description: 'spaced + in nth-child argument',
		},
		{
			code: '.foo:nth-child(2n - 1) {}',
			description: 'spaced - in nth-child argument',
		},
		{
			code: "a[rel~='copyright'] {}",
			description: 'attribute selector with ~=',
		},
		{
			code: "a [type='button'] {}",
			description: 'combinator between selectors and attribute selector',
		},
		{
			code: 'a  a {}',
			description: 'combinator selector contain multiple spaces',
		},
		{
			code: 'a\na {}',
			description: 'combinator selector contain newline',
		},
		{
			code: 'a\r\na {}',
			description: 'combinator selector contain CRLF',
		},
		{
			code: 'a\n\na {}',
			description: 'combinator selector contain multiple newline',
		},
		{
			code: 'a\r\n\r\na {}',
			description: 'combinator selector contain multiple CRLF',
		},
		{
			code: 'namespace|type#id >.foo {}',
			description: 'qualified ID with namespace',
		},
	],

	reject: [
		{
			code: 'a+ a {}',
			fixed: 'a+a {}',
			description: 'space after + combinator',
			message: messages.rejectedAfter('+'),
			line: 1,
			column: 2,
		},
		{
			code: 'a> a {}',
			fixed: 'a>a {}',
			description: 'space after > combinator',
			message: messages.rejectedAfter('>'),
			line: 1,
			column: 2,
		},
		{
			code: 'a~ a {}',
			fixed: 'a~a {}',
			description: 'space after ~ combinator',
			message: messages.rejectedAfter('~'),
			line: 1,
			column: 2,
		},
		{
			code: 'a+\na{}',
			fixed: 'a+a{}',
			description: 'newline after + combinator',
			message: messages.rejectedAfter('+'),
			line: 1,
			column: 2,
		},
		{
			code: 'a+\r\na{}',
			fixed: 'a+a{}',
			description: 'CRLF after + combinator',
			message: messages.rejectedAfter('+'),
			line: 1,
			column: 2,
		},
		{
			code: 'a>\na{}',
			fixed: 'a>a{}',
			description: 'newline after > combinator',
			message: messages.rejectedAfter('>'),
			line: 1,
			column: 2,
		},
		{
			code: 'a>\r\na{}',
			fixed: 'a>a{}',
			description: 'newline after > combinator',
			message: messages.rejectedAfter('>'),
			line: 1,
			column: 2,
		},
		{
			code: 'a~\na{}',
			fixed: 'a~a{}',
			description: 'newline after ~ combinator',
			message: messages.rejectedAfter('~'),
			line: 1,
			column: 2,
		},
		{
			code: 'a~\r\na{}',
			fixed: 'a~a{}',
			description: 'CRLF after ~ combinator',
			message: messages.rejectedAfter('~'),
			line: 1,
			column: 2,
		},
		{
			code: 'a + .foo.bar ~a {}',
			fixed: 'a +.foo.bar ~a {}',
			description: 'multiple combinators: space after + combinator',
			message: messages.rejectedAfter('+'),
			line: 1,
			column: 3,
		},
		{
			code: '#foo +.foo.bar ~ a {}',
			fixed: '#foo +.foo.bar ~a {}',
			description: 'multiple combinators: no space after ~ combinator',
			message: messages.rejectedAfter('~'),
			line: 1,
			column: 16,
		},
		{
			code: 'a >>> a {}',
			fixed: 'a >>>a {}',
			description: 'space after >>> combinator',
			message: messages.rejectedAfter('>>>'),
			line: 1,
			column: 3,
		},
		{
			code: 'a/*comment*/ > /*comment*/a {}',
			fixed: 'a/*comment*/ >/*comment*/a {}',
			description: 'comment',
			message: messages.rejectedAfter('>'),
			line: 1,
			column: 14,
		},
		{
			code: 'a/*comment*/ > /*comment*/a, b/*comment*/ > /*comment*/b {}',
			fixed: 'a/*comment*/ >/*comment*/a, b/*comment*/ >/*comment*/b {}',
			description: 'comment',
			warnings: [
				{
					message: messages.rejectedAfter('>'),
					line: 1,
					column: 14,
				},
				{
					message: messages.rejectedAfter('>'),
					line: 1,
					column: 43,
				},
			],
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['always'],
	fix: true,

	accept: [
		{
			code: '.a when (@size>=60) and (@size<102) {}',
			description: 'ignore constructs',
		},
	],

	reject: [
		{
			code: 'a+  a {}',
			fixed: 'a+ a {}',
			description: 'two spaces after + combinator',
			message: messages.expectedAfter('+'),
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a { > /*comment*/a, > /*comment*/.b{} }',
			description: 'scss nesting and comment',
		},
	],

	reject: [
		{
			code: 'a { >/*comment*/a {} }',
			fixed: 'a { > /*comment*/a {} }',
			description: 'scss nesting and comment',
			message: messages.expectedAfter('>'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { >/*comment*/a, >/*comment*/.b{} }',
			fixed: 'a { > /*comment*/a, > /*comment*/.b{} }',
			description: 'scss nesting, comment and comma',
			warnings: [
				{
					message: messages.expectedAfter('>'),
					line: 1,
					column: 5,
				},
				{
					message: messages.expectedAfter('>'),
					line: 1,
					column: 20,
				},
			],
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a { >/*comment*/a, >/*comment*/.b {} }',
			description: 'scss nesting and comment',
		},
	],

	reject: [
		{
			code: 'a { > /*comment*/a {} }',
			fixed: 'a { >/*comment*/a {} }',
			description: 'scss nesting and comment',
			message: messages.rejectedAfter('>'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { > /*comment*/a, > /*comment*/.b {} }',
			fixed: 'a { >/*comment*/a, >/*comment*/.b {} }',
			description: 'scss nesting, comment and comma',
			warnings: [
				{
					message: messages.rejectedAfter('>'),
					line: 1,
					column: 5,
				},
				{
					message: messages.rejectedAfter('>'),
					line: 1,
					column: 21,
				},
			],
		},
	],
});
