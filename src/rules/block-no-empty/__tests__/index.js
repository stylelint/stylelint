import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [undefined],
  skipBasicChecks: true,

  accept: [ {
    code: "",
  }, {
    code: "@import \"foo.css\";",
  }, {
    code: "a { color: pink; }",
  }, {
    code: "@media print { a { color: pink; } }",
  }, {
    code: "@import url(x.css)",
  } ],

  reject: [ {
    code: "a {}",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a { }",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a {\n}",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "@media print {}",
    message: messages.rejected,
    line: 1,
    column: 14,
  }, {
    code: "@media print { a {} }",
    message: messages.rejected,
    line: 1,
    column: 18,
  } ],
})

testRule(rule, {
  ruleName,
  config: [undefined],
  skipBasicChecks: true,
  syntax: "sugarss",

  reject: [{
    code: ".a",
    message: messages.rejected,
    line: 1,
    column: 2,
  }],
})
