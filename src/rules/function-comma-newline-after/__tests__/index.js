import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo, bar, baz)\"; }")
  tr.ok("a::before { background: url('func(foo,bar,baz)'); }")
  tr.ok("a { background-size: 0,\n  0,\n  0; }")
  tr.ok("a { transform: translate(1 ,\n1); }")
  tr.ok("a { transform: translate(1,\r\n1); }", "CRLF")
  tr.ok("a { transform: color(rgb(0 ,\n\t0,\n\t0) lightness(50%)); }")

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
  tr.notOk("a { transform: translate(1, 1); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: translate(1,\t1); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  })
  tr.notOk("a { transform: color(rgb(0 , 0 ,\n0) lightness(50%)); }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0 ,\n 0 ,0)); }", {
    message: messages.expectedAfter(),
    line: 2,
    column: 4,
  })
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo, bar, baz)\"; }")
  tr.ok("a::before { background: url('func(foo,bar,baz)'); }")
  tr.ok("a { background-size: 0,\n  0,\n  0; }")
  tr.ok("a { transform: translate(1 ,\n1); }")
  tr.ok("a { transform: translate(1,\r\n1); }", "CRLF")
  tr.ok("a { transform: color(rgb(0 ,\n\t0,\n\t0) lightness(50%)); }")

  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: translate(1,  1); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1,\t1); }")
  tr.ok("a {\r\n  transform:\r\n    translate(1,1)\r\n  scale(3);\r\n}", "CRLF")
  tr.ok(`
    .foo {
      box-shadow:
        inset 0 8px 8px -8px rgba(0, 0, 0, 1)
        inset 0 -10px 12px 0 #f00;
    }
  `)
  tr.ok(`
    .foo {
      background-image:
        repeating-linear-gradient(
          -45deg,
          transparent,
          rgba(0, 0, 0, 1) 5px
        );
      }
  `)

  tr.notOk("a { transform: color(rgb(0 , 0 ,\n0) lightness(50%)); }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 28,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0 ,\n 0 ,0)); }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 4,
  })
  tr.notOk("a { background-image: repeating-linear-gradient(\n-45deg,\ntransparent, rgba(0, 0, 0, 1) 5px\n);}", {
    message: messages.expectedAfterMultiLine(),
    line: 3,
    column: 12,
  })
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"func(foo,\n bar,\n baz)\"; }")
  tr.ok("a::before { background: url('func(foo,\nbar,\nbaz)'); }")
  tr.ok("a { background-size: 0\n, 0\n, 0; }")
  tr.ok("a { transform: translate(1\r\n,1); }", "CRLF")
  tr.ok("a { transform: color(rgb(0\n\t,0\n\t,0) lightness(50%)); }")

  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: translate(1,  1); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1,\t1); }")

  tr.notOk("a { transform: color(rgb(0 ,0 ,\n0) lightness(50%)); }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 31,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0 ,\n 0 ,0)); }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 43,
  })
  tr.notOk("a { transform: color(rgb(0\n,0 ,\n0) lightness(50%)); }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 4,
  })
  tr.notOk("a { transform: color(lightness(50%) rgb(0 ,\n 0\n,0)); }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 43,
  })
})
