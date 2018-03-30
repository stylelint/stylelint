"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "@media (max-width :600px) {}"
    },
    {
      code: "@mEdIa (max-width :600px) {}"
    },
    {
      code: "@MEDIA (max-width :600px) {}"
    },
    {
      code: "@media (max-width : 600px) {}"
    },
    {
      code: "@media (max-width :600px) and (min-width :3em) {}"
    },
    {
      code: "@custom-selector:--enter :hover;"
    }
  ],

  reject: [
    {
      code: "@media (max-width:600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 18
    },
    {
      code: "@mEdIa (max-width:600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 18
    },
    {
      code: "@MEDIA (max-width:600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width  :600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 20
    },
    {
      code: "@media (max-width\t:600px) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 19
    },
    {
      code: "@media (max-width\n:600px) {}",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "@media (max-width\r\n:600px) {}",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "@media (max-width:600px) and (min-width :3em) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width :600px) and (min-width:3em) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 41
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "@media (max-width:600px) {}"
    },
    {
      code: "@mEdIa (max-width:600px) {}"
    },
    {
      code: "@MEDIA (max-width:600px) {}"
    },
    {
      code: "@media (max-width: 600px) {}"
    },
    {
      code: "@media (max-width:600px) and (min-width:3em) {}"
    },
    {
      code: "@custom-selector :--enter :hover;"
    }
  ],

  reject: [
    {
      code: "@media (max-width :600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 19
    },
    {
      code: "@mEdIa (max-width :600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 19
    },
    {
      code: "@MEDIA (max-width :600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 19
    },
    {
      code: "@media (max-width  :600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 20
    },
    {
      code: "@media (max-width\t:600px) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 19
    },
    {
      code: "@media (max-width\n:600px) {}",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "@media (max-width\r\n:600px) {}",
      description: "CRLF",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "@media (max-width:600px) and (min-width :3em) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 41
    },
    {
      code: "@media (max-width :600px) and (min-width:3em) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 19
    }
  ]
});
