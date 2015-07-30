import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a {}\nb {}")
  tr.ok("a {}\r\nb {}")
  tr.ok("a {}\n\nb{}")
  tr.ok("a {}\r\n\r\nb{}")
  tr.ok("/** horse */\n\nb{}")
  tr.ok("/** horse */\r\n\r\nb{}")
  tr.ok("a{}\n\n/** horse */\n\nb{}")
  tr.ok("a{}\r\n\r\n/** horse */\r\n\r\nb{}")

  tr.notOk("a {}\n\n\nb{}", messages.rejected(3))
  tr.notOk("a {}\r\n\r\n\r\nb{}", messages.rejected(3))
  tr.notOk("a {}\n\n/** horse */\n\n\nb{}", messages.rejected(5))
  tr.notOk("a {}\r\n\r\n/** horse */\r\n\r\n\r\nb{}", messages.rejected(5))
  tr.notOk("/* horse\n\n\n */\na{}", messages.rejected(3))
  tr.notOk("/* horse\r\n\r\n\r\n */\r\na{}", messages.rejected(3))
})
