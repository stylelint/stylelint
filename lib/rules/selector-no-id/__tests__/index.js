"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const stylelint = require("../../../standalone")

const rule = rules[ruleName]

it("deprecation warning", () => {
  const config = {
    rules: {
      [ruleName]: true,
    },
  }

  const code = ""

  return stylelint({ code, config }).then(output => {
    const result = output.results[0]
    expect(result.deprecations.length).toEqual(1)
    expect(result.deprecations[0].text).toEqual(`\'${ruleName}\' has been deprecated and in 8.0 will be removed. Instead use \'selector-max-id\' with \'0\' as its primary option.`)
    expect(result.deprecations[0].reference).toEqual(`https://stylelint.io/user-guide/rules/${ruleName}/`)
  })
})

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "foo {}",
  }, {
    code: ".foo {}",
  }, {
    code: "[foo] {}",
  }, {
    code: ":root { --foo: 1px; }",
    description: "custom property in root",
  }, {
    code: "html { --foo: 1px; }",
    description: "custom property in selector",
  }, {
    code: ":root { --custom-property-set: {} }",
    description: "custom property set in root",
  }, {
    code: "html { --custom-property-set: {} }",
    description: "custom property set in selector",
  } ],

  reject: [ {
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
  }, {
    code: "@for $n from 1 through 10 { .n-#{$n} #foo {} }",
    description: "ignore sass interpolation + id inside @for",
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
  }, {
    code: ".for(@n: 1) when (@n <= 10) { .n-@{n} #foo {} .for(@n + 1) }",
    description: "ignore Less interpolation + id inside .for",
  } ],
})
