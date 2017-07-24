"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: "a { /* color: pink; */ }",
      description: "regular comment around declaration"
    },
    {
      code: "/* a { color: pink; } */",
      description: "regular comment around rule"
    },
    {
      code: "a { background: url(//foo.com/bar.png) }",
      description: "url with double slash"
    }
  ],

  reject: [
    {
      code: "a { // color: pink; }",
      description: "before declaration",
      message: messages.rejected,
      line: 1,
      column: 5
    },
    {
      code: "// a { color: pink; }",
      description: "before rule",
      message: messages.rejected,
      line: 1,
      column: 1
    },
    {
      code: "a, // div { color: pink; }",
      description: "between rules",
      message: messages.rejected,
      line: 1,
      column: 1
    },
    {
      code: "// @media { }",
      description: "before media rule",
      message: messages.rejected,
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: "// a { color: pink }",
      description: "single-line comment ignored"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: "a { \n// color: pink;\n }",
      description: "single-line comment ignored"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "less",

  accept: [
    {
      code: "// a { color: pink }",
      description: "single-line comment ignored"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "less",

  accept: [
    {
      code: "a { \n// color: pink;\n }",
      description: "single-line comment ignored"
    }
  ]
});
