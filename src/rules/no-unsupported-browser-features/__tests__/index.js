/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/mochaStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [true],
})

testRule(rule, {
  ruleName,
  config: [true, { browsers: "last 2 versions" }],

  accept: [{
    code: "a { opacity: 1; }",
  }, {
    code: "a { outline: none; }",
  }, {
    code: "a { background: linear-gradient(black, white); }",
  }],
})

testRule(rule, {
  ruleName,
  config: [true, { browsers: "ie >= 7, safari >= 6" }],

  reject: [{
    code: "a { opacity: 1; }",
    description: "opacity",
    message: messages.rejected("CSS3 Opacity not supported by: IE (7,8)"),
    line: 1,
    column: 5,
  }, {
    code: "a { outline: none; }",
    description: "outline",
    message: messages.rejected("CSS outline not supported by: IE (7)"),
    line: 1,
    column: 5,
  }],
})

testRule(rule, {
  ruleName,
  config: [true, { browsers: "ie >= 7, safari >= 6", ignore: "outline" }],

  accept: [{
    code: "a { outline: none; }",
  }],

  reject: [{
    code: "a { opacity: 1; }",
    description: "opacity",
    message: messages.rejected("CSS3 Opacity not supported by: IE (7,8)"),
    line: 1,
    column: 5,
  }],
})

testRule(rule, {
  ruleName,
  config: [true, { browsers: "ie >= 9" }],

  accept: [{
    code: "a { opacity: 1; }",
  }, {
    code: "a { outline: none; }",
  }],

  reject: [{
    code: "a { background: linear-gradient(black, white); }",
    description: "gradient",
    message: messages.rejected("CSS Gradients not supported by: IE (9)"),
    line: 1,
    column: 5,
  }],
})