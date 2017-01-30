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
    expect(result.deprecations[0].text).toEqual(`\'${ruleName}\' has been deprecated and in 8.0 will be removed. Instead use \'time-min-milliseconds\' with \'100\' as its primary option.`)
    expect(result.deprecations[0].reference).toEqual(`https://stylelint.io/user-guide/rules/${ruleName}/`)
  })
})

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a { transition-delay: 0.2s; }",
  }, {
    code: "a { -webkit-transition-delay: 0.2s; }",
  }, {
    code: "a { tRaNsItIoN-dElAy: 0.2s; }",
  }, {
    code: "a { TRANSITION-DELAY: 0.2s; }",
  }, {
    code: "a { transition-delay: 3s; }",
  }, {
    code: "a { transition-delay: 200ms; }",
  }, {
    code: "a { transition-delay: 5000ms; }",
  }, {
    code: "a { transition-duration: 0.15s; }",
  }, {
    code: "a { -webkit-transition-duration: 0.15s; }",
  }, {
    code: "a { transition-duration: 2.8s; }",
  }, {
    code: "a { transition-duration: 330ms; }",
  }, {
    code: "a { transition-duration: 4700ms; }",
  }, {
    code: "a { transition: foo 0.8s linear; }",
  }, {
    code: "a { -webkit-transition: foo 0.8s linear; }",
  }, {
    code: "a { tRaNsItIoN: foo 0.8s linear; }",
  }, {
    code: "a { TRANSITION: foo 0.8s linear; }",
  }, {
    code: "a { transition: foo 0.8s 200ms ease-in-out; }",
  }, {
    code: "a { animation-delay: 0.2s; }",
  }, {
    code: "a { -webkit-animation-delay: 0.2s; }",
  }, {
    code: "a { animation-delay: 3s; }",
  }, {
    code: "a { animation-delay: 200ms; }",
  }, {
    code: "a { animation-delay: 5000ms; }",
  }, {
    code: "a { animation-duration: 0.15s; }",
  }, {
    code: "a { -webkitanimation-duration: 0.15s; }",
  }, {
    code: "a { animation-duration: 2.8s; }",
  }, {
    code: "a { animation-duration: 330ms; }",
  }, {
    code: "a { animation-duration: 4700ms; }",
  }, {
    code: "a { animation: foo 0.8s linear; }",
  }, {
    code: "a { -webkit-animation: foo 0.8s linear; }",
  }, {
    code: "a { animation: foo 0.8s 200ms ease-in-out; }",
  }, {
    code: "a { animation-delay: -2.5s; }",
  }, {
    code: "a { animation-delay: -150ms; }",
  } ],

  reject: [ {
    code: "a { transition-delay: 0.006s; }",
    message: messages.rejected("0.006s"),
    line: 1,
    column: 23,
  }, {
    code: "a { -webkit-transition-delay: 0.006s; }",
    message: messages.rejected("0.006s"),
    line: 1,
    column: 31,
  }, {
    code: "a { tRaNsItIoN-dElAy: 0.006s; }",
    message: messages.rejected("0.006s"),
    line: 1,
    column: 23,
  }, {
    code: "a { TRANSITION-DELAY: 0.006s; }",
    message: messages.rejected("0.006s"),
    line: 1,
    column: 23,
  }, {
    code: "a { transition-delay: 0.006S; }",
    message: messages.rejected("0.006S"),
    line: 1,
    column: 23,
  }, {
    code: "a { transition-delay: 3ms; }",
    message: messages.rejected("3ms"),
    line: 1,
    column: 23,
  }, {
    code: "a { transition-delay: 3MS; }",
    message: messages.rejected("3MS"),
    line: 1,
    column: 23,
  }, {
    code: "a { transition-duration: 0.009s; }",
    message: messages.rejected("0.009s"),
    line: 1,
    column: 26,
  }, {
    code: "a { -webkit-transition-duration: 0.009s; }",
    message: messages.rejected("0.009s"),
    line: 1,
    column: 34,
  }, {
    code: "a { transition-duration: 80ms; }",
    message: messages.rejected("80ms"),
    line: 1,
    column: 26,
  }, {
    code: "a { transition: foo 0.008s linear; }",
    message: messages.rejected("0.008s"),
    line: 1,
    column: 21,
  }, {
    code: "a { -webkit-transition: foo 0.008s linear; }",
    message: messages.rejected("0.008s"),
    line: 1,
    column: 29,
  }, {
    code: "a { tRaNsItIoN: foo 0.008s linear; }",
    message: messages.rejected("0.008s"),
    line: 1,
    column: 21,
  }, {
    code: "a { TRANSITION: foo 0.008s linear; }",
    message: messages.rejected("0.008s"),
    line: 1,
    column: 21,
  }, {
    code: "a { transition: foo 0.8s 20ms ease-in-out; }",
    message: messages.rejected("20ms"),
    line: 1,
    column: 26,
  }, {
    code: "a { animation-delay: 0.006s; }",
    message: messages.rejected("0.006s"),
    line: 1,
    column: 22,
  }, {
    code: "a { -webkit-animation-delay: 0.006s; }",
    message: messages.rejected("0.006s"),
    line: 1,
    column: 30,
  }, {
    code: "a { animation-delay: 3ms; }",
    message: messages.rejected("3ms"),
    line: 1,
    column: 22,
  }, {
    code: "a { animation-duration: 0.009s; }",
    message: messages.rejected("0.009s"),
    line: 1,
    column: 25,
  }, {
    code: "a { -webkit-animation-duration: 0.009s; }",
    message: messages.rejected("0.009s"),
    line: 1,
    column: 33,
  }, {
    code: "a { animation-duration: 80ms; }",
    message: messages.rejected("80ms"),
    line: 1,
    column: 25,
  }, {
    code: "a { animation: foo 0.008s linear; }",
    message: messages.rejected("0.008s"),
    line: 1,
    column: 20,
  }, {
    code: "a { -webkit-animation: foo 0.008s linear; }",
    message: messages.rejected("0.008s"),
    line: 1,
    column: 28,
  }, {
    code: "a { animation: foo 0.8s 20ms ease-in-out; }",
    message: messages.rejected("20ms"),
    line: 1,
    column: 25,
  }, {
    code: "a { animation: foo 0.8s -20ms ease-in-out; }",
    message: messages.rejected("-20ms"),
    line: 1,
    column: 25,
  } ],
})
