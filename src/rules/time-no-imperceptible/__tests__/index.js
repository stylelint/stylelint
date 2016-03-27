import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: "a { transition-delay: 0.2s; }",
  }, {
    code: "a { transition-delay: 3s; }",
  }, {
    code: "a { transition-delay: 200ms; }",
  }, {
    code: "a { transition-delay: 5000ms; }",
  }, {
    code: "a { transition-duration: 0.15s; }",
  }, {
    code: "a { transition-duration: 2.8s; }",
  }, {
    code: "a { transition-duration: 330ms; }",
  }, {
    code: "a { transition-duration: 4700ms; }",
  }, {
    code: "a { transition: foo 0.8s linear; }",
  }, {
    code: "a { transition: foo 0.8s 200ms ease-in-out; }",
  }, {
    code: "a { animation-delay: 0.2s; }",
  }, {
    code: "a { animation-delay: 3s; }",
  }, {
    code: "a { animation-delay: 200ms; }",
  }, {
    code: "a { animation-delay: 5000ms; }",
  }, {
    code: "a { animation-duration: 0.15s; }",
  }, {
    code: "a { animation-duration: 2.8s; }",
  }, {
    code: "a { animation-duration: 330ms; }",
  }, {
    code: "a { animation-duration: 4700ms; }",
  }, {
    code: "a { animation: foo 0.8s linear; }",
  }, {
    code: "a { animation: foo 0.8s 200ms ease-in-out; }",
  } ],

  reject: [ {
    code: "a { transition-delay: 0.006s; }",
    message: messages.rejected("0.006s"),
    line: 1,
    column: 23,
  }, {
    code: "a { transition-delay: 3ms; }",
    message: messages.rejected("3ms"),
    line: 1,
    column: 23,
  }, {
    code: "a { transition-duration: 0.009s; }",
    message: messages.rejected("0.009s"),
    line: 1,
    column: 26,
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
    code: "a { animation: foo 0.8s 20ms ease-in-out; }",
    message: messages.rejected("20ms"),
    line: 1,
    column: 25,
  } ],
})
