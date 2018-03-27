"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: ".foo.bar {}"
    },
    {
      code: ".foo .bar {}"
    },
    {
      code: ".foo>.bar {}"
    },
    {
      code: ".foo > .bar {}"
    },
    {
      code: ".foo  >  .bar {}"
    },
    {
      code: ".foo\n>\n.bar {}"
    },
    {
      code: ".foo\r\n>\r\n.bar {}"
    },
    {
      code: ".foo >>> .bar {}",
      description: "shadow-piercing descendant combinator"
    },
    {
      code: ".foo  >>>  .bar {}",
      description: "shadow-piercing descendant combinator"
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
      code: ".foo  .bar {}",
      message: messages.rejected("  "),
      line: 1,
      column: 5
    },
    {
      code: ".foo\t.bar {}",
      message: messages.rejected("\t"),
      line: 1,
      column: 5
    },
    {
      code: ".foo\n.bar {}",
      message: messages.rejected("\n"),
      line: 1,
      column: 5
    },
    {
      code: ".foo\r\n.bar {}",
      message: messages.rejected("\r\n"),
      line: 1,
      column: 5
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "less",

  accept: [
    {
      code: ":hover when (@variable = true) { color: red; }"
    },
    {
      code: "a:hover when (@variable = true) { color: red; }"
    }
  ]
});
