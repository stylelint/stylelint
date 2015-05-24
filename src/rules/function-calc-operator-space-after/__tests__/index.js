import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a { color: color(red s(-10%)); }")
  tr.ok("a { top: calc(1px + 2px); }")
  tr.ok("a { top: calc(1px * 2); }")
  tr.ok("a { top: calc(1px / 2); }")
  tr.ok("a { top: calc(1px - 2px); }")
  tr.ok("a { top: calc(1px+ 2px); }")
  tr.ok("a { top: calc(calc(1px + 2px) + 3px); }")

  tr.notOk("a { top: calc(1px +2px); }", messages.expectedAfter())
  tr.notOk("a { top: calc(1px *2); }", messages.expectedAfter())
  tr.notOk("a { top: calc(1px /2); }", messages.expectedAfter())
  tr.notOk("a { top: calc(1px -2px); }", messages.expectedAfter())
  tr.notOk("a { top: calc(1px+2px); }", messages.expectedAfter())
  tr.notOk("a { top: calc(1px+  2px); }", messages.expectedAfter())
  tr.notOk("a { top: calc(1px+\t2px); }", messages.expectedAfter())
  tr.notOk("a { top: calc(calc(1px +2px) + 3px); }", messages.expectedAfter())
  tr.notOk("a { top: calc(calc(1px + 2px) +3px); }", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("a {}")
  tr.ok("a { color: color(red s(- 10%)); }")
  tr.ok("a { top: calc(1px +2px); }")
  tr.ok("a { top: calc(1px *2); }")
  tr.ok("a { top: calc(1px /2); }")
  tr.ok("a { top: calc(1px -2px); }")
  tr.ok("a { top: calc(1px+2px); }")
  tr.ok("a { top: calc(calc(1px +2px) +3px); }")

  tr.notOk("a { top: calc(1px + 2px); }", messages.rejectedAfter())
  tr.notOk("a { top: calc(1px * 2); }", messages.rejectedAfter())
  tr.notOk("a { top: calc(1px / 2); }", messages.rejectedAfter())
  tr.notOk("a { top: calc(1px - 2px); }", messages.rejectedAfter())
  tr.notOk("a { top: calc(1px+ 2px); }", messages.rejectedAfter())
  tr.notOk("a { top: calc(1px+  2px); }", messages.rejectedAfter())
  tr.notOk("a { top: calc(1px+\t2px); }", messages.rejectedAfter())
  tr.notOk("a { top: calc(calc(1px +2px) + 3px); }", messages.rejectedAfter())
  tr.notOk("a { top: calc(calc(1px + 2px) +3px); }", messages.rejectedAfter())
})
