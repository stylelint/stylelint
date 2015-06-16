import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media screen and (color) , projection and (color) {}")
  tr.ok("@media screen and (color) ,  projection and (color) {}")
  tr.ok("@media screen and (color) ,\nprojection and (color) {}")

  tr.notOk("@media screen and (color), projection and (color)", messages.expectedBefore())
  tr.notOk("@media screen and (color)  , projection and (color)", messages.expectedBefore())
  tr.notOk("@media screen and (color)\n, projection and (color)", messages.expectedBefore())
  tr.notOk("@media screen and (color)\t, projection and (color)", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media screen and (color),projection and (color) {}")
  tr.ok("@media screen and (color), projection and (color) {}")
  tr.ok("@media screen and (color),\nprojection and (color) {}")

  tr.notOk("@media screen and (color) , projection and (color)", messages.rejectedBefore())
  tr.notOk("@media screen and (color)  , projection and (color)", messages.rejectedBefore())
  tr.notOk("@media screen and (color)\n, projection and (color)", messages.rejectedBefore())
  tr.notOk("@media screen and (color)\t, projection and (color)", messages.rejectedBefore())
})
