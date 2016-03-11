import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: 'one'; }", "without newline")
  tr.ok("a::before { content: 'one\\ntwo'; }", "with escaped slash-slash-n newline")
  tr.ok("a::before { content: 'one\\Atwo'; }", "with escaped slash-A newline")
  tr.ok(`a::before {
    content: 'one\
    two';
  }`, "with escaped slash at end of real line")
  tr.ok(`p[href^=\"https://\"]:before {
    top: 0;
  }`, "attribute containing double-slash")

  tr.notOk("a::before { content: 'one\ntwo'; }", {
    message: messages.rejected,
    line: 1,
    column: 26,
  })
  tr.notOk("a::before { content: 'one\r\ntwo'; }", {
    message: messages.rejected,
    line: 1,
    column: 27,
  }, "CRLF")
})
