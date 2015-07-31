import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(2, tr => {
  warningFreeBasics(tr)

  tr.ok("a { top: 3px /* 3.12345px */; }")
  tr.ok("a::before { content: \"3.12345px\"; }")

  tr.ok("a { top: 3%; }")
  tr.ok("a { top: 3.1%; }")
  tr.ok("a { top: 3.12%; }")
  tr.ok("a { padding: 6.1% 3.12%; }")

  tr.notOk("a { top: 3.123%; }", messages.expected(3.123, 2))
  tr.notOk("a { padding: 6.123% 3.1%; }", messages.expected(6.123, 2))

  tr.ok("@media (min-width: 5.12em) {}")
  tr.notOk("@media (min-width: 5.123em) {}", messages.expected(5.123, 2))
})

testRule(4, tr => {
  warningFreeBasics(tr)

  tr.ok("a { top: 3px /* 3.12345px */; }")
  tr.ok("a::before { content: \"3.12345px\"; }")

  tr.ok("a { top: 3%; }")
  tr.ok("a { top: 3.1%; }")
  tr.ok("a { top: 3.12%; }")
  tr.ok("a { top: 3.123%; }")
  tr.ok("a { top: 3.1234%; }")
  tr.ok("a { padding: 6.123% 3.1234%; }")

  tr.notOk("a { top: 3.12345%; }", messages.expected(3.12345, 4))
  tr.notOk("a { padding: 6.12345% 3.1234%; }", messages.expected(6.12345, 4))

  tr.ok("@media (min-width: 5.1234em) {}")
  tr.notOk("@media (min-width: 5.12345em) {}", messages.expected(5.12345, 4))
})

testRule(0, tr => {
  warningFreeBasics(tr)

  tr.ok("a { top: 3%; }")
  tr.notOk("a { top: 3.1%; }", messages.expected(3.1, 0))
})
