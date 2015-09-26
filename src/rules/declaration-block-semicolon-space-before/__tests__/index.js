import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("color: pink ;", "declaration on root")
  tr.ok("a { color: pink ; }")
  tr.ok("a::before { content: \";a\" ; }")
  tr.ok("a { color: pink ; top: 0 ; }")
  tr.ok("a { color: pink ; top: 0}")

  tr.notOk("a { color: pink; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 15,
  })
  tr.notOk("a { color: pink  ; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink\t; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink\n; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink\r\n; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  }, "CRLF")
  tr.notOk("a { color: pink ; top: 0; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 24,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("color: pink;", "declaration on root")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0; }")

  tr.notOk("a { color: pink ; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink  ; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink\t; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink\n; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink\r\n; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 17,
  }, "CRLF")
  tr.notOk("a { color: pink; top: 0 ; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 24,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("color: pink ;", "declaration on root")
  tr.ok("a { color: pink ; }")
  tr.ok("a::before { content: \";a\" ; }")
  tr.ok("a { color: pink ; top: 0 ; }")
  tr.ok("a,\nb { color: pink ; top: 0 ; }", "multi-line rule, single-line declaration-block")

  // Ignore multi-line
  tr.ok("a {\n  color: pink;\n  top: 0;\n}")
  tr.ok("a {\r\n  color: pink;\r\n  top: 0;\r\n}", "CRLF")

  tr.notOk("a { color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 15,
  })
  tr.notOk("a,\nb { color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 15,
  })
  tr.notOk("a,\r\nb { color: pink; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 15,
  }, "CRLF")
  tr.notOk("a { color: pink  ; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink\t; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink ; top: 0; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 24,
  })
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("color: pink;", "declaration on root")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0; }")
  tr.ok("a,\nb { color: pink; top: 0; }", "multi-line rule, single-line declaration-block")

  // Ignore multi-line
  tr.ok("a {\n  color: pink ;\n  top: 0 ;\n}")

  tr.notOk("a { color: pink ; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 16,
  })
  tr.notOk("a,\nb { color: pink ; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 16,
  })
  tr.notOk("a,\r\nb { color: pink ; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 16,
  }, "CRLF")
  tr.notOk("a { color: pink  ; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink\t; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink; top: 0 ; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 24,
  })
})
