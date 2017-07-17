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
      code: "a { color :pink }",
      description: "space only before"
    },
    {
      code: "a { color : pink }",
      description: "space before and after"
    },
    {
      code: "a { color :\npink }",
      description: "space before and newline after"
    },
    {
      code: "a { color :\r\npink }",
      description: "space before and CRLF after"
    },
    {
      code: "$map:(key:value)",
      description: "SCSS map with no newlines"
    },
    {
      code: "$list:('value1', 'value2')",
      description: "SCSS list with no newlines"
    },
    {
      code: "a { background : url(data:application/font-woff;...); }",
      description: "data URI"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      description: "no space before",
      message: messages.expectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { color  : pink; }",
      description: "two spaces before",
      message: messages.expectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { color\t: pink; }",
      description: "tab before",
      message: messages.expectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { color\n: pink; }",
      description: "newline before",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { color\r\n: pink; }",
      description: "CRLF before",
      message: messages.expectedBefore(),
      line: 1,
      column: 11
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a { color:pink }",
      description: "no space before and after"
    },
    {
      code: "a { color: pink }",
      description: "no space before and space after"
    },
    {
      code: "a { color:\npink }",
      description: "no space before and newline after"
    },
    {
      code: "a { color:\r\npink }",
      description: "no space before and CRLF after"
    },
    {
      code: "$map :(key :value)",
      description: "SCSS map with no newlines"
    }
  ],

  reject: [
    {
      code: "a { color : pink; }",
      description: "space before",
      message: messages.rejectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { color  : pink; }",
      description: "two spaces before",
      message: messages.rejectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { color\t: pink; }",
      description: "tab before",
      message: messages.rejectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { color\n: pink; }",
      description: "newline before",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { color\r\n: pink; }",
      description: "CRLF before",
      message: messages.rejectedBefore(),
      line: 1,
      column: 11
    }
  ]
});
