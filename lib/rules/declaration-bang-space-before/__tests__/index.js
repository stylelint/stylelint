"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "a { color: pink; }",
      description: "no !important"
    },
    {
      code: "a { color: pink !important; }",
      description: "space only before"
    },
    {
      code: "a { color: pink ! important; }",
      description: "space before and after"
    },
    {
      code: "a { color: pink !\noptional; }",
      description: "space before and newline after"
    },
    {
      code: "a { color: pink !\r\nimportant; }",
      description: "space before and CRLF after"
    },
    {
      code: 'a::before { content: "!!!" !default; }',
      description: "ignores string"
    },
    {
      code: "a { color: pink/*!important */;}",
      description: "violating comment"
    }
  ],

  reject: [
    {
      code: "a { color: pink  !important; }",
      description: "two spaces before",
      message: messages.expectedBefore(),
      line: 1,
      column: 18
    },
    {
      code: "a { color: pink!default; }",
      description: "no space before",
      message: messages.expectedBefore(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink\n!important; }",
      description: "newline before",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { color: pink\r\n!something; }",
      description: "CRLF before",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a { color: pink; }",
      description: "no !important"
    },
    {
      code: "a { color: pink!important; }",
      description: "no spaces"
    },
    {
      code: "a { color: pink! important; }",
      description: "no space before and after"
    },
    {
      code: "a { color: pink!\nimportant; }",
      description: "no space before and newline after"
    },
    {
      code: "a { color: pink!\r\nimportant; }",
      description: "no space before and CRLF after"
    }
  ],

  reject: [
    {
      code: "a { color: pink !important; }",
      description: "space before",
      message: messages.rejectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink\n!important; }",
      description: "newline before",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { color: pink\r\n!important; }",
      description: "CRLF before",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    }
  ]
});
