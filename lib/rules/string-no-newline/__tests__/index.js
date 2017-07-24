"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: "a::before { content: 'one'; }",
      description: "without newline"
    },
    {
      code: "a::before { content: 'one\\ntwo'; }",
      description: "with escaped slash-slash-n newline"
    },
    {
      code: "a::before { content: 'one\\Atwo'; }",
      description: "with escaped slash-A newline"
    },
    {
      code: `a::before {
      content: 'one\
      two';
    }`,

      description: "with escaped slash at end of real line"
    },
    {
      code: `p[href^="https://"]:before {
      top: 0;
    }`,

      description: "attribute containing double-slash"
    }
  ],

  reject: [
    {
      code: "a::before { content: 'one\ntwo'; }",
      message: messages.rejected,
      line: 1,
      column: 26
    },
    {
      code: "a::before { content: 'one\r\ntwo'; }",
      description: "CRLF",
      message: messages.rejected,
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "/// it's within a comment\na {}"
    }
  ]
});
