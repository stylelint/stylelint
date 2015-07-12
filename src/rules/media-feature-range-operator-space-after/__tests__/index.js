import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width= 600px) {}")
  tr.ok("@media (max-width > 600px) {}")
  tr.ok("@media (max-width>= 600px) and (min-width<= 3em) {}")

  tr.notOk("@media (max-width<600px) {}", messages.expectedAfter())
  tr.notOk("@media (max-width<=  600px) {}", messages.expectedAfter())
  tr.notOk("@media (max-width=\t600px) {}", messages.expectedAfter())
  tr.notOk("@media (max-width>\n600px) {}", messages.expectedAfter())
  tr.notOk("@media (max-width>\r\n600px) {}", messages.expectedAfter(), "CRLF")
  tr.notOk("@media (max-width>=600px) and (min-width< 3em) {}", messages.expectedAfter())
  tr.notOk("@media (max-width> 600px) and (min-width=3em) {}", messages.expectedAfter())
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width =600px) {}")
  tr.ok("@media (max-width>600px) {}")
  tr.ok("@media (max-width >=600px) and (min-width <=3em) {}")

  tr.notOk("@media (max-width < 600px) {}", messages.rejectedAfter())
  tr.notOk("@media (max-width <=  600px) {}", messages.rejectedAfter())
  tr.notOk("@media (max-width =\t600px) {}", messages.rejectedAfter())
  tr.notOk("@media (max-width >\n600px) {}", messages.rejectedAfter())
  tr.notOk("@media (max-width >\r\n600px) {}", messages.rejectedAfter(), "CRLF")
  tr.notOk("@media (max-width >= 600px) and (min-width <3em) {}", messages.rejectedAfter())
  tr.notOk("@media (max-width >600px) and (min-width = 3em) {}", messages.rejectedAfter())
})
