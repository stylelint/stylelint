import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule({
  "transform": ["/scale/"],
  "whitespace": ["nowrap"],
  "/color/": ["/^green/"],
}, tr => {
  warningFreeBasics(tr)

  tr.ok("div { whitespace: nowrap; }")
  tr.ok("a { transform: scale(1, 1); }")
  tr.ok("a { -webkit-transform: scale(1, 1); }")
  tr.ok("a { color: green; }")
  tr.ok("a { background-color: green; }")

  tr.notOk("div { whitespace: pre; }", {
    message: messages.rejected("whitespace", "pre"),
    line: 1,
    column: 7,
  })
  tr.notOk("a { transform: translate(1, 1); }", {
    message: messages.rejected("transform", "translate(1, 1)"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { -webkit-transform: translate(1, 1); }", {
    message: messages.rejected("-webkit-transform", "translate(1, 1)"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { color: pink; }", {
    message: messages.rejected("color", "pink"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { background-color: pink; }", {
    message: messages.rejected("background-color", "pink"),
    line: 1,
    column: 5,
  })
})
