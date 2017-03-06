"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a { font-family: \"Lucida Grande\", \"Arial\", sans-serif; }",
  }, {
    code: "a { font: 1em \"Lucida Grande\", \'Arial\', sans-serif; }",
  }, {
    code: "a { font: 1em \"Lucida Grande\", \'Arial\', \"sans-serif\", sans-serif; }",
  }, {
    code: "a { font-family: Times, serif; }",
  }, {
    code: "b { font: normal 14px/32px -apple-system, BlinkMacSystemFont, sans-serif; }",
  } ],

  reject: [ {
    code: "a { font-family: \"Lucida Grande\", \'Arial\', sans-serif, sans-serif; }",
    message: messages.rejected("sans-serif"),
    line: 1,
    column: 56,
  }, {
    code: "a { font-family: \'Arial\', \"Lucida Grande\", Arial, sans-serif; }",
    message: messages.rejected("Arial"),
    line: 1,
    column: 44,
  }, {
    code: "a { fOnT-fAmIlY: \'  Lucida Grande \', \"Lucida Grande\", sans-serif; }",
    message: messages.rejected("Lucida Grande"),
    line: 1,
    column: 38,
  }, {
    code: "a { font-family: \'Times\', Times, \"serif\", serif; }",
    message: messages.rejected("Times"),
    line: 1,
    column: 27,
  }, {
    code: "a { FONT: italic 300 16px/30px Arial, \" Arial\", serif; }",
    message: messages.rejected("Arial"),
    line: 1,
    column: 39,
  }, {
    code: "b { font: normal 14px/32px -apple-system, BlinkMacSystemFont, sans-serif, sans-serif; }",
    message: messages.rejected("sans-serif"),
    line: 1,
    column: 75,
  } ],

})

testRule(rule, {
  ruleName,
  config: [ true, { ignoreFontFamilyNames: [ "monospace", "/my-/" ] } ],

  accept: [ {
    code: "pre { font-family: monospace, monospace }",
  }, {
    code: "pre { font: 1em monospace, monospace}",
  }, {
    code: "pre { font-family: monospace, \"Roberto Mono\", monospace}",
  }, {
    code: "pre { font-family: my-font, \"My-font\", sans-serif}",
  }, {
    code: "pre { font-family: \"My-font\", \"My-font\", sans-serif}",
  } ],

  reject: [{
    code: "pre { font-family: \"Roberto Mono\", \"Roberto Mono\", monospace}",
    message: messages.rejected("Roberto Mono"),
    line: 1,
    column: 36,
  }],
})
