import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: "foo {}",
  }, {
    code: "#foo {}",
  }, {
    code: ".foo {}",
  }, {
    code: "[foo] {}",
  }, {
    code: ":root { --custom-property-set: {} }",
  } ],

  reject: [ {
    code: "* {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".bar * {}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: "*.bar {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".foo, .bar, *.baz {}",
    message: messages.rejected,
    line: 1,
    column: 13,
  } ],
})
