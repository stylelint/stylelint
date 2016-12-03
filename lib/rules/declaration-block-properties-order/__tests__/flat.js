"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,

  config: [[ "my", "transform", "font-smoothing", "top", "transition", "border", "color" ]],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a { color: pink; color: red; }",
  }, {
    code: "a { top: 0; color: pink; }",
  }, {
    code: "a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }",
  }, {
    code: "a { -webkit-font-smoothing: antialiased; top: 0; color: pink; }",
  }, {
    code: "a { my-property: 2em; -webkit-font-smoothing: antialiased; }",
  }, {
    code: "a { top: 0; color: pink; width: 0; }",
  }, {
    code: "a { top: 0; color: pink; width: 0; height: 0; }",
  }, {
    code: "a { @media (min-width: 10px) { color: pink; } top: 0; }",
    description: "media query nested in rule has its own ordering",
  }, {
    code: "a { border: 1px solid; color: pink; }",
  }, {
    code: "a { border-top: 1px solid; color: pink; }",
  }, {
    code: "a { border-left: 1px solid; color: pink; }",
  }, {
    code: "a { border-left: 1px solid; border-right: 0; color: pink; }",
  }, {
    code: "a { border-right: 1px solid; border-left: 0; color: pink; }",
  }, {
    code: "a { transition: none; border: 1px solid; }",
  }, {
    code: "a { transition-name: 'foo'; border-top: 1px solid; }",
  }, {
    code: "a { top: 0; color: pink; width: 0; height: 0; display: none; }",
  }, {
    code: "a { top: 0; color: pink; display: none; width: 0; height: 0; }",
  }, {
    code: "a { display: none; top: 0; color: pink; width: 0; height: 0; }",
  } ],

  reject: [ {
    code: "a { color: pink; top: 0;  }",
    message: messages.expected("top", "color"),
  }, {
    code: "a { top: 0; transform: scale(1); color: pink; }",
    message: messages.expected("transform", "top"),
  }, {
    code: "a { -moz-transform: scale(1); transform: scale(1); -webkit-transform: scale(1); }",
    message: messages.expected("-webkit-transform", "transform"),
  }, {
    code: "a { -webkit-transform: scale(1); -moz-transform: scale(1); transform: scale(1); }",
    message: messages.expected("-moz-transform", "-webkit-transform"),
  }, {
    code: "a { color: pink; -webkit-font-smoothing: antialiased; }",
    message: messages.expected("-webkit-font-smoothing", "color"),
  }, {
    code: "a { my-property: 2em; -webkit-font-smoothing: antialiased; my-other-property: 1em; }",
    message: messages.expected("my-other-property", "-webkit-font-smoothing"),
  }, {
    code: "a { color: pink; border: 1px solid; }",
    message: messages.expected("border", "color"),
  }, {
    code: "a { color: pink; border-top: 1px solid; }",
    message: messages.expected("border-top", "color"),
  }, {
    code: "a { color: pink; border-bottom: 1px solid; }",
    message: messages.expected("border-bottom", "color"),
  }, {
    code: "a { border-right: 0; color: pink; border-bottom: 1px solid; }",
    message: messages.expected("border-bottom", "color"),
  }, {
    code: "a { border-top: 1px solid; transition-name: 'foo'; }",
    message: messages.expected("transition-name", "border-top"),
  }, {
    code: "a { @media (min-width: 10px) { color: pink; top: 0; } transform: scale(1); }",
    description: "media query nested in rule can violates its own ordering",
    message: messages.expected("top", "color"),
  } ],
})

testRule(rule, {
  ruleName,

  config: [[ "padding", "padding-top", "padding-right", "padding-left", "border", "border-top", "border-right", "color" ]],

  accept: [ {
    code: "a { padding: 1px; color: pink; }",
  }, {
    code: "a { padding-top: 1px; color: pink; }",
  }, {
    code: "a { padding-left: 1px; color: pink; }",
  }, {
    code: "a { padding-top: 1px; padding-right: 0; color: pink; }",
  }, {
    code: "a { padding-bottom: 0; padding-top: 1px; padding-right: 0; padding-left: 0; color: pink; }",
  }, {
    code: "a { padding: 1px; padding-bottom: 0; padding-left: 0; color: pink; }",
  }, {
    code: "a { border: 1px solid #fff; border-right: 2px solid #fff; border-right-color: #000; }",
  }, {
    code: "a { border: 1px solid #fff; border-top: none; border-right-color: #000; }",
  } ],

  reject: [ {
    code: "a { color: pink; padding: 1px; }",
    message: messages.expected("padding", "color"),
  }, {
    code: "a { color: pink; padding-top: 1px; }",
    message: messages.expected("padding-top", "color"),
  }, {
    code: "a { padding-right: 1px; padding-top: 0; color: pink;  }",
    message: messages.expected("padding-top", "padding-right"),
  } ],
})

testRule(rule, {
  ruleName,

  config: [ [ "height", "color" ], { unspecified: "top" } ],

  accept: [ {
    code: "a { top: 0; height: 1px; color: pink; }",
  }, {
    code: "a { bottom: 0; top: 0; }",
  } ],

  reject: [ {
    code: "a { height: 1px; top: 0; }",
    message: messages.expected("top", "height"),
  }, {
    code: "a { color: 1px; top: 0; }",
    message: messages.expected("top", "color"),
  } ],
})

testRule(rule, {
  ruleName,

  config: [ [ "height", "color" ], { unspecified: "bottom" } ],

  accept: [ {
    code: "a { height: 1px; color: pink; bottom: 0; }",
  }, {
    code: "a { bottom: 0; top: 0; }",
  } ],

  reject: [ {
    code: "a { bottom: 0; height: 1px; }",
    message: messages.expected("height", "bottom"),
  }, {
    code: "a { bottom: 0; color: 1px; }",
    message: messages.expected("color", "bottom"),
  } ],
})

testRule(rule, {
  ruleName,

  config: [ [ "all", "compose" ], { unspecified: "bottomAlphabetical" } ],

  accept: [ {
    code: "a { all: initial; compose: b; }",
  }, {
    code: "a { bottom: 0; top: 0; }",
  }, {
    code: "a { all: initial; compose: b; bottom: 0; top: 0; }",
  } ],

  reject: [ {
    code: "a { align-items: flex-end; all: initial; }",
    message: messages.expected("all", "align-items"),
  }, {
    code: "a { compose: b; top: 0; bottom: 0; }",
    message: messages.expected("bottom", "top"),
  } ],
})

testRule(rule, {
  ruleName,

  config: [[ "left", "margin" ]],

  skipBasicChecks: true,

  accept: [{
    code: ".foo { left: 0; color: pink; margin: 0; }",
  }],

  reject: [{
    code: ".foo { margin: 0; color: pink; left: 0; }",
    message: messages.expected("left", "margin"),
  }],
})
