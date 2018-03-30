"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "@media (width = 600px) {}"
    },
    {
      code: "@mEdIa (width = 600px) {}"
    },
    {
      code: "@MEDIA (width = 600px) {}"
    },
    {
      code: "@media (width >600px) {}"
    },
    {
      code: "@media (width >= 600px) and (width <= 3em) {}"
    }
  ],

  reject: [
    {
      code: "@media (width< 600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 13
    },
    {
      code: "@mEdIa (width< 600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 13
    },
    {
      code: "@MEDIA (width< 600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 13
    },
    {
      code: "@media (width  <= 600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 15
    },
    {
      code: "@media (width\t= 600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 14
    },
    {
      code: "@media (width\n> 600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 14
    },
    {
      code: "@media (width\r\n> 600px) {}",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 1,
      column: 15
    },
    {
      code: "@media (width>= 600px) and (width < 3em) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 13
    },
    {
      code: "@media (width > 600px) and (width= 3em) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 33
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "@media (width= 600px) {}"
    },
    {
      code: "@mEdIa (width= 600px) {}"
    },
    {
      code: "@MEDIA (width= 600px) {}"
    },
    {
      code: "@media (width>600px) {}"
    },
    {
      code: "@media (width>= 600px) and (width<= 3em) {}"
    }
  ],

  reject: [
    {
      code: "@media (width < 600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 14
    },
    {
      code: "@mEdIa (width < 600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 14
    },
    {
      code: "@MEDIA (width < 600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 14
    },
    {
      code: "@media (width  <= 600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 15
    },
    {
      code: "@media (width\t= 600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 14
    },
    {
      code: "@media (width\n> 600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 14
    },
    {
      code: "@media (width\r\n> 600px) {}",
      description: "CRLF",
      message: messages.rejectedBefore(),
      line: 1,
      column: 15
    },
    {
      code: "@media (width>= 600px) and (width < 3em) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 34
    },
    {
      code: "@media (width > 600px) and (width= 3em) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 14
    }
  ]
});
