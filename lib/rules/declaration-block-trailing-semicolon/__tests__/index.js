"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "a { color: pink; }",
      description: "single-line declaration block with trailing semicolon"
    },
    {
      code: "a { background: orange; color: pink; }",
      description: "multi-line declaration block with trailing semicolon"
    },
    {
      code: "a {{ &:hover { color: pink; }}}",
      description: "nesting without first-level decl"
    },
    {
      code: "a { color: red; { &:hover { color: pink; }}}",
      description: "nesting with first-level decl"
    },
    {
      code: "a { &:hover { color: pink; }}",
      description: "nested"
    },
    {
      code: "a { @import foo; }",
      description: "at-rule with trailing semicolon"
    },
    {
      code: "a { @foo { color: pink; } }",
      description: "at-rule with decl block with trailing semicolon"
    }
  ],

  reject: [
    {
      code: "a { color: pink }",
      description: "single-line declaration block without trailing semicolon",
      message: messages.expected,
      line: 1,
      column: 15
    },
    {
      code: "a { background: orange; color: pink }",
      description: "multi-line declaration block without trailing semicolon",
      message: messages.expected,
      line: 1,
      column: 35
    },
    {
      code: "a {{ &:hover { color: pink }}}",
      description: "nesting without first-level decl",
      message: messages.expected,
      line: 1,
      column: 26
    },
    {
      code: "a { color: red; { &:hover { color: pink }}}",
      description: "nesting with first-level decl",
      message: messages.expected,
      line: 1,
      column: 39
    },
    {
      code: "a { &:hover { color: pink }}",
      description: "nested",
      message: messages.expected,
      line: 1,
      column: 25
    },
    {
      code: "a { @import foo }",
      description: "at-rule without trailing semicolon",
      message: messages.expected,
      line: 1,
      column: 15
    },
    {
      code: "a { @foo { color: pink } }",
      description: "at-rule with decl block without trailing semicolon",
      message: messages.expected,
      line: 1,
      column: 22
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a { color: pink }",
      description: "single-line declaration block without trailing semicolon"
    },
    {
      code: "a { background: orange; color: pink }",
      description: "multi-line declaration block without trailing semicolon"
    },
    {
      code: "a { @import foo }",
      description: "at-rule without trailing semicolon"
    },
    {
      code: "a { @foo { color: pink } }",
      description: "at-rule with decl block without trailing semicolon"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      description: "single-line declaration block with trailing semicolon",
      message: messages.rejected,
      line: 1,
      column: 15
    },
    {
      code: "a { background: orange; color: pink; }",
      description: "multi-line declaration block with trailing semicolon",
      message: messages.rejected,
      line: 1,
      column: 35
    },
    {
      code: "a { @import foo; }",
      description: "at-rule with trailing semicolon",
      message: messages.rejected,
      line: 1,
      column: 15
    },
    {
      code: "a { @foo { color: pink; } }",
      description: "at-rule with decl block with trailing semicolon",
      message: messages.rejected,
      line: 1,
      column: 22
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always"],
  fix: true,

  accept: [
    {
      code: "a { color: pink; }",
      description: "single-line declaration block with trailing semicolon"
    }
  ],

  reject: [
    {
      code: "a { color: pink }",
      fixed: "a { color: pink; }",
      description: "single-line declaration block with fixed semicolon",
      message: messages.expected,
      line: 1,
      column: 15
    },
    {
      code: "a { background: orange; color: pink }",
      fixed: "a { background: orange; color: pink; }",
      description: "multi-line declaration block with fixed semicolon",
      message: messages.expected,
      line: 1,
      column: 35
    }
  ]
});
