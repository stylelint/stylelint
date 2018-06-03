"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: "a:focus { }"
    },
    {
      code: "a:hover, a:focus { }"
    },
    {
      code: "a:hover { } a:focus { }"
    }
  ],

  reject: [
    {
      code: "a:hover { }",
      message: messages.expected("a:hover"),
      line: 1,
      column: 4
    }
  ]
});
