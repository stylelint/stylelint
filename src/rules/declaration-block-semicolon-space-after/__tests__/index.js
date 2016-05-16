import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a { color: pink;; }",
    description: "ignore extra semicolon",
  }, {
    code: "a { color: pink; }",
  }, {
    code: "a::before { content: \";a\"; }",
  }, {
    code: "a { color: pink; top: 0;}",
    description: "no space between trailing semicolon and closing brace",
  }, {
    code: "a { color: pink; top: 0}",
  }, {
    code: "a { color: pink;; top: 0}",
    description: "ignore extra semicolon",
  } ],

  reject: [ {
    code: "a { color: pink;top: 0; }",
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;;top: 0;; }",
    description: "ignore extra semicolon",
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;  top: 0; }",
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;\ntop: 0; }",
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;\r\ntop: 0; }",
    description: "CRLF",
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;\ttop: 0; }",
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a { color: pink;; }",
    description: "ignore extra semicolon",
  }, {
    code: "a::before { content: \";a\"; }",
  }, {
    code: "a { color: pink; top: 0;}",
    description: "no space between trailing semicolon and closing brace",
  }, {
    code: "a { color: pink;; top: 0;;}",
    description: "ignore extra semicolon",
  }, {
    code: "a,\nb { color: pink; top: 0; }",
    description: "multi-line rule, single-line declaration-block",
  }, {
    code: "a,\r\nb { color: pink; top: 0; }",
    description: "multi-line rule, single-line declaration-block and CRLF",
  }, {
    code: "a {\n  color: pink;\n  top: 0;\n}",
  }, {
    code: "a {\r\n  color: pink;\r\n  top: 0;\r\n}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "a { color: pink;top: 0; }",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;;top: 0;; }",
    description: "ignore extra semicolon",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 17,
  }, {
    code: "a,\nb { color: pink;top: 0; }",
    message: messages.expectedAfterSingleLine(),
    line: 2,
    column: 17,
  }, {
    code: "a,\r\nb { color: pink;top: 0; }",
    description: "CRLF",
    message: messages.expectedAfterSingleLine(),
    line: 2,
    column: 17,
  }, {
    code: "a { color: pink;  top: 0; }",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;\ttop: 0; }",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 17,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a { color: pink;; }",
    description: "ignore extra semicolon",
  }, {
    code: "a::before { content: \"; a\"; }",
  }, {
    code: "a { color: pink;top: 0; }",
    description: "space between trailing semicolon and closing brace",
  }, {
    code: "a { color: pink;;top: 0;; }",
    description: "ignore extra semicolon",
  }, {
    code: "a,\nb { color: pink;top: 0; }",
    description: "multi-line rule, single-line declaration-block",
  }, {
    code: "a {\n  color: pink; top: 0;\n}",
  }, {
    code: "a {\r\n  color: pink; top: 0;\r\n}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "a { color: pink; top: 0; }",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;; top: 0;; }",
    description: "ignore extra semicolon",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 17,
  }, {
    code: "a,\nb { color: pink; top: 0; }",
    message: messages.rejectedAfterSingleLine(),
    line: 2,
    column: 17,
  }, {
    code: "a,\r\nb { color: pink; top: 0; }",
    description: "CRLF",
    message: messages.rejectedAfterSingleLine(),
    line: 2,
    column: 17,
  }, {
    code: "a { color: pink;  top: 0; }",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 17,
  }, {
    code: "a { color: pink;\ttop: 0; }",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 17,
  } ],
})
