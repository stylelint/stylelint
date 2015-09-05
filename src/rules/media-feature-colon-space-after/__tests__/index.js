import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media (max-width : 600px) {}")
  tr.ok("@media (max-width: 600px) and (min-width: 3em) {}")
  tr.ok("@custom-selector :--enter :hover;")

  tr.notOk("@media (max-width:600px) {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width:  600px) {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width:\t600px) {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width:\n600px) {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width:\r\n600px) {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 18,
  }, "CRLF")
  tr.notOk("@media (max-width:600px) and (min-width: 3em) {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width: 600px) and (min-width:3em) {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 41,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width:600px) {}")
  tr.ok("@media (max-width:600px) and (min-width:3em) {}")
  tr.ok("@custom-selector : --enter :hover;")

  tr.notOk("@media (max-width: 600px) {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width:  600px) {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width:\t600px) {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width:\n600px) {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width:\r\n600px) {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 18,
  }, "CRLF")
  tr.notOk("@media (max-width:600px) and (min-width: 3em) {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 40,
  })
  tr.notOk("@media (max-width: 600px) and (min-width:3em) {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 18,
  })
})
