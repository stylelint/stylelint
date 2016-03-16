/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [{
    code: "foo {}",
  }, {
    code: ".bar {}",
  }, {
    code: "foo .bar {}",
  }, {
    code: ":root { --custom-property-set: {} }",
  }],

  reject: [{
    code: "[foo] {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "a[rel=\"external\"] {}",
    message: messages.rejected,
    line: 1,
    column: 2,
  }, {
    code: "a, .foo[type=\"text\"] {}",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: "a > [foo] {}",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a[rel='external'] {}",
    message: messages.rejected,
    line: 1,
    column: 2,
  }],
})