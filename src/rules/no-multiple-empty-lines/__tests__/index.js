import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a {}\nb {}")
  tr.ok("a {}\n\nb{}")
  tr.ok("/** horse */\n\nb{}")
  tr.ok("a{}\n\n/** horse */\n\nb{}")

  tr.notOk("a {}\n\n\nb{}", messages.rejected(3))
  tr.notOk("a {}\n\n/** horse */\n\n\nb{}", messages.rejected(5))
  tr.notOk("/* horse\n\n\n */\na{}", messages.rejected(3))
})
