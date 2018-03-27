"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: 'a { font-family: "Lucida Grande", "Arial", sans-serif; }'
    },
    {
      code: "a { font: 1em \"Lucida Grande\", 'Arial', sans-serif; }"
    },
    {
      code:
        'a { font: 1em "Lucida Grande", \'Arial\', "sans-serif", sans-serif; }'
    },
    {
      code: "a { font-family: Times, serif; }"
    },
    {
      code: "b { font-family: inherit; }"
    },
    {
      code: "b { font-family: inherit; }"
    },
    {
      code: "b { font-family: initial; }"
    },
    {
      code: "b { font-family: unset; }"
    },
    {
      code: "b { font-family: serif; }"
    },
    {
      code: "b { font-family: sans-serif; }"
    },
    {
      code: "b { font-family: Courier, monospace; }"
    },
    {
      code: 'b { font: 1em/1.5 "Whatever Fanciness", cursive; }'
    },
    {
      code: "a { font-family: Helvetica Neue, sans-serif, Apple Color Emoji; }"
    },
    {
      code: "@font-face { font-family: Gentium; }"
    },
    {
      code: "@FONT-FACE { font-family: Gentium; }"
    }
  ],

  reject: [
    {
      code: "a { font-family: Arial; }",
      message: messages.rejected,
      line: 1,
      column: 18
    },
    {
      code: "a { font-family: 'Arial', \"Lucida Grande\", Arial; }",
      message: messages.rejected,
      line: 1,
      column: 44
    },
    {
      code: "a { fOnT-fAmIlY: '  Lucida Grande '; }",
      message: messages.rejected,
      line: 1,
      column: 18
    },
    {
      code: "a { font-family: Times; }",
      message: messages.rejected,
      line: 1,
      column: 18
    },
    {
      code: 'a { FONT: italic 300 16px/30px Arial, " Arial"; }',
      message: messages.rejected,
      line: 1,
      column: 39
    },
    {
      code: "b { font: normal 14px/32px -apple-system, BlinkMacSystemFont; }",
      message: messages.rejected,
      line: 1,
      column: 43
    },
    {
      code: 'a { font: 1em Lucida Grande, Arial, "sans-serif" }',
      message: messages.rejected,
      line: 1,
      column: 37
    }
  ]
});
