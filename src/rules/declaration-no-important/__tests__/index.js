import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "without !important")

  tr.notOk(
    "a { color: pink !important; }",
    {
      message: messages.rejected,
      line: 1,
      column: 18,
    },
    "with !important"
  )

  tr.notOk(
    "a { color: pink ! important; }",
    {
      message: messages.rejected,
      line: 1,
      column: 19,
    },
    "with ! important"
  )

  tr.notOk(
    "a { color: pink!important; }",
    {
      message: messages.rejected,
      line: 1,
      column: 17,
    },
    "with value!important"
  )
})
