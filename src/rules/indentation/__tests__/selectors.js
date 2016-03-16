/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [2],
  skipBasicChecks: true,

  accept: [{
    code: "a { color: pink; }",
  }, {
    code: "a,\n" +
    "b { color: pink; }",
  }, {
    code: "a,\n" +
    "b,\n" +
    "c { color: pink; }",
  }, {
    code: "@media print {\n" +
    "  a,\n" +
    "  b { color: pink;}\n" +
    "}",
  }],

  reject: [{
    code: "a,\n" +
    "  b { color: pink; }",

    message: messages.expected("0 spaces"),
    line: 2,
    column: 1,
  }, {
    code: "a,\n" +
    "b,\n" +
    " c { color: pink; }",

    message: messages.expected("0 spaces"),
    line: 3,
    column: 1,
  }, {
    code: "@media print {\n" +
    "  a,\n" +
    "b { color: pink;}\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 3,
    column: 1,
  }, {
    code: "@media print {\n" +
    "  a,\n" +
    "   b { color: pink;}\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 3,
    column: 1,
  }, {
    code: "@media print {\n" +
    "   a,\n" +
    "  b { color: pink;}\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 2,
    column: 4,
  }],
})
