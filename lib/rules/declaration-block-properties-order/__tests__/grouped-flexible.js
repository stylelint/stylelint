"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,

  config: [[ "height", "width", {
    order: "flexible",
    properties: [ "color", "font-size", "font-weight" ],
  } ]],

  accept: [ {
    code: "a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }",
  }, {
    code: "a { height: 1px; width: 2px; font-size: 2px; color: pink; font-weight: bold; }",
  }, {
    code: "a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }",
  }, {
    code: "a { height: 1px; width: 2px; font-weight: bold; font-size: 2px; color: pink; }",
  }, {
    code: "a { height: 10px; background: orange; }",
    description: "unspecified after groupless specified",
  }, {
    code: "a { font-weight: bold; background: orange; }",
    description: "unspecified after grouped specified",
  }, {
    code: "a { background: orange; height: 10px; }",
    description: "unspecified before groupless specified",
  }, {
    code: "a { background: orange; font-weight: bold; }",
    description: "unspecified before grouped specified",
  } ],

  reject: [ {
    code: "a { height: 1px; font-weight: bold; width: 2px; }",
    message: messages.expected("width", "font-weight"),
    line: 1,
    column: 37,
  }, {
    code: "a { font-weight: bold; height: 1px; width: 2px; }",
    message: messages.expected("height", "font-weight"),
    line: 1,
    column: 24,
  }, {
    code: "a { width: 2px; height: 1px; font-weight: bold; }",
    message: messages.expected("height", "width"),
    line: 1,
    column: 17,
  }, {
    code: "a { height: 1px; color: pink; width: 2px; font-weight: bold; }",
    message: messages.expected("width", "color"),
    line: 1,
    column: 31,
  } ],
})

testRule(rule, {
  ruleName,

  config: [[ {
    order: "flexible",
    properties: [ "width", "height" ],
  }, {
    order: "flexible",
    properties: [ "color", "font-size", "font-weight" ],
  } ]],

  accept: [ {
    code: "a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }",
  }, {
    code: "a { width: 2px; height: 1px; font-size: 2px; color: pink; font-weight: bold; }",
  }, {
    code: "a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }",
  }, {
    code: "a { width: 2px; height: 1px; font-weight: bold; font-size: 2px; color: pink; }",
  } ],

  reject: [ {
    code: "a { height: 1px; font-weight: bold; width: 2px; }",
    message: messages.expected("width", "font-weight"),
    line: 1,
    column: 37,
  }, {
    code: "a { font-weight: bold; height: 1px; width: 2px; }",
    message: messages.expected("height", "font-weight"),
    line: 1,
    column: 24,
  }, {
    code: "a { height: 1px; color: pink; width: 2px; font-weight: bold; }",
    message: messages.expected("width", "color"),
    line: 1,
    column: 31,
  } ],
})
