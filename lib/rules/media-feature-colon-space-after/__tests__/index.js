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
      code: "@media (max-width: 600px) {}"
    },
    {
      code: "@mEdIa (max-width: 600px) {}"
    },
    {
      code: "@MEDIA (max-width: 600px) {}"
    },
    {
      code: "@media (max-width : 600px) {}"
    },
    {
      code: "@media (max-width: 600px) and (min-width: 3em) {}"
    },
    {
      code: "@custom-selector :--enter :hover;"
    }
  ],

  reject: [
    {
      code: "@media (max-width:600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@mEdIa (max-width:600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@MEDIA (max-width:600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:  600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:\t600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:\n600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:\r\n600px) {}",
      description: "CRLF",
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:600px) and (min-width: 3em) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width: 600px) and (min-width:3em) {}",
      message: messages.expectedAfter(),
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
      code: "@media (max-width:600px) and (min-width:3em) {}"
    },
    {
      code: "@custom-selector : --enter :hover;"
    }
  ],

  reject: [
    {
      code: "@media (max-width: 600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@mEdIa (max-width: 600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@MEDIA (max-width: 600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:  600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:\t600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:\n600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:\r\n600px) {}",
      description: "CRLF",
      message: messages.rejectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "@media (max-width:600px) and (min-width: 3em) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 40
    },
    {
      code: "@media (max-width: 600px) and (min-width:3em) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 18
    }
  ]
});
