import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a:before { }",
  }, {
    code: "a:Before { }",
  }, {
    code: "a:bEfOrE { }",
  }, {
    code: "a:BEFORE { }",
  }, {
    code: "a:after { }",
  }, {
    code: "a:first-letter { }",
  }, {
    code: "a:first-line { }",
  }, {
    code: "a::before { }",
  }, {
    code: "a::Before { }",
  }, {
    code: "a::bEfOrE { }",
  }, {
    code: "a::BEFORE { }",
  }, {
    code: "a::after { }",
  }, {
    code: "a::first-letter { }",
  }, {
    code: "a::first-line { }",
  }, {
    code: "::selection { }",
  }, {
    code: "a::spelling-error { }",
  }, {
    code: "a::grammar-error { }",
  }, {
    code: "li::marker { }",
  }, {
    code: "div::shadow { }",
  }, {
    code: "div::content { }",
  }, {
    code: "input::-moz-placeholder { }",
  }, {
    code: "input::-moz-test { }",
  }, {
    code: "a:hover { }",
  }, {
    code: "a:focus { }",
  }, {
    code: "a:hover::before { }",
  }, {
    code: "a:hover::-moz-placeholder { }",
  }, {
    code: "a,\nb > .foo::before { }",
  } ],

  reject: [ {
    code: "a::pseudo { }",
    message: messages.rejected("::pseudo"),
    line: 1,
    column: 2,
  }, {
    code: "a::Pseudo { }",
    message: messages.rejected("::Pseudo"),
    line: 1,
    column: 2,
  }, {
    code: "a::pSeUdO { }",
    message: messages.rejected("::pSeUdO"),
    line: 1,
    column: 2,
  }, {
    code: "a::PSEUDO { }",
    message: messages.rejected("::PSEUDO"),
    line: 1,
    column: 2,
  }, {
    code: "a::element { }",
    message: messages.rejected("::element"),
    line: 1,
    column: 2,
  }, {
    code: "a:hover::element { }",
    message: messages.rejected("::element"),
    line: 1,
    column: 8,
  }, {
    code: "a,\nb > .foo::error { }",
    message: messages.rejected("::error"),
    line: 2,
    column: 9,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignorePseudoElements: ["pseudo"] } ],

  accept: [ {
    code: "a:before { }",
  }, {
    code: "a::before { }",
  }, {
    code: "a::pseudo { }",
  }, {
    code: "a::pSeUdO { }",
  }, {
    code: "a::PSEUDO { }",
  } ],

  reject: [{
    code: "a::element { }",
    message: messages.rejected("::element"),
    line: 1,
    column: 2,
  }],
})
