import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("@keyframes { 0% { top: 0; } }")
  tr.notOk("@-webkit-keyframes { 0% { top: 0; } }", messages.rejected("-webkit-keyframes"))
  tr.notOk("@-moz-keyframes { 0% { top: 0; } }", messages.rejected("-moz-keyframes"))

  tr.ok("@viewport { orientation: landscape; }")
  tr.notOk("@-ms-viewport { orientation: landscape; }", messages.rejected("-ms-viewport"))
})
