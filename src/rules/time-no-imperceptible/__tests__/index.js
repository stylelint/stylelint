import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a { transition-delay: 0.2s; }")
  tr.ok("a { transition-delay: 3s; }")
  tr.ok("a { transition-delay: 200ms; }")
  tr.ok("a { transition-delay: 5000ms; }")
  tr.ok("a { transition-duration: 0.15s; }")
  tr.ok("a { transition-duration: 2.8s; }")
  tr.ok("a { transition-duration: 330ms; }")
  tr.ok("a { transition-duration: 4700ms; }")
  tr.ok("a { transition: foo 0.8s linear; }")
  tr.ok("a { transition: foo 0.8s 200ms ease-in-out; }")

  tr.notOk("a { transition-delay: 0.006s; }", {
    message: messages.rejected("0.006s"),
    line: 1,
    column: 23,
  })
  tr.notOk("a { transition-delay: 3ms; }", {
    message: messages.rejected("3ms"),
    line: 1,
    column: 23,
  })
  tr.notOk("a { transition-duration: 0.009s; }", {
    message: messages.rejected("0.009s"),
    line: 1,
    column: 26,
  })
  tr.notOk("a { transition-duration: 80ms; }", {
    message: messages.rejected("80ms"),
    line: 1,
    column: 26,
  })
  tr.notOk("a { transition: foo 0.008s linear; }", {
    message: messages.rejected("0.008s"),
    line: 1,
    column: 21,
  })
  tr.notOk("a { transition: foo 0.8s 20ms ease-in-out; }", {
    message: messages.rejected("20ms"),
    line: 1,
    column: 26,
  })

  tr.ok("a { animation-delay: 0.2s; }")
  tr.ok("a { animation-delay: 3s; }")
  tr.ok("a { animation-delay: 200ms; }")
  tr.ok("a { animation-delay: 5000ms; }")
  tr.ok("a { animation-duration: 0.15s; }")
  tr.ok("a { animation-duration: 2.8s; }")
  tr.ok("a { animation-duration: 330ms; }")
  tr.ok("a { animation-duration: 4700ms; }")
  tr.ok("a { animation: foo 0.8s linear; }")
  tr.ok("a { animation: foo 0.8s 200ms ease-in-out; }")

  tr.notOk("a { animation-delay: 0.006s; }", {
    message: messages.rejected("0.006s"),
    line: 1,
    column: 22,
  })
  tr.notOk("a { animation-delay: 3ms; }", {
    message: messages.rejected("3ms"),
    line: 1,
    column: 22,
  })
  tr.notOk("a { animation-duration: 0.009s; }", {
    message: messages.rejected("0.009s"),
    line: 1,
    column: 25,
  })
  tr.notOk("a { animation-duration: 80ms; }", {
    message: messages.rejected("80ms"),
    line: 1,
    column: 25,
  })
  tr.notOk("a { animation: foo 0.008s linear; }", {
    message: messages.rejected("0.008s"),
    line: 1,
    column: 20,
  })
  tr.notOk("a { animation: foo 0.8s 20ms ease-in-out; }", {
    message: messages.rejected("20ms"),
    line: 1,
    column: 25,
  })
})
