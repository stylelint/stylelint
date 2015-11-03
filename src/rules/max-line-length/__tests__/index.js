import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("20", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: 0; }")
  tr.ok("a {  color   : 0 ; }")
  tr.ok("a { color: 0;\n  top: 0; }")
  tr.ok("@media print {\n  a {\n    color: pink;\n }\n}")

  tr.ok("a {\n  background: url(\n  somethingsomethingsomethingsomething\n  );\n}")

  tr.notOk("a {   color   : 0  ;}", {
    message: messages.expected(20),
    line: 1,
    column: 21,
  })
  tr.notOk("a { color: 0; top: 0; }", {
    message: messages.expected(20),
    line: 1,
    column: 23,
  })
  tr.notOk("a { color: 0;\n  top: 0; bottom: 0; right: 0; \n  left: 0; }", {
    message: messages.expected(20),
    line: 2,
    column: 31,
  })
  tr.notOk("a { color: 0;\n  top: 0;\n  left: 0; bottom: 0; right: 0; }", {
    message: messages.expected(20),
    line: 3,
    column: 33,
  })
  tr.notOk("@media print {\n  a {\n    color: pink; background: orange;\n }\n}", {
    message: messages.expected(20),
    line: 3,
    column: 36,
  })
  tr.notOk("@media (min-width: 30px) and screen {}", {
    message: messages.expected(20),
    line: 1,
    column: 38,
  })
  tr.notOk("a {\n  background: url(somethingsomethingsomethingsomething);\n}", {
    message: messages.expected(20),
    line: 2,
    column: 56,
  })
})

testRule("30", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: 0;\n  top: 0; left: 0; right: 0; \n  bottom: 0; }")
  tr.notOk("a { color: 0;\n  top: 0; left: 0; right: 0; background: pink; \n  bottom: 0; }", {
    message: messages.expected(30),
    line: 2,
    column: 47,
  })
})
