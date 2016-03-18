import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a::before { content: \"var(--hoot)color(blue)\"; }",
  }, {
    code: "a::before { background: url('var(--hoot)color(blue)'); }",
  }, {
    code: "a::before { content: attr(data-foo); }",
  }, {
    code: "a { transform: translate(1, 1); }",
  }, {
    code: "a { transform: translate(1, 1) }",
  }, {
    code: "a { transform: translate(1, 1)}",
  }, {
    code: "a { transform: translate(1, 1) scale(3); }",
  }, {
    code: "a { color: color(rgb(0,0,0) lightness(50%)) };",
  }, {
    code: "a { background-image: linear-gradient(#f3c, #4ec), linear-gradient(#f3c, #4ec); }",
    description: "multiple comma-separated functions ",
  }, {
    code: "a { border-color: color(rgb(0,0,0) lightness(50%)) red pink orange; }",
    description: "function within a function as one of multiple space-separated values",
  }, {
    code: "a { transform: translate(1, 1)  scale(3); }",
  }, {
    code: "a { transform: translate(1, 1)\nscale(3); }",
  }, {
    code: "a { transform: translate(1, 1)\r\nscale(3); }",
  }, {
    code: "a { color: color(rgb(0,0,0)  lightness(50%)) };",
  }, {
    code: "a { color: color(rgb(0,0,0)\nlightness(50%)) };",
  }, {
    code: "a { color: color(rgb(0,0,0)\r\nlightness(50%)) };",
  } ],

  reject: [ {
    code: "a { transform: translate(1, 1)scale(3); }",
    message: messages.expected,
    line: 1,
    column: 31,
  }, {
    code: "a { color: color(rgb(0,0,0)lightness(50%)) };",
    message: messages.expected,
    line: 1,
    column: 28,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "a::before { content: \"var(--hoot) color(blue)\"; }",
  }, {
    code: "a::before { background: url('var(--hoot) color(blue)'); }",
  }, {
    code: "a::before { content: attr(data-foo); }",
  }, {
    code: "a { transform: translate(1, 1); }",
  }, {
    code: "a { transform: translate(1, 1) }",
  }, {
    code: "a { transform: translate(1, 1)}",
  }, {
    code: "a { transform: translate(1, 1)scale(3); }",
  }, {
    code: "a { color: color(rgb(0,0,0)lightness(50%)) };",
  } ],

  reject: [ {
    code: "a { transform: translate(1, 1) scale(3); }",
    message: messages.rejected,
    line: 1,
    column: 31,
  }, {
    code: "a { transform: translate(1, 1)  scale(3); }",
    message: messages.rejected,
    line: 1,
    column: 31,
  }, {
    code: "a { transform: translate(1, 1)\nscale(3); }",
    message: messages.rejected,
    line: 1,
    column: 31,
  }, {
    code: "a { transform: translate(1, 1)\r\nscale(3); }",
    description: "CRLF",
    message: messages.rejected,
    line: 1,
    column: 31,
  }, {
    code: "a { color: color(rgb(0,0,0) lightness(50%)) };",
    message: messages.rejected,
    line: 1,
    column: 28,
  }, {
    code: "a { color: color(rgb(0,0,0)  lightness(50%)) };",
    message: messages.rejected,
    line: 1,
    column: 28,
  }, {
    code: "a { color: color(rgb(0,0,0)\nlightness(50%)) };",
    message: messages.rejected,
    line: 1,
    column: 28,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [{
    code: "h1 { max-height: #{($line-height) * ($lines-to-show)}em; }",
    description: "Sass-style interpolation with curly braces",
  }],

  reject: [{
    code: "a { padding:\n  10px\n  // comment one\n  // comment two\n  var(--boo)orange}",
    message: messages.expected,
    line: 5,
    column: 13,
  }],
})
