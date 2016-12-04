"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,

  accept: [ {
    code: "",
  }, {
    code: "\n",
  }, {
    code: "a { color: pink; }\n",
  }, {
    code: "a { color: pink; }\n\n\n",
  } ],

  reject: [ {
    code: "a { color: pink; }",
    message: messages.rejected,
    line: 1,
    column: 18,
  }, {
    code: "a { color: pink; }\n\n\nb{ color: orange; }",
    message: messages.rejected,
    line: 4,
    column: 19,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "sugarss",

  accept: [{
    code: "a\n",
  }],

  reject: [ {
    code: "a",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "body\n  padding: 5% 2% 5%",
    message: messages.rejected,
    line: 2,
    column: 17,
  } ],
})
