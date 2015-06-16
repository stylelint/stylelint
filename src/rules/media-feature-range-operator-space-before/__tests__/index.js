import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("@media (max-width = 600px) {}")
  tr.ok("@media (max-width >600px) {}")
  tr.ok("@media (max-width >= 600px) and (min-width <= 3em) {}")

  tr.notOk("@media (max-width< 600px) {}", messages.expectedBefore())
  tr.notOk("@media (max-width  <= 600px) {}", messages.expectedBefore())
  tr.notOk("@media (max-width\t= 600px) {}", messages.expectedBefore())
  tr.notOk("@media (max-width\n> 600px) {}", messages.expectedBefore())
  tr.notOk("@media (max-width>= 600px) and (min-width < 3em) {}", messages.expectedBefore())
  tr.notOk("@media (max-width > 600px) and (min-width= 3em) {}", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("@media (max-width= 600px) {}")
  tr.ok("@media (max-width>600px) {}")
  tr.ok("@media (max-width>= 600px) and (min-width<= 3em) {}")

  tr.notOk("@media (max-width < 600px) {}", messages.rejectedBefore())
  tr.notOk("@media (max-width  <= 600px) {}", messages.rejectedBefore())
  tr.notOk("@media (max-width\t= 600px) {}", messages.rejectedBefore())
  tr.notOk("@media (max-width\n> 600px) {}", messages.rejectedBefore())
  tr.notOk("@media (max-width>= 600px) and (min-width < 3em) {}", messages.rejectedBefore())
  tr.notOk("@media (max-width > 600px) and (min-width= 3em) {}", messages.rejectedBefore())
})
