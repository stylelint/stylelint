"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,

  accept: [
    {
      code: ""
    },
    {
      code: "\n"
    },
    {
      code: "a { color: pink; }\n"
    },
    {
      code: "a { color: pink; }\r\n"
    },
    {
      code: "a { color: pink; }\n\n\n"
    },
    {
      code: "a { color: pink; }\r\n\r\n\r\n"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.rejected,
      line: 1,
      column: 18
    },
    {
      code: "a { color: pink; }\n\n\nb{ color: orange; }",
      message: messages.rejected,
      line: 4,
      column: 19
    },
    {
      code: "a { color: pink; }\r\n\r\n\r\nb{ color: orange; }",
      message: messages.rejected,
      line: 4,
      column: 19
    },
    {
      code: "&.active {\n    top:\n    .tab {}\n}",
      message: messages.rejected,
      line: 4,
      column: 1
    },
    {
      code: "&.active {\r\n    top:\r\n    .tab {}\r\n}",
      message: messages.rejected,
      line: 4,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "sugarss",

  accept: [
    {
      code: "a\n"
    },
    {
      code: "a\r\n"
    }
  ],

  reject: [
    {
      code: "a",
      message: messages.rejected,
      line: 1,
      column: 1
    },
    {
      code: "body\n  padding: 5% 2% 5%",
      message: messages.rejected,
      line: 2,
      column: 17
    },
    {
      code: "body\r\n  padding: 5% 2% 5%",
      message: messages.rejected,
      line: 2,
      column: 17
    }
  ]
});
