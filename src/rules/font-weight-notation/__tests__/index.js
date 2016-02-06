import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("numeric", tr => {
  warningFreeBasics(tr)

  tr.ok("a { font-weight: 100; }")
  tr.ok("a { font-weight: 700; }")
  tr.ok("a { font-weight: 850; }")
  tr.ok("a { font-weight: 900; }")
  tr.ok("a { font: italic small-caps 400 16px/3 cursive; }")
  tr.ok("a { font: italic small-caps 400 16px/500 cursive; }")

  tr.notOk("a { font-weight: normal; }", {
    message: messages.expected("numeric"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { font: italic small-caps bolder 16px/3 cursive; }", {
    message: messages.expected("numeric"),
    line: 1,
    column: 29,
  })
})

testRule("named", tr => {
  warningFreeBasics(tr)

  tr.ok("a { font-weight: bold; }")
  tr.ok("a { font-weight: bolder; }")
  tr.ok("a { font-weight: normal; }")
  tr.ok("a { font-weight: lighter; }")
  tr.ok("a { font: italic small-caps bold 16px/500 cursive; }")

  tr.notOk("a { font-weight: 400; }", {
    message: messages.expected("named"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { font: italic small-caps 700 16px/3 cursive; }", {
    message: messages.expected("named"),
    line: 1,
    column: 29,
  })
})
