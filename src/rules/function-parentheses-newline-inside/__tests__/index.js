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
  // tr.notOk("a { color: color(\nrgb(0, 0, 0\n) lightness(\n50%\n)\n); }", {
  //   message: messages.expectedOpening,
  //   line: 1,
  //   column: 23,
  // })
  // tr.notOk("a { color: color(\nrgb(\n0, 0, 0) lightness(\n50%\n)\n); }", {
  //   message: messages.expectedClosing,
  //   line: 1,
  //   column: 30,
  // })
  // tr.notOk("a { color: color(\nrgb(\n0, 0, 0\n) lightness(50%\n)\n); }", {
  //   message: messages.expectedOpening,
  //   line: 1,
  //   column: 44,
  // })
  // tr.notOk("a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%)\n); }", {
  //   message: messages.expectedClosing,
  //   line: 1,
  //   column: 47,
  // })
  // tr.notOk("a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)); }", {
  //   message: messages.expectedClosing,
  //   line: 1,
  //   column: 49,
  // })
  // tr.notOk("a::before { content: attr(data-foo\n); }", {
  //   message: messages.expectedOpening,
  //   line: 1,
  //   column: 27,
  // })
  // tr.notOk("a::before { content: attr(\ndata-foo); }", {
  //   message: messages.expectedClosing,
  //   line: 1,
  //   column: 35,
  // })
  // tr.notOk("a { transform: translate(\n  1,\n  1\n); }", {
  //   message: messages.expectedOpening,
  //   line: 1,
  //   column: 26,
  // })
  // tr.notOk("a { transform: translate(\n1,\n  1\n\t); }", {
  //   message: messages.expectedClosing,
  //   line: 3,
  //   column: 1,
  // })
  // tr.notOk("a { transform: translate(1,\r\n1\n); }", {
  //   message: messages.expectedOpening,
  //   line: 1,
  //   column: 26,
  // }, "CRLF")
})

