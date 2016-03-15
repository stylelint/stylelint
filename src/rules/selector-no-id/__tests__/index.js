/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/mochaStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [{
    code: "foo {}",
  }, {
    code: ".foo {}",
  }, {
    code: "[foo] {}",
  }, {
    code: ":root { --custom-property-set: {} }",
  }],

  reject: [{
    code: "#foo {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".bar > #foo {}",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: "#foo.bar {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".foo, .bar, #foo.baz {}",
    message: messages.rejected,
    line: 1,
    column: 13,
  }],
})

testRule(rule, {
  ruleName,
  config: [undefined],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [{
    code: "@for $n from 1 through 10 { .n-#{$n} { content: \"n: #{1 + 1}\"; } }",
    description: "ignore sass interpolation inside @for",
  }, {
    code: "@for $n from 1 through 10 { .n#{$n}-#{$n} { content: \"n: #{1 + 1}\"; } }",
    description: "ignore multiple sass interpolations in a selector inside @for",
  }, {
    code: "@for $n from 1 through 10 { .n#{$n}n#{$n} { content: \"n: #{1 + 1}\"; } }",
    description: "ignore multiple sass interpolations in a selector inside @for",
  }, {
    code: "@each $n in $vals { .n-#{$n} { content: \"n: #{1 + 1}\"; } }",
    description: "ignore sass interpolation inside @each",
  }, {
    code: "@while $n < 10 { .n-#{$n} { content: \"n: #{1 + 1}\"; } }",
    description: "ignore sass interpolation inside @while",
  }, {
    code: "div:nth-child(#{map-get($foo, bar)}) {}",
    description: "ignore sass map-get interpolation",
  }],

  reject: [{
    code: "@for $n from 1 through 10 { .n-#{$n} #foo { } }",
    description: "report sass interpolation + id inside @for",
    message: messages.rejected,
    line: 1,
    column: 38,
  }, {
    code: "@for $n from 1 through 10 { .n#{$n}-#{$n} #foo { } }",
    description: "report sass interpolation + id inside @for",
    message: messages.rejected,
    line: 1,
    column: 43,
  }],
})