import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule([
  "transform",
  "background-size",
], tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { background: red; }")
  tr.ok("a { top: 0; color: pink; }")

  tr.notOk("a { transform: scale(1); }", {
    message: messages.rejected("transform"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { color: pink; background-size: cover; }", {
    message: messages.rejected("background-size"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: pink; -webkit-transform: scale(1); }", {
    message: messages.rejected("-webkit-transform"),
    line: 1,
    column: 18,
  })
})

testRule([
  "/^background/",
], tr => {
  warningFreeBasics(tr)
  tr.ok("a { color: pink; }")
  tr.ok("a { no-background: sure; }")
  tr.notOk("a { background: pink; }", {
    message: messages.rejected("background"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { background-size: cover; }", {
    message: messages.rejected("background-size"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { background-image: none; }", {
    message: messages.rejected("background-image"),
    line: 1,
    column: 5,
  })
})
