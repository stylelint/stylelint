import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media screen and (color)\n, projection and (color) {}")
  tr.ok("@media screen and (color)\r\n, projection and (color) {}", "CRLF")
  tr.ok("@media screen and (color)\n     ,  projection and (color) {}")
  tr.ok(
    "@media screen and (color)\n\t\t,\nprojection and (color) {}",
    "indentation after the newline before the comma"
  )
  tr.ok(
    "@media screen and (color)\r\n\t\t,\r\nprojection and (color) {}",
    "indentation after the CRLF before the comma"
  )
  tr.ok("@media screen and (color)\n\n, projection and (color)")

  tr.notOk("@media screen and (color), projection and (color)", messages.expectedBefore())
  tr.notOk("@media screen and (color)  , projection and (color)", messages.expectedBefore())
  tr.notOk("@media screen and (color)\t, projection and (color)", messages.expectedBefore())
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("@media screen and (color)\n, projection and (color) {}", "multi-line list, single-line block")
  tr.ok("@media screen and (color)\r\n, projection and (color) {}", "multi-line list, single-line block and CRLF")
  tr.ok("@media screen and (color)\n, projection and (color) {\n}", "multi-line list, multi-line block")
  tr.ok("@media screen and (color),projection and (color) {}", "ignore single line list, single-lint block")
  tr.ok("@media screen and (color),projection and (color) {\n}", "ignore single line list, multi-line block")

  tr.notOk("@media screen and (color),projection and (color)\n, print {}", messages.expectedBeforeMultiLine())
  tr.notOk(
    "@media screen and (color),projection and (color)\r\n, print {}",
    messages.expectedBeforeMultiLine(),
    "CRLF"
  )
  tr.notOk("@media screen and (color),projection and (color)\n, print {\n}", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("@media screen and (color),\nprojection and (color) {}", "multi-line list, single-line block")
  tr.ok("@media screen and (color),\nprojection and (color) {\n}", "multi-line list, multi-line block")
  tr.ok("@media screen and (color),\r\nprojection and (color) {\r\n}", "multi-line list, multi-line block and CRLF")
  tr.ok("@media screen and (color) ,projection and (color) {}", "ignore single line list, single-lint block")
  tr.ok("@media screen and (color) ,projection and (color) {\n}", "ignore single line list, multi-line block")

  tr.notOk("@media screen and (color) ,projection and (color),\nprint {}", messages.rejectedBeforeMultiLine())
  tr.notOk("@media screen and (color) ,projection and (color),\nprint {\n}", messages.rejectedBeforeMultiLine())
  tr.notOk(
    "@media screen and (color) ,projection and (color),\r\nprint {\r\n}",
    messages.rejectedBeforeMultiLine(),
    "CRLF"
  )
})
