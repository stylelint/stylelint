"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "foo {}",
  }, {
    code: "#foo {}",
  }, {
    code: ".foo {}",
  }, {
    code: "[foo] {}",
  }, {
    code: ":root { --foo: 1px; }",
    description: "custom property in root",
  }, {
    code: "html { --foo: 1px; }",
    description: "custom property in selector",
  }, {
    code: ":root { --custom-property-set: {} }",
    description: "custom property set in root",
  }, {
    code: "html { --custom-property-set: {} }",
    description: "custom property set in selector",
  } ],

  reject: [ {
    code: "* {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".bar * {}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: "*.bar {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".foo, .bar, *.baz {}",
    message: messages.rejected,
    line: 1,
    column: 13,
  } ],
})
