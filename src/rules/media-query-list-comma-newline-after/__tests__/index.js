import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media screen and (color),\nprojection and (color) {}")
  tr.ok("@media screen and (color) ,\n  projection and (color) {}")
  tr.ok("@media screen and (color)\n,\n\t\t\tprojection and (color) {}",
    "indentation after the newline after the comma")

  tr.notOk("@media screen and (color),projection and (color)", messages.expectedAfter())
  tr.notOk("@media screen and (color), projection and (color)", messages.expectedAfter())
  tr.notOk("@media screen and (color),  projection and (color)", messages.expectedAfter())
  tr.notOk("@media screen and (color),\tprojection and (color)", messages.expectedAfter())
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("@media screen and (color),\nprojection and (color) {}", "multi-line list, single-line block")
  tr.ok("@media screen and (color),\nprojection and (color) {\n}", "multi-line list, multi-line block")
  tr.ok("@media screen and (color),projection and (color) {}", "ignore single line list, single-lint block")
  tr.ok("@media screen and (color),projection and (color) {\n}", "ignore single line list, multi-line block")

  tr.notOk("@media screen and (color),projection and (color),\nprint {}", messages.expectedAfterMultiLine())
  tr.notOk("@media screen and (color),projection and (color),\nprint {\n}", messages.expectedAfterMultiLine())
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("@media screen and (color)\n,projection and (color) {}", "multi-line list, single-line block")
  tr.ok("@media screen and (color)\n,projection and (color) {\n}", "multi-line list, multi-line block")
  tr.ok("@media screen and (color), projection and (color) {}", "ignore single line list, single-lint block")
  tr.ok("@media screen and (color), projection and (color) {\n}", "ignore single line list, multi-line block")

  tr.notOk("@media screen and (color) ,projection and (color),\nprint {}", messages.rejectedAfterMultiLine())
  tr.notOk("@media screen and (color) ,projection and (color),\nprint {\n}", messages.rejectedAfterMultiLine())
})
