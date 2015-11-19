import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@import url(x.css)")
  tr.ok("a\n{ color: pink; }")
  tr.ok("a\r\n{ color: pink; }", "CRLF")
  tr.ok("a\n{color: pink; }")
  tr.ok("@media print\n{ a\n{ color: pink; } }")
  tr.ok("@media print\r\n{ a\r\n{ color: pink; } }", "CRLF")
  tr.ok("@media print\n{a\n{color: pink; } }")
  tr.ok("@media print\n\t{a\n\t\t{color: pink; } }",
    "indentation after the newline before the opening braces")
  tr.ok(
    "@media print\n\t{a\n\t\t{color: pink;\n\t\t&:hover\n\t\t\t{\n\t\t\t\tcolor:black;} } }",
    "3 level deep indentation after the newline before the opening braces"
  )
  tr.ok(
    "@media print\r\n\t{a\r\n\t\t{color: pink;\r\n\t\t&:hover\r\n\t\t\t{\r\n\t\t\t\tcolor:black;} } }",
    "3 level deep indentation after the newline before the opening braces and CRLF"
  )

  tr.ok("a\n{ &:hover\n{ color: pink; }}")
  tr.ok("a\n{ color: red; &:hover\n{ color: pink; }}")

  tr.notOk("a { color: pink; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 2,
  })
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
  tr.notOk("@media print { a\n{ color: pink; } }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 13,
  })
  tr.notOk("@media print { a\r\n{ color: pink; } }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 13,
  }, "CRLF")
  tr.notOk("@media print\n{ a { color: pink; } }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 4,
  })
  tr.notOk("@media print{ a\n{ color: pink; } }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 12,
  })
  tr.notOk("@media print{ a\r\n{ color: pink; } }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 12,
  }, "CRLF")
  tr.notOk("@media print\n{ a{ color: pink; } }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 3,
  })
  tr.notOk("a\n/* foo */{ a{ color: pink; } }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 12,
  })
  tr.notOk("a\r\n/* foo */{ a{ color: pink; } }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 12,
  }, "CRLF")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n{ color: pink; }")
  tr.ok("a\n{color: pink; }")
  tr.ok("@media print\n{ a\n{ color: pink; } }")
  tr.ok("@media print\r\n{ a\r\n{ color: pink; } }", "CRLF")
  tr.ok("@media print\n{a\n{color: pink; } }")

  // Ignoring multi-line blocks
  tr.ok("a{ color: pink;\nbackground:orange; }")
  tr.ok("@media print { a{ color: pink;\nbackground:orange; } }")
  tr.ok("@media print{ a { color: pink;\nbackground:orange; } }")
  tr.ok("@media print{\na\n{ color: pink; } }")
  tr.ok("@media print{\r\na\r\n{ color: pink; } }", "CRLF")

  tr.notOk("a { color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 2,
  })
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
  tr.notOk("@media print\n{ a { color: pink; } }", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 4,
  })
  tr.notOk("@media print\n{ a{ color: pink; } }", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 3,
  })
  tr.notOk("@media print\r\n{ a{ color: pink; } }", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 3,
  }, "CRLF")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a{ color: pink; }")
  tr.ok("a{color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")
  tr.ok("@media print{a{color: pink; } }")

  // Ignoring multi-line blocks
  tr.ok("a\n{ color: pink;\nbackground:orange; }")
  tr.ok("a\r\n{ color: pink;\r\nbackground:orange; }", "CRLF")
  tr.ok("@media print { a\n{ color: pink;\nbackground:orange; } }")
  tr.ok("@media print{ a\n{ color: pink;\nbackground:orange; } }")
  tr.ok("@media print{\na{ color: pink; } }")
  tr.ok("@media print{\r\na{ color: pink; } }", "CRLF")

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
  tr.notOk("@media print\n{ a\n{ color: pink; } }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 4,
  })
  tr.notOk("@media print\r\n{ a\r\n{ color: pink; } }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 5,
  }, "CRLF")
  tr.notOk("@media print { a\n{ color: pink; } }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 17,
  })
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n{ color: pink;\nbackground: orange; }")
  tr.ok("a\r\n{ color: pink;\nbackground: orange; }", "CRLF")
  tr.ok("@media print\n{\na\n{ color: pink;\nbackground: orange } }")

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
  tr.notOk("a { color: pink;\nbackground: orange; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a { color: pink;\r\nbackground: orange; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 2,
  }, "CRLF")
  tr.notOk("@media print\n{\na { color: pink;\nbackground: orange; } }", {
    message: messages.expectedBeforeMultiLine(),
    line: 3,
    column: 2,
  })
  tr.notOk(
    "@media print { a\n{ color: pink;\nbackground: orange; } }",
    {
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 13,
    }
  )
  tr.notOk(
    "@media print { a\r\n{ color: pink;\r\nbackground: orange; } }",
    {
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 13,
    },
    "CRLF"
  )
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a{ color: pink;\nbackground: orange; }")
  tr.ok("a{ color: pink;\r\nbackground: orange; }", "CRLF")
  tr.ok("@media print{\na{ color: pink;\nbackground: orange } }")

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
  tr.notOk("a { color: pink;\r\nbackground: orange; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 2,
  }, "CRLF")
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
    }
  )
})
