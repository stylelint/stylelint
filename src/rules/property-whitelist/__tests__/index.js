/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/mochaStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,

  config: [[
    "transform",
    "background-size",
  ]],

  accept: [{
    code: "a { background-size: cover; }",
  }, {
    code: "a { transform: scale(1); }",
  }, {
    code: "a { -webkit-transform: scale(1); }",
  }, {
    code: "a { transform: scale(1); background-size: cover; }",
  }, {
    code: "a { transform: scale(1); -webkit-transform: scale(1); background-size: cover; }",
  }, {
    code: "a { $scss: 0; }",
  }, {
    code: "a { @less: 0; }",
  }, {
    code: "a { --custom-property: 0; }",
  }],

  reject: [{
    code: "a { background: pink; }",
    message: messages.rejected("background"),
    line: 1,
    column: 5,
  }, {
    code: "a { color: pink; }",
    message: messages.rejected("color"),
    line: 1,
    column: 5,
  }, {
    code: "a { overflow: hidden; background-size: cover; }",
    message: messages.rejected("overflow"),
    line: 1,
    column: 5,
  }, {
    code: "a { color: orange; -webkit-transform: scale(1); }",
    message: messages.rejected("color"),
    line: 1,
    column: 5,
  }],
})

testRule(rule, {
  ruleName,

  config: [[
    "/^background/",
  ]],

  accept: [{
    code: "a { background: pink; }",
  }, {
    code: "a { background-color: pink; }",
  }, {
    code: "a { background-image: none; }",
  }],

  reject: [{
    code: "a { color: pink; }",
    message: messages.rejected("color"),
    line: 1,
    column: 5,
  }],
})
