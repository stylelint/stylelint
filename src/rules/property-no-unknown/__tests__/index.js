import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: ".foo { color: green; }",
  }, {
    code: ".foo { fill: black; }",
  }, {
    code: ".foo { -webkit-align-self: center; }",
  }, {
    code: ".foo { align-self: center; }",
  }, {
    code: ".foo { --bg-color: white; }",
    description: "ignore standard CSS variables",
  }, {
    code: ".foo { *width: 100px; }",
    description: "ignore CSS hacks",
  } ],

  reject: [ {
    code: ".foo { colr: blue; }",
    message: messages.rejected("colr"),
    line: 1,
    column: 8,
  }, {
    code: ".foo {\n  colr: blue;\n}",
    message: messages.rejected("colr"),
    line: 2,
    column: 3,
  }, {
    code: ".foo { -moz-align-self: center; }",
    message: messages.rejected("-moz-align-self"),
    line: 1,
    column: 8,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: [true],

  accept: [ {
    code: ".foo { $bgColor: white; }",
    description: "ignore SCSS variables",
  }, {
    code: ".foo { #{$prop}: black; }",
    description: "ignore property interpolation",
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: [true],

  accept: [ {
    code: ".foo { @bgColor: white; }",
    description: "ignore LESS variables",
  }, {
    code: ".foo { @{prop}: black; }",
    description: "ignore property interpolation",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignoreProperties: ["-moz-overflow-scrolling"] } ],

  accept: [ {
    code: ".foo { -webkit-overflow-scrolling: auto; }",
  }, {
    code: ".foo { -moz-overflow-scrolling: auto; }",
  } ],

  reject: [{
    code: ".foo { overflow-scrolling: auto; }",
    message: messages.rejected("overflow-scrolling"),
    line: 1,
    column: 8,
  }],
})
