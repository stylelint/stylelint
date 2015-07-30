import {
  ruleTester
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  tr.ok("\n")
  tr.ok("a { color: pink; }\n")
  tr.ok("a { color: pink; }\n\n\n")

  tr.notOk("", messages.rejected)
  tr.notOk("a { color: pink; }", messages.rejected)
  tr.notOk("a { color: pink; }\n\n\nb{ color: orange; }", messages.rejected)
})
