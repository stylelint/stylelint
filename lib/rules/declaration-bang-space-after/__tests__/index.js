"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "a { color: pink; }",
      description: "no !important"
    },
    {
      code: "a { color: pink! important; }",
      description: "space only after"
    },
    {
      code: "a { color: pink ! default; }",
      description: "space before and after"
    },
    {
      code: "a { color: pink\n! important; }",
      description: "newline before and space after"
    },
    {
      code: "a { color: pink\r\n! optional; }",
      description: "CRLF before and space after"
    },
    {
      code: 'a::before { content: "!!!" ! important; }',
      description: "ignores string"
    },
    {
      code: "a { color: pink /* !important */;}",
      description: "violating comment"
    }
  ],

  reject: [
    {
      code: "a { color: pink!important; }",
      description: "no space after",
      message: messages.expectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink!  global; }",
      description: "two spaces after",
      message: messages.expectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink!\nimportant; }",
      description: "newline after",
      message: messages.expectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink!\r\nexciting; }",
      description: "CRLF after",
      message: messages.expectedAfter(),
      line: 1,
      column: 16
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
      description: "no space before or after"
    },
    {
      code: "a { color: pink !important; }",
      description: "space before and none after"
    },
    {
      code: "a { color: pink\n!important; }",
      description: "newline before and none after"
    },
    {
      code: "a { color: pink\r\n!important; }",
      description: "CRLF before and none after"
    }
  ],

  reject: [
    {
      code: "a { color: pink! important; }",
      description: "space after",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink!\nimportant; }",
      description: "newline after",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink!\r\nimportant; }",
      description: "CRLF after",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    }
  ]
});
