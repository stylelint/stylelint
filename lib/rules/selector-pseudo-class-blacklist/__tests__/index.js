"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["focus", "global", "input-placeholder", "not", "nth-last-child"],
  skipBasicChecks: true,

  accept: [
    {
      code: "a {}"
    },
    {
      code: "a:hover {}"
    },
    {
      code: "a:nth-child(5) {}"
    },
    {
      code: "div:nth-LAST-child {}"
    },
    {
      code: "input:-Ms-INPUT-placeholder {}"
    },
    {
      code: ":root {}"
    },
    {
      code: "a:HOVER {}"
    },
    {
      code: "a:hover, a:nth-child(5) {}"
    },
    {
      code: "a::before {}"
    },
    {
      code: "a:nth-child(5)::before {}"
    },
    {
      code: "a:-moz-placeholder {}"
    },
    {
      code: "a:-MOZ-PLACEholder {}"
    },
    {
      code: ":root { --foo: 1px; }",
      description: "custom property in root"
    },
    {
      code: "html { --foo: 1px; }",
      description: "custom property in selector"
    },
    {
      code: ":root { --custom-property-set: {} }",
      description: "custom property set in root"
    },
    {
      code: "html { --custom-property-set: {} }",
      description: "custom property set in selector"
    }
  ],

  reject: [
    {
      code: "a:focus {}",
      message: messages.rejected("focus"),
      line: 1,
      column: 2
    },
    {
      code: "a,\n:global {}",
      message: messages.rejected("global"),
      line: 2,
      column: 1
    },
    {
      code: "input:-ms-input-placeholder {}",
      message: messages.rejected("-ms-input-placeholder"),
      line: 1,
      column: 6
    },
    {
      code: "a:not(::selection) {}",
      message: messages.rejected("not"),
      line: 1,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [["/^last/"]],
  skipBasicChecks: true,

  accept: [
    {
      code: "a {}"
    },
    {
      code: "a:first-child() {}"
    },
    {
      code: "a:nth-LAST-child(5) {}"
    }
  ],

  reject: [
    {
      code: "a:last-child {}",
      message: messages.rejected("last-child"),
      line: 1,
      column: 2
    },
    {
      code: "a:last-of-child {}",
      message: messages.rejected("last-of-child"),
      line: 1,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [[/^last/]],
  skipBasicChecks: true,

  accept: [
    {
      code: "a {}"
    }
  ],

  reject: [
    {
      code: "a:last-child {}",
      message: messages.rejected("last-child"),
      line: 1,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["variable"],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: ":#{$variable} {}"
    },
    {
      code: ":#{$VARIABLE} {}"
    },
    {
      code: "a:#{$variable} {}"
    }
  ]
});
