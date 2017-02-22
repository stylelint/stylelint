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
})

testRule(rule, {
  ruleName,
  config: [ true, { browsers: "last 2 versions" } ],

  accept: [ {
    code: "a { opacity: 1; }",
  }, {
    code: "a { outline: none; }",
  }, {
    code: "a { background: linear-gradient(black, white); }",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { browsers: "ie >= 7, safari >= 6" } ],

  reject: [ {
    code: "a { opacity: 1; }",
    description: "opacity",
    message: messages.rejected("\"css-opacity\" is only partially supported by IE 7,8"),
    line: 1,
    column: 5,
  }, {
    code: "a { outline: none; }",
    description: "outline",
    message: messages.rejected("\"outline\" is not supported by IE 7"),
    line: 1,
    column: 5,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { browsers: "ie >= 7, safari >= 6", ignore: "outline" } ],

  accept: [{
    code: "a { outline: none; }",
  }],

  reject: [{
    code: "a { opacity: 1; }",
    description: "opacity",
    message: messages.rejected("\"css-opacity\" is only partially supported by IE 7,8"),
    line: 1,
    column: 5,
  }],
})

testRule(rule, {
  ruleName,
  config: [ true, { browsers: "ie >= 9, chrome > 1" } ],

  accept: [ {
    code: "a { opacity: 1; }",
  }, {
    code: "a { outline: none; }",
  } ],

  reject: [{
    code: "a { background: linear-gradient(black, white); }",
    description: "gradient",
    message: messages.rejected("\"css-gradients\" is not supported by IE 9 and only partially supported by Chrome 4,5,6,7,8,9"),
    line: 1,
    column: 5,
  }],
})
