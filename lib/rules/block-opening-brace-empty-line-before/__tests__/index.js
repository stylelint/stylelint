"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a { color: pink; }"
    }
  ],

  reject: [
    {
      code: "a\n\n{ color: pink; }",
      message: messages.rejected,
      line: 3,
      column: 1
    }
  ]
});
