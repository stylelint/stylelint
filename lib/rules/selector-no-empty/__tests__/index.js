"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: ".a, .b {}",
  }, {
    code: " a {}",
  } ],

  reject: [ {
    code: "   {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: "   ,  .a   , .b {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: ".a,  ,.b {}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: ".a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 11,
  }, {
    code: "   .a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 14,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "sugarss",
  skipBasicChecks: true,

  accept: [ {
    code: ".a, .b \n  color: pink",
  }, {
    code: "a\n  color: red",
  } ],

  reject: [ {
    code: ",\n.a  ,\n.b\n  color:red",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".a,\n,\n.b\n  color:red",
    message: messages.rejected,
    line: 2,
    column: 1,
  }, {
    code: ".a,\n.b,\n  color:red",
    message: messages.rejected,
    line: 2,
    column: 4,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "less",

  accept: [ {
    code: ".a, .b {}",
  }, {
    code: " a {}",
  } ],

  reject: [ {
    code: "   {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: "   ,  .a   , .b {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: ".a,  ,.b {}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: ".a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 11,
  }, {
    code: "   .a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 14,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [ {
    code: ".a, .b {}",
  }, {
    code: " a {}",
  } ],

  reject: [ {
    code: "   {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: "   ,  .a   , .b {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  }, {
    code: ".a,  ,.b {}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: ".a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 11,
  }, {
    code: "   .a,    .b, {}",
    message: messages.rejected,
    line: 1,
    column: 14,
  }, {
    code: "  .a     ,    , .b {}",
    message: messages.rejected,
    line: 1,
    column: 15,
  }, {
    code: ".a,,.b {}",
    message: messages.rejected,
    line: 1,
    column: 4,
  } ],
})
