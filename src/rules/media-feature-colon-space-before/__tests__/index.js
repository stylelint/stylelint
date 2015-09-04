import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width :600px) {}")
  tr.ok("@media (max-width : 600px) {}")
  tr.ok("@media (max-width :600px) and (min-width :3em) {}")
  tr.ok("@custom-selector:--enter :hover;")

  tr.notOk("@media (max-width:600px) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width  :600px) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 20,
  })
  tr.notOk("@media (max-width\t:600px) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media (max-width\n:600px) {}", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("@media (max-width\r\n:600px) {}", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("@media (max-width:600px) and (min-width :3em) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width :600px) and (min-width:3em) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 41,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width:600px) {}")
  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media (max-width:600px) and (min-width:3em) {}")
  tr.ok("@custom-selector :--enter :hover;")

  tr.notOk("@media (max-width :600px) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media (max-width  :600px) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 20,
  })
  tr.notOk("@media (max-width\t:600px) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media (max-width\n:600px) {}", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("@media (max-width\r\n:600px) {}", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("@media (max-width:600px) and (min-width :3em) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 41,
  })
  tr.notOk("@media (max-width :600px) and (min-width:3em) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 19,
  })
})
