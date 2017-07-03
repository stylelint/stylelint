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
    expect(result.deprecations[0].text).toEqual(`\'${ruleName}\' has been deprecated and in 8.0 will be removed. Instead use \'selector-max-universal\' with \'0\' as its primary option.`)
    expect(result.deprecations[0].reference).toEqual(`https://stylelint.io/user-guide/rules/${ruleName}/`)
  })
})

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
