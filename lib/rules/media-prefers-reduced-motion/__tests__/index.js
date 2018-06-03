"use strict";

const rule = require("..");
const { ruleName, messages } = rule;

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code:
        ".foo { transition: none } @media screen and (prefers-reduced-motion: reduce) { .foo { transition: none } }"
    },
    {
      code:
        ".bar { animation: none } @media screen and (prefers-reduced-motion) { .bar { animation: none } }"
    }
  ],

  reject: [
    {
      code: ".foo { transition: none }",
      message: messages.expected(".foo"),
      line: 1,
      column: 4
    },
    {
      code:
        ".bar { animation: none } .baz { transition: none } @media screen and (prefers-reduced-motion) { .baz { transition: none } }",
      message: messages.expected(".bar"),
      line: 1,
      column: 4
    },
    {
      code:
        ".foo { animation: none } @media screen and (prefers-reduced-motion) { .foo { transition: none } }",
      message: messages.expected(".foo"),
      line: 1,
      column: 4
    }
  ]
});
