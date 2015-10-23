import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule([
  "px",
  "vmin",
], tr => {
  warningFreeBasics(tr)

  tr.ok("a { line-height: 1; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { top: 0; left: 0; }")
  tr.ok("a { font-size: 100%; }")
  tr.ok("a { line-height: 1.2rem; }")

  tr.ok("/* 100px */", "ignore unit within comments")
  tr.ok("a::before { content: \"10px\"}", "ignore unit within quotes")

  tr.ok("a { font-size: $fs10px; }", "ignore preprocessor variable includes unit")
  tr.ok("a { font-size: --some-fs-10px; }", "ignore css variable includes unit")

  tr.notOk("a { font-size: 13px; }", {
    message: messages.rejected("px"),
    line: 1,
    column: 16,
  })
  tr.notOk("a { width: 100vmin; }", {
    message: messages.rejected("vmin"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { border-left: 1px solid #ccc; }", {
    message: messages.rejected("px"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { margin: 0 20px; }", {
    message: messages.rejected("px"),
    line: 1,
    column: 15,
  })
})
