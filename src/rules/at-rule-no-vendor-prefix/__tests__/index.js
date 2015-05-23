import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("@keyframes {}")

  tr.notOk("@-webkit-keyframes {}", messages.rejected("-webkit-keyframes"))
  tr.notOk("@-ms-keyframes {}", messages.rejected("-ms-keyframes"))
})
