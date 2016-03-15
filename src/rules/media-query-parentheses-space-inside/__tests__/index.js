/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/mochaStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [{
    code: "@media ( max-width: 300px ) {}",
  }, {
    code: "@media screen and ( color ), projection and ( color ) {}",
  }, {
    code: "@media ( grid ) and ( max-width: 15em ) {}",
  }],

  reject: [{
    code: "@media (max-width: 300px ) {}",
    message: messages.expectedOpening,
    line: 1,
    column: 9,
  }, {
    code: "@media ( max-width: 300px) {}",
    message: messages.expectedClosing,
    line: 1,
    column: 25,
  }, {
    code: "@media screen and (color ), projection and ( color ) {}",
    message: messages.expectedOpening,
    line: 1,
    column: 20,
  }, {
    code: "@media screen and ( color), projection and ( color ) {}",
    message: messages.expectedClosing,
    line: 1,
    column: 25,
  }, {
    code: "@media screen and ( color ), projection and (color ) {}",
    message: messages.expectedOpening,
    line: 1,
    column: 46,
  }, {
    code: "@media screen and ( color ), projection and ( color) {}",
    message: messages.expectedClosing,
    line: 1,
    column: 51,
  }, {
    code: "@media ( grid ) and (max-width: 15em ) {}",
    message: messages.expectedOpening,
    line: 1,
    column: 22,
  }],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [{
    code: "@media (max-width: 300px) {}",
  }, {
    code: "@media screen and (color), projection and (color) {}",
  }, {
    code: "@media (grid) and (max-width: 15em) {}",
  }],

  reject: [{
    code: "@media (max-width: 300px ) {}",
    message: messages.rejectedClosing,
    line: 1,
    column: 25,
  }, {
    code: "@media ( max-width: 300px) {}",
    message: messages.rejectedOpening,
    line: 1,
    column: 9,
  }, {
    code: "@media screen and (color ), projection and (color) {}",
    message: messages.rejectedClosing,
    line: 1,
    column: 25,
  }, {
    code: "@media screen and ( color), projection and (color) {}",
    message: messages.rejectedOpening,
    line: 1,
    column: 20,
  }, {
    code: "@media screen and (color), projection and (color ) {}",
    message: messages.rejectedClosing,
    line: 1,
    column: 49,
  }, {
    code: "@media screen and (color), projection and ( color) {}",
    message: messages.rejectedOpening,
    line: 1,
    column: 44,
  }, {
    code: "@media (grid) and (max-width: 15em ) {}",
    message: messages.rejectedClosing,
    line: 1,
    column: 35,
  }],
})