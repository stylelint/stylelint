import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo ,bar ,baz)\"; }")
  tr.ok("a::before { background: url('func(foo,bar,baz)'); }")
  tr.ok("a { background-size: 0\n, 0\n, 0; }")
  tr.ok("a { transform: translate(1\n,1); }")
  tr.ok("a { transform: translate(1\r\n, 1); }", "CRLF")
  tr.ok("a { transform: color(rgb(0\n\t, 0\n\t,0) lightness(50%)); }")
  tr.ok("a { transform: color(rgb(0\n  , 0\n  ,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1,1); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1  ,1); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 29,
  })
  tr.notOk("a { transform: translate(1 ,1); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: translate(1\t,1); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: color(rgb(0 , 0 \n,0) lightness(50%)); }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0\n, 0,0)); }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 4,
  })
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo ,bar ,baz)\"; }")
  tr.ok("a::before { background: url('func(foo,bar,baz)'); }")
  tr.ok("a { background-size: 0\n, 0\n, 0; }")
  tr.ok("a { transform: translate(1\n,1); }")
  tr.ok("a { transform: translate(1\r\n, 1); }", "CRLF")
  tr.ok("a { transform: color(rgb(0\n\t, 0\n\t,0) lightness(50%)); }")
  tr.ok("a { transform: color(rgb(0\n  , 0\n  ,0) lightness(50%)); }")

  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: translate(1  ,1); }")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1\t,1); }")

  tr.ok("a { background: linear-gradient(45deg\n, rgba(0, 0, 0, 1)\n, red); }")

  tr.notOk("a { transform: color(rgb(0\n, 0, 0) lightness(50%)); }", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 4,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0,0\n,0)); }", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 42,
  })
  tr.notOk("a { background: linear-gradient(45deg\n, rgba(0\n, 0, 0\n, 1)\n, red); }", {
    message: messages.expectedBeforeMultiLine(),
    line: 3,
    column: 4,
  })
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo\n,bar\n,baz)\"; }")
  tr.ok("a::before { background: url('func(foo\n,bar,baz)'); }")

  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: translate(1  ,1); }")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1\t,1); }")

  tr.notOk("a { transform: color(rgb(0,0\n,0) lightness(50%)); }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 1,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0\n, 0, 0)); }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 1,
  })
  tr.notOk("a { transform: color(rgb(0\n,0,\n0) lightness(50%)); }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 1,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0,\n 0\n,0)); }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 3,
    column: 1,
  })
})
