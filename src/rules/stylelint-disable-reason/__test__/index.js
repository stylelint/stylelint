import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always-preceding"],

  accept: [ {
    code: "/* reason */\n/* stylelint-disable */\na {}",
  }, {
    code: "a {}/* reason *//* stylelint-disable-line block-no-empty */",
  } ],

  reject: [ {
    code: "a {} /* stylelint-disable-line block-no-empty */",
    message: messages.expectedPreceding,
    line: 1,
    column: 6,
  }, {
    code: "/* stylelint-disable */\na {}",
    message: messages.expectedPreceding,
    line: 1,
    column: 1,
  }, {
    code: "/* stylelint-disable */\n/* reason */\na {}",
    message: messages.expectedPreceding,
    line: 1,
    column: 1,
  }, {
    code: "/* reason */\n/* stylelint-disable block-no-empty */\n/* stylelint-disable no-browser-hacks */\na {}",
    message: messages.expectedPreceding,
    line: 3,
    column: 1,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-succeeding"],

  accept: [ {
    code: "/* stylelint-disable */\n/* reason */\na {}",
  }, {
    code: "a {}/* stylelint-disable-line *//* reason block-no-empty */",
  } ],

  reject: [ {
    code: "a {} /* stylelint-disable-line block-no-empty */",
    message: messages.expectedPreceding,
    line: 1,
    column: 6,
  }, {
    code: "/* stylelint-disable */\na {}",
    message: messages.expectedPreceding,
    line: 1,
    column: 1,
  }, {
    code: "/* reason */\n/* stylelint-disable */\na {}",
    message: messages.expectedPreceding,
    line: 2,
    column: 1,
  }, {
    code: "/* stylelint-disable block-no-empty */\n/* reason */\n/* stylelint-disable no-browser-hacks */\na {}",
    message: messages.expectedPreceding,
    line: 3,
    column: 1,
  } ],
})
