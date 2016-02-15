import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("@keyframes foo {} a { animation-name: foo; }", "keyframes before usage")
  tr.ok("a { animation-name: foo; } @keyframes foo {}", "keyframes after usage")
  tr.ok("@keyframes foo {} a { animation: foo 2s linear; }", "animation shorthand")
  tr.ok("@keyframes foo {} a { animation: linear foo 2s backwards; }", "animation shorthand variant")

  tr.ok("@keyframes foo {} a { animation: $sassy-variable 2s linear; }",
    "ignores sass variable in shorthand")
  tr.ok("@keyframes foo {} a { animation: var(--custom-property) 2s linear; }",
    "ignores custom property in shorthand")
  tr.ok("@keyframes foo {} a { animation: linear 2s @lessy-lessy; }",
    "ignores less variable in shorthand")
  tr.ok("@keyframes foo {} a { animation: steps(12, end) 2s foo; }",
    "ignores steps() function")
  tr.ok("@keyframes foo {} a { animation: foo 100ms cubic-bezier(0.1, 0.7, 1.0, 0.1); }",
    "ignores cubic-bezier() function")

  tr.notOk("a { animation-name: foo; }", {
    message: messages.rejected("foo"),
    line: 1,
    column: 21,
  }, "no declaration")
  tr.notOk("@keyframes bar {} .baz { animation-name: foo; }", {
    message: messages.rejected("foo"),
    line: 1,
    column: 42,
  },"no matching declaration with animation-name")
  tr.notOk("a { animation: baz 100ms ease-in backwards; } @keyframes bar {}", {
    message: messages.rejected("baz"),
    line: 1,
    column: 16,
  }, "no matching declaration with animation shorthand")
})
