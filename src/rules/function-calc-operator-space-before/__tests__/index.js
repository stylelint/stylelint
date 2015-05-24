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
  tr.ok("a { top: calc(1px +2px); }")
  tr.ok("a { top: calc(calc(1px + 2px) + 3px); }")

  tr.notOk("a { top: calc(1px+ 2px); }", messages.expectedBefore())
  tr.notOk("a { top: calc(1px* 2); }", messages.expectedBefore())
  tr.notOk("a { top: calc(1px/ 2); }", messages.expectedBefore())
  tr.notOk("a { top: calc(1px- 2px); }", messages.expectedBefore())
  tr.notOk("a { top: calc(1px+2px); }", messages.expectedBefore())
  tr.notOk("a { top: calc(1px  + 2px); }", messages.expectedBefore())
  tr.notOk("a { top: calc(1px\t+ 2px); }", messages.expectedBefore())
  tr.notOk("a { top: calc(calc(1px+ 2px) + 3px); }", messages.expectedBefore())
  tr.notOk("a { top: calc(calc(1px + 2px)+ 3px); }", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("a {}")
  tr.ok("a { color: color(red s( -10%)); }")
  tr.ok("a { top: calc(1px+ 2px); }")
  tr.ok("a { top: calc(1px* 2); }")
  tr.ok("a { top: calc(1px/ 2); }")
  tr.ok("a { top: calc(1px- 2px); }")
  tr.ok("a { top: calc(1px+2px); }")
  tr.ok("a { top: calc(calc(1px+ 2px)+ 3px); }")

  tr.notOk("a { top: calc(1px + 2px); }", messages.rejectedBefore())
  tr.notOk("a { top: calc(1px * 2); }", messages.rejectedBefore())
  tr.notOk("a { top: calc(1px / 2); }", messages.rejectedBefore())
  tr.notOk("a { top: calc(1px - 2px); }", messages.rejectedBefore())
  tr.notOk("a { top: calc(1px +2px); }", messages.rejectedBefore())
  tr.notOk("a { top: calc(1px  + 2px); }", messages.rejectedBefore())
  tr.notOk("a { top: calc(1px\t+ 2px); }", messages.rejectedBefore())
  tr.notOk("a { top: calc(calc(1px+ 2px) + 3px); }", messages.rejectedBefore())
  tr.notOk("a { top: calc(calc(1px + 2px)+ 3px); }", messages.rejectedBefore())
})
