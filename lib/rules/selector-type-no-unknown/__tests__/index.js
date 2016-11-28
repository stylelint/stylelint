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
    code: "a {}",
  }, {
    code: "input {}",
  }, {
    code: "acronym {}",
  }, {
    code: "HGrOuP {}",
  }, {
    code: "iNpUt {}",
  }, {
    code: "INPUT {}",
  }, {
    code: "ul li {}",
  }, {
    code: "ul > li {}",
  }, {
    code: "ul + li {}",
  }, {
    code: "ul ~ li {}",
  }, {
    code: "@media only screen and (min-width: 35em) { a {} }",
  }, {
    code: "a.class {}",
  }, {
    code: "a#id {}",
  }, {
    code: "a:hover {}",
  }, {
    code: "a::before {}",
  }, {
    code: "a[target] {}",
  }, {
    code: ":lang(en) {}",
  }, {
    code: "a:nth-of-type(n) {}",
  }, {
    code: "a:nth-child(n) {}",
  }, {
    code: "circle {}",
    description: "svg tags",
  }, {
    code: "@media keyframes { 0.0% {} 49.1% {} 100% {} }",
    description: "standard usage of keyframe selectors",
  }, {
    code: "@media keyframes { 0%, 50.001%, 100% {} }",
    description: "standard usage of complex keyframe selectors",
  }, {
    code: "@include keyframes(identifier) { 0% {} 100% {} }",
    description: "non-standard usage of keyframe selectors",
  }, {
    code: "a { --custom-property-set: {}; }",
    description: "custom property set",
  } ],

  reject: [ {
    code: "unknown {}",
    message: messages.rejected("unknown"),
    line: 1,
    column: 1,
  }, {
    code: "uNkNoWn {}",
    message: messages.rejected("uNkNoWn"),
    line: 1,
    column: 1,
  }, {
    code: "UNKNOWN {}",
    message: messages.rejected("UNKNOWN"),
    line: 1,
    column: 1,
  }, {
    code: "ul unknown {}",
    message: messages.rejected("unknown"),
    line: 1,
    column: 4,
  }, {
    code: "unknown[target] {}",
    message: messages.rejected("unknown"),
    line: 1,
    column: 1,
  }, {
    code: "unknown:nth-child(even) {}",
    message: messages.rejected("unknown"),
    line: 1,
    column: 1,
  }, {
    code: "@media only screen and (min-width: 35em) { unknown {} }",
    message: messages.rejected("unknown"),
    line: 1,
    column: 44,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [ {
    code: ".foo { &-bar {} }",
  }, {
    code: "#{$variable} {}",
  }, {
    code: "%foo {}",
    description: "ignore placeholder selector",
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "less",

  accept: [{
    code: "@foo: {};",
    description: "less detached rulesets",
  }],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignoreTypes: [ "unknown", "/^my-/" ] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "unknown {}",
  }, {
    code: "uNkNoWn {}",
  }, {
    code: "UNKNOWN {}",
  }, {
    code: "my-type {}",
  }, {
    code: "my-other-type {}",
  } ],

  reject: [ {
    code: "tag {}",
    message: messages.rejected("tag"),
    line: 1,
    column: 1,
  }, {
    code: "not-my-type {}",
    message: messages.rejected("not-my-type"),
    line: 1,
    column: 1,
  } ],
})
