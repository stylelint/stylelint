import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media screen and (color) , projection and (color) {}")
  tr.ok("@media screen and (color) ,  projection and (color) {}")
  tr.ok("@media screen and (color) ,\nprojection and (color) {}")
  tr.ok("@media screen and (color) ,\r\nprojection and (color) {}", "CRLF")

  tr.notOk("@media screen and (color), projection and (color)", {
    message: messages.expectedBefore(),
    line: 1,
    column: 26,
  })
  tr.notOk("@media screen and (color)  , projection and (color)", {
    message: messages.expectedBefore(),
    line: 1,
    column: 28,
  })
  tr.notOk("@media screen and (color)\n, projection and (color)", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("@media screen and (color)\r\n, projection and (color)", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("@media screen and (color)\t, projection and (color)", {
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 600px) {}")
  tr.ok("@media screen and (color),projection and (color) {}")
  tr.ok("@media screen and (color), projection and (color) {}")
  tr.ok("@media screen and (color),\nprojection and (color) {}")
  tr.ok("@media screen and (color),\r\nprojection and (color) {}", "CRLF")

  tr.notOk("@media screen and (color) , projection and (color)", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 27,
  })
  tr.notOk("@media screen and (color)  , projection and (color)", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 28,
  })
  tr.notOk("@media screen and (color)\n, projection and (color)", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("@media screen and (color)\r\n, projection and (color)", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("@media screen and (color)\t, projection and (color)", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 27,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("@media screen and (color) ,projection and (color) {}")
  tr.ok("@media screen and (color) ,projection and (color) {\n}", "single-line list, multi-line block")
  tr.ok("@media screen and (color) ,projection and (color) {\r\n}", "single-line list, multi-line block and CRLF")
  tr.ok("@media screen and (color),\nprojection and (color) {}", "ignore multi-line")
  tr.ok("@media screen and (color),\r\nprojection and (color) {}", "ignore multi-line", "CRLF")

  tr.notOk("@media screen and (color), projection and (color) {}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 26,
  })
  tr.notOk(
    "@media screen and (color), projection and (color) {\n}",
    {
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 26,
    },
    "single-line list, multi-line block"
  )
  tr.notOk(
    "@media screen and (color), projection and (color) {\r\n}",
    {
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 26,
    },
    "single-line list, multi-line block and CRLF"
  )
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("@media screen and (color), projection and (color) {}")
  tr.ok("@media screen and (color), projection and (color) {\n}", "single-line list, multi-line block")
  tr.ok("@media screen and (color), projection and (color) {\r\n}", "single-line list, multi-line block and CRLF")
  tr.ok("@media screen and (color)\n,projection and (color) {}", "ignore multi-line")
  tr.ok("@media screen and (color)\r\n,projection and (color) {}", "ignore multi-line and CRLF")

  tr.notOk("@media screen and (color) ,projection and (color) {}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 27,
  })
  tr.notOk(
    "@media screen and (color) ,projection and (color) {\n}",
    {
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 27,
    },
    "single-line list, multi-line block"
  )
  tr.notOk(
    "@media screen and (color) ,projection and (color) {\r\n}",
    {
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 27,
    },
    "single-line list, multi-line block and CRLF"
  )
})
