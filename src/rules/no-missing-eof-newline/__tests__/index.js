import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],
  skipBasicChecks: true,

  accept: [ {
    code: "",
  }, {
    code: "\n",
  }, {
    code: "a { color: pink; }\n",
  }, {
    code: "a { color: pink; }\n\n\n",
  } ],

  reject: [ {
    code: "a { color: pink; }",
    message: messages.rejected,
    line: 1,
    column: 18,
  }, {
    code: "a { color: pink; }\n\n\nb{ color: orange; }",
    message: messages.rejected,
    line: 4,
    column: 19,
  } ],
})
