/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/blueTapeStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [{
    code: "a { padding: 0 /* calc(1px+2px) */ 0; }",
  }, {
    code: "a { color: color(red s(-10%)); }",
  }, {
    code: "a { color: color(red s( -10%)); }",
  }, {
    code: "a { top: calc(1px + 2px); }",
  }, {
    code: "a { top: calc(1px - 2px); }",
  }, {
    code: "a { top: calc(1px * 2); }",
  }, {
    code: "a { top: calc(1px / 2); }",
  }, {
    code: "a { top: calc(calc(1em * 2) / 3); }",
  }, {
    code: "a { top: calc(+1px)}",
    description: "sign",
  }, {
    code: "a { top: calc(1px + -1px)}",
    description: "sign after operator",
  }, {
    code: "a { top: calc(-1px * -1)}",
    description: "sign after operator and at start",
  }, {
    code: "a { top: calc(    +1px)}",
    description: "multiple spaces before sign at start",
  }, {
    code: "a { top: calc(\t+1px)}",
    description: "tab before sign at start",
  }, {
    code: "a { top: calc(-$x - 2rem); }",
    description: "postcss-simple-vars and SCSS variable syntax",
  }, {
    code: "a { top: calc(-@x - 2rem); }",
    description: "Less variable syntax",
  }, {
    code: "a { top: calc($x-y-z - 2rem); }",
    description: "postcss-simple-vars and SCSS variable with hyphens",
  }, {
    code: "a { top: calc(2rem + @fh+d*sf-as); }",
    description: "Less variable with symbols",
  }],

  reject: [{
    code: "a { top: calc(1px +\t-1px)}",
    description: "tab before sign after operator",
    message: messages.expectedAfter("+"),
    line: 1,
    column: 19,
  }, {
    code: "a { top: calc(1px +  -1px)}",
    description: "multiple spaces before sign after operator",
    message: messages.expectedAfter("+"),
    line: 1,
    column: 19,
  }, {
    code: "a { top: calc(1px+ 2px); }",
    message: messages.expectedBefore("+"),
    line: 1,
    column: 18,
  }, {
    code: "a { top: calc(1px  + 2px); }",
    message: messages.expectedBefore("+"),
    line: 1,
    column: 20,
  }, {
    code: "a { top: calc(1px\t+ 2px); }",
    message: messages.expectedBefore("+"),
    line: 1,
    column: 19,
  }, {
    code: "a { top: calc(1px +  2px); }",
    message: messages.expectedAfter("+"),
    line: 1,
    column: 19,
  }, {
    code: "a { top: calc(1px +\t2px); }",
    message: messages.expectedAfter("+"),
    line: 1,
    column: 19,
  }, {
    code: "a { top: calc(1px- 2px); }",
    message: messages.expectedBefore("-"),
    line: 1,
    column: 18,
  }, {
    code: "a { top: calc(1px* 2); }",
    message: messages.expectedBefore("*"),
    line: 1,
    column: 18,
  }, {
    code: "a { top: calc(1px *2); }",
    message: messages.expectedAfter("*"),
    line: 1,
    column: 19,
  }, {
    code: "a { top: calc(1px/ 2); }",
    message: messages.expectedBefore("/"),
    line: 1,
    column: 18,
  }, {
    code: "a { top: calc(1px /2); }",
    message: messages.expectedAfter("/"),
    line: 1,
    column: 19,
  }, {
    code: "a { top: calc(calc(1px* 2px) + 3px); }",
    message: messages.expectedBefore("*"),
    line: 1,
    column: 23,
  }, {
    code: "a { top: calc(calc(1px + 2px)* 3px); }",
    message: messages.expectedBefore("*"),
    line: 1,
    column: 30,
  }, {
    code: "a { top: calc(1px +2px); }",
    message: messages.expectedOperatorBeforeSign("+"),
    line: 1,
    column: 19,
  }, {
    code: "a { top: calc(1px -2px); }",
    message: messages.expectedOperatorBeforeSign("-"),
    line: 1,
    column: 19,
  }],
})