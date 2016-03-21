import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: ":root { --foo: 0; }",
  }, {
    code: "a, :root { --foo: 0; }",
  }, {
    code: "a { color: pink; } :root { --foo: 0; }",
  }, {
    code: ":root { $scss: 0; }",
  }, {
    code: ":root { @less: 0; }",
  }, {
    code: ":not(:root) { color: pink; }",
    description: "negation pseudo-class",
  }, {
    code: "svg:not(:root) { color: pink; }",
    description: "negation pseudo-class",
  }, {
    code: "a, :not(:root) { color: pink; }",
    description: "negation pseudo-class",
  }, {
    code: ":not(:root) { --foo: pink; }",
    description: "negation pseudo-class",
  } ],

  reject: [ {
    code: ":root { top: 0; }",
    message: messages.rejected("top"),
    line: 1,
    column: 9,
  }, {
    code: ":root { -webkit-transform: scale(0); }",
    message: messages.rejected("-webkit-transform"),
    line: 1,
    column: 9,
  }, {
    code: "a, :root { color: pink; }",
    message: messages.rejected("color"),
    line: 1,
    column: 12,
  }, {
    code: "a { color: pink; } :root { margin: 0; }",
    message: messages.rejected("margin"),
    line: 1,
    column: 28,
  }, {
    code: ":root, :not(a) { color: pink; }",
    message: messages.rejected("color"),
    line: 1,
    column: 18,
  }, {
    code: ":root:not(a) { color: pink; }",
    message: messages.rejected("color"),
    line: 1,
    column: 16,
  } ],
})
