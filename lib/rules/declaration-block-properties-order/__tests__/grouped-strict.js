"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,

  config: [[ "height", "width", {
    order: "strict",
    properties: [ "color", "font-size", "font-weight" ],
  } ]],

  accept: [ {
    code: "a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }",
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
    code: "a { width: 2px; color: pink; font-size: 2px; font-weight: bold; height: 1px; }",
    message: messages.expected("height", "font-weight"),
  }, {
    code: "a { height: 1px; color: pink; width: 2px; font-size: 2px; font-weight: bold; }",
    message: messages.expected("width", "color"),
  }, {
    code: "a { height: 1px; width: 2px; font-size: 2px; color: pink; font-weight: bold; }",
    message: messages.expected("color", "font-size"),
  }, {
    code: "a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }",
    message: messages.expected("color", "font-weight"),
  }, {
    code: "a { height: 1px; width: 2px; color: pink; font-weight: bold; font-size: 2px; }",
    message: messages.expected("font-size", "font-weight"),
  } ],
})

testRule(rule, {
  ruleName,

  config: [[ {
    order: "strict",
    properties: [ "width", "height" ],
  }, {
    order: "strict",
    properties: [ "color", "font-size", "font-weight" ],
  } ]],

  accept: [{
    code: "a { width: 2px; height: 1px; color: pink; font-size: 2px; font-weight: bold; }",
  }],

  reject: [ {
    code: "a { width: 2px; color: pink; font-size: 2px; font-weight: bold; height: 1px; }",
    message: messages.expected("height", "font-weight"),
  }, {
    code: "a { height: 1px; color: pink; width: 2px; font-size: 2px; font-weight: bold; }",
    message: messages.expected("width", "color"),
  }, {
    code: "a { width: 2px; height: 1px; font-size: 2px; color: pink; font-weight: bold; }",
    message: messages.expected("color", "font-size"),
  }, {
    code: "a { width: 2px; height: 1px; font-size: 2px; font-weight: bold; color: pink; }",
    message: messages.expected("color", "font-weight"),
  }, {
    code: "a { width: 2px; height: 1px; color: pink; font-weight: bold; font-size: 2px; }",
    message: messages.expected("font-size", "font-weight"),
  } ],
})
