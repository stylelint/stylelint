import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a {}")
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

  tr.notOk("a { top: calc(1px +\t-1px)}", messages.expectedAfter("+"),
    "tab before sign after operator")
  tr.notOk("a { top: calc(1px +  -1px)}", messages.expectedAfter("+"),
    "multiple spaces before sign after operator")

  tr.notOk("a { top: calc(1px+ 2px); }", messages.expectedBefore("+"))
  tr.notOk("a { top: calc(1px  + 2px); }", messages.expectedBefore("+"))
  tr.notOk("a { top: calc(1px\t+ 2px); }", messages.expectedBefore("+"))
  tr.notOk("a { top: calc(1px +  2px); }", messages.expectedAfter("+"))
  tr.notOk("a { top: calc(1px +\t2px); }", messages.expectedAfter("+"))
  tr.notOk("a { top: calc(1px- 2px); }", messages.expectedBefore("-"))
  tr.notOk("a { top: calc(1px* 2); }", messages.expectedBefore("*"))
  tr.notOk("a { top: calc(1px *2); }", messages.expectedAfter("*"))
  tr.notOk("a { top: calc(1px/ 2); }", messages.expectedBefore("/"))
  tr.notOk("a { top: calc(1px /2); }", messages.expectedAfter("/"))
  tr.notOk("a { top: calc(calc(1px* 2px) + 3px); }", messages.expectedBefore("*"))
  tr.notOk("a { top: calc(calc(1px + 2px)* 3px); }", messages.expectedBefore("*"))

  tr.notOk("a { top: calc(1px +2px); }", messages.expectedOperatorBeforeSign("+"))
  tr.notOk("a { top: calc(1px -2px); }", messages.expectedOperatorBeforeSign("-"))
})
