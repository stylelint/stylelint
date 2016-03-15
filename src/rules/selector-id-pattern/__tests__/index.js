/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/blueTapeStylelintAssert"
import { mergeTestDescriptions } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const basicAZTests = {
  accept: [{
    code: "a {}",
  }, {
    code: ".foo {}",
  }, {
    code: "[foo='bar'] {}",
  }, {
    code: "#FOO {}",
  }, {
    code: "a .foo > [foo='bar'], #FOO {}",
  }, {
    code: "a /* #foo */ {}",
  }, {
    code: ":root { --custom-property-set: {} }",
  }],

  reject: [{
    code: "a #foo {}",
    message: messages.expected("foo"),
    line: 1,
    column: 3,
  }, {
    code: "#ABABA > #bar {}",
    message: messages.expected("bar"),
    line: 1,
    column: 10,
  }],
}

testRule(rule, mergeTestDescriptions(basicAZTests, {
  ruleName: ruleName,
  config: [/^[A-Z]+$/],
}))

testRule(rule, mergeTestDescriptions(basicAZTests, {
  ruleName: ruleName,
  config: ["^[A-Z]+$"],
}))
