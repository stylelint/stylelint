import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo,bar,baz)\"; }")
  tr.ok("a::before { background: url('func(foo,bar,baz)'); }")
  tr.ok("a { background-size: 0, 0, 0; }")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1, 1); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1  , 1); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 29,
  })
  tr.notOk("a { transform: translate(1\n, 1); }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("a { transform: translate(1\r\n, 1); }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("a { transform: translate(1\t, 1); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: color(rgb(0 , 0, 0) lightness(50%)); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 31,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0 , 0, 0)); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 46,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo ,bar ,baz)\"; }")
  tr.ok("a::before { background: url('func(foo ,bar ,baz)'); }")
  tr.ok("a { background-size: 0 , 0 , 0; }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: color(rgb(0, 0,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1 , 1); }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: translate(1  , 1); }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 29,
  })
  tr.notOk("a { transform: translate(1\n, 1); }", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("a { transform: translate(1\r\n, 1); }", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("a { transform: translate(1\t, 1); }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: color(rgb(0, 0 , 0) lightness(50%)); }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 31,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0, 0 , 0)); }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 46,
  })
})
