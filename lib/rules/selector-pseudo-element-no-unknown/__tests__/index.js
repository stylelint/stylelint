"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

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
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [ {
    code: "::#{$variable} {}",
  }, {
    code: "::#{$VARIABLE} {}",
  }, {
    code: "a::#{$variable} {}",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignorePseudoElements: [ "pseudo", "/^my-/" ] } ],

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
  }, {
    code: "a::my-pseudo { }",
  }, {
    code: "a::MY-other-pseudo { }",
  } ],

  reject: [ {
    code: "a::element { }",
    message: messages.rejected("::element"),
    line: 1,
    column: 2,
  }, {
    code: "a::not-my-pseudo { }",
    message: messages.rejected("::not-my-pseudo"),
    line: 1,
    column: 2,
  } ],
})
