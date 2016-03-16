/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["single"],

  accept: [{
    code: "a { color: pink; }",
  }, {
    code: "a:before { color: pink; }",
  }, {
    code: "a:after { color: pink; }",
  }, {
    code: "a:first-letter { color: pink; }",
  }, {
    code: "a:first-line { color: pink; }",
  }, {
    code: "a:before, a[data-before='before'] { color: pink; }",
  }, {
    code: "::selection { color: pink; }",
  }, {
    code: "a::spelling-error { color: pink; }",
  }, {
    code: "a::grammar-error { color: pink; }",
  }, {
    code: "li::marker { font-variant-numeric: tabular-nums; }",
  }, {
    code: "input::placeholder { color: pink; }",
  }],

  reject: [{
    code: "a::before { color: pink; }",
    message: messages.expected("single"),
    line: 1,
    column: 3,
  }, {
    code: "a::after { color: pink; }",
    message: messages.expected("single"),
    line: 1,
    column: 3,
  }, {
    code: "a::first-line { color: pink; }",
    message: messages.expected("single"),
    line: 1,
    column: 3,
  }, {
    code: "a::first-letter { color: pink; }",
    message: messages.expected("single"),
    line: 1,
    column: 3,
  }],
})

testRule(rule, {
  ruleName,
  config: ["double"],

  accept: [{
    code: "a { color: pink; }",
  }, {
    code: "a::before { color: pink; }",
  }, {
    code: "a::after { color: pink; }",
  }, {
    code: "a::first-letter { color: pink; }",
  }, {
    code: "a::first-line { color: pink; }",
  }, {
    code: "a::before, a[data-before='before'] { color: pink; }",
  }, {
    code: "::selection { color: pink; }",
  }, {
    code: "a::spelling-error { color: pink; }",
  }, {
    code: "a::grammar-error { color: pink; }",
  }, {
    code: "li::marker { font-variant-numeric: tabular-nums; }",
  }, {
    code: "input::placeholder { color: pink; }",
  }],

  reject: [{
    code: "a:before { color: pink; }",
    message: messages.expected("double"),
    line: 1,
    column: 2,
  }, {
    code: "a:after { color: pink; }",
    message: messages.expected("double"),
    line: 1,
    column: 2,
  }, {
    code: "a:first-line { color: pink; }",
    message: messages.expected("double"),
    line: 1,
    column: 2,
  }, {
    code: "a:first-letter { color: pink; }",
    message: messages.expected("double"),
    line: 1,
    column: 2,
  }],
})