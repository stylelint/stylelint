import { messages, ruleName } from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

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
