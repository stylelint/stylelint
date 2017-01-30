"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const stylelint = require("../../../standalone")

const rule = rules[ruleName]

it("deprecation warning for selectorNoEmpty", () => {
  const config = {
    rules: {
      "selector-no-empty": true,
    },
  }

  const code = "{}"

  return stylelint({ code, config }).then(output => {
    const result = output.results[0]
    expect(result.deprecations.length).toEqual(1)
    expect(result.deprecations[0].text).toEqual("\'selector-no-empty\' has been deprecated and in 8.0 will be removed.")
    expect(result.deprecations[0].reference).toEqual("https://stylelint.io/user-guide/rules/selector-no-empty/")
    expect(result.warnings.length).toEqual(1)
    expect(result.warnings[0].text).toEqual("Unexpected empty selector (selector-no-empty)")
  })
})
testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: ".a, .b {}",
  }, {
    code: " a {}",
  } ],

  reject: [ {
    code: "   {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: "   ,  .a   , .b {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: ".a,  ,.b {}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: ".a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 11,
  }, {
    code: "   .a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 14,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "sugarss",
  skipBasicChecks: true,

  accept: [ {
    code: ".a, .b \n  color: pink",
  }, {
    code: "a\n  color: red",
  } ],

  reject: [ {
    code: ",\n.a  ,\n.b\n  color:red",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".a,\n,\n.b\n  color:red",
    message: messages.rejected,
    line: 2,
    column: 1,
  }, {
    code: ".a,\n.b,\n  color:red",
    message: messages.rejected,
    line: 2,
    column: 4,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "less",

  accept: [ {
    code: ".a, .b {}",
  }, {
    code: " a {}",
  } ],

  reject: [ {
    code: "   {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: "   ,  .a   , .b {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: ".a,  ,.b {}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: ".a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 11,
  }, {
    code: "   .a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 14,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [ {
    code: ".a, .b {}",
  }, {
    code: " a {}",
  } ],

  reject: [ {
    code: "   {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: "   ,  .a   , .b {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: ".a,  ,.b {}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: ".a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 11,
  }, {
    code: "   .a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 14,
  }, {
    code: "  .a     ,    , .b {}",
    message: messages.rejected,
    line: 1,
    column: 15,
  }, {
    code: ".a,,.b {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  } ],
})
