"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [">", "/\\s+/"],
  skipBasicChecks: true,

  accept: [
    {
      code: "a {}"
    },
    {
      code: "a, b {}"
    },
    {
      code: "a /for/ b {}"
    },
    {
      code: "a + b {}"
    },
    {
      code: "a:not(b ~ c) {}"
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
      message: messages.rejected("\t"),
      line: 1,
      column: 2
    },
    {
      code: "a\n\tb {}",
      message: messages.rejected("\n\t"),
      line: 1,
      column: 2
    },
    {
      code: "a,\nb c {}",
      message: messages.rejected(" "),
      line: 2,
      column: 2
    },
    {
      code: "a:not(b > c) {}",
      message: messages.rejected(">"),
      line: 1,
      column: 9
    },
    {
      code: "a > b {}",
      message: messages.rejected(">"),
      line: 1,
      column: 3
    }
  ]
});
