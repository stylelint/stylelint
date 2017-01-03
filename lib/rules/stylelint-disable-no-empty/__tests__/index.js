"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "/* non applicable comment */",
    description: "non applicable comment",
  }, {
    code: "/* stylelint-disable block-no-empty */",
    description: "stylelint-disable",
  }, {
    code: "a {} /* stylelint-disable-line block-no-empty */",
    description: "stylelint-disable-line",
  } ],

  reject: [ {
    code: "/* stylelint-disable */",
    description: "stylelint-disable",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "a {} /* stylelint-disable-line */",
    description: "stylelint-disable-line",
    message: messages.rejected,
    line: 1,
    column: 6,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [ {
    code: "// stylelint-disable block-no-empty",
    description: "scss stylelint-disable inline comment",
  }, {
    code: "a {} // stylelint-disable-line block-no-empty",
    description: "scss stylelint-disable-line inline comment",
  } ],

  reject: [ {
    code: "// stylelint-disable",
    description: "scss stylelint-disable inline comment",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "a {} // stylelint-disable-line",
    description: "scss stylelint-disable-line inline comment",
    message: messages.rejected,
    line: 1,
    column: 6,
  } ],
})
