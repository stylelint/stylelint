"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [0],

  accept: [
    {
      code: "\n.foo { }"
    },
    {
      code: "\r\n.foo { }"
    },
    {
      code: "\n\n.foo { }"
    },
    {
      code: "\r\n\r\n.foo { }"
    },
    {
      code: "\n\n\n.foo { }"
    },
    {
      code: "\r\n\r\n\r\n.foo { }"
    },
    {
      code: ".foo\n{ }"
    },
    {
      code: ".foo\r\n{ }"
    },
    {
      code: ".foo\n\n{ }"
    },
    {
      code: ".foo\r\n\r\n{ }"
    },
    {
      code: ".foo\n\n\n{ }"
    },
    {
      code: ".foo\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo\n\n\n{ }"
    },
    {
      code: ".foo\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo {\n}"
    },
    {
      code: ".foo {\r\n}"
    },
    {
      code: ".foo {\n\n}"
    },
    {
      code: ".foo {\r\n\r\n}"
    },
    {
      code: ".foo {\n\n\n}"
    },
    {
      code: ".foo {\r\n\r\n\r\n}"
    },
    {
      code: ".foo {\n\n\n}"
    },
    {
      code: ".foo {\r\n\r\n\r\n}"
    },
    {
      code: ".foo { }\n"
    },
    {
      code: ".foo { }\r\n"
    },
    {
      code: ".foo { }\n\n"
    },
    {
      code: ".foo { }\r\n\r\n"
    },
    {
      code: ".foo { }\n\n\n"
    },
    {
      code: ".foo { }\r\n\r\n\r\n"
    },
    {
      code: ".foo { }\n\n\n"
    },
    {
      code: ".foo { }\r\n\r\n\r\n"
    },
    {
      code: "\n.foo, .bar { }"
    },
    {
      code: "\r\n.foo, .bar { }"
    },
    {
      code: "\n\n.foo, .bar { }"
    },
    {
      code: "\r\n\r\n.foo, .bar { }"
    },
    {
      code: "\n\n\n.foo, .bar { }"
    },
    {
      code: "\r\n\r\n\r\n.foo, .bar { }"
    },
    {
      code: ".foo, .bar { }"
    },
    {
      code: ".foo,\n.bar { }"
    },
    {
      code: ".foo,\r\n.bar { }"
    },
    {
      code: ".foo, .bar\n{ }"
    },
    {
      code: ".foo, .bar\r\n{ }"
    },
    {
      code: ".foo, .bar\n\n{ }"
    },
    {
      code: ".foo, .bar\r\n\r\n{ }"
    },
    {
      code: ".foo, .bar\n\n\n{ }"
    },
    {
      code: ".foo, .bar\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo, .bar {\n}"
    },
    {
      code: ".foo, .bar {\r\n}"
    },
    {
      code: ".foo, .bar {\n\n}"
    },
    {
      code: ".foo, .bar {\r\n\r\n}"
    },
    {
      code: ".foo, .bar {\n\n\n}"
    },
    {
      code: ".foo, .bar {\r\n\r\n\r\n}"
    },
    {
      code: ".foo, .bar { }\n"
    },
    {
      code: ".foo, .bar { }\r\n"
    },
    {
      code: ".foo, .bar { }\n\n"
    },
    {
      code: ".foo, .bar { }\r\n\r\n"
    },
    {
      code: ".foo, .bar { }\n\n\n"
    },
    {
      code: ".foo, .bar { }\r\n\r\n\r\n"
    },
    {
      code: ".foo .bar { }"
    },
    {
      code: ".foo\n.bar { }"
    },
    {
      code: ".foo\r\n.bar { }"
    },
    {
      code: "\n.foo .bar { }"
    },
    {
      code: "\r\n.foo .bar { }"
    },
    {
      code: "\n\n.foo .bar { }"
    },
    {
      code: "\r\n\r\n.foo .bar { }"
    },
    {
      code: "\n\n\n.foo .bar { }"
    },
    {
      code: "\r\n\r\n\r\n.foo .bar { }"
    },
    {
      code: ".foo .bar\n{ }"
    },
    {
      code: ".foo .bar\r\n{ }"
    },
    {
      code: ".foo .bar\n\n{ }"
    },
    {
      code: ".foo .bar\r\n\r\n{ }"
    },
    {
      code: ".foo .bar\n\n\n{ }"
    },
    {
      code: ".foo .bar\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo .bar {\n}"
    },
    {
      code: ".foo .bar {\r\n}"
    },
    {
      code: ".foo .bar {\n\n}"
    },
    {
      code: ".foo .bar {\r\n\r\n}"
    },
    {
      code: ".foo .bar {\n\n\n}"
    },
    {
      code: ".foo .bar {\r\n\r\n\r\n}"
    },
    {
      code: ".foo .bar { }\n"
    },
    {
      code: ".foo .bar { }\r\n"
    },
    {
      code: ".foo .bar { }\n\n"
    },
    {
      code: ".foo .bar { }\r\n\r\n"
    },
    {
      code: ".foo .bar { }\n\n\n"
    },
    {
      code: ".foo .bar { }\r\n\r\n\r\n"
    },
    {
      code: ".foo > .bar { }"
    },
    {
      code: "\n.foo > .bar { }"
    },
    {
      code: "\r\n.foo > .bar { }"
    },
    {
      code: "\n\n.foo > .bar { }"
    },
    {
      code: "\r\n\r\n.foo > .bar { }"
    },
    {
      code: "\n\n\n.foo > .bar { }"
    },
    {
      code: "\r\n\r\n\r\n.foo > .bar { }"
    },
    {
      code: ".foo\n> .bar { }"
    },
    {
      code: ".foo\r\n> .bar { }"
    },
    {
      code: ".foo >\n.bar { }"
    },
    {
      code: ".foo >\r\n.bar { }"
    },
    {
      code: ".foo > .bar\n{ }"
    },
    {
      code: ".foo > .bar\r\n{ }"
    },
    {
      code: ".foo > .bar\n\n{ }"
    },
    {
      code: ".foo > .bar\r\n\r\n{ }"
    },
    {
      code: ".foo > .bar\n\n\n{ }"
    },
    {
      code: ".foo > .bar\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo > .bar {\n}"
    },
    {
      code: ".foo > .bar {\r\n}"
    },
    {
      code: ".foo > .bar {\n\n}"
    },
    {
      code: ".foo > .bar {\r\n\r\n}"
    },
    {
      code: ".foo > .bar {\n\n\n}"
    },
    {
      code: ".foo > .bar {\r\n\r\n\r\n}"
    },
    {
      code: ".foo > .bar { }\n"
    },
    {
      code: ".foo > .bar { }\r\n"
    },
    {
      code: ".foo > .bar { }\n\n"
    },
    {
      code: ".foo > .bar { }\r\n\r\n"
    },
    {
      code: ".foo > .bar { }\n\n\n"
    },
    {
      code: ".foo > .bar { }\r\n\r\n\r\n"
    },
    {
      code: "\na[itemprop=url] { }"
    },
    {
      code: "\r\na[itemprop=url] { }"
    },
    {
      code: "\n\na[itemprop=url] { }"
    },
    {
      code: "\r\n\r\na[itemprop=url] { }"
    },
    {
      code: "\n\n\na[itemprop=url] { }"
    },
    {
      code: "\r\n\r\n\r\na[itemprop=url] { }"
    },
    {
      code: "a\n[itemprop=url] { }"
    },
    {
      code: "a\r\n[itemprop=url] { }"
    },
    {
      code: "a[\nitemprop=url] { }"
    },
    {
      code: "a[\r\nitemprop=url] { }"
    },
    {
      code: "a[itemprop\n=url] { }"
    },
    {
      code: "a[itemprop\r\n=url] { }"
    },
    {
      code: "a[itemprop=\nurl] { }"
    },
    {
      code: "a[itemprop=\r\nurl] { }"
    },
    {
      code: "a[itemprop=url\n] { }"
    },
    {
      code: "a[itemprop=url\r\n] { }"
    },
    {
      code: "a[itemprop=url]\n{ }"
    },
    {
      code: "a[itemprop=url]\r\n{ }"
    },
    {
      code: "a[itemprop=url]\n\n{ }"
    },
    {
      code: "a[itemprop=url]\r\n\r\n{ }"
    },
    {
      code: "a[itemprop=url]\n\n\n{ }"
    },
    {
      code: "a[itemprop=url]\r\n\r\n\r\n{ }"
    },
    {
      code: "\na:hover { }"
    },
    {
      code: "\r\na:hover { }"
    },
    {
      code: "\n\na:hover { }"
    },
    {
      code: "\r\n\r\na:hover { }"
    },
    {
      code: "\n\n\na:hover { }"
    },
    {
      code: "\r\n\r\n\r\na:hover { }"
    },
    {
      code: "a\n:hover { }"
    },
    {
      code: "a\r\n:hover { }"
    },
    {
      code: "a:\nhover { }"
    },
    {
      code: "a:\r\nhover { }"
    },
    {
      code: "a:hover\n{ }"
    },
    {
      code: "a:hover\r\n{ }"
    },
    {
      code: "a:hover\n\n{ }"
    },
    {
      code: "a:hover\r\n\r\n{ }"
    },
    {
      code: "a:hover\n\n\n{ }"
    },
    {
      code: "a:hover\r\n\r\n\r\n{ }"
    },
    {
      code: "\na::before { }"
    },
    {
      code: "\r\na::before  { }"
    },
    {
      code: "\n\na::before { }"
    },
    {
      code: "\r\n\r\na::before  { }"
    },
    {
      code: "\n\n\na::before { }"
    },
    {
      code: "\r\n\r\n\r\na::before  { }"
    },
    {
      code: "a\n::before  { }"
    },
    {
      code: "a\r\n::before  { }"
    },
    {
      code: "a::\nbefore { }"
    },
    {
      code: "a::\r\nbefore { }"
    },
    {
      code: "a::before\n{ }"
    },
    {
      code: "a::before\r\n{ }"
    },
    {
      code: "a::before\n\n{ }"
    },
    {
      code: "a::before\r\n\r\n{ }"
    },
    {
      code: "a::before\n\n\n{ }"
    },
    {
      code: "a::before\r\n\r\n\r\n{ }"
    },
    {
      code: ":root { --foo: 1px; }",
      description: "custom property in root"
    },
    {
      code: "html { --foo: 1px; }",
      description: "custom property in selector"
    },
    {
      code: ":root { --custom-property-set: {} }",
      description: "custom property set in root"
    },
    {
      code: "html { --custom-property-set: {} }",
      description: "custom property set in selector"
    }
  ],

  reject: [
    {
      code: ".foo\n\n.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 5
    },
    {
      code: ".foo\r\n\r\n.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 5
    },
    {
      code: ".foo,\n\n.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 6
    },
    {
      code: ".foo,\r\n\r\n.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 6
    },
    {
      code: ".foo\n\n,.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 5
    },
    {
      code: ".foo\r\n\r\n,.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 5
    },
    {
      code: ".foo, .bar,\n\n.other { }",
      message: messages.expected(0),
      line: 1,
      column: 12
    },
    {
      code: ".foo, .bar,\r\n\r\n.other { }",
      message: messages.expected(0),
      line: 1,
      column: 12
    },
    {
      code: ".foo,\n.bar,\n\n.other { }",
      message: messages.expected(0),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\r\n.bar,\r\n\r\n.other { }",
      message: messages.expected(0),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\n.bar,\n\n.other\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\r\n.bar,\r\n\r\n.other\r\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\n.bar,\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 6
    },
    {
      code: "\n.foo,\n.bar,\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 3,
      column: 6
    },
    {
      code: "\r\n.foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 3,
      column: 6
    },
    {
      code: "\n\n.foo,\n.bar,\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 4,
      column: 6
    },
    {
      code: "\r\n\r\n.foo,\r\n.bar,\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 4,
      column: 6
    },
    {
      code: ".foo\n\n.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 5
    },
    {
      code: ".foo\r\n\r\n.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 5
    },
    {
      code: ".foo .bar\n\n.other { }",
      message: messages.expected(0),
      line: 1,
      column: 10
    },
    {
      code: ".foo .bar\r\n\r\n.other { }",
      message: messages.expected(0),
      line: 1,
      column: 10
    },
    {
      code: ".foo\n.bar\n\n.other { }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n.other { }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n.bar\n\n.other\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n.other\r\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n.bar\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: "\n.foo\n.bar\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 3,
      column: 5
    },
    {
      code: "\r\n.foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 3,
      column: 5
    },
    {
      code: "\n\n.foo\n.bar\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 4,
      column: 5
    },
    {
      code: "\r\n\r\n.foo\r\n.bar\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 4,
      column: 5
    },
    {
      code: ".foo >\n\n.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 7
    },
    {
      code: ".foo >\r\n\r\n.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 7
    },
    {
      code: ".foo\n\n>.bar { }",
      message: messages.expected(0),
      line: 1,
      column: 5
    },
    {
      code: ".foo\r\n\r\n> .bar { }",
      message: messages.expected(0),
      line: 1,
      column: 5
    },
    {
      code: ".foo .bar >\n\n.other { }",
      message: messages.expected(0),
      line: 1,
      column: 12
    },
    {
      code: ".foo .bar >\r\n\r\n .other { }",
      message: messages.expected(0),
      line: 1,
      column: 12
    },
    {
      code: ".foo .bar\n\n> .other { }",
      message: messages.expected(0),
      line: 1,
      column: 10
    },
    {
      code: ".foo .bar\r\n\r\n> .other { }",
      message: messages.expected(0),
      line: 1,
      column: 10
    },
    {
      code: ".foo\n.bar >\n\n.other { }",
      message: messages.expected(0),
      line: 2,
      column: 7
    },
    {
      code: ".foo\r\n.bar >\r\n\r\n.other { }",
      message: messages.expected(0),
      line: 2,
      column: 7
    },
    {
      code: ".foo\n.bar\n\n> .other { }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n> .other { }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n.bar >\n\n.other\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 7
    },
    {
      code: ".foo\r\n.bar >\r\n\r\n.other\r\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 7
    },
    {
      code: ".foo\n.bar\n\n> .other\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n > .other\r\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n.bar >\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 7
    },
    {
      code: ".foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 7
    },
    {
      code: ".foo\n.bar\n\n> .other\n\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 2,
      column: 5
    },
    {
      code: "\n.foo\n.bar >\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 3,
      column: 7
    },
    {
      code: "\r\n.foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 3,
      column: 7
    },
    {
      code: "\n.foo\n.bar\n\n> .other\n\n{ }",
      message: messages.expected(0),
      line: 3,
      column: 5
    },
    {
      code: "\r\n.foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 3,
      column: 5
    },
    {
      code: "\n\n.foo\n.bar >\n\n.other\n\n{ }",
      message: messages.expected(0),
      line: 4,
      column: 7
    },
    {
      code: "\r\n\r\n.foo\r\n.bar >\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 4,
      column: 7
    },
    {
      code: "\n\n.foo\n.bar\n\n >.other\n\n{ }",
      message: messages.expected(0),
      line: 4,
      column: 5
    },
    {
      code: "\r\n\r\n.foo\r\n.bar\r\n\r\n> .other\r\n\r\n{ }",
      message: messages.expected(0),
      line: 4,
      column: 5
    },
    {
      code: "a[\n\nitemprop=url] { }",
      message: messages.expected(0),
      line: 1,
      column: 3
    },
    {
      code: "a[\r\n\r\nitemprop=url] { }",
      message: messages.expected(0),
      line: 1,
      column: 3
    },
    {
      code: "a[itemprop\n\n=url] { }",
      message: messages.expected(0),
      line: 1,
      column: 11
    },
    {
      code: "a[itemprop\r\n\r\n=url] { }",
      message: messages.expected(0),
      line: 1,
      column: 11
    },
    {
      code: "a[itemprop=\n\nurl] { }",
      message: messages.expected(0),
      line: 1,
      column: 12
    },
    {
      code: "a[itemprop=\r\n\r\nurl] { }",
      message: messages.expected(0),
      line: 1,
      column: 12
    },
    {
      code: "a[itemprop=url\n\n] { }",
      message: messages.expected(0),
      line: 1,
      column: 15
    },
    {
      code: "a[itemprop=url\r\n\r\n] { }",
      message: messages.expected(0),
      line: 1,
      column: 15
    },
    {
      code: "a\n\n:hover { }",
      message: messages.expected(0),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n\r\n:hover { }",
      message: messages.expected(0),
      line: 1,
      column: 2
    },
    {
      code: "a:\n\nhover { }",
      message: messages.expected(0),
      line: 1,
      column: 3
    },
    {
      code: "a:\r\n\r\nhover { }",
      message: messages.expected(0),
      line: 1,
      column: 3
    },
    {
      code: "a\n\n::before { }",
      message: messages.expected(0),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n\r\n::before { }",
      message: messages.expected(0),
      line: 1,
      column: 2
    },
    {
      code: "a::\n\nbefore { }",
      message: messages.expected(0),
      line: 1,
      column: 4
    },
    {
      code: "a::\r\n\r\nbefore { }",
      message: messages.expected(0),
      line: 1,
      column: 4
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [1],

  accept: [
    {
      code: "\n.foo { }"
    },
    {
      code: "\r\n.foo { }"
    },
    {
      code: "\n\n.foo { }"
    },
    {
      code: "\r\n\r\n.foo { }"
    },
    {
      code: "\n\n\n.foo { }"
    },
    {
      code: "\r\n\r\n\r\n.foo { }"
    },
    {
      code: ".foo\n{ }"
    },
    {
      code: ".foo\r\n{ }"
    },
    {
      code: ".foo\n\n{ }"
    },
    {
      code: ".foo\r\n\r\n{ }"
    },
    {
      code: ".foo\n\n\n{ }"
    },
    {
      code: ".foo\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo\n\n\n{ }"
    },
    {
      code: ".foo\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo {\n}"
    },
    {
      code: ".foo {\r\n}"
    },
    {
      code: ".foo {\n\n}"
    },
    {
      code: ".foo {\r\n\r\n}"
    },
    {
      code: ".foo {\n\n\n}"
    },
    {
      code: ".foo {\r\n\r\n\r\n}"
    },
    {
      code: ".foo {\n\n\n}"
    },
    {
      code: ".foo {\r\n\r\n\r\n}"
    },
    {
      code: ".foo { }\n"
    },
    {
      code: ".foo { }\r\n"
    },
    {
      code: ".foo { }\n\n"
    },
    {
      code: ".foo { }\r\n\r\n"
    },
    {
      code: ".foo { }\n\n\n"
    },
    {
      code: ".foo { }\r\n\r\n\r\n"
    },
    {
      code: ".foo { }\n\n\n"
    },
    {
      code: ".foo { }\r\n\r\n\r\n"
    },
    {
      code: "\n.foo, .bar { }"
    },
    {
      code: "\r\n.foo, .bar { }"
    },
    {
      code: "\n\n.foo, .bar { }"
    },
    {
      code: "\r\n\r\n.foo, .bar { }"
    },
    {
      code: "\n\n\n.foo, .bar { }"
    },
    {
      code: "\r\n\r\n\r\n.foo, .bar { }"
    },
    {
      code: ".foo, .bar { }"
    },
    {
      code: ".foo,\n.bar { }"
    },
    {
      code: ".foo,\r\n.bar { }"
    },
    {
      code: ".foo,\n\n.bar { }"
    },
    {
      code: ".foo,\r\n\r\n.bar { }"
    },
    {
      code: ".foo, .bar\n{ }"
    },
    {
      code: ".foo, .bar\r\n{ }"
    },
    {
      code: ".foo, .bar\n\n{ }"
    },
    {
      code: ".foo, .bar\r\n\r\n{ }"
    },
    {
      code: ".foo, .bar\n\n\n{ }"
    },
    {
      code: ".foo, .bar\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo, .bar {\n}"
    },
    {
      code: ".foo, .bar {\r\n}"
    },
    {
      code: ".foo, .bar {\n\n}"
    },
    {
      code: ".foo, .bar {\r\n\r\n}"
    },
    {
      code: ".foo, .bar {\n\n\n}"
    },
    {
      code: ".foo, .bar {\r\n\r\n\r\n}"
    },
    {
      code: ".foo, .bar { }\n"
    },
    {
      code: ".foo, .bar { }\r\n"
    },
    {
      code: ".foo, .bar { }\n\n"
    },
    {
      code: ".foo, .bar { }\r\n\r\n"
    },
    {
      code: ".foo, .bar { }\n\n\n"
    },
    {
      code: ".foo, .bar { }\r\n\r\n\r\n"
    },
    {
      code: ".foo .bar { }"
    },
    {
      code: ".foo\n.bar { }"
    },
    {
      code: ".foo\r\n.bar { }"
    },
    {
      code: ".foo\n\n.bar { }"
    },
    {
      code: ".foo\r\n\r\n.bar { }"
    },
    {
      code: "\n.foo .bar { }"
    },
    {
      code: "\r\n.foo .bar { }"
    },
    {
      code: "\n\n.foo .bar { }"
    },
    {
      code: "\r\n\r\n.foo .bar { }"
    },
    {
      code: "\n\n\n.foo .bar { }"
    },
    {
      code: "\r\n\r\n\r\n.foo .bar { }"
    },
    {
      code: ".foo .bar\n{ }"
    },
    {
      code: ".foo .bar\r\n{ }"
    },
    {
      code: ".foo .bar\n\n{ }"
    },
    {
      code: ".foo .bar\r\n\r\n{ }"
    },
    {
      code: ".foo .bar\n\n\n{ }"
    },
    {
      code: ".foo .bar\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo .bar {\n}"
    },
    {
      code: ".foo .bar {\r\n}"
    },
    {
      code: ".foo .bar {\n\n}"
    },
    {
      code: ".foo .bar {\r\n\r\n}"
    },
    {
      code: ".foo .bar {\n\n\n}"
    },
    {
      code: ".foo .bar {\r\n\r\n\r\n}"
    },
    {
      code: ".foo .bar { }\n"
    },
    {
      code: ".foo .bar { }\r\n"
    },
    {
      code: ".foo .bar { }\n\n"
    },
    {
      code: ".foo .bar { }\r\n\r\n"
    },
    {
      code: ".foo .bar { }\n\n\n"
    },
    {
      code: ".foo .bar { }\r\n\r\n\r\n"
    },
    {
      code: ".foo > .bar { }"
    },
    {
      code: "\n.foo > .bar { }"
    },
    {
      code: "\r\n.foo > .bar { }"
    },
    {
      code: "\n\n.foo > .bar { }"
    },
    {
      code: "\r\n\r\n.foo > .bar { }"
    },
    {
      code: "\n\n\n.foo > .bar { }"
    },
    {
      code: "\r\n\r\n\r\n.foo > .bar { }"
    },
    {
      code: ".foo\n> .bar { }"
    },
    {
      code: ".foo\r\n> .bar { }"
    },
    {
      code: ".foo\n\n> .bar { }"
    },
    {
      code: ".foo\r\n\r\n> .bar { }"
    },
    {
      code: ".foo >\n.bar { }"
    },
    {
      code: ".foo >\r\n.bar { }"
    },
    {
      code: ".foo >\n\n.bar { }"
    },
    {
      code: ".foo >\r\n\r\n.bar { }"
    },
    {
      code: ".foo > .bar\n{ }"
    },
    {
      code: ".foo > .bar\r\n{ }"
    },
    {
      code: ".foo > .bar\n\n{ }"
    },
    {
      code: ".foo > .bar\r\n\r\n{ }"
    },
    {
      code: ".foo > .bar\n\n\n{ }"
    },
    {
      code: ".foo > .bar\r\n\r\n\r\n{ }"
    },
    {
      code: ".foo > .bar {\n}"
    },
    {
      code: ".foo > .bar {\r\n}"
    },
    {
      code: ".foo > .bar {\n\n}"
    },
    {
      code: ".foo > .bar {\r\n\r\n}"
    },
    {
      code: ".foo > .bar {\n\n\n}"
    },
    {
      code: ".foo > .bar {\r\n\r\n\r\n}"
    },
    {
      code: ".foo > .bar { }\n"
    },
    {
      code: ".foo > .bar { }\r\n"
    },
    {
      code: ".foo > .bar { }\n\n"
    },
    {
      code: ".foo > .bar { }\r\n\r\n"
    },
    {
      code: ".foo > .bar { }\n\n\n"
    },
    {
      code: ".foo > .bar { }\r\n\r\n\r\n"
    },
    {
      code: "\na[itemprop=url] { }"
    },
    {
      code: "\r\na[itemprop=url] { }"
    },
    {
      code: "\n\na[itemprop=url] { }"
    },
    {
      code: "\r\n\r\na[itemprop=url] { }"
    },
    {
      code: "\n\n\na[itemprop=url] { }"
    },
    {
      code: "\r\n\r\n\r\na[itemprop=url] { }"
    },
    {
      code: "a\n[itemprop=url] { }"
    },
    {
      code: "a\r\n[itemprop=url] { }"
    },
    {
      code: "a\n\n[itemprop=url] { }"
    },
    {
      code: "a\r\n\r\n[itemprop=url] { }"
    },
    {
      code: "a[\nitemprop=url] { }"
    },
    {
      code: "a[\r\nitemprop=url] { }"
    },
    {
      code: "a[\n\nitemprop=url] { }"
    },
    {
      code: "a[\r\n\r\nitemprop=url] { }"
    },
    {
      code: "a[itemprop\n=url] { }"
    },
    {
      code: "a[itemprop\r\n=url] { }"
    },
    {
      code: "a[itemprop\n\n=url] { }"
    },
    {
      code: "a[itemprop\r\n\r\n=url] { }"
    },
    {
      code: "a[itemprop=\nurl] { }"
    },
    {
      code: "a[itemprop=\r\nurl] { }"
    },
    {
      code: "a[itemprop=\n\nurl] { }"
    },
    {
      code: "a[itemprop=\r\n\r\nurl] { }"
    },
    {
      code: "a[itemprop=url\n] { }"
    },
    {
      code: "a[itemprop=url\r\n] { }"
    },
    {
      code: "a[itemprop=url\n\n] { }"
    },
    {
      code: "a[itemprop=url\r\n\r\n] { }"
    },
    {
      code: "a[itemprop=url]\n{ }"
    },
    {
      code: "a[itemprop=url]\r\n{ }"
    },
    {
      code: "a[itemprop=url]\n\n{ }"
    },
    {
      code: "a[itemprop=url]\r\n\r\n{ }"
    },
    {
      code: "a[itemprop=url]\n\n\n{ }"
    },
    {
      code: "a[itemprop=url]\r\n\r\n\r\n{ }"
    },
    {
      code: "\na:hover { }"
    },
    {
      code: "\r\na:hover { }"
    },
    {
      code: "\n\na:hover { }"
    },
    {
      code: "\r\n\r\na:hover { }"
    },
    {
      code: "\n\n\na:hover { }"
    },
    {
      code: "\r\n\r\n\r\na:hover { }"
    },
    {
      code: "a\n:hover { }"
    },
    {
      code: "a\r\n:hover { }"
    },
    {
      code: "a\n\n:hover { }"
    },
    {
      code: "a\r\n\r\n:hover { }"
    },
    {
      code: "a:\nhover { }"
    },
    {
      code: "a:\r\nhover { }"
    },
    {
      code: "a:\n\nhover { }"
    },
    {
      code: "a:\r\n\r\nhover { }"
    },
    {
      code: "a:hover\n{ }"
    },
    {
      code: "a:hover\r\n{ }"
    },
    {
      code: "a:hover\n\n{ }"
    },
    {
      code: "a:hover\r\n\r\n{ }"
    },
    {
      code: "a:hover\n\n\n{ }"
    },
    {
      code: "a:hover\r\n\r\n\r\n{ }"
    },
    {
      code: "\na::before { }"
    },
    {
      code: "\r\na::before  { }"
    },
    {
      code: "\n\na::before { }"
    },
    {
      code: "\r\n\r\na::before  { }"
    },
    {
      code: "\n\n\na::before { }"
    },
    {
      code: "\r\n\r\n\r\na::before  { }"
    },
    {
      code: "a\n::before  { }"
    },
    {
      code: "a\r\n::before  { }"
    },
    {
      code: "a\n\n::before  { }"
    },
    {
      code: "a\r\n\r\n::before  { }"
    },
    {
      code: "a::\nbefore { }"
    },
    {
      code: "a::\r\nbefore { }"
    },
    {
      code: "a::\n\nbefore { }"
    },
    {
      code: "a::\r\n\r\nbefore { }"
    },
    {
      code: "a::before\n{ }"
    },
    {
      code: "a::before\r\n{ }"
    },
    {
      code: "a::before\n\n{ }"
    },
    {
      code: "a::before\r\n\r\n{ }"
    },
    {
      code: "a::before\n\n\n{ }"
    },
    {
      code: "a::before\r\n\r\n\r\n{ }"
    }
  ],

  reject: [
    {
      code: ".foo\n\n\n.bar { }",
      message: messages.expected(1),
      line: 1,
      column: 5
    },
    {
      code: ".foo\r\n\r\n\r\n.bar { }",
      message: messages.expected(1),
      line: 1,
      column: 5
    },
    {
      code: ".foo,\n\n\n.bar { }",
      message: messages.expected(1),
      line: 1,
      column: 6
    },
    {
      code: ".foo,\r\n\r\n\r\n.bar { }",
      message: messages.expected(1),
      line: 1,
      column: 6
    },
    {
      code: ".foo, .bar,\n\n\n.other { }",
      message: messages.expected(1),
      line: 1,
      column: 12
    },
    {
      code: ".foo, .bar,\r\n\r\n\r\n.other { }",
      message: messages.expected(1),
      line: 1,
      column: 12
    },
    {
      code: ".foo,\n.bar,\n\n\n.other { }",
      message: messages.expected(1),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\r\n.bar,\r\n\r\n\r\n.other { }",
      message: messages.expected(1),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\n\n.bar,\n\n\n.other { }",
      message: messages.expected(1),
      line: 3,
      column: 6
    },
    {
      code: ".foo,\r\n\r\n.bar,\r\n\r\n\r\n.other { }",
      message: messages.expected(1),
      line: 3,
      column: 6
    },
    {
      code: ".foo,\n.bar,\n\n\n.other\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\r\n.bar,\r\n\r\n\r\n.other\r\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\n\n.bar,\n\n\n.other\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 6
    },
    {
      code: ".foo,\r\n\r\n.bar,\r\n\r\n\r\n.other\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 6
    },
    {
      code: ".foo,\n.bar,\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 6
    },
    {
      code: ".foo,\n\n.bar,\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 6
    },
    {
      code: ".foo,\r\n\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 6
    },
    {
      code: "\n.foo,\n.bar,\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 6
    },
    {
      code: "\r\n.foo,\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 6
    },
    {
      code: "\n\n.foo,\n\n.bar,\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 5,
      column: 6
    },
    {
      code: "\r\n\r\n.foo,\r\n\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 5,
      column: 6
    },
    {
      code: "\n\n.foo,\n.bar,\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 4,
      column: 6
    },
    {
      code: "\r\n\r\n.foo,\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 4,
      column: 6
    },
    {
      code: "\n\n\n.foo,\n\n.bar,\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 6,
      column: 6
    },
    {
      code: "\r\n\r\n\r\n.foo,\r\n\r\n.bar,\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 6,
      column: 6
    },
    {
      code: ".foo .bar\n\n\n.other { }",
      message: messages.expected(1),
      line: 1,
      column: 10
    },
    {
      code: ".foo .bar\r\n\r\n\r\n.other { }",
      message: messages.expected(1),
      line: 1,
      column: 10
    },
    {
      code: ".foo\n.bar\n\n\n.other { }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n\r\n.other { }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n\n.bar\n\n\n.other { }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\r\n\r\n.bar\r\n\r\n\r\n.other { }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\n.bar\n\n\n.other\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n\r\n.other\r\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n\n.bar\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\r\n\r\n.bar\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\n.bar\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n\n.bar\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\r\n\r\n.bar\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: "\n.foo\n.bar\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: "\r\n.foo\r\n.bar\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: "\n\n.foo\n\n.bar\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 5,
      column: 5
    },
    {
      code: "\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 5,
      column: 5
    },
    {
      code: "\n\n.foo\n.bar\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 4,
      column: 5
    },
    {
      code: "\r\n\r\n.foo\r\n.bar\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 4,
      column: 5
    },
    {
      code: "\n\n\n.foo\n\n.bar\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 6,
      column: 5
    },
    {
      code: "\r\n\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 6,
      column: 5
    },
    {
      code: ".foo >\n\n\n.bar { }",
      message: messages.expected(1),
      line: 1,
      column: 7
    },
    {
      code: ".foo >\r\n\r\n\r\n.bar { }",
      message: messages.expected(1),
      line: 1,
      column: 7
    },
    {
      code: ".foo\n\n\n>.bar { }",
      message: messages.expected(1),
      line: 1,
      column: 5
    },
    {
      code: ".foo\r\n\r\n\r\n> .bar { }",
      message: messages.expected(1),
      line: 1,
      column: 5
    },
    {
      code: ".foo .bar >\n\n\n.other { }",
      message: messages.expected(1),
      line: 1,
      column: 12
    },
    {
      code: ".foo .bar >\r\n\r\n\r\n .other { }",
      message: messages.expected(1),
      line: 1,
      column: 12
    },
    {
      code: ".foo .bar\n\n\n> .other { }",
      message: messages.expected(1),
      line: 1,
      column: 10
    },
    {
      code: ".foo .bar\r\n\r\n\r\n> .other { }",
      message: messages.expected(1),
      line: 1,
      column: 10
    },
    {
      code: ".foo\n.bar >\n\n\n.other { }",
      message: messages.expected(1),
      line: 2,
      column: 7
    },
    {
      code: ".foo\r\n.bar >\r\n\r\n\r\n.other { }",
      message: messages.expected(1),
      line: 2,
      column: 7
    },
    {
      code: ".foo\n\n.bar >\n\n\n.other { }",
      message: messages.expected(1),
      line: 3,
      column: 7
    },
    {
      code: ".foo\r\n\r\n.bar >\r\n\r\n\r\n.other { }",
      message: messages.expected(1),
      line: 3,
      column: 7
    },
    {
      code: ".foo\n.bar\n\n\n> .other { }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n\r\n> .other { }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n\n.bar\n\n\n> .other { }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\r\n\r\n.bar\r\n\r\n\r\n> .other { }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\n.bar >\n\n\n.other\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 7
    },
    {
      code: ".foo\r\n.bar >\r\n\r\n\r\n.other\r\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 7
    },
    {
      code: ".foo\n\n.bar >\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 7
    },
    {
      code: ".foo\r\n\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 7
    },
    {
      code: ".foo\n.bar\n\n\n> .other\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n\r\n > .other\r\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n\n.bar\n\n\n> .other\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\r\n\r\n.bar\r\n\r\n\r\n > .other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\n.bar >\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 7
    },
    {
      code: ".foo\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 7
    },
    {
      code: ".foo\n\n.bar >\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 7
    },
    {
      code: ".foo\r\n\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 7
    },
    {
      code: ".foo\n.bar\n\n\n> .other\n\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 2,
      column: 5
    },
    {
      code: ".foo\n\n.bar\n\n\n> .other\n\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: ".foo\r\n\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: "\n.foo\n.bar >\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 7
    },
    {
      code: "\r\n.foo\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 7
    },
    {
      code: "\n\n.foo\n\n.bar >\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 5,
      column: 7
    },
    {
      code: "\r\n\r\n.foo\r\n\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 5,
      column: 7
    },
    {
      code: "\n.foo\n.bar\n\n\n> .other\n\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: "\r\n.foo\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 3,
      column: 5
    },
    {
      code: "\n\n.foo\n\n.bar\n\n\n> .other\n\n\n{ }",
      message: messages.expected(1),
      line: 5,
      column: 5
    },
    {
      code: "\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 5,
      column: 5
    },
    {
      code: "\n\n.foo\n.bar >\n\n\n.other\n\n{ }",
      message: messages.expected(1),
      line: 4,
      column: 7
    },
    {
      code: "\r\n\r\n.foo\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 4,
      column: 7
    },
    {
      code: "\n\n\n.foo\n\n.bar >\n\n\n.other\n\n\n{ }",
      message: messages.expected(1),
      line: 6,
      column: 7
    },
    {
      code: "\r\n\r\n\r\n.foo\r\n\r\n.bar >\r\n\r\n\r\n.other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 6,
      column: 7
    },
    {
      code: "\n\n.foo\n.bar\n\n\n >.other\n\n{ }",
      message: messages.expected(1),
      line: 4,
      column: 5
    },
    {
      code: "\r\n\r\n.foo\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n{ }",
      message: messages.expected(1),
      line: 4,
      column: 5
    },
    {
      code: "\n\n\n.foo\n\n.bar\n\n\n >.other\n\n\n{ }",
      message: messages.expected(1),
      line: 6,
      column: 5
    },
    {
      code: "\r\n\r\n\r\n.foo\r\n\r\n.bar\r\n\r\n\r\n> .other\r\n\r\n\r\n{ }",
      message: messages.expected(1),
      line: 6,
      column: 5
    },
    {
      code: "a[\n\n\nitemprop=url] { }",
      message: messages.expected(1),
      line: 1,
      column: 3
    },
    {
      code: "a[\r\n\r\n\r\nitemprop=url] { }",
      message: messages.expected(1),
      line: 1,
      column: 3
    },
    {
      code: "a[itemprop\n\n\n=url] { }",
      message: messages.expected(1),
      line: 1,
      column: 11
    },
    {
      code: "a[itemprop\r\n\r\n\r\n=url] { }",
      message: messages.expected(1),
      line: 1,
      column: 11
    },
    {
      code: "a[itemprop=\n\n\nurl] { }",
      message: messages.expected(1),
      line: 1,
      column: 12
    },
    {
      code: "a[itemprop=\r\n\r\n\r\nurl] { }",
      message: messages.expected(1),
      line: 1,
      column: 12
    },
    {
      code: "a[itemprop=url\n\n\n] { }",
      message: messages.expected(1),
      line: 1,
      column: 15
    },
    {
      code: "a[itemprop=url\r\n\r\n\r\n] { }",
      message: messages.expected(1),
      line: 1,
      column: 15
    },
    {
      code: "a\n\n\n:hover { }",
      message: messages.expected(1),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n\r\n\r\n:hover { }",
      message: messages.expected(1),
      line: 1,
      column: 2
    },
    {
      code: "a:\n\n\nhover { }",
      message: messages.expected(1),
      line: 1,
      column: 3
    },
    {
      code: "a:\r\n\r\n\r\nhover { }",
      message: messages.expected(1),
      line: 1,
      column: 3
    },
    {
      code: "a\n\n\n::before { }",
      message: messages.expected(1),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n\r\n\r\n::before { }",
      message: messages.expected(1),
      line: 1,
      column: 2
    },
    {
      code: "a::\n\n\nbefore { }",
      message: messages.expected(1),
      line: 1,
      column: 4
    },
    {
      code: "a::\r\n\r\n\r\nbefore { }",
      message: messages.expected(1),
      line: 1,
      column: 4
    }
  ]
});
