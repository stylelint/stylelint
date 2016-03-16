/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [{
    code: "a { color: pink; }",
    description: "single-line declaration block with trailing semicolon",
  }, {
    code: "a { background: orange; color: pink; }",
    description: "multi-line declaration block with trailing semicolon",
  }, {
    code: "a {{ &:hover { color: pink; }}}",
    description: "nesting without first-level decl",
  }, {
    code: "a { color: red; { &:hover { color: pink; }}}",
    description: "nesting with first-level decl",
  }, {
    code: "a { &:hover { color: pink; }}",
    description: "nested",
  }],

  reject: [{
    code: "a { color: pink }",
    description: "single-line declaration block without trailing semicolon",
    message: messages.expected,
    line: 1,
    column: 16,
  }, {
    code: "a { background: orange; color: pink }",
    description: "multi-line declaration block without trailing semicolon",
    message: messages.expected,
    line: 1,
    column: 36,
  }, {
    code: "a {{ &:hover { color: pink }}}",
    description: "nesting without first-level decl",
    message: messages.expected,
    line: 1,
    column: 27,
  }, {
    code: "a { color: red; { &:hover { color: pink }}}",
    description: "nesting with first-level decl",
    message: messages.expected,
    line: 1,
    column: 40,
  }, {
    code: "a { &:hover { color: pink }}",
    description: "nested",
    message: messages.expected,
    line: 1,
    column: 26,
  }],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [{
    code: "a { color: pink }",
    description: "single-line declaration block without trailing semicolon",
  }, {
    code: "a { background: orange; color: pink }",
    description: "multi-line declaration block without trailing semicolon",
  }],

  reject: [{
    code: "a { color: pink; }",
    description: "single-line declaration block with trailing semicolon",
    message: messages.rejected,
    line: 1,
    column: 16,
  }, {
    code: "a { background: orange; color: pink; }",
    description: "multi-line declaration block with trailing semicolon",
    message: messages.rejected,
    line: 1,
    column: 36,
  }],
})