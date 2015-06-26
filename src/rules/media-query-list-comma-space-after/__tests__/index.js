import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media screen and (color), projection and (color) {}")
  tr.ok("@media screen and (color) , projection and (color) {}")
  tr.ok("@media screen and (color)\n, projection and (color) {}")

  tr.notOk("@media screen and (color),projection and (color)", messages.expectedAfter())
  tr.notOk("@media screen and (color),  projection and (color)", messages.expectedAfter())
  tr.notOk("@media screen and (color),\nprojection and (color)", messages.expectedAfter())
  tr.notOk("@media screen and (color),\tprojection and (color)", messages.expectedAfter())
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media screen and (color),projection and (color) {}")
  tr.ok("@media screen and (color) ,projection and (color) {}")
  tr.ok("@media screen and (color)\n,projection and (color) {}")

  tr.notOk("@media screen and (color), projection and (color)", messages.rejectedAfter())
  tr.notOk("@media screen and (color),  projection and (color)", messages.rejectedAfter())
  tr.notOk("@media screen and (color),\nprojection and (color)", messages.rejectedAfter())
  tr.notOk("@media screen and (color),\tprojection and (color)", messages.rejectedAfter())
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("@media screen and (color), projection and (color) {}")
  tr.ok("@media screen and (color), projection and (color) {\n}", "single-line list, multi-line block")
  tr.ok("@media screen and (color)\n,projection and (color) {}", "ignore multi-line")

  tr.notOk("@media screen and (color) ,projection and (color) {}", messages.expectedAfterSingleLine())
  tr.notOk("@media screen and (color) ,projection and (color) {\n}",
    messages.expectedAfterSingleLine(),
    "single-line list, multi-line block")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("@media screen and (color) ,projection and (color) {}")
  tr.ok("@media screen and (color) ,projection and (color) {\n}", "single-line list, multi-line block")
  tr.ok("@media screen and (color),\nprojection and (color) {}", "ignore multi-line")

  tr.notOk("@media screen and (color), projection and (color) {}", messages.rejectedAfterSingleLine())
  tr.notOk("@media screen and (color), projection and (color) {\n}",
    messages.rejectedAfterSingleLine(),
    "single-line list, multi-line block")
})
