import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a { padding: 1px; }")
  tr.ok("a { padding: 10px; }")
  tr.ok("a { padding: 10.01px; }")
  tr.ok("a { padding: 10px 1px 1.05px 3.00003em; }")
  tr.ok("a { padding: 0.01px; }")
  tr.ok("a { padding: .01px; }")
  tr.ok("@media (min-width: 100px) {}")
  tr.ok("@import \"0.10.css\";")
  tr.ok("@import url(0.10.css);")

  tr.notOk("a { padding: 1.0px; }", {
    message: messages.rejected,
    line: 1,
    column: 16,
  })
  tr.notOk("a { padding: 1.000px; }", {
    message: messages.rejected,
    line: 1,
    column: 18,
  })
  tr.notOk("a { padding: 10.0px; }", {
    message: messages.rejected,
    line: 1,
    column: 17,
  })
  tr.notOk("a { padding: 10.010px; }", {
    message: messages.rejected,
    line: 1,
    column: 19,
  })
  tr.notOk("a { padding: 10.010px; }", {
    message: messages.rejected,
    line: 1,
    column: 19,
  })
  tr.notOk("a { padding: 0.010px; }", {
    message: messages.rejected,
    line: 1,
    column: 18,
  })
  tr.notOk("a { padding: .010px; }", {
    message: messages.rejected,
    line: 1,
    column: 17,
  })
  tr.notOk("a { transform: translate(2px, 0.40px); }", {
    message: messages.rejected,
    line: 1,
    column: 34,
  })
  tr.notOk("a { padding: 10px 1px 10.010px 3.00003em; }", {
    message: messages.rejected,
    line: 1,
    column: 28,
  })
  tr.notOk("a { padding: 10px 1px 10.01px 3.000030em; }", {
    message: messages.rejected,
    line: 1,
    column: 38,
  })
  tr.notOk("@media (min-width: 100.0px) {}", {
    message: messages.rejected,
    line: 1,
    column: 24,
  })
})
