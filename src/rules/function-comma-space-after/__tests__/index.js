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
  tr.ok("a { background-size: 0,0,0; }")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: color(rgb(0 , 0, 0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1,1); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1,  1); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1,\n1); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1,\r\n1); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  }, "CRLF")
  tr.notOk("a { transform: translate(1,\t1); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 32,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0 , 0 ,0)); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 47,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo, bar, baz)\"; }")
  tr.ok("a::before { background: url('func(foo, bar, baz)'); }")
  tr.ok("a { background-size: 0, 0, 0; }")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: color(rgb(0 ,0,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1, 1); }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1,  1); }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1,\n1); }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1,\r\n1); }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  }, "CRLF")
  tr.notOk("a { transform: translate(1,\t1); }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: lightness(50%) color(rgb(0 , 0 ,0) ); }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 43,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo,bar,baz)\"; }")
  tr.ok("a::before { background: url('func(foo,bar,baz)'); }")
  tr.ok("a { background-size: 0,0,0; }")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: color(rgb(0 , 0, 0) lightness(50%)); }")

  tr.ok("a { transform: translate(1,\n1); }")
  tr.ok("a { transform: translate(1\n,1); }")
  tr.ok("a { transform: translate(1,\r\n1); }", "CRLF")
  tr.ok("a { color: rgba(0,0\n,0); }", "CRLF")
  tr.ok("a { color: rgba(0\n,0,0); }", "CRLF")

  tr.ok("a { background: linear-gradient(45deg\n,rgba(0, 0, 0, 1)\n,red); }")

  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 32,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0 , 0 ,0)); }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 47,
  })
  tr.notOk("a { background: linear-gradient(45deg\n,rgba(0, 0,0, 1),red); }", {
    message: messages.expectedAfterSingleLine(),
    line: 2,
    column: 11,
  })
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo, bar, baz)\"; }")
  tr.ok("a::before { background: url('func(foo, bar, baz)'); }")
  tr.ok("a { background-size: 0, 0, 0; }")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: color(rgb(0 ,0,0) lightness(50%)); }")

  tr.ok("a { transform: translate(1,\n1); }")
  tr.ok("a { transform: translate(1\n, 1); }")
  tr.ok("a { transform: translate(1\r\n, 1); }", "CRLF")
  tr.ok("a { color: rgba(0, 0\n, 0); }", "CRLF")
  tr.ok("a { color: rgba(0\n, 0, 0); }", "CRLF")

  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: lightness(50%) color(rgb(0 , 0 ,0) ); }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 43,
  })
  tr.notOk("a { transform: lightness(50%)\ncolor(rgb(0 , 0 ,0) ); }", {
    message: messages.rejectedAfterSingleLine(),
    line: 2,
    column: 13,
  })
})