// testRule("always-multi-line", tr => {
//   warningFreeBasics(tr)
//
//   tr.ok("a::before { content: \"(a) (\na\n)\"; }")
//   tr.ok("a::before { background: url(\n'asdf(Vcxvsd)ASD'\n); }")
//   tr.ok("a { transform: translate(\n1, 1\n); }")
//   tr.ok("a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }")
//
//   tr.ok("a { transform: translate(\n  1,\n  1\n); }")
//   tr.ok("a { transform: translate(\n \n  1,\n  1\n\t); }")
//   tr.ok("a { transform: translate(1,\r\n1); }", "CRLF")
//   tr.ok("a { color: color(rgb(0,\n0,\n0\n) lightness(\n50%\n)); }")
//   tr.notOk("a { color: color(rgb(0,\n0,\n0\n) lightness(50%\n)); }", {
//     message: messages.expectedOpeningSingleLine,
//     line: 3,
//     column: 15,
//   })
//
//   tr.notOk("a { transform: translate(1, 1\n); }", {
//     message: messages.expectedOpeningSingleLine,
//     line: 1,
//     column: 26,
//   })
//   tr.notOk("a { transform: translate(\n1, 1); }", {
//     message: messages.expectedClosingSingleLine,
//     line: 1,
//     column: 30,
//   })
//   tr.notOk("a { transform: translate(\n 1, 1\n); }", {
//     message: messages.expectedOpeningSingleLine,
//     line: 1,
//     column: 26,
//   })
//   tr.notOk("a { transform: translate(\n1, 1 \n); }", {
//     message: messages.expectedClosingSingleLine,
//     line: 1,
//     column: 32,
//   })
//   tr.notOk("a { color: color(rgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }", {
//     message: messages.expectedOpeningSingleLine,
//     line: 1,
//     column: 18,
//   })
//   tr.notOk("a { color: color(\nrgb(0, 0, 0\n) lightness(\n50%\n)\n); }", {
//     message: messages.expectedOpeningSingleLine,
//     line: 1,
//     column: 23,
//   })
//   tr.notOk("a { color: color(\nrgb(\n0, 0, 0) lightness(\n50%\n)\n); }", {
//     message: messages.expectedClosingSingleLine,
//     line: 1,
//     column: 30,
//   })
//   tr.notOk("a { color: color(\nrgb(\n0, 0, 0\n) lightness(50%\n)\n); }", {
//     message: messages.expectedOpeningSingleLine,
//     line: 1,
//     column: 44,
//   })
//   tr.notOk("a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%)\n); }", {
//     message: messages.expectedClosingSingleLine,
//     line: 1,
//     column: 47,
//   })
//   tr.notOk("a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)); }", {
//     message: messages.expectedClosingSingleLine,
//     line: 1,
//     column: 49,
//   })
//   tr.notOk("a::before { content: attr(data-foo\n); }", {
//     message: messages.expectedOpeningSingleLine,
//     line: 1,
//     column: 27,
//   })
//   tr.notOk("a::before { content: attr(\ndata-foo); }", {
//     message: messages.expectedClosingSingleLine,
//     line: 1,
//     column: 35,
//   })
// })
//
// testRule("never-multi-line", tr => {
//   warningFreeBasics(tr)
//
//   tr.ok("a::before { content: \"(a) (\na\n)\"; }")
//   tr.ok("a::before { background: url('asdf(\nVcxvsd\n)ASD'); }")
//   tr.ok("a::before { content: \"(a) (\na\n)\"; }")
//   tr.ok("a { transform: translate(1, 1); }")
//   tr.ok("a { color: color(rgb(0, 0, 0) lightness(50%)); }")
//
//   tr.ok("a { transform: translate(\n1,\n1\n); }")
//   tr.ok("a { transform: translate(\r\n  1,\r\n  1\r\n); }", "CRLF")
//   tr.ok("a { color: color(rgb(0,\n0,\n0\n) lightness(50%)); }")
//   tr.notOk("a { color: color(rgb(0,\n0,\n0) lightness(\n50%)); }", {
//     message: messages.rejectedOpeningSingleLine,
//     line: 3,
//     column: 14,
//   })
//
//   tr.notOk("a { transform: translate(\n1, 1); }", {
//     message: messages.rejectedOpeningSingleLine,
//     line: 1,
//     column: 26,
//   })
//   tr.notOk("a { transform: translate(\n 1, 1); }", {
//     message: messages.rejectedOpeningSingleLine,
//     line: 1,
//     column: 26,
//   })
//   tr.notOk("a { transform: translate(1, 1\n); }", {
//     message: messages.rejectedClosingSingleLine,
//     line: 1,
//     column: 30,
//   })
//   tr.notOk("a { transform: translate(1, 1 \n); }", {
//     message: messages.rejectedClosingSingleLine,
//     line: 1,
//     column: 31,
//   })
//   tr.notOk("a { color: color(\nrgb(0, 0, 0) lightness(50%)); }", {
//     message: messages.rejectedOpeningSingleLine,
//     line: 1,
//     column: 18,
//   })
//   tr.notOk("a { color: color(rgb(\n0, 0, 0) lightness(50%)); }", {
//     message: messages.rejectedOpeningSingleLine,
//     line: 1,
//     column: 22,
//   })
//   tr.notOk("a { color: color(rgb(0, 0, 0\n) lightness(50%)); }", {
//     message: messages.rejectedClosingSingleLine,
//     line: 1,
//     column: 29,
//   })
//   tr.notOk("a { color: color(rgb(0, 0, 0) lightness(\n50%)); }", {
//     message: messages.rejectedOpeningSingleLine,
//     line: 1,
//     column: 41,
//   })
//   tr.notOk("a { color: color(rgb(0, 0, 0) lightness(50%\n)); }", {
//     message: messages.rejectedClosingSingleLine,
//     line: 1,
//     column: 44,
//   })
//   tr.notOk("a { color: color(rgb(0, 0, 0) lightness(50%)\n); }", {
//     message: messages.rejectedClosingSingleLine,
//     line: 1,
//     column: 45,
//   })
//   tr.notOk("a::before { content: attr(data-foo\n); }", {
//     message: messages.rejectedClosingSingleLine,
//     line: 1,
//     column: 35,
//   })
//   tr.notOk("a::before { content: attr(\ndata-foo); }", {
//     message: messages.rejectedOpeningSingleLine,
//     line: 1,
//     column: 27,
//   })
// })
