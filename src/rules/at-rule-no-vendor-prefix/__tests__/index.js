/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/mochaStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [{
    code: "@keyframes { 0% { top: 0; } }",
  }, {
    code: "@viewport { orientation: landscape; }",
  }],

  reject: [{
    code: "@-webkit-keyframes { 0% { top: 0; } }",
    message: messages.rejected("-webkit-keyframes"),
  }, {
    code: "@-moz-keyframes { 0% { top: 0; } }",
    message: messages.rejected("-moz-keyframes"),
  }, {
    code: "@-ms-viewport { orientation: landscape; }",
    message: messages.rejected("-ms-viewport"),
  }],
})