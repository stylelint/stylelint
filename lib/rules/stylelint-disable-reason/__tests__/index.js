"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const stylelint = require("../../../standalone")

const rule = rules[ruleName]

it("deprecation warning", () => {
  const config = {
    rules: {
      [ruleName]: "always-before",
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
  config: ["always-before"],

  accept: [ {
    code: "/* reason */\n/* stylelint-disable */\na {}",
  }, {
    code: "a {}/* reason *//* stylelint-disable-line block-no-empty */",
  }, {
    code: "a { /* reason */ color: pink; /* stylelint-disable-line color-no-named */}",
  }, {
    code: "a { /* reason */ color: pink; /* reason */ /* stylelint-disable-line color-no-named */}",
  }, {
    code: "/* reason */a {}/* stylelint-disable-line block-no-empty */",
  } ],

  reject: [ {
    code: "/* stylelint-disable */",
    message: messages.expectedBefore,
    line: 1,
    column: 1,
  }, {
    code: "/* stylelint-disable */\na {}",
    message: messages.expectedBefore,
    line: 1,
    column: 1,
  }, {
    code: "/* stylelint-disable */\n/* reason */\na {}",
    message: messages.expectedBefore,
    line: 1,
    column: 1,
  }, {
    code: "/* reason */\n/* stylelint-disable block-no-empty */\n/* stylelint-disable no-browser-hacks */\na {}",
    message: messages.expectedBefore,
    line: 3,
    column: 1,
  }, {
    code: "a {} /* stylelint-disable-line block-no-empty */",
    message: messages.expectedBefore,
    line: 1,
    column: 6,
  }, {
    code: "a { color: pink; /* stylelint-disable-line block-no-empty */}",
    message: messages.expectedBefore,
    line: 1,
    column: 18,
  }, {
    code: "a { /* reason */ display: block; color: pink; /* stylelint-disable-line block-no-empty */}",
    message: messages.expectedBefore,
    line: 1,
    column: 47,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-after"],

  accept: [ {
    code: "/* stylelint-disable */\n/* reason */\na {}",
  }, {
    code: "a {}/* stylelint-disable-line *//* reason block-no-empty */",
  } ],

  reject: [ {
    code: "/* stylelint-disable */",
    message: messages.expectedAfter,
    line: 1,
    column: 1,
  }, {
    code: "/* stylelint-disable */\na {}",
    message: messages.expectedAfter,
    line: 1,
    column: 1,
  }, {
    code: "/* reason */\n/* stylelint-disable */\na {}",
    message: messages.expectedAfter,
    line: 2,
    column: 1,
  }, {
    code: "/* stylelint-disable block-no-empty */\n/* reason */\n/* stylelint-disable no-browser-hacks */\na {}",
    message: messages.expectedAfter,
    line: 3,
    column: 1,
  }, {
    code: "a {} /* stylelint-disable-line block-no-empty */",
    message: messages.expectedAfter,
    line: 1,
    column: 6,
  } ],
})
