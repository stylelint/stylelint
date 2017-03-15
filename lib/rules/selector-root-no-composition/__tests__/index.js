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
    expect(result.deprecations[0].text).toEqual(`\'${ruleName}\' has been deprecated and in 8.0 will be removed. Instead use the community 'stylelint-suitcss' plugin pack.`)
    expect(result.deprecations[0].reference).toEqual(`https://stylelint.io/user-guide/rules/${ruleName}/`)
  })
})

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: ":root {}",
  }, {
    code: ":rOoT {}",
  }, {
    code: ":ROOT {}",
  }, {
    code: "   :root\n {}",
  } ],

  reject: [ {
    code: "a, :root {}",
    message: messages.rejected,
  }, {
    code: "a, :rOoT {}",
    message: messages.rejected,
  }, {
    code: "a, :ROOT {}",
    message: messages.rejected,
  }, {
    code: ":root, a {}",
    message: messages.rejected,
  }, {
    code: ":root + a {}",
    message: messages.rejected,
  }, {
    code: "body, .foo, :root + a {}",
    message: messages.rejected,
  }, {
    code: "html:root {}",
    message: messages.rejected,
  }, {
    code: "html :root {}",
    message: messages.rejected,
  } ],
})
