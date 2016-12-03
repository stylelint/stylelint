"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],
})

testRule(rule, {
  ruleName,
  config: [ true, { browsers: "last 2 versions" } ],

  accept: [ {
    code: "a { opacity: 1; }",
  }, {
    code: "a { outline: none; }",
  }, {
    code: "a { background: linear-gradient(black, white); }",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { browsers: "ie >= 7, safari >= 6" } ],

  reject: [ {
    code: "a { opacity: 1; }",
    description: "opacity",
    message: messages.rejected("\"css-opacity\" is only partially supported by IE 7,8"),
    line: 1,
    column: 5,
  }, {
    code: "a { outline: none; }",
    description: "outline",
    message: messages.rejected("\"outline\" is not supported by IE 7"),
    line: 1,
    column: 5,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { browsers: "ie >= 7, safari >= 6", ignore: "outline" } ],

  accept: [{
    code: "a { outline: none; }",
  }],

  reject: [{
    code: "a { opacity: 1; }",
    description: "opacity",
    message: messages.rejected("\"css-opacity\" is only partially supported by IE 7,8"),
    line: 1,
    column: 5,
  }],
})

testRule(rule, {
  ruleName,
  config: [ true, { browsers: "ie >= 9, chrome > 1" } ],

  accept: [ {
    code: "a { opacity: 1; }",
  }, {
    code: "a { outline: none; }",
  } ],

  reject: [{
    code: "a { background: linear-gradient(black, white); }",
    description: "gradient",
    message: messages.rejected("\"css-gradients\" is not supported by IE 9 and only partially supported by Chrome 4,5,6,7,8,9"),
    line: 1,
    column: 5,
  }],
})
