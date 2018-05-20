"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["foo-.+"],

  accept: [
    {
      code: "@keyframes foo-bar {}",
      description: "Normal"
    },
    {
      code: " @keyframes   foo-bar   {}",
      description: "Whitespace"
    }
  ],

  reject: [
    {
      code: "@keyframes foo {}",
      message: messages.expected("foo"),
      line: 1,
      column: 12
    },
    {
      code: "@keyframes bar {}",
      message: messages.expected("bar"),
      line: 1,
      column: 12
    },
    {
      code: "@keyframes FOO-bar {}",
      message: messages.expected("FOO-bar"),
      line: 1,
      column: 12
    }
  ]
});
