import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"(a) ( a)\"; }")
  tr.ok("a::before { background: url(\n'asdf( Vcxvsd)ASD'\n); }")
  tr.ok("a { transform: translate(\n1, 1\n); }")
  tr.ok("a { transform: translate(\r\n1, 1\r\n); }", "CRLF")
  tr.ok("a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }")

  tr.notOk("a { transform: translate(1, 1\n); }", {
    message: messages.expectedOpening,
    line: 1,
    column: 26,
  })
  tr.notOk("a { transform: translate(\n1, 1); }", {
    message: messages.expectedClosing,
    line: 2,
    column: 4,
  })
  tr.notOk("a { transform: translate(  1, 1\n); }", {
    message: messages.expectedOpening,
    line: 1,
    column: 26,
  })
  tr.notOk("a { transform: translate(\n1,\n1\t); }", {
    message: messages.expectedClosing,
    line: 3,
    column: 2,
  })
  tr.notOk("a { color: color(rgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }", {
    message: messages.expectedOpening,
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: color(\nrgb(\n0, 0, 0\n) lightness(50%\n)\n); }", {
    message: messages.expectedOpening,
    line: 4,
    column: 13,
  })
  tr.notOk("a::before { content: attr(data-foo\n); }", {
    message: messages.expectedOpening,
    line: 1,
    column: 27,
  })
  tr.notOk("a::before { content: attr(\n\tdata-foo); }", {
    message: messages.expectedClosing,
    line: 2,
    column: 9,
  })
  tr.notOk("a { transform: translate(  1,\n  1\n); }", {
    message: messages.expectedOpening,
    line: 1,
    column: 26,
  })
  tr.notOk("a { transform: translate(1,\r\n1\n); }", {
    message: messages.expectedOpening,
    line: 1,
    column: 26,
  }, "CRLF")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"(a) ( a)\"; }")
  tr.ok("a::before { background: url(\n'asdf( Vcxvsd)ASD'\n); }")
  tr.ok("a { transform: translate(\n1, 1\n); }")
  tr.ok("a { transform: translate(\r\n1, 1\r\n); }", "CRLF")
  tr.ok("a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }")

  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(  1, 1\t); }")

  tr.notOk("a { transform: translate(1, 1\n); }", {
    message: messages.expectedOpeningMultiLine,
    line: 1,
    column: 26,
  })
  tr.notOk("a { transform: translate(\n1, 1); }", {
    message: messages.expectedClosingMultiLine,
    line: 2,
    column: 4,
  })
  tr.notOk("a { transform: translate(  1, 1\n); }", {
    message: messages.expectedOpeningMultiLine,
    line: 1,
    column: 26,
  })
  tr.notOk("a { transform: translate(\n1,\n1\t); }", {
    message: messages.expectedClosingMultiLine,
    line: 3,
    column: 2,
  })
  tr.notOk("a { color: color(rgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }", {
    message: messages.expectedOpeningMultiLine,
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: color(\nrgb(\n0, 0, 0\n) lightness(50%\n)\n); }", {
    message: messages.expectedOpeningMultiLine,
    line: 4,
    column: 13,
  })
  tr.notOk("a::before { content: attr(data-foo\n); }", {
    message: messages.expectedOpeningMultiLine,
    line: 1,
    column: 27,
  })
  tr.notOk("a::before { content: attr(\n\tdata-foo); }", {
    message: messages.expectedClosingMultiLine,
    line: 2,
    column: 9,
  })
  tr.notOk("a { transform: translate(  1,\n  1\n); }", {
    message: messages.expectedOpeningMultiLine,
    line: 1,
    column: 26,
  })
  tr.notOk("a { transform: translate(1,\r\n1\n); }", {
    message: messages.expectedOpeningMultiLine,
    line: 1,
    column: 26,
  }, "CRLF")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"(a) ( a)\"; }")
  tr.ok("a::before { background: url('asdf(Vcxv\nsd\n)ASD'); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1,\r\n1); }", "CRLF")
  tr.ok("a { color: color(rgb(0, 0, 0) lightness(50%)); }")

  tr.ok("a { transform: translate(1,\n  1); }")
  tr.ok("a { transform: translate(1,\n\t\t1); }")

  tr.notOk("a { transform: translate(\n  1,\n  1); }", {
    message: messages.rejectedOpeningMultiLine,
    line: 1,
    column: 26,
  })
  tr.notOk("a { transform: translate(  \n  1,\n  1); }", {
    message: messages.rejectedOpeningMultiLine,
    line: 1,
    column: 26,
  })
  tr.notOk("a { transform: translate(1,\n  1\n); }", {
    message: messages.rejectedClosingMultiLine,
    line: 2,
    column: 4,
  })
  tr.notOk("a { transform: translate(1,\r\n1\t); }", {
    message: messages.rejectedClosingMultiLine,
    line: 2,
    column: 2,
  })
  tr.notOk("a { color: color(rgb(0,\r\n  0,\r\n  0\r\n) lightness(50%)); }", {
    message: messages.rejectedClosingMultiLine,
    line: 3,
    column: 5,
  })
  tr.notOk("a { color: color(rgb(0, 0, 0) lightness(\n50%)); }", {
    message: messages.rejectedOpeningMultiLine,
    line: 1,
    column: 41,
  })
})
