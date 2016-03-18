/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/blueTapeStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName: ruleName,
  config: [undefined],

  accept: [{
    code: "@keyframes foo {} a { animation-name: foo; }",
    description: "keyframes before usage",
  }, {
    code: "a { animation-name: foo; } @keyframes foo {}",
    description: "keyframes after usage",
  }, {
    code: "@keyframes foo {} a { animation: foo 2s linear; }",
    description: "animation shorthand",
  }, {
    code: "@keyframes foo {} a { animation: linear foo 2s backwards; }",
    description: "animation shorthand variant",
  }, {
    code: "@keyframes foo {} a { animation: $sassy-variable 2s linear; }",
    description: "ignores sass variable in shorthand",
  }, {
    code: "@keyframes foo {} a { animation: var(--custom-property) 2s linear; }",
    description: "ignores custom property in shorthand",
  }, {
    code: "@keyframes foo {} a { animation: linear 2s @lessy-lessy; }",
    description: "ignores less variable in shorthand",
  }, {
    code: "@keyframes foo {} a { animation: steps(12, end) 2s foo; }",
    description: "ignores steps() function",
  }, {
    code: "@keyframes foo {} a { animation: foo 100ms cubic-bezier(0.1, 0.7, 1.0, 0.1); }",
    description: "ignores cubic-bezier() function",
  }],

  reject: [{
    code: "a { animation-name: foo; }",
    description: "no declaration",
    message: messages.rejected("foo"),
    line: 1,
    column: 21,
  }, {
    code: "@keyframes bar {} .baz { animation-name: foo; }",
    description: "no matching declaration with animation-name",
    message: messages.rejected("foo"),
    line: 1,
    column: 42,
  }, {
    code: "a { animation: baz 100ms ease-in backwards; } @keyframes bar {}",
    description: "no matching declaration with animation shorthand",
    message: messages.rejected("baz"),
    line: 1,
    column: 16,
  }],
})