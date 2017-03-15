"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a { margin: 1px; }",
  }, {
    code: "a { margin: 1px 2px; }",
  }, {
    code: "a { margin: 1px 1px 2px; }",
  }, {
    code: "a { margin: 1px 2px 2px; }",
  }, {
    code: "a { margin: 1px 2px 3px; }",
  }, {
    code: "a { margin: 1px 1px 2px 2px; }",
  }, {
    code: "a { margin: 1px 1px 1px 2px; }",
  }, {
    code: "a { margin: 1px 2px 2px 1px; }",
  }, {
    code: "a { margin: 1px 2px 3px 1px; }",
  }, {
    code: "a { margin: 1px 2px 2px 3px; }",
  }, {
    code: "a { margin: 1px 2px 3px 3px; }",
  }, {
    code: "a { margin: 1px 2px 3px 4px; }",
  }, {
    code: "a { margin: 1px 1em 1pt 1pc; }",
  }, {
    code: "a { padding: 1px 2px 3px 4px; }",
  }, {
    code: "a { padding: 1px 1em 1pt 1pc; }",
  }, {
    code: "a { margin: calc(2px + 1px) calc(1px + 1px); }",
  }, {
    code: "a { margin: 1px 1px 1px 1px 1px; }",
    description: "ignore wrong value",
  }, {
    code: "a { property: 1px 1px 1px 1px; }",
    description: "ignore not shorthandable property",
  }, {
    code: "a { border-radius: 1px / 1px }",
    description: "ignore ellipse",
  }, {
    code: "a { margin: calc(1px + 1px) calc(1px + 1px); }",
    description: "ignore calc function",
  }, {
    code: "a { margin: some-function(1px + 1px) some-function(1px + 1px); }",
    description: "ignore all function",
  }, {
    code: "a { margin: var(--margin) var(--margin); }",
    description: "ignore variables",
  }, {
    code: "a { border-color: #FFFFFF transparent transparent }",
    description: "ignore upper case value",
  }, {
    code: "a { background: url(img.gif), url(img.gif); }",
    description: "ignore background property",
  }, {
    code: "a { font: 12pt/10pt 'Font', 'Font', 'Font'; }",
    description: "ignore font property",
  }, {
    code: "a { border: 5px solid red; }",
    description: "ignore border property",
  }, {
    code: "a { list-style: square outside; }",
    description: "ignore list-style property",
  }, {
    code: "a { transition: opacity 0.35s, transform 0.35s; }",
    description: "ignore transition property",
  } ],

  reject: [ {
    code: "a { margin: 1px 1px; }",
    message: messages.rejected("1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1Px 1pX; }",
    message: messages.rejected("1Px 1pX", "1Px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1PX 1PX; }",
    message: messages.rejected("1PX 1PX", "1PX"),
    line: 1,
    column: 5,
  }, {
    code: "a { mArGiN: 1px 1px; }",
    message: messages.rejected("1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { MARGIN: 1px 1px; }",
    message: messages.rejected("1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 1px 1px; }",
    message: messages.rejected("1px 1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 2px 1px; }",
    message: messages.rejected("1px 2px 1px", "1px 2px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 2pX 1px; }",
    message: messages.rejected("1px 2pX 1px", "1px 2pX"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 2PX 1px; }",
    message: messages.rejected("1px 2PX 1px", "1px 2PX"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 1px 1px 1px; }",
    message: messages.rejected("1px 1px 1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 2px 1px 2px; }",
    message: messages.rejected("1px 2px 1px 2px", "1px 2px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 2px 2px 2px; }",
    message: messages.rejected("1px 2px 2px 2px", "1px 2px 2px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 2px 3px 2px; }",
    message: messages.rejected("1px 2px 3px 2px", "1px 2px 3px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px  1px   1px    1px; }",
    message: messages.rejected("1px  1px   1px    1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 100% 100% 100% 100%; }",
    message: messages.rejected("100% 100% 100% 100%", "100%"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 1px !important; }",
    message: messages.rejected("1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1px 1px 1px 1px !important; }",
    message: messages.rejected("1px 1px 1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { padding: 1px 1px 1px 1px; }",
    message: messages.rejected("1px 1px 1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-color: transparent transparent transparent transparent; }",
    message: messages.rejected("transparent transparent transparent transparent", "transparent"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-color: transparent tRaNsPaReNt TRANSPARENT transparent; }",
    message: messages.rejected("transparent tRaNsPaReNt TRANSPARENT transparent", "transparent"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-color: tRaNsPaReNt TRANSPARENT TRANSPARENT transparent; }",
    message: messages.rejected("tRaNsPaReNt TRANSPARENT TRANSPARENT transparent", "tRaNsPaReNt"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-color: tRaNsPaReNt tRaNsPaReNt tRaNsPaReNt tRaNsPaReNt; }",
    message: messages.rejected("tRaNsPaReNt tRaNsPaReNt tRaNsPaReNt tRaNsPaReNt", "tRaNsPaReNt"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-color: TRANSPARENT TRANSPARENT TRANSPARENT TRANSPARENT; }",
    message: messages.rejected("TRANSPARENT TRANSPARENT TRANSPARENT TRANSPARENT", "TRANSPARENT"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-color: inherit inherit inherit inherit; }",
    message: messages.rejected("inherit inherit inherit inherit", "inherit"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-color: #fff #fff #fff #fff; }",
    message: messages.rejected("#fff #fff #fff #fff", "#fff"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-radius: 1px 1px 1px 1px; }",
    message: messages.rejected("1px 1px 1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { -webkit-border-radius: 1px 1px 1px 1px; }",
    message: messages.rejected("1px 1px 1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-style: solid solid solid solid; }",
    message: messages.rejected("solid solid solid solid", "solid"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-width: 1px 1px 1px 1px; }",
    message: messages.rejected("1px 1px 1px 1px", "1px"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-width: thin thin thin thin; }",
    message: messages.rejected("thin thin thin thin", "thin"),
    line: 1,
    column: 5,
  }, {
    code: "a { margin: 1em 0 2em 0; }",
    message: messages.rejected("1em 0 2em 0", "1em 0 2em"),
    line: 1,
    column: 5,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "less",

  accept: [ {
    code: "@margin: 1px 1px 1px 1px;",
  }, {
    code: "a { margin: @variable @variable @variable @variable; }",
  }, {
    code: "a { @margin: 1px 1px 1px 1px; }",
  }, {
    code: "a { @margin: @variable + 10 @variable + 10; }",
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [ {
    code: "$margin: 1px 1px 1px 1px;",
  }, {
    code: "a { margin: $variable $variable $variable $variable; }",
  }, {
    code: "a { $margin: 1px 1px 1px 1px; }",
  }, {
    code: "a { $margin: $variable + 10 $variable + 10; }",
  }, {
    code: "a { #{$margin}: 1px 1px 1px 1px; }",
  }, {
    code: "a { margin-#{$margin}: 1px 1px 1px 1px; }",
  }, {
    code: "a { #{$margin}-margin: 1px 1px 1px 1px; }",
  } ],
})
