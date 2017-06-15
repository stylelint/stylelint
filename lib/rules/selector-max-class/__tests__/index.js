"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

// Sanity checks
testRule(rule, {
  ruleName,
  config: [0],

  accept: [ {
    code: ":root { --foo: 1px; }",
    description: "custom property in root",
  }, {
    code: "html { --foo: 1px; }",
    description: "custom property in selector",
  }, {
    code: ":root { --custom-property-set: {} }",
    description: "custom property set in root",
  }, {
    code: "html { --custom-property-set: {} }",
    description: "custom property set in selector",
  } ],

  reject: [{
    code: ".foo { left: 0; top: 0; }",
    description: "disallow classes",
    message: messages.expected(".foo", 0),
    line: 1,
    column: 1,
  }],
})

// Standard tests
testRule(rule, {
  ruleName,
  config: [2],

  accept: [ {
    code: ".ab { left: 0; top: 0; }",
    description: "fewer than max classes",
  }, {
    code: ".ab.cd { left: 0; top: 0; }",
    description: "exactly max classes",
  }, {
    code: ".ab .cd { left: 0; top: 0; }",
    description: "compound selector",
  }, {
    code: ".ab, \n.cd { left: 0; top: 0; }",
    description: "multiple selectors: fewer than max classes",
  }, {
    code: ".ab.cd, \n.ef.gh { left: 0; top: 0; }",
    description: "multiple selectors: exactly max classes",
  }, {
    code: ".ab.cd :not(.ef.gh) { left: 0; top: 0; }",
    description: ":not(): inside and outside",
  }, {
    code: ".ab.cd[disabled]:hover { left: 0; top: 0; }",
    description: "pseudo selectors, attribute selectors",
  }, {
    code: ".ab { .cd: { left: 0; top: 0; } }",
    description: "nested selectors",
  }, {
    code: ".ab { .cd > & { left: 0; top: 0; } }",
    description: "nested selectors: parent selector",
  }, {
    code: ".ab, .cd { & > .ef { left: 0; top: 0; } }",
    description: "nested selectors: superfluous parent selector",
  }, {
    code: "@media print { .ab.cd { left: 0; top: 0; } }",
    description: "media query: parent",
  }, {
    code: ".ab { @media print { .cd { left: 0; top: 0; } } }",
    description: "media query: nested",
  } ],

  reject: [ {
    code: ".ab.cd.ef { left: 0; top: 0; }",
    description: "greater than max classes",
    message: messages.expected(".ab.cd.ef", 2),
    line: 1,
    column: 1,
  }, {
    code: ".ab .cd .ef { left: 0; top: 0; }",
    description: "compound selector: greater than max classes",
    message: messages.expected(".ab .cd .ef", 2),
    line: 1,
    column: 1,
  }, {
    code: ".ab, \n.cd.ef.gh { left: 0; top: 0; }",
    description: "multiple selectors: greater than max classes",
    message: messages.expected(".cd.ef.gh", 2),
    line: 2,
    column: 1,
  }, {
    code: ":not(.ab.cd.ef) { left: 0; top: 0; }",
    description: ":not(): greater than max classes, inside",
    message: messages.expected(".ab.cd.ef", 2),
    line: 1,
    column: 6,
  }, {
    code: ".ab.cd.ef :not(.gh) { left: 0; top: 0; }",
    description: ":not(): greater than max classes, outside",
    message: messages.expected(".ab.cd.ef :not(.gh)", 2),
    line: 1,
    column: 1,
  }, {
    code: ".ab, .cd { &:hover > .ef.gh { left: 0; top: 0; } }",
    description: "nested selectors: greater than max classes",
    message: messages.expected(".ab:hover > .ef.gh", 2),
    line: 1,
    column: 12,
  } ],
})

// SCSS tests
testRule(rule, {
  ruleName,
  config: [1],
  syntax: "scss",

  accept: [ {
    code: ".foo #{$test} { left: 0; top: 0; }",
    description: "scss: ignore variable interpolation",
  }, {
    code: ".foo.bar #{$test} { left: 0; top: 0; }",
    description: "scss: ignore variable interpolation",
  }, {
    code: ".foo { margin: { left: 0; top: 0; }; }",
    description: "scss: nested properties",
  } ],
})

// LESS tests
testRule(rule, {
  ruleName,
  config: [1],
  syntax: "less",

  accept: [ {
    code: ".foo @{test} { left: 0; top: 0; }",
    description: "less: ignore variable interpolation",
  }, {
    code: ".setFont(@size) { font-size: @size; }",
    description: "less: ignore mixins",
  }, {
    code: ".foo { .setFont(12px) }",
    description: "less: ignore called mixins",
  } ],
})
