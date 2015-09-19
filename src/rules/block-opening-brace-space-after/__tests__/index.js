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

  tr.notOk("a {color: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {  color: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\ncolor: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\r\ncolor: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  }, "CRLF")
  tr.notOk("@media print {\na { color: pink; } }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 15,
  })
  tr.notOk("@media print { a {\ncolor: pink; } }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media print { a {\r\ncolor: pink; } }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  }, "CRLF")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a {color: pink; }")
  tr.ok("@media print {a {color: pink; } }")

  tr.notOk("a { color: pink; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {  color: pink; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\ncolor: pink; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\r\ncolor: pink; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  }, "CRLF")
  tr.notOk("@media print {\na {color: pink; } }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 15,
  })
  tr.notOk("@media print {a {\ncolor: pink; } }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 18,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  // Regular "always" tests
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a {color: pink; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {  color: pink; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("@media print {\ta { color: pink; } }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 15,
  })
  tr.notOk("@media print { a {\tcolor: pink; } }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 19,
  })

  // Ignoring multi-line blocks
  tr.ok("a {\ncolor: pink; }")
  tr.ok("a {\r\ncolor: pink; }", "CRLF")
  tr.ok("a {color:\npink; }")
  tr.ok("@media print {a {color:\npink; } }")
  tr.ok("@media print{a {color:\npink; } }")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  // Regular "never" tests
  tr.ok("a {color: pink; }")
  tr.ok("@media print {a {color: pink; } }")

  tr.notOk("a { color: pink; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {  color: pink; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("@media print { a {color: pink; } }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 15,
  })
  tr.notOk("@media print {a { color: pink; } }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 18,
  })

  // Ignoring multi-line blocks
  tr.ok("a { color:\npink; }")
  tr.ok("@media print { a { color:\npink; } }")
  tr.ok("@media print { a\n{color: pink; } }")
  tr.ok("@media print { a\r\n{color: pink; } }", "CRLF")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\nbackground: orange; }")
  tr.ok("@media print { a { color: pink;\nbackground: orange } }")

  // Ignoring single-line blocks
  tr.ok("a {color: pink; }")
  tr.ok("@media print {a {color: pink; } }")
  tr.ok("a { color: pink; }")
  tr.ok("a {  color: pink; }")
  tr.ok("a {\tcolor: pink; }")

  tr.notOk("a {color: pink;\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {  color: pink;\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\ncolor: pink;\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\r\ncolor: pink;\r\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  }, "CRLF")
  tr.notOk("@media print\n{a { color: pink;\nbackground: orange; } }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  })
  tr.notOk("@media print { a\n{color: pink;\nbackground: orange; } }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  })
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {color: pink;\nbackground: orange; }")
  tr.ok("@media print {a\n{color: pink;\nbackground: orange } }")
  tr.ok("@media print {a\r\n{color: pink;\r\nbackground: orange } }", "CRLF")

  // Ignoring single-line blocks
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("a { color: pink; }")
  tr.ok("a {  color: pink; }")
  tr.ok("a {\tcolor: pink; }")

  tr.notOk("a { color: pink;\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {  color: pink;\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink;\r\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  }, "CRLF")
  tr.notOk("a {\ncolor: pink;\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("@media print\n{ a {color: pink;\nbackground: orange; } }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 2,
  })
  tr.notOk("@media print{a\n{ color: pink;\nbackground: orange; } }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 2,
  })
})
