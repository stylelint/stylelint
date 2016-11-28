"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a {}",
  }, {
    code: ".foo, #bar {}",
  }, {
    code: "a.foo {}",
  }, {
    code: ":root { --custom-property-set: {} }",
  }, {
    code: ".foo\\+bar {}",
    description: "escaped combinator-like character",
  } ],

  reject: [ {
    code: "a b {}",
    message: messages.rejected,
    line: 1,
    column: 2,
  }, {
    code: "a + a {}",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a > a {}",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a ~ a {}",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a b, .foo {}",
    message: messages.rejected,
    line: 1,
    column: 2,
  }, {
    code: ".foo, a b {}",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: "\t.foo,\n\ta b {}",
    message: messages.rejected,
    line: 2,
    column: 3,
  }, {
    code: "a#foo ~ b {}",
    message: messages.rejected,
    line: 1,
    column: 7,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [ {
    code: "@keyframes spin { #{50% - $n} {} }",
  }, {
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
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "less",

  accept: [ {
    code: ".for(@n: 1) when (@n <= 10) { .n-@{n} { content: %(\"n: %d\", 1 + 1); } .for(@n + 1); }",
    description: "ignore Less interpolation inside .for",
  }, {
    code: ".for(@n: 1) when (@n <= 10) { .n-@{n}-@{n} { content: %(\"n: %d\", 1 + 1); } .for(@n + 1); }",
    description: "ignore multiple Less interpolations in a selector inside .for",
  }, {
    code: ".for(@n: 1) when (@n <= 10) { .n-@{n}n@{n} { content: %(\"n: %d\", 1 + 1); } .for(@n + 1); }",
    description: "ignore multiple Less interpolations in a selector inside .for",
  }, {
    code: ".each(@vals, @n: 1) when (@n <= length(@vals)) { @val: extract(@vals, @n); .n-@{val} { content: %(\"n: %d\", 1 + 1); } .each(@vals, @n + 1); }",
    description: "ignore Less interpolation inside .each",
  }, {
    code: ".while(@n: 0) when (@n < 10) { .n-@{n} { content: %(\"n: %d\", 1 + 1); } .while(@n + 1) }",
    description: "ignore Less interpolation inside .while",
  } ],
})
