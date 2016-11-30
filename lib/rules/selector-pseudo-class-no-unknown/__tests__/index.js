"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,

  accept: [ {
    code: "a:hover { }",
  }, {
    code: "a:Hover { }",
  }, {
    code: "a:hOvEr { }",
  }, {
    code: "a:HOVER { }",
  }, {
    code: "a:before { }",
  }, {
    code: "a::before { }",
  }, {
    code: "input:not([type='submit']) { }",
  }, {
    code: ":matches(section, article, aside, nav) h1 { }",
  }, {
    code: "section:has(h1, h2, h3, h4, h5, h6) { }",
  }, {
    code: ":root { }",
  }, {
    code: "p:has(img):not(:has(:not(img))) { }",
  }, {
    code: "div.sidebar:has(*:nth-child(5)):not(:has(*:nth-child(6))) { }",
  }, {
    code: "div :nth-child(2 of .widget) { }",
  }, {
    code: "a:hover::before { }",
  }, {
    code: "a:-moz-placeholder { }",
  }, {
    code: "a,\nb > .foo:hover { }",
  }, {
    code: ":--heading { }",
  } ],

  reject: [ {
    code: "a:unknown { }",
    message: messages.rejected(":unknown"),
    line: 1,
    column: 2,
  }, {
    code: "a:Unknown { }",
    message: messages.rejected(":Unknown"),
    line: 1,
    column: 2,
  }, {
    code: "a:uNkNoWn { }",
    message: messages.rejected(":uNkNoWn"),
    line: 1,
    column: 2,
  }, {
    code: "a:UNKNOWN { }",
    message: messages.rejected(":UNKNOWN"),
    line: 1,
    column: 2,
  }, {
    code: "a:pseudo-class { }",
    message: messages.rejected(":pseudo-class"),
    line: 1,
    column: 2,
  }, {
    code: "a:unknown::before { }",
    message: messages.rejected(":unknown"),
    line: 1,
    column: 2,
  }, {
    code: "a,\nb > .foo:error { }",
    message: messages.rejected(":error"),
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
    code: ":#{$variable} {}",
  }, {
    code: ":#{$VARIABLE} {}",
  }, {
    code: "a:#{$variable} {}",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignorePseudoClasses: [ "unknown", "/^my-/" ] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "a:unknown { }",
  }, {
    code: "a:uNkNoWn { }",
  }, {
    code: "a:UNKNOWN { }",
  }, {
    code: "a:my-pseudo { }",
  }, {
    code: "a:MY-other-pseudo { }",
  } ],

  reject: [ {
    code: "a:pseudo-class { }",
    message: messages.rejected(":pseudo-class"),
    line: 1,
    column: 2,
  }, {
    code: "a:not-my-pseudo { }",
    message: messages.rejected(":not-my-pseudo"),
    line: 1,
    column: 2,
  } ],
})
