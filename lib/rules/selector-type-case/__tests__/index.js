"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["lower"],

  accept: [
    {
      code: "a {}"
    },
    {
      code: "a::before {}"
    },
    {
      code: "&a {}"
    },
    {
      code: ".foo {}"
    },
    {
      code: "#bar {}"
    },
    {
      code: ".FOO {}"
    },
    {
      code: "#BAR {}"
    },
    {
      code: "a.FOO {}"
    },
    {
      code: "a b {}"
    },
    {
      code: "a { & b {}}"
    },
    {
      code: "a, b, * {}"
    },
    {
      code: "a:nth-child(3n + 1) {}"
    },
    {
      code: "a:nth-child(n) {}"
    },
    {
      code: "a:nth-child(odd) {}"
    },
    {
      code: "a:nth-child(even) {}"
    },
    {
      code: "a:nth-child(-n) {}"
    },
    {
      code: "a { &:nth-child(3n + 1) {} }"
    },
    {
      code: "@keyframes spin { 0% {} }"
    },
    {
      code: "@keyframes spin { to {} from {} }"
    },
    {
      code: "@include keyframes(identifier) { TO, 50.0% {} 50.01% {} 100% {} }",
      description: "non-standard usage of keyframe selectors"
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
      code: "A {}",
      message: messages.expected("A", "a")
    },
    {
      code: "DIV::before {}",
      message: messages.expected("DIV", "div")
    },
    {
      code: "a B {}",
      message: messages.expected("B", "b")
    },
    {
      code: "a { & B {}}",
      message: messages.expected("B", "b")
    },
    {
      code: "A:nth-child(even) {}",
      message: messages.expected("A", "a")
    },
    {
      code: "A:nth-child(-n) {}",
      message: messages.expected("A", "a")
    },
    {
      code: "A { &:nth-child(3n + 1) {} }",
      message: messages.expected("A", "a")
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["upper"],
  skipBasicChecks: true,

  accept: [
    {
      code: "A {}"
    },
    {
      code: "A::before {}"
    },
    {
      code: "&A {}"
    },
    {
      code: "&LI {}"
    },
    {
      code: ".foo {}"
    },
    {
      code: "#bar {}"
    },
    {
      code: ".FOO {}"
    },
    {
      code: "#BAR {}"
    },
    {
      code: "A.FOO {}"
    },
    {
      code: "A B {}"
    },
    {
      code: "A { & B {}}"
    },
    {
      code: "A, B, * {}"
    },
    {
      code: "A:nth-child(3n + 1) {}"
    },
    {
      code: "A:nth-child(n) {}"
    },
    {
      code: "A:nth-child(odd) {}"
    },
    {
      code: "A:nth-child(even) {}"
    },
    {
      code: "A:nth-child(-n) {}"
    },
    {
      code: "A { &:nth-child(3n + 1) {} }"
    },
    {
      code: "@keyframes spin { 0% {} }"
    },
    {
      code: "@keyframes spin { to {} from {} }"
    },
    {
      code: ":root { --custom-property-set: {} }"
    }
  ],

  reject: [
    {
      code: "a {}",
      message: messages.expected("a", "A")
    },
    {
      code: "div::before {}",
      message: messages.expected("div", "DIV")
    },
    {
      code: "a B {}",
      message: messages.expected("a", "A")
    },
    {
      code: "a { & B {}}",
      message: messages.expected("a", "A")
    },
    {
      code: "a:nth-child(even) {}",
      message: messages.expected("a", "A")
    },
    {
      code: "a:nth-child(-n) {}",
      message: messages.expected("a", "A")
    },
    {
      code: "a { &:nth-child(3n + 1) {} }",
      message: messages.expected("a", "A")
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["upper"],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: ".foo { &-bar {} }"
    },
    {
      code: "#{$variable} {}"
    },
    {
      code: "%foo {}",
      description: "ignore placeholder selector"
    },
    {
      code: ".foo, %foo {}"
    }
  ]
});
