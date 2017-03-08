"use strict"

const mergeTestDescriptions = require("../../../testUtils/mergeTestDescriptions")

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

const sharedTests = {
  accept: [ {
    code: "a { border-#$side: 0; }",
    description: "ignore sass-like interpolation",
  }, {
    code: "a { box-sizing: #$type-box; }",
    description: "ignore sass-like interpolation",
  }, {
    code: "a { stroke: url(#gradiantA) }",
    description: "SVG reference interaction",
  } ],
}

testRule(rule, mergeTestDescriptions(sharedTests, {
  ruleName,
  config: ["lower"],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a { color: #000; }",
  }, {
    code: "a { something: #000, #fff, #ababab; }",
  }, {
    code: "a { color: #0000ffcc; }",
    description: "eight digits",
  }, {
    code: "a { color: #00fc; }",
    description: "four digits",
  }, {
    code: "a { padding: 000; }",
  }, {
    code: "a::before { content: \"#ABABA\"; }",
  }, {
    code: "a { color: white /* #FFF */; }",
  } ],

  reject: [ {
    code: "a { color: #Ababa; }",
    message: messages.expected("#Ababa", "#ababa"),
    line: 1,
    column: 12,
  }, {
    code: "a { something: #000F, #fff, #ababab; }",
    message: messages.expected("#000F", "#000f"),
    line: 1,
    column: 16,
  }, {
    code: "a { something: #000, #FFFFAZ, #ababab; }",
    message: messages.expected("#FFFFAZ", "#ffffaz"),
    line: 1,
    column: 22,
  }, {
    code: "a { something: #000, #fff, #12345AA; }",
    message: messages.expected("#12345AA", "#12345aa"),
    line: 1,
    column: 28,
  } ],
}))

testRule(rule, mergeTestDescriptions(sharedTests, {
  ruleName,
  config: ["upper"],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a { color: #000; }",
  }, {
    code: "a { something: #000, #FFF, #ABABAB; }",
  }, {
    code: "a { color: #0000FFCC; }",
    description: "eight digits",
  }, {
    code: "a { color: #00FC; }",
    description: "four digits",
  }, {
    code: "a { padding: 000; }",
  }, {
    code: "a::before { content: \"#ababa\"; }",
  }, {
    code: "a { color: white /* #fff */; }",
  } ],

  reject: [ {
    code: "a { color: #aBABA; }",
    message: messages.expected("#aBABA", "#ABABA"),
    line: 1,
    column: 12,
  }, {
    code: "a { something: #000f, #FFF, #ABABAB; }",
    message: messages.expected("#000f", "#000F"),
    line: 1,
    column: 16,
  }, {
    code: "a { something: #000, #ffffaz, #ABABAB; }",
    message: messages.expected("#ffffaz", "#FFFFAZ"),
    line: 1,
    column: 22,
  }, {
    code: "a { something: #000, #FFF, #12345aa; }",
    message: messages.expected("#12345aa", "#12345AA"),
    line: 1,
    column: 28,
  } ],
}))
