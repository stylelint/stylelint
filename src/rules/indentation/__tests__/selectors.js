import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [2],
  skipBasicChecks: true,

  accept: [ {
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
  }, {
    code: "a {\n" +
    "  @nest b & ,\n" +
    "  &.foo {\n" +
    "    color: pink;\n" +
    "  }\n" +
    "}",
  } ],

  reject: [ {
    code: "a,\n" +
    "  b { color: pink; }",

    message: messages.expected("0 spaces"),
    line: 2,
    column: 3,
  }, {
    code: "a,\n" +
    "b,\n" +
    " c { color: pink; }",

    message: messages.expected("0 spaces"),
    line: 3,
    column: 2,
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
    column: 4,
  }, {
    code: "@media print {\n" +
    "   a,\n" +
    "  b { color: pink;}\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 2,
    column: 4,
  } ],
})
