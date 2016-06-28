import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "foo {}",
  }, {
    code: ".bar {}",
  }, {
    code: "foo .bar {}",
  }, {
    code: ":root { --custom-property-set: {} }",
  } ],

  reject: [ {
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
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "less",

  reject: [ {
    code: "[@{attribute}] {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "@{selector} [foo] {}",
    message: messages.rejected,
    line: 1,
    column: 13,
  }, {
    code: "[foo] @{selector} {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "@{selector}[title] {}",
    message: messages.rejected,
    line: 1,
    column: 12,
  }, {
    code: "[title]@{selector} {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  reject: [ {
    code: "[#{$attribute}] {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "#{$selector} [foo] {}",
    message: messages.rejected,
    line: 1,
    column: 14,
  }, {
    code: "[foo] #{$selector} {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "%placeholder[title] {}",
    message: messages.rejected,
    line: 1,
    column: 13,
  }, {
    code: "[title]%placeholder {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  } ],
})
