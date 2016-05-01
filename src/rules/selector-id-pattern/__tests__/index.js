import { testRule } from "../../../testUtils"

import { mergeTestDescriptions } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const basicAZTests = {
  accept: [ {
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
  } ],

  reject: [ {
    code: "a #foo {}",
    message: messages.expected("foo"),
    line: 1,
    column: 3,
  }, {
    code: "#ABABA > #bar {}",
    message: messages.expected("bar"),
    line: 1,
    column: 10,
  } ],
}

testRule(rule, mergeTestDescriptions(basicAZTests, {
  ruleName,
  config: [/^[A-Z]+$/],
}))

testRule(rule, mergeTestDescriptions(basicAZTests, {
  ruleName,
  config: ["^[A-Z]+$"],
}))

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: [/^[A-Z]+$/],

  accept:[{
    code: "@for $n from 1 through 5 { #a#{$n} { } }",
    description: "ignore sass interpolation inside @for",
  }],
})
