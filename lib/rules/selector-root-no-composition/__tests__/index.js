"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: ":root {}",
  }, {
    code: ":rOoT {}",
  }, {
    code: ":ROOT {}",
  }, {
    code: "   :root\n {}",
  } ],

  reject: [ {
    code: "a, :root {}",
    message: messages.rejected,
  }, {
    code: "a, :rOoT {}",
    message: messages.rejected,
  }, {
    code: "a, :ROOT {}",
    message: messages.rejected,
  }, {
    code: ":root, a {}",
    message: messages.rejected,
  }, {
    code: ":root + a {}",
    message: messages.rejected,
  }, {
    code: "body, .foo, :root + a {}",
    message: messages.rejected,
  }, {
    code: "html:root {}",
    message: messages.rejected,
  }, {
    code: "html :root {}",
    message: messages.rejected,
  } ],
})
