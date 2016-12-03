"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["alphabetical"],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a { color: pink; color: red; }",
  }, {
    code: "a { color: pink; color: red; } b { color: pink; color: red; }",
  }, {
    code: "a { color: pink; top: 0; }",
  }, {
    code: "a { border: 1px solid pink; border-left-width: 0; }",
  }, {
    code: "a { color: pink; top: 0; transform: scale(1); }",
  }, {
    code: "a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }",
  }, {
    code: "a { color: pink; -webkit-font-smoothing: antialiased; top: 0; }",
  }, {
    code: "a {{ &:hover { color: red; top: 0; } } }",
  }, {
    code: "a { top: 0; { &:hover { color: red; } } }",
  }, {
    code: "a { top: 0; &:hover { color: red; } }",
  }, {
    code: "a { color: red; width: 0; { &:hover { color: red; top: 0; } } }",
  }, {
    code: "a { color: red; width: 0; &:hover { color: red; top: 0; } }",
  }, {
    code: "a { color: red; width: 0; @media print { color: red; top: 0; } }",
  }, {
    code: "a { $scss: 0; $a: 0; alpha: 0; }",
  }, {
    code: "a { @less: 0; @a: 0; alpha: 0; }",
  }, {
    code: "a { --custom-property: 0; --another: 0; alpha: 0; }",
  }, {
    code: "a { font-size: 1px; -moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialised; font-weight: bold; }",
  } ],

  reject: [ {
    code: "a { top: 0; color: pink; }",
    message: messages.expected("color", "top"),
  }, {
    code: "a { top: 0; color: pink; } b { color: pink; top: 0; }",
    message: messages.expected("color", "top"),
  }, {
    code: "a { color: pink; transform: scale(1); top: 0; }",
    message: messages.expected("top", "transform"),
  }, {
    code: "a { color: pink; top: 0; -moz-transform: scale(1); transform: scale(1); -webkit-transform: scale(1); }",
    message: messages.expected("-webkit-transform", "transform"),
  }, {
    code: "a { -webkit-transform: scale(1); -moz-transform: scale(1); transform: scale(1); }",
    message: messages.expected("-moz-transform", "-webkit-transform"),
  }, {
    code: "a { -webkit-font-smoothing: antialiased; color: pink;  top: 0; }",
    message: messages.expected("color", "-webkit-font-smoothing"),
  }, {
    code: "a { width: 0; { &:hover { top: 0; color: red; } } }",
    message: messages.expected("color", "top"),
  }, {
    code: "a {{ &:hover { top: 0; color: red; } } }",
    message: messages.expected("color", "top"),
  }, {
    code: "a { width: 0; &:hover { top: 0; color: red; } }",
    message: messages.expected("color", "top"),
  }, {
    code: "a { width: 0; @media print { top: 0; color: red; } }",
    message: messages.expected("color", "top"),
  }, {
    code: "@media print { top: 0; color: red; }",
    message: messages.expected("color", "top"),
  } ],
})
