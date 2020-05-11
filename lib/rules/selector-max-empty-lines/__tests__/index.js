'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [0],
	fix: true,

	accept: [
		{
			code: '\n.foo { }',
		},
		{
			code: '\r\n.foo { }',
		},
		{
			code: '\n\n.foo { }',
		},
		{
			code: '\r\n\r\n.foo { }',
		},
		{
			code: '\n\n\n.foo { }',
		},
		{
			code: '\r\n\r\n\r\n.foo { }',
		},
		{
			code: '.foo\n{ }',
		},
		{
			code: '.foo\r\n{ }',
		},
		{
			code: '.foo\n\n{ }',
		},
		{
			code: '.foo\r\n\r\n{ }',
		},
		{
			code: '.foo\n\n\n{ }',
		},
		{
			code: '.foo\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo\n\n\n{ }',
		},
		{
			code: '.foo\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo {\n}',
		},
		{
			code: '.foo {\r\n}',
		},
		{
			code: '.foo {\n\n}',
		},
		{
			code: '.foo {\r\n\r\n}',
		},
		{
			code: '.foo {\n\n\n}',
		},
		{
			code: '.foo {\r\n\r\n\r\n}',
		},
		{
			code: '.foo {\n\n\n}',
		},
		{
			code: '.foo {\r\n\r\n\r\n}',
		},
		{
			code: '.foo { }\n',
		},
		{
			code: '.foo { }\r\n',
		},
		{
			code: '.foo { }\n\n',
		},
		{
			code: '.foo { }\r\n\r\n',
		},
		{
			code: '.foo { }\n\n\n',
		},
		{
			code: '.foo { }\r\n\r\n\r\n',
		},
		{
			code: '.foo { }\n\n\n',
		},
		{
			code: '.foo { }\r\n\r\n\r\n',
		},
		{
			code: '\n.foo, .bar { }',
		},
		{
			code: '\r\n.foo, .bar { }',
		},
		{
			code: '\n\n.foo, .bar { }',
		},
		{
			code: '\r\n\r\n.foo, .bar { }',
		},
		{
			code: '\n\n\n.foo, .bar { }',
		},
		{
			code: '\r\n\r\n\r\n.foo, .bar { }',
		},
		{
			code: '.foo, .bar { }',
		},
		{
			code: '.foo,\n.bar { }',
		},
		{
			code: '.foo,\r\n.bar { }',
		},
		{
			code: '.foo, .bar\n{ }',
		},
		{
			code: '.foo, .bar\r\n{ }',
		},
		{
			code: '.foo, .bar\n\n{ }',
		},
		{
			code: '.foo, .bar\r\n\r\n{ }',
		},
		{
			code: '.foo, .bar\n\n\n{ }',
		},
		{
			code: '.foo, .bar\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo, .bar {\n}',
		},
		{
			code: '.foo, .bar {\r\n}',
		},
		{
			code: '.foo, .bar {\n\n}',
		},
		{
			code: '.foo, .bar {\r\n\r\n}',
		},
		{
			code: '.foo, .bar {\n\n\n}',
		},
		{
			code: '.foo, .bar {\r\n\r\n\r\n}',
		},
		{
			code: '.foo, .bar { }\n',
		},
		{
			code: '.foo, .bar { }\r\n',
		},
		{
			code: '.foo, .bar { }\n\n',
		},
		{
			code: '.foo, .bar { }\r\n\r\n',
		},
		{
			code: '.foo, .bar { }\n\n\n',
		},
		{
			code: '.foo, .bar { }\r\n\r\n\r\n',
		},
		{
			code: '.foo .bar { }',
		},
		{
			code: '.foo\n.bar { }',
		},
		{
			code: '.foo\r\n.bar { }',
		},
		{
			code: '\n.foo .bar { }',
		},
		{
			code: '\r\n.foo .bar { }',
		},
		{
			code: '\n\n.foo .bar { }',
		},
		{
			code: '\r\n\r\n.foo .bar { }',
		},
		{
			code: '\n\n\n.foo .bar { }',
		},
		{
			code: '\r\n\r\n\r\n.foo .bar { }',
		},
		{
			code: '.foo .bar\n{ }',
		},
		{
			code: '.foo .bar\r\n{ }',
		},
		{
			code: '.foo .bar\n\n{ }',
		},
		{
			code: '.foo .bar\r\n\r\n{ }',
		},
		{
			code: '.foo .bar\n\n\n{ }',
		},
		{
			code: '.foo .bar\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo .bar {\n}',
		},
		{
			code: '.foo .bar {\r\n}',
		},
		{
			code: '.foo .bar {\n\n}',
		},
		{
			code: '.foo .bar {\r\n\r\n}',
		},
		{
			code: '.foo .bar {\n\n\n}',
		},
		{
			code: '.foo .bar {\r\n\r\n\r\n}',
		},
		{
			code: '.foo .bar { }\n',
		},
		{
			code: '.foo .bar { }\r\n',
		},
		{
			code: '.foo .bar { }\n\n',
		},
		{
			code: '.foo .bar { }\r\n\r\n',
		},
		{
			code: '.foo .bar { }\n\n\n',
		},
		{
			code: '.foo .bar { }\r\n\r\n\r\n',
		},
		{
			code: '.foo > .bar { }',
		},
		{
			code: '\n.foo > .bar { }',
		},
		{
			code: '\r\n.foo > .bar { }',
		},
		{
			code: '\n\n.foo > .bar { }',
		},
		{
			code: '\r\n\r\n.foo > .bar { }',
		},
		{
			code: '\n\n\n.foo > .bar { }',
		},
		{
			code: '\r\n\r\n\r\n.foo > .bar { }',
		},
		{
			code: '.foo\n> .bar { }',
		},
		{
			code: '.foo\r\n> .bar { }',
		},
		{
			code: '.foo >\n.bar { }',
		},
		{
			code: '.foo >\r\n.bar { }',
		},
		{
			code: '.foo > .bar\n{ }',
		},
		{
			code: '.foo > .bar\r\n{ }',
		},
		{
			code: '.foo > .bar\n\n{ }',
		},
		{
			code: '.foo > .bar\r\n\r\n{ }',
		},
		{
			code: '.foo > .bar\n\n\n{ }',
		},
		{
			code: '.foo > .bar\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo > .bar {\n}',
		},
		{
			code: '.foo > .bar {\r\n}',
		},
		{
			code: '.foo > .bar {\n\n}',
		},
		{
			code: '.foo > .bar {\r\n\r\n}',
		},
		{
			code: '.foo > .bar {\n\n\n}',
		},
		{
			code: '.foo > .bar {\r\n\r\n\r\n}',
		},
		{
			code: '.foo > .bar { }\n',
		},
		{
			code: '.foo > .bar { }\r\n',
		},
		{
			code: '.foo > .bar { }\n\n',
		},
		{
			code: '.foo > .bar { }\r\n\r\n',
		},
		{
			code: '.foo > .bar { }\n\n\n',
		},
		{
			code: '.foo > .bar { }\r\n\r\n\r\n',
		},
		{
			code: '\na[itemprop=url] { }',
		},
		{
			code: '\r\na[itemprop=url] { }',
		},
		{
			code: '\n\na[itemprop=url] { }',
		},
		{
			code: '\r\n\r\na[itemprop=url] { }',
		},
		{
			code: '\n\n\na[itemprop=url] { }',
		},
		{
			code: '\r\n\r\n\r\na[itemprop=url] { }',
		},
		{
			code: 'a\n[itemprop=url] { }',
		},
		{
			code: 'a\r\n[itemprop=url] { }',
		},
		{
			code: 'a[\nitemprop=url] { }',
		},
		{
			code: 'a[\r\nitemprop=url] { }',
		},
		{
			code: 'a[itemprop\n=url] { }',
		},
		{
			code: 'a[itemprop\r\n=url] { }',
		},
		{
			code: 'a[itemprop=\nurl] { }',
		},
		{
			code: 'a[itemprop=\r\nurl] { }',
		},
		{
			code: 'a[itemprop=url\n] { }',
		},
		{
			code: 'a[itemprop=url\r\n] { }',
		},
		{
			code: 'a[itemprop=url]\n{ }',
		},
		{
			code: 'a[itemprop=url]\r\n{ }',
		},
		{
			code: 'a[itemprop=url]\n\n{ }',
		},
		{
			code: 'a[itemprop=url]\r\n\r\n{ }',
		},
		{
			code: 'a[itemprop=url]\n\n\n{ }',
		},
		{
			code: 'a[itemprop=url]\r\n\r\n\r\n{ }',
		},
		{
			code: '\na:hover { }',
		},
		{
			code: '\r\na:hover { }',
		},
		{
			code: '\n\na:hover { }',
		},
		{
			code: '\r\n\r\na:hover { }',
		},
		{
			code: '\n\n\na:hover { }',
		},
		{
			code: '\r\n\r\n\r\na:hover { }',
		},
		{
			code: 'a\n:hover { }',
		},
		{
			code: 'a\r\n:hover { }',
		},
		{
			code: 'a:\nhover { }',
		},
		{
			code: 'a:\r\nhover { }',
		},
		{
			code: 'a:hover\n{ }',
		},
		{
			code: 'a:hover\r\n{ }',
		},
		{
			code: 'a:hover\n\n{ }',
		},
		{
			code: 'a:hover\r\n\r\n{ }',
		},
		{
			code: 'a:hover\n\n\n{ }',
		},
		{
			code: 'a:hover\r\n\r\n\r\n{ }',
		},
		{
			code: '\na::before { }',
		},
		{
			code: '\r\na::before  { }',
		},
		{
			code: '\n\na::before { }',
		},
		{
			code: '\r\n\r\na::before  { }',
		},
		{
			code: '\n\n\na::before { }',
		},
		{
			code: '\r\n\r\n\r\na::before  { }',
		},
		{
			code: 'a\n::before  { }',
		},
		{
			code: 'a\r\n::before  { }',
		},
		{
			code: 'a::\nbefore { }',
		},
		{
			code: 'a::\r\nbefore { }',
		},
		{
			code: 'a::before\n{ }',
		},
		{
			code: 'a::before\r\n{ }',
		},
		{
			code: 'a::before\n\n{ }',
		},
		{
			code: 'a::before\r\n\r\n{ }',
		},
		{
			code: 'a::before\n\n\n{ }',
		},
		{
			code: 'a::before\r\n\r\n\r\n{ }',
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
			code: '/*comment*/\n.foo{ }',
		},
		{
			code: '/*comment*/\r\n.foo{ }',
		},
		{
			code: '.foo \n/*comment*/\n .bar { }',
		},
		{
			code: '.foo \r\n/*comment*/\n\r .bar { }',
		},
	],

	reject: [
		{
			code: '.foo\n\n.bar { }',
			fixed: '.foo\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n.bar { }',
			fixed: '.foo\r\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n\n.bar { }',
			fixed: '.foo,\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n\r\n.bar { }',
			fixed: '.foo,\r\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n,.bar { }',
			fixed: '.foo\n,.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n,.bar { }',
			fixed: '.foo\r\n,.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, .bar,\n\n.other { }',
			fixed: '.foo, .bar,\n.other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, .bar,\r\n\r\n.other { }',
			fixed: '.foo, .bar,\r\n.other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n.bar,\n\n.other { }',
			fixed: '.foo,\n.bar,\n.other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n.bar,\r\n\r\n.other { }',
			fixed: '.foo,\r\n.bar,\r\n.other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n.bar,\n\n.other\n{ }',
			fixed: '.foo,\n.bar,\n.other\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n.bar,\r\n\r\n.other\r\n{ }',
			fixed: '.foo,\r\n.bar,\r\n.other\r\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n.bar,\n\n.other\n\n{ }',
			fixed: '.foo,\n.bar,\n.other\n\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }',
			fixed: '.foo,\r\n.bar,\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '\n.foo,\n.bar,\n\n.other\n\n{ }',
			fixed: '\n.foo,\n.bar,\n.other\n\n{ }',
			message: messages.expected(0),
			line: 2,
			column: 1,
		},
		{
			code: '\r\n.foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n.foo,\r\n.bar,\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
			line: 2,
			column: 1,
		},
		{
			code: '\n\n.foo,\n.bar,\n\n.other\n\n{ }',
			fixed: '\n\n.foo,\n.bar,\n.other\n\n{ }',
			message: messages.expected(0),
			line: 3,
			column: 1,
		},
		{
			code: '\r\n\r\n.foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo,\r\n.bar,\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
			line: 3,
			column: 1,
		},
		{
			code: '.foo\n\n.bar { }',
			fixed: '.foo\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n.bar { }',
			fixed: '.foo\r\n.bar { }',
			message: messages.expected(0),
		},
		{
			code: '.foo .bar\n\n.other { }',
			fixed: '.foo .bar\n.other { }',
			message: messages.expected(0),
		},
		{
			code: '.foo .bar\r\n\r\n.other { }',
			fixed: '.foo .bar\r\n.other { }',
			message: messages.expected(0),
		},
		{
			code: '.foo\n.bar\n\n.other { }',
			fixed: '.foo\n.bar\n.other { }',
			message: messages.expected(0),
		},
		{
			code: '.foo\r\n.bar\r\n\r\n.other { }',
			fixed: '.foo\r\n.bar\r\n.other { }',
			message: messages.expected(0),
		},
		{
			code: '.foo\n.bar\n\n.other\n{ }',
			fixed: '.foo\n.bar\n.other\n{ }',
			message: messages.expected(0),
		},
		{
			code: '.foo\r\n.bar\r\n\r\n.other\r\n{ }',
			fixed: '.foo\r\n.bar\r\n.other\r\n{ }',
			message: messages.expected(0),
		},
		{
			code: '.foo\n.bar\n\n.other\n\n{ }',
			fixed: '.foo\n.bar\n.other\n\n{ }',
			message: messages.expected(0),
		},
		{
			code: '.foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }',
			fixed: '.foo\r\n.bar\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
		},
		{
			code: '\n.foo\n.bar\n\n.other\n\n{ }',
			fixed: '\n.foo\n.bar\n.other\n\n{ }',
			message: messages.expected(0),
		},
		{
			code: '\r\n.foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n.foo\r\n.bar\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
		},
		{
			code: '\n\n.foo\n.bar\n\n.other\n\n{ }',
			fixed: '\n\n.foo\n.bar\n.other\n\n{ }',
			message: messages.expected(0),
		},
		{
			code: '\r\n\r\n.foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n.bar\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
		},
		{
			code: '.foo >\n\n.bar { }',
			fixed: '.foo >\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo >\r\n\r\n.bar { }',
			fixed: '.foo >\r\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n>.bar { }',
			fixed: '.foo\n>.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n> .bar { }',
			fixed: '.foo\r\n> .bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo .bar >\n\n.other { }',
			fixed: '.foo .bar >\n.other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo .bar >\r\n\r\n .other { }',
			fixed: '.foo .bar >\r\n .other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo .bar\n\n> .other { }',
			fixed: '.foo .bar\n> .other { }',
			message: messages.expected(0),
		},
		{
			code: '.foo .bar\r\n\r\n> .other { }',
			fixed: '.foo .bar\r\n> .other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar >\n\n.other { }',
			fixed: '.foo\n.bar >\n.other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar >\r\n\r\n.other { }',
			fixed: '.foo\r\n.bar >\r\n.other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar\n\n> .other { }',
			fixed: '.foo\n.bar\n> .other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar\r\n\r\n> .other { }',
			fixed: '.foo\r\n.bar\r\n> .other { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar >\n\n.other\n{ }',
			fixed: '.foo\n.bar >\n.other\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar >\r\n\r\n.other\r\n{ }',
			fixed: '.foo\r\n.bar >\r\n.other\r\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar\n\n> .other\n{ }',
			fixed: '.foo\n.bar\n> .other\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar\r\n\r\n > .other\r\n{ }',
			fixed: '.foo\r\n.bar\r\n > .other\r\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar >\n\n.other\n\n{ }',
			fixed: '.foo\n.bar >\n.other\n\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }',
			fixed: '.foo\r\n.bar >\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar\n\n> .other\n\n{ }',
			fixed: '.foo\n.bar\n> .other\n\n{ }',
			message: messages.expected(0),
		},
		{
			code: '.foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }',
			fixed: '.foo\r\n.bar\r\n> .other\r\n\r\n{ }',
			message: messages.expected(0),
		},
		{
			code: '\n.foo\n.bar >\n\n.other\n\n{ }',
			fixed: '\n.foo\n.bar >\n.other\n\n{ }',
			message: messages.expected(0),
		},
		{
			code: '\r\n.foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n.foo\r\n.bar >\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
			line: 2,
			column: 1,
		},
		{
			code: '\n.foo\n.bar\n\n> .other\n\n{ }',
			fixed: '\n.foo\n.bar\n> .other\n\n{ }',
			message: messages.expected(0),
			line: 2,
			column: 1,
		},
		{
			code: '\r\n.foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }',
			fixed: '\r\n.foo\r\n.bar\r\n> .other\r\n\r\n{ }',
			message: messages.expected(0),
			line: 2,
			column: 1,
		},
		{
			code: '\n\n.foo\n.bar >\n\n.other\n\n{ }',
			fixed: '\n\n.foo\n.bar >\n.other\n\n{ }',
			message: messages.expected(0),
			line: 3,
			column: 1,
		},
		{
			code: '\r\n\r\n.foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n.bar >\r\n.other\r\n\r\n{ }',
			message: messages.expected(0),
			line: 3,
			column: 1,
		},
		{
			code: '\n\n.foo\n.bar\n\n >.other\n\n{ }',
			fixed: '\n\n.foo\n.bar\n >.other\n\n{ }',
			message: messages.expected(0),
		},
		{
			code: '\r\n\r\n.foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n.bar\r\n> .other\r\n\r\n{ }',
			message: messages.expected(0),
		},
		{
			code: 'a[\n\nitemprop=url] { }',
			fixed: 'a[\nitemprop=url] { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a[\r\n\r\nitemprop=url] { }',
			fixed: 'a[\r\nitemprop=url] { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop\n\n=url] { }',
			fixed: 'a[itemprop\n=url] { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop\r\n\r\n=url] { }',
			fixed: 'a[itemprop\r\n=url] { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop=\n\nurl] { }',
			fixed: 'a[itemprop=\nurl] { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop=\r\n\r\nurl] { }',
			fixed: 'a[itemprop=\r\nurl] { }',
			message: messages.expected(0),
		},
		{
			code: 'a[itemprop=url\n\n] { }',
			fixed: 'a[itemprop=url\n] { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop=url\r\n\r\n] { }',
			fixed: 'a[itemprop=url\r\n] { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a\n\n:hover { }',
			fixed: 'a\n:hover { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a\r\n\r\n:hover { }',
			fixed: 'a\r\n:hover { }',
			message: messages.expected(0),
		},
		{
			code: 'a:\n\nhover { }',
			fixed: 'a:\nhover { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a:\r\n\r\nhover { }',
			fixed: 'a:\r\nhover { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a\n\n::before { }',
			fixed: 'a\n::before { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a\r\n\r\n::before { }',
			fixed: 'a\r\n::before { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: 'a { }\na::\n\nbefore { }',
			fixed: 'a { }\na::\nbefore { }',
			message: messages.expected(0),
			line: 2,
			column: 1,
		},
		{
			code: 'a::\r\n\r\nbefore { }',
			fixed: 'a::\r\nbefore { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n/*comment*/ .bar { }',
			fixed: '.foo\n/*comment*/ .bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n/*comment*/\n\n.bar { }',
			fixed: '.foo\n/*comment*/\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n/*comment*/ .bar { }',
			fixed: '.foo\r\n/*comment*/ .bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n/*comment*/\r\n\r\n.bar { }',
			fixed: '.foo\r\n/*comment*/\r\n.bar { }',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [1],
	fix: true,

	accept: [
		{
			code: '\n.foo { }',
		},
		{
			code: '\r\n.foo { }',
		},
		{
			code: '\n\n.foo { }',
		},
		{
			code: '\r\n\r\n.foo { }',
		},
		{
			code: '\n\n\n.foo { }',
		},
		{
			code: '\r\n\r\n\r\n.foo { }',
		},
		{
			code: '.foo\n{ }',
		},
		{
			code: '.foo\r\n{ }',
		},
		{
			code: '.foo\n\n{ }',
		},
		{
			code: '.foo\r\n\r\n{ }',
		},
		{
			code: '.foo\n\n\n{ }',
		},
		{
			code: '.foo\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo\n\n\n{ }',
		},
		{
			code: '.foo\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo {\n}',
		},
		{
			code: '.foo {\r\n}',
		},
		{
			code: '.foo {\n\n}',
		},
		{
			code: '.foo {\r\n\r\n}',
		},
		{
			code: '.foo {\n\n\n}',
		},
		{
			code: '.foo {\r\n\r\n\r\n}',
		},
		{
			code: '.foo {\n\n\n}',
		},
		{
			code: '.foo {\r\n\r\n\r\n}',
		},
		{
			code: '.foo { }\n',
		},
		{
			code: '.foo { }\r\n',
		},
		{
			code: '.foo { }\n\n',
		},
		{
			code: '.foo { }\r\n\r\n',
		},
		{
			code: '.foo { }\n\n\n',
		},
		{
			code: '.foo { }\r\n\r\n\r\n',
		},
		{
			code: '.foo { }\n\n\n',
		},
		{
			code: '.foo { }\r\n\r\n\r\n',
		},
		{
			code: '\n.foo, .bar { }',
		},
		{
			code: '\r\n.foo, .bar { }',
		},
		{
			code: '\n\n.foo, .bar { }',
		},
		{
			code: '\r\n\r\n.foo, .bar { }',
		},
		{
			code: '\n\n\n.foo, .bar { }',
		},
		{
			code: '\r\n\r\n\r\n.foo, .bar { }',
		},
		{
			code: '.foo, .bar { }',
		},
		{
			code: '.foo,\n.bar { }',
		},
		{
			code: '.foo,\r\n.bar { }',
		},
		{
			code: '.foo,\n\n.bar { }',
		},
		{
			code: '.foo,\r\n\r\n.bar { }',
		},
		{
			code: '.foo, .bar\n{ }',
		},
		{
			code: '.foo, .bar\r\n{ }',
		},
		{
			code: '.foo, .bar\n\n{ }',
		},
		{
			code: '.foo, .bar\r\n\r\n{ }',
		},
		{
			code: '.foo, .bar\n\n\n{ }',
		},
		{
			code: '.foo, .bar\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo, .bar {\n}',
		},
		{
			code: '.foo, .bar {\r\n}',
		},
		{
			code: '.foo, .bar {\n\n}',
		},
		{
			code: '.foo, .bar {\r\n\r\n}',
		},
		{
			code: '.foo, .bar {\n\n\n}',
		},
		{
			code: '.foo, .bar {\r\n\r\n\r\n}',
		},
		{
			code: '.foo, .bar { }\n',
		},
		{
			code: '.foo, .bar { }\r\n',
		},
		{
			code: '.foo, .bar { }\n\n',
		},
		{
			code: '.foo, .bar { }\r\n\r\n',
		},
		{
			code: '.foo, .bar { }\n\n\n',
		},
		{
			code: '.foo, .bar { }\r\n\r\n\r\n',
		},
		{
			code: '.foo .bar { }',
		},
		{
			code: '.foo\n.bar { }',
		},
		{
			code: '.foo\r\n.bar { }',
		},
		{
			code: '.foo\n\n.bar { }',
		},
		{
			code: '.foo\r\n\r\n.bar { }',
		},
		{
			code: '\n.foo .bar { }',
		},
		{
			code: '\r\n.foo .bar { }',
		},
		{
			code: '\n\n.foo .bar { }',
		},
		{
			code: '\r\n\r\n.foo .bar { }',
		},
		{
			code: '\n\n\n.foo .bar { }',
		},
		{
			code: '\r\n\r\n\r\n.foo .bar { }',
		},
		{
			code: '.foo .bar\n{ }',
		},
		{
			code: '.foo .bar\r\n{ }',
		},
		{
			code: '.foo .bar\n\n{ }',
		},
		{
			code: '.foo .bar\r\n\r\n{ }',
		},
		{
			code: '.foo .bar\n\n\n{ }',
		},
		{
			code: '.foo .bar\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo .bar {\n}',
		},
		{
			code: '.foo .bar {\r\n}',
		},
		{
			code: '.foo .bar {\n\n}',
		},
		{
			code: '.foo .bar {\r\n\r\n}',
		},
		{
			code: '.foo .bar {\n\n\n}',
		},
		{
			code: '.foo .bar {\r\n\r\n\r\n}',
		},
		{
			code: '.foo .bar { }\n',
		},
		{
			code: '.foo .bar { }\r\n',
		},
		{
			code: '.foo .bar { }\n\n',
		},
		{
			code: '.foo .bar { }\r\n\r\n',
		},
		{
			code: '.foo .bar { }\n\n\n',
		},
		{
			code: '.foo .bar { }\r\n\r\n\r\n',
		},
		{
			code: '.foo > .bar { }',
		},
		{
			code: '\n.foo > .bar { }',
		},
		{
			code: '\r\n.foo > .bar { }',
		},
		{
			code: '\n\n.foo > .bar { }',
		},
		{
			code: '\r\n\r\n.foo > .bar { }',
		},
		{
			code: '\n\n\n.foo > .bar { }',
		},
		{
			code: '\r\n\r\n\r\n.foo > .bar { }',
		},
		{
			code: '.foo\n> .bar { }',
		},
		{
			code: '.foo\r\n> .bar { }',
		},
		{
			code: '.foo\n\n> .bar { }',
		},
		{
			code: '.foo\r\n\r\n> .bar { }',
		},
		{
			code: '.foo >\n.bar { }',
		},
		{
			code: '.foo >\r\n.bar { }',
		},
		{
			code: '.foo >\n\n.bar { }',
		},
		{
			code: '.foo >\r\n\r\n.bar { }',
		},
		{
			code: '.foo > .bar\n{ }',
		},
		{
			code: '.foo > .bar\r\n{ }',
		},
		{
			code: '.foo > .bar\n\n{ }',
		},
		{
			code: '.foo > .bar\r\n\r\n{ }',
		},
		{
			code: '.foo > .bar\n\n\n{ }',
		},
		{
			code: '.foo > .bar\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo > .bar {\n}',
		},
		{
			code: '.foo > .bar {\r\n}',
		},
		{
			code: '.foo > .bar {\n\n}',
		},
		{
			code: '.foo > .bar {\r\n\r\n}',
		},
		{
			code: '.foo > .bar {\n\n\n}',
		},
		{
			code: '.foo > .bar {\r\n\r\n\r\n}',
		},
		{
			code: '.foo > .bar { }\n',
		},
		{
			code: '.foo > .bar { }\r\n',
		},
		{
			code: '.foo > .bar { }\n\n',
		},
		{
			code: '.foo > .bar { }\r\n\r\n',
		},
		{
			code: '.foo > .bar { }\n\n\n',
		},
		{
			code: '.foo > .bar { }\r\n\r\n\r\n',
		},
		{
			code: '\na[itemprop=url] { }',
		},
		{
			code: '\r\na[itemprop=url] { }',
		},
		{
			code: '\n\na[itemprop=url] { }',
		},
		{
			code: '\r\n\r\na[itemprop=url] { }',
		},
		{
			code: '\n\n\na[itemprop=url] { }',
		},
		{
			code: '\r\n\r\n\r\na[itemprop=url] { }',
		},
		{
			code: 'a\n[itemprop=url] { }',
		},
		{
			code: 'a\r\n[itemprop=url] { }',
		},
		{
			code: 'a\n\n[itemprop=url] { }',
		},
		{
			code: 'a\r\n\r\n[itemprop=url] { }',
		},
		{
			code: 'a[\nitemprop=url] { }',
		},
		{
			code: 'a[\r\nitemprop=url] { }',
		},
		{
			code: 'a[\n\nitemprop=url] { }',
		},
		{
			code: 'a[\r\n\r\nitemprop=url] { }',
		},
		{
			code: 'a[itemprop\n=url] { }',
		},
		{
			code: 'a[itemprop\r\n=url] { }',
		},
		{
			code: 'a[itemprop\n\n=url] { }',
		},
		{
			code: 'a[itemprop\r\n\r\n=url] { }',
		},
		{
			code: 'a[itemprop=\nurl] { }',
		},
		{
			code: 'a[itemprop=\r\nurl] { }',
		},
		{
			code: 'a[itemprop=\n\nurl] { }',
		},
		{
			code: 'a[itemprop=\r\n\r\nurl] { }',
		},
		{
			code: 'a[itemprop=url\n] { }',
		},
		{
			code: 'a[itemprop=url\r\n] { }',
		},
		{
			code: 'a[itemprop=url\n\n] { }',
		},
		{
			code: 'a[itemprop=url\r\n\r\n] { }',
		},
		{
			code: 'a[itemprop=url]\n{ }',
		},
		{
			code: 'a[itemprop=url]\r\n{ }',
		},
		{
			code: 'a[itemprop=url]\n\n{ }',
		},
		{
			code: 'a[itemprop=url]\r\n\r\n{ }',
		},
		{
			code: 'a[itemprop=url]\n\n\n{ }',
		},
		{
			code: 'a[itemprop=url]\r\n\r\n\r\n{ }',
		},
		{
			code: '\na:hover { }',
		},
		{
			code: '\r\na:hover { }',
		},
		{
			code: '\n\na:hover { }',
		},
		{
			code: '\r\n\r\na:hover { }',
		},
		{
			code: '\n\n\na:hover { }',
		},
		{
			code: '\r\n\r\n\r\na:hover { }',
		},
		{
			code: 'a\n:hover { }',
		},
		{
			code: 'a\r\n:hover { }',
		},
		{
			code: 'a\n\n:hover { }',
		},
		{
			code: 'a\r\n\r\n:hover { }',
		},
		{
			code: 'a:\nhover { }',
		},
		{
			code: 'a:\r\nhover { }',
		},
		{
			code: 'a:\n\nhover { }',
		},
		{
			code: 'a:\r\n\r\nhover { }',
		},
		{
			code: 'a:hover\n{ }',
		},
		{
			code: 'a:hover\r\n{ }',
		},
		{
			code: 'a:hover\n\n{ }',
		},
		{
			code: 'a:hover\r\n\r\n{ }',
		},
		{
			code: 'a:hover\n\n\n{ }',
		},
		{
			code: 'a:hover\r\n\r\n\r\n{ }',
		},
		{
			code: '\na::before { }',
		},
		{
			code: '\r\na::before  { }',
		},
		{
			code: '\n\na::before { }',
		},
		{
			code: '\r\n\r\na::before  { }',
		},
		{
			code: '\n\n\na::before { }',
		},
		{
			code: '\r\n\r\n\r\na::before  { }',
		},
		{
			code: 'a\n::before  { }',
		},
		{
			code: 'a\r\n::before  { }',
		},
		{
			code: 'a\n\n::before  { }',
		},
		{
			code: 'a\r\n\r\n::before  { }',
		},
		{
			code: 'a::\nbefore { }',
		},
		{
			code: 'a::\r\nbefore { }',
		},
		{
			code: 'a::\n\nbefore { }',
		},
		{
			code: 'a::\r\n\r\nbefore { }',
		},
		{
			code: 'a::before\n{ }',
		},
		{
			code: 'a::before\r\n{ }',
		},
		{
			code: 'a::before\n\n{ }',
		},
		{
			code: 'a::before\r\n\r\n{ }',
		},
		{
			code: 'a::before\n\n\n{ }',
		},
		{
			code: 'a::before\r\n\r\n\r\n{ }',
		},
		{
			code: '\n/*comment*/\n.foo { }',
		},
		{
			code: '\n\n/*comment*/\n\n.foo { }',
		},
		{
			code: '\n\n\n/*comment*/\n\n\n.foo { }',
		},
		{
			code: '\r\n/*comment*/\r\n.foo { }',
		},
		{
			code: '\r\n\r\n/*comment*/\r\n\r\n.foo { }',
		},
		{
			code: '\r\n\r\n\r\n/*comment*/\r\n\r\n\r\n.foo { }',
		},
		{
			code: '.foo\n/*comment*/\n{ }',
		},
		{
			code: '.foo\n\n/*comment*/\n\n{ }',
		},
		{
			code: '.foo\n\n\n/*comment*/\n\n\n{ }',
		},
		{
			code: '.foo\r\n/*comment*/\r\n{ }',
		},
		{
			code: '.foo\r\n\r\n/*comment*/\r\n\r\n{ }',
		},
		{
			code: '.foo\r\n\r\n\r\n/*comment*/\r\n\r\n\r\n{ }',
		},
		{
			code: '.foo\n/*comment*/\n.bar{ }',
		},
		{
			code: '.foo\n\n/*comment*/\n\n.bar{ }',
		},
		{
			code: '.foo\r\n/*comment*/\r\n.bar{ }',
		},
		{
			code: '.foo\r\n\r\n/*comment*/\r\n\r\n.bar{ }',
		},
	],

	reject: [
		{
			code: '.foo\n\n\n.bar { }',
			fixed: '.foo\n\n.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n\r\n.bar { }',
			fixed: '.foo\r\n\r\n.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n\n\n.bar { }',
			fixed: '.foo,\n\n.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n\r\n\r\n.bar { }',
			fixed: '.foo,\r\n\r\n.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, .bar,\n\n\n.other { }',
			fixed: '.foo, .bar,\n\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo, .bar,\r\n\r\n\r\n.other { }',
			fixed: '.foo, .bar,\r\n\r\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n.bar,\n\n\n.other { }',
			fixed: '.foo,\n.bar,\n\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n.bar,\r\n\r\n\r\n.other { }',
			fixed: '.foo,\r\n.bar,\r\n\r\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n\n.bar,\n\n\n.other { }',
			fixed: '.foo,\n\n.bar,\n\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n\r\n.bar,\r\n\r\n\r\n.other { }',
			fixed: '.foo,\r\n\r\n.bar,\r\n\r\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n.bar,\n\n\n.other\n{ }',
			fixed: '.foo,\n.bar,\n\n.other\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo,\r\n.bar,\r\n\r\n\r\n.other\r\n{ }',
			fixed: '.foo,\r\n.bar,\r\n\r\n.other\r\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n\n.bar,\n\n\n.other\n{ }',
			fixed: '.foo,\n\n.bar,\n\n.other\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n\r\n.bar,\r\n\r\n\r\n.other\r\n{ }',
			fixed: '.foo,\r\n\r\n.bar,\r\n\r\n.other\r\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n.bar,\n\n\n.other\n\n{ }',
			fixed: '.foo,\n.bar,\n\n.other\n\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '.foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\n\n.bar,\n\n\n.other\n\n\n{ }',
			fixed: '.foo,\n\n.bar,\n\n.other\n\n\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo,\r\n\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '.foo,\r\n\r\n.bar,\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '\n.foo,\n.bar,\n\n\n.other\n\n{ }',
			fixed: '\n.foo,\n.bar,\n\n.other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\r\n.foo,\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n.foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
			line: 2,
			column: 1,
		},
		{
			code: '\n\n.foo,\n\n.bar,\n\n\n.other\n\n\n{ }',
			fixed: '\n\n.foo,\n\n.bar,\n\n.other\n\n\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\r\n\r\n.foo,\r\n\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo,\r\n\r\n.bar,\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\n\n.foo,\n.bar,\n\n\n.other\n\n{ }',
			fixed: '\n\n.foo,\n.bar,\n\n.other\n\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\r\n\r\n.foo,\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\n\n\n.foo,\n\n.bar,\n\n\n.other\n\n\n{ }',
			fixed: '\n\n\n.foo,\n\n.bar,\n\n.other\n\n\n{ }',
			message: messages.expected(1),
			line: 4,
			column: 1,
		},
		{
			code: '\r\n\r\n\r\n.foo,\r\n\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '\r\n\r\n\r\n.foo,\r\n\r\n.bar,\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
			line: 4,
			column: 1,
		},
		{
			code: '.foo .bar\n\n\n.other { }',
			fixed: '.foo .bar\n\n.other { }',
			message: messages.expected(1),
		},
		{
			code: '.foo .bar\r\n\r\n\r\n.other { }',
			fixed: '.foo .bar\r\n\r\n.other { }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n.bar\n\n\n.other { }',
			fixed: '.foo\n.bar\n\n.other { }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n.bar\r\n\r\n\r\n.other { }',
			fixed: '.foo\r\n.bar\r\n\r\n.other { }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n\n.bar\n\n\n.other { }',
			fixed: '.foo\n\n.bar\n\n.other { }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n\r\n.bar\r\n\r\n\r\n.other { }',
			fixed: '.foo\r\n\r\n.bar\r\n\r\n.other { }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n.bar\n\n\n.other\n{ }',
			fixed: '.foo\n.bar\n\n.other\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n.bar\r\n\r\n\r\n.other\r\n{ }',
			fixed: '.foo\r\n.bar\r\n\r\n.other\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n\n.bar\n\n\n.other\n\n{ }',
			fixed: '.foo\n\n.bar\n\n.other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n\r\n.bar\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '.foo\r\n\r\n.bar\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n.bar\n\n\n.other\n\n{ }',
			fixed: '.foo\n.bar\n\n.other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n.bar\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '.foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n\n.bar\n\n\n.other\n\n\n{ }',
			fixed: '.foo\n\n.bar\n\n.other\n\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n\r\n.bar\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '.foo\r\n\r\n.bar\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\n.foo\n.bar\n\n\n.other\n\n{ }',
			fixed: '\n.foo\n.bar\n\n.other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\r\n.foo\r\n.bar\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n.foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\n\n.foo\n\n.bar\n\n\n.other\n\n\n{ }',
			fixed: '\n\n.foo\n\n.bar\n\n.other\n\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\n\n.foo\n.bar\n\n\n.other\n\n{ }',
			fixed: '\n\n.foo\n.bar\n\n.other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\r\n\r\n.foo\r\n.bar\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\n\n\n.foo\n\n.bar\n\n\n.other\n\n\n{ }',
			fixed: '\n\n\n.foo\n\n.bar\n\n.other\n\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\r\n\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '\r\n\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo >\n\n\n.bar { }',
			fixed: '.foo >\n\n.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo >\r\n\r\n\r\n.bar { }',
			fixed: '.foo >\r\n\r\n.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n\n>.bar { }',
			fixed: '.foo\n\n>.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n\r\n> .bar { }',
			fixed: '.foo\r\n\r\n> .bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo .bar >\n\n\n.other { }',
			fixed: '.foo .bar >\n\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo .bar >\r\n\r\n\r\n .other { }',
			fixed: '.foo .bar >\r\n\r\n .other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo .bar\n\n\n> .other { }',
			fixed: '.foo .bar\n\n> .other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo .bar\r\n\r\n\r\n> .other { }',
			fixed: '.foo .bar\r\n\r\n> .other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar >\n\n\n.other { }',
			fixed: '.foo\n.bar >\n\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar >\r\n\r\n\r\n.other { }',
			fixed: '.foo\r\n.bar >\r\n\r\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n.bar >\n\n\n.other { }',
			fixed: '.foo\n\n.bar >\n\n.other { }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n\r\n.bar >\r\n\r\n\r\n.other { }',
			fixed: '.foo\r\n\r\n.bar >\r\n\r\n.other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar\n\n\n> .other { }',
			fixed: '.foo\n.bar\n\n> .other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar\r\n\r\n\r\n> .other { }',
			fixed: '.foo\r\n.bar\r\n\r\n> .other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n.bar\n\n\n> .other { }',
			fixed: '.foo\n\n.bar\n\n> .other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n.bar\r\n\r\n\r\n> .other { }',
			fixed: '.foo\r\n\r\n.bar\r\n\r\n> .other { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar >\n\n\n.other\n{ }',
			fixed: '.foo\n.bar >\n\n.other\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar >\r\n\r\n\r\n.other\r\n{ }',
			fixed: '.foo\r\n.bar >\r\n\r\n.other\r\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n.bar >\n\n\n.other\n\n{ }',
			fixed: '.foo\n\n.bar >\n\n.other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '.foo\r\n\r\n.bar >\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n.bar\n\n\n> .other\n{ }',
			fixed: '.foo\n.bar\n\n> .other\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n.bar\r\n\r\n\r\n > .other\r\n{ }',
			fixed: '.foo\r\n.bar\r\n\r\n > .other\r\n{ }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n.bar\n\n\n> .other\n\n{ }',
			fixed: '.foo\n\n.bar\n\n> .other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n\r\n.bar\r\n\r\n\r\n > .other\r\n\r\n{ }',
			fixed: '.foo\r\n\r\n.bar\r\n\r\n > .other\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n.bar >\n\n\n.other\n\n{ }',
			fixed: '.foo\n.bar >\n\n.other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '.foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n\n.bar >\n\n\n.other\n\n\n{ }',
			fixed: '.foo\n\n.bar >\n\n.other\n\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '.foo\r\n\r\n.bar >\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n.bar\n\n\n> .other\n\n{ }',
			fixed: '.foo\n.bar\n\n> .other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n{ }',
			fixed: '.foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\n\n.bar\n\n\n> .other\n\n\n{ }',
			fixed: '.foo\n\n.bar\n\n> .other\n\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '.foo\r\n\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n\r\n{ }',
			fixed: '.foo\r\n\r\n.bar\r\n\r\n> .other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\n.foo\n.bar >\n\n\n.other\n\n{ }',
			fixed: '\n.foo\n.bar >\n\n.other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\r\n.foo\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n.foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
			line: 2,
			column: 1,
		},
		{
			code: '\n\n.foo\n\n.bar >\n\n\n.other\n\n\n{ }',
			fixed: '\n\n.foo\n\n.bar >\n\n.other\n\n\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\r\n\r\n.foo\r\n\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n\r\n.bar >\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\n.foo\n.bar\n\n\n> .other\n\n{ }',
			fixed: '\n.foo\n.bar\n\n> .other\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\r\n.foo\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n{ }',
			fixed: '\r\n.foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }',
			message: messages.expected(1),
			line: 2,
			column: 1,
		},
		{
			code: '\n\n.foo\n\n.bar\n\n\n> .other\n\n\n{ }',
			fixed: '\n\n.foo\n\n.bar\n\n> .other\n\n\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n> .other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\n\n.foo\n.bar >\n\n\n.other\n\n{ }',
			fixed: '\n\n.foo\n.bar >\n\n.other\n\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\r\n\r\n.foo\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\n\n\n.foo\n\n.bar >\n\n\n.other\n\n\n{ }',
			fixed: '\n\n\n.foo\n\n.bar >\n\n.other\n\n\n{ }',
			message: messages.expected(1),
			line: 4,
			column: 1,
		},
		{
			code: '\r\n\r\n\r\n.foo\r\n\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n\r\n{ }',
			fixed: '\r\n\r\n\r\n.foo\r\n\r\n.bar >\r\n\r\n.other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
			line: 4,
			column: 1,
		},
		{
			code: '\n\n.foo\n.bar\n\n\n >.other\n\n{ }',
			fixed: '\n\n.foo\n.bar\n\n >.other\n\n{ }',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '\r\n\r\n.foo\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n{ }',
			fixed: '\r\n\r\n.foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\n\n\n.foo\n\n.bar\n\n\n >.other\n\n\n{ }',
			fixed: '\n\n\n.foo\n\n.bar\n\n >.other\n\n\n{ }',
			message: messages.expected(1),
		},
		{
			code: '\r\n\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n\r\n{ }',
			fixed: '\r\n\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n> .other\r\n\r\n\r\n{ }',
			message: messages.expected(1),
		},
		{
			code: 'a[\n\n\nitemprop=url] { }',
			fixed: 'a[\n\nitemprop=url] { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a[\r\n\r\n\r\nitemprop=url] { }',
			fixed: 'a[\r\n\r\nitemprop=url] { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop\n\n\n=url] { }',
			fixed: 'a[itemprop\n\n=url] { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop\r\n\r\n\r\n=url] { }',
			fixed: 'a[itemprop\r\n\r\n=url] { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop=\n\n\nurl] { }',
			fixed: 'a[itemprop=\n\nurl] { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop=\r\n\r\n\r\nurl] { }',
			fixed: 'a[itemprop=\r\n\r\nurl] { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop=url\n\n\n] { }',
			fixed: 'a[itemprop=url\n\n] { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a[itemprop=url\r\n\r\n\r\n] { }',
			fixed: 'a[itemprop=url\r\n\r\n] { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a\n\n\n:hover { }',
			fixed: 'a\n\n:hover { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a\r\n\r\n\r\n:hover { }',
			fixed: 'a\r\n\r\n:hover { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a:\n\n\nhover { }',
			fixed: 'a:\n\nhover { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a:\r\n\r\n\r\nhover { }',
			fixed: 'a:\r\n\r\nhover { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a\n\n\n::before { }',
			fixed: 'a\n\n::before { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a\r\n\r\n\r\n::before { }',
			fixed: 'a\r\n\r\n::before { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a::\n\n\nbefore { }',
			fixed: 'a::\n\nbefore { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: 'a::\r\n\r\n\r\nbefore { }',
			fixed: 'a::\r\n\r\nbefore { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\n\n\n/*comment*/.bar { }',
			fixed: '.foo\n\n/*comment*/.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
		{
			code: '.foo\r\n\r\n\r\n/*comment*/.bar { }',
			fixed: '.foo\r\n\r\n/*comment*/.bar { }',
			message: messages.expected(1),
			line: 1,
			column: 1,
		},
	],
});
