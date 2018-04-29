"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [">", " "],
  skipBasicChecks: true,

  accept: [
    {
      code: "a {}"
    },
    {
      code: "a, b {}"
    },
    {
      code: "a > b {}"
    },
    {
      code: "a:not(b > c) {}"
    },
    {
      code: "a b {}"
    },
    {
      code: "a\tb {}"
    },
    {
      code: "a\nb {}"
    }
  ],

  reject: [
    {
      code: "a /for/ b {}",
      message: messages.rejected("/for/"),
      line: 1,
      column: 3
    },
    {
      code: "a ~ b {}",
      message: messages.rejected("~"),
      line: 1,
      column: 3
    },
    {
      code: "a:not(b ~ c) {}",
      message: messages.rejected("~"),
      line: 1,
      column: 9
    },
    {
      code: "a,\nb + c {}",
      message: messages.rejected("+"),
      line: 2,
      column: 3
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["~"],
  skipBasicChecks: true,

  accept: [
    {
      code: "a ~ b {}"
    }
  ],

  reject: [
    {
      code: "a b {}",
      message: messages.rejected(" "),
      line: 1,
      column: 2
    },
    {
      code: "a\tb {}",
      message: messages.rejected(" "),
      line: 1,
      column: 2
    },
    {
      code: "a\n\tb {}",
      message: messages.rejected(" "),
      line: 1,
      column: 2
    }
  ]
});
