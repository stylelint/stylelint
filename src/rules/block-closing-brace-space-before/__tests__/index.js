import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink; }b { color: red; }")

  tr.notOk("a { color: pink;}", messages.expectedBefore())
  tr.notOk("a { color: pink;  }", messages.expectedBefore())
  tr.notOk("a { color: pink;\n}", messages.expectedBefore())
  tr.notOk("a { color: pink;\r\n}", messages.expectedBefore(), "CRLF")
  tr.notOk("a { color: pink;\t}", messages.expectedBefore())
  tr.notOk("a { color: pink; } b { color: red;}", messages.expectedBefore())
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a { color: pink;  }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;\r\n}", messages.rejectedBefore(), "CRLF")
  tr.notOk("a { color: pink;\t}", messages.rejectedBefore())
  tr.notOk("a { color: pink;} b { color: red; }", messages.rejectedBefore())
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a,\nb { color: pink; } c { color: red; }", "multi-line rule, single-line block")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0;}")
  tr.ok("a { color: pink;\n\ntop: 0;}", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;  } b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;\n}b { color: red; }")

  tr.notOk("a { color: pink;}", messages.expectedBeforeSingleLine())
  tr.notOk("a,\nb { color: pink;}", messages.expectedBeforeSingleLine())
  tr.notOk("a,\r\nb { color: pink;}", messages.expectedBeforeSingleLine(), "CRLF")
  tr.notOk("a { color: pink;  }", messages.expectedBeforeSingleLine())
  tr.notOk("a { color: pink;\t}", messages.expectedBeforeSingleLine())
  tr.notOk("a { color: pink; } b { color: red;}", messages.expectedBeforeSingleLine())
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")
  tr.ok("a,\nb { color: pink;} b { color: red;}", "multi-line rule, single-line block")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\r\ntop: 0; }", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;  } b { color: red;}")
  tr.ok("a { color: pink;\ntop: 0;\n}b { color: red;}")

  tr.notOk("a { color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a,\nb { color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a,\r\nb { color: pink; }", messages.rejectedBeforeSingleLine(), "CRLF")
  tr.notOk("a { color: pink;  }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink;\t}", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink;} b { color: red;\t}", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink;  } b { color: red;}", messages.rejectedBeforeSingleLine())
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\ntop: 0; } b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0; }b { color: red; }")
  tr.ok("a { color: pink;\r\ntop: 0; }b { color: red; }", "CRLF")

  // Ignore single-line
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;  } b { color: red; }")
  tr.ok("a { color: pink;\t}b { color: red; }")

  tr.notOk("a { color: pink;\ntop: 0;}", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;  }", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;\t}", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink; } b { color: red;\ntop: 0;}", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;} b { color: red; }", messages.expectedBeforeMultiLine())
  tr.notOk(
    "a { color: pink;\r\ntop: 0;} b { color: red; }",
    messages.expectedBeforeMultiLine(),
    "CRLF"
  )
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\ntop: 0;}")
  tr.ok("a { color: pink;\ntop: 0;} b { color: red;}")
  tr.ok("a { color: pink;\r\ntop: 0;} b { color: red;}", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;}")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink;  } b { color: red; }")
  tr.ok("a { color: pink;\t}b { color: red; }")

  tr.notOk("a { color: pink;\ntop: 0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;  }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;\t}", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\r\ntop: 0;\t}", messages.rejectedBeforeMultiLine(), "CRLF")
  tr.notOk("a { color: pink; } b { color: red;\ntop: 0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; } b { color: red; }", messages.rejectedBeforeMultiLine())
})
