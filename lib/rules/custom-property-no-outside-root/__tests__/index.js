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
    expect(result.deprecations[0].text).toEqual(`\'${ruleName}\' has been deprecated and in 8.0 will be removed.`)
    expect(result.deprecations[0].reference).toEqual(`https://stylelint.io/user-guide/rules/${ruleName}/`)
  })
})

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: ":root { --foo-bar: 1px; }",
  }, {
    code: ":rOoT { --foo-bar: 1px; }",
  }, {
    code: ":ROOT { --foo-bar: 1px; }",
  }, {
    code: "a { color: pink; }",
  }, {
    code: "a { -webkit-transform: 1px; }",
  } ],

  reject: [ {
    code: "a { --foo-bar: 1px; }",
    message: messages.rejected,
  }, {
    code: "a { color: pink; -webkit-transform: 1px; --foo-bar: 1px; }",
    message: messages.rejected,
  }, {
    code: ":root, a { --foo-bar: 1px; }",
    message: messages.rejected,
  }, {
    code: ":root a { --foo-bar: 1px; }",
    message: messages.rejected,
  }, {
    code: ":rOoT a { --foo-bar: 1px; }",
    message: messages.rejected,
  }, {
    code: ":ROOT a { --foo-bar: 1px; }",
    message: messages.rejected,
  } ],
})
