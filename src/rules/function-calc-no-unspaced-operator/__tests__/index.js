import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a { padding: 0 /* calc(1px+2px) */ 0; }")
  tr.ok("a { color: color(red s(-10%)); }")
  tr.ok("a { color: color(red s( -10%)); }")

  tr.ok("a { top: calc(1px + 2px); }")
  tr.ok("a { top: calc(1px - 2px); }")
  tr.ok("a { top: calc(1px * 2); }")
  tr.ok("a { top: calc(1px / 2); }")
  tr.ok("a { top: calc(calc(1em * 2) / 3); }")

  tr.ok("a { top: calc(+1px)}", "sign")
  tr.ok("a { top: calc(1px + -1px)}", "sign after operator")
  tr.ok("a { top: calc(-1px * -1)}", "sign after operator and at start")
  tr.ok("a { top: calc(    +1px)}", "multiple spaces before sign at start")
  tr.ok("a { top: calc(\t+1px)}", "tab before sign at start")

  tr.ok("a { top: calc(-$x - 2rem); }", "postcss-simple-vars and SCSS variable syntax")
  tr.ok("a { top: calc(-@x - 2rem); }", "Less variable syntax")

  tr.notOk("a { top: calc(1px +\t-1px)}", {
    message: messages.expectedAfter("+"),
    line: 1,
    column: 19,
  },
    "tab before sign after operator")
  tr.notOk("a { top: calc(1px +  -1px)}", {
    message: messages.expectedAfter("+"),
    line: 1,
    column: 19,
  },
    "multiple spaces before sign after operator")

  tr.notOk("a { top: calc(1px+ 2px); }", {
    message: messages.expectedBefore("+"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { top: calc(1px  + 2px); }", {
    message: messages.expectedBefore("+"),
    line: 1,
    column: 20,
  })
  tr.notOk("a { top: calc(1px\t+ 2px); }", {
    message: messages.expectedBefore("+"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { top: calc(1px +  2px); }", {
    message: messages.expectedAfter("+"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { top: calc(1px +\t2px); }", {
    message: messages.expectedAfter("+"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { top: calc(1px- 2px); }", {
    message: messages.expectedBefore("-"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { top: calc(1px* 2); }", {
    message: messages.expectedBefore("*"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { top: calc(1px *2); }", {
    message: messages.expectedAfter("*"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { top: calc(1px/ 2); }", {
    message: messages.expectedBefore("/"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { top: calc(1px /2); }", {
    message: messages.expectedAfter("/"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { top: calc(calc(1px* 2px) + 3px); }", {
    message: messages.expectedBefore("*"),
    line: 1,
    column: 23,
  })
  tr.notOk("a { top: calc(calc(1px + 2px)* 3px); }", {
    message: messages.expectedBefore("*"),
    line: 1,
    column: 30,
  })

  tr.notOk("a { top: calc(1px +2px); }", {
    message: messages.expectedOperatorBeforeSign("+"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { top: calc(1px -2px); }", {
    message: messages.expectedOperatorBeforeSign("-"),
    line: 1,
    column: 19,
  })
})
