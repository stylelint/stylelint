import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["tab"],

  accept: [ {
    code: "/* blergh */",
  }, {
    code: ".foo {\n" +
    "\t/* blergh */\n" +
    "\ttop: 0;\n" +
    "}",
  }, {
    code: "@media print {\n" +
    "\t.foo {\n" +
    "\t\t/* blergh */\n" +
    "\t\ttop: 0;\n" +
    "\t}\n" +
    "}",
  } ],

  reject: [ {
    code: " /* blergh */",
    message: messages.expected("0 tabs"),
    line: 1,
    column: 2,
  }, {
    code: ".foo {\n" +
    "\t\t/* blergh */\n" +
    "\ttop: 0;\n" +
    "}",

    message: messages.expected("1 tab"),
    line: 2,
    column: 3,
  }, {
    code: "@media print {\n" +
    "\t.foo {\n" +
    "\t/* blergh */\n" +
    "\t\ttop: 0;\n" +
    "\t}\n" +
    "}",

    message: messages.expected("2 tabs"),
    line: 3,
    column: 2,
  } ],
})
