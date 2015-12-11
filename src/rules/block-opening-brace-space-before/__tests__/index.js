import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.ok("a {{ &:hover { color: pink; }}}")
  tr.ok("a {\n&:hover { color: pink; }}")

  tr.notOk("a{ color: pink; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 1,
  })
  tr.notOk("a  { color: pink; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 3,
  })
  tr.notOk("a\t{ color: pink; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\n{ color: pink; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\r\n{ color: pink; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 3,
  }, "CRLF")
  tr.notOk("@media print\n{ a { color: pink; } }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 13,
  })
  tr.notOk("@media print { a\n{ color: pink; } }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a{ color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")

  tr.notOk("a { color: pink; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 2,
  })
  tr.notOk("a  { color: pink; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 3,
  })
  tr.notOk("a\t{ color: pink; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\n{ color: pink; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\r\n{ color: pink; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 3,
  }, "CRLF")
  tr.notOk("@media print { a{ color: pink; } }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 13,
  })
  tr.notOk("@media print{ a { color: pink; } }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 16,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  // Regular "always" tests
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a{ color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 1,
  })
  tr.notOk("a  { color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 3,
  })
  tr.notOk("a\t{ color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\n{ color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\r\n{ color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 3,
  }, "CRLF")
  tr.notOk("@media print\n{ a { color: pink; } }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 13,
  })
  tr.notOk("@media print { a\n{ color: pink; } }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 17,
  })

  // Ignoring multi-line blocks
  tr.ok("a{ color:\npink; }")
  tr.ok("@media print { a{ color:\npink; } }")
  tr.ok("@media print{ a { color:\npink; } }")
  tr.ok("@media print{\na { color: pink; } }")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  // Regular "never" tests
  tr.ok("a{ color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")

  tr.notOk("a { color: pink; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a  { color: pink; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 3,
  })
  tr.notOk("a\t{ color: pink; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\n{ color: pink; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\r\n{ color: pink; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 3,
  }, "CRLF")
  tr.notOk("@media print { a{ color: pink; } }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 13,
  })
  tr.notOk("@media print{ a { color: pink; } }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 16,
  })

  // Ignoring multi-line blocks
  tr.ok("a { color:\npink; }")
  tr.ok("a { color:\r\npink; }", "CRLF")
  tr.ok("@media print { a { color:\npink; } }")
  tr.ok("@media print{ a{ color:\npink; } }")
  tr.ok("@media print {\na{ color: pink; } }")
  tr.ok("@media print{\na{ color: pink; } }")
  tr.ok("@media print{\r\na{ color: pink; } }", "CRLF")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\nbackground: orange; }")
  tr.ok("@media print {\na { color: pink;\nbackground: orange } }")
  tr.ok("@media print {\r\na { color: pink;\r\nbackground: orange } }", "CRLF")

  // Ignoring single-line blocks
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("a{ color: pink; }")
  tr.ok("a  { color: pink; }")
  tr.ok("a\t{ color: pink; }")

  tr.notOk("a{ color: pink;\nbackground: orange; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 1,
  })
  tr.notOk("a  { color: pink;\nbackground: orange; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 3,
  })
  tr.notOk("a\t{ color: pink;\nbackground: orange; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\n{ color: pink;\nbackground: orange; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\r\n{ color: pink;\r\nbackground: orange; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 3,
  }, "CRLF")
  tr.notOk("@media print\n{\na { color: pink;\nbackground: orange; } }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 13,
  })
  tr.notOk("@media print { a\n{ color: pink;\nbackground: orange; } }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 17,
  })
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a{ color: pink;\nbackground: orange; }")
  tr.ok("@media print{\na{ color: pink;\nbackground: orange } }")
  tr.ok("@media print{\r\na{ color: pink;\r\nbackground: orange } }", "CRLF")

  // Ignoring single-line blocks
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("a{ color: pink; }")
  tr.ok("a  { color: pink; }")
  tr.ok("a\t{ color: pink; }")

  tr.notOk("a { color: pink;\nbackground: orange; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a  { color: pink;\nbackground: orange; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 3,
  })
  tr.notOk("a\t{ color: pink;\nbackground: orange; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a\n{ color: pink;\nbackground: orange; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("@media print\n{\na{ color: pink;\nbackground: orange; } }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 13,
  })
  tr.notOk(
    "@media print{ a\n{ color: pink;\nbackground: orange; } }",
    {
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 16,
    }
  )
  tr.notOk(
    "@media print{ a\r\n{ color: pink;\r\nbackground: orange; } }",
    {
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 17,
    },
    "CRLF"
  )
})
