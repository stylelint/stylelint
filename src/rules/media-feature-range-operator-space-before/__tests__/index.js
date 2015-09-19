import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width = 600px) {}")
  tr.ok("@media (max-width >600px) {}")
  tr.ok("@media (max-width >= 600px) and (min-width <= 3em) {}")

  tr.notOk("@media (max-width< 600px) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("@media (max-width  <= 600px) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media (max-width\t= 600px) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width\n> 600px) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width\r\n> 600px) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 19,
  }, "CRLF")
  tr.notOk("@media (max-width>= 600px) and (min-width < 3em) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("@media (max-width > 600px) and (min-width= 3em) {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 41,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width= 600px) {}")
  tr.ok("@media (max-width>600px) {}")
  tr.ok("@media (max-width>= 600px) and (min-width<= 3em) {}")

  tr.notOk("@media (max-width < 600px) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width  <= 600px) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media (max-width\t= 600px) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width\n> 600px) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("@media (max-width\r\n> 600px) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 19,
  }, "CRLF")
  tr.notOk("@media (max-width>= 600px) and (min-width < 3em) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 42,
  })
  tr.notOk("@media (max-width > 600px) and (min-width= 3em) {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 18,
  })
})
