import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule([
  "px",
  "em",
], tr => {
  warningFreeBasics(tr)

  tr.ok("a { line-height: 1; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { font-size: 14px; }")
  tr.ok("a { font-size: 1.2em; }")
  tr.ok("a { margin: 0 10em 5em 2px; }")
  tr.ok("a { background-position: top right, 10px 20px; }")
  tr.ok("a { top: calc(10em - 3em); }")
  tr.ok("a { background-image: linear-gradient(to right, white calc(100px - 50em), silver); }")

  tr.ok("a { width: /* 100pc */ 1em; }", "ignore unit within comments")
  tr.ok("a::before { content: \"10%\"}", "ignore unit within quotes")

  tr.ok("a { font-size: $fs10%; }", "ignore preprocessor variable includes unit")
  tr.ok("a { font-size: --some-fs-10rem; }", "ignore css variable includes unit")

  tr.notOk("a { font-size: 80%; }", {
    message: messages.rejected("%"),
    line: 1,
    column: 16,
  })
  tr.notOk("a { width: 100vmin; }", {
    message: messages.rejected("vmin"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { border-left: 1rem solid #ccc; }", {
    message: messages.rejected("rem"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { margin: 0 20%; }", {
    message: messages.rejected("%"),
    line: 1,
    column: 15,
  })

  tr.notOk("a { margin: 0 0 0 20rem; }", {
    message: messages.rejected("rem"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { background-position: top right, 1em 5rem; }", {
    message: messages.rejected("rem"),
    line: 1,
    column: 41,
  })
  tr.notOk("a { top: calc(100px - 30vh); }", {
    message: messages.rejected("vh"),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-image: linear-gradient(to right, white calc(100px - 5vmin), silver); }", {
    message: messages.rejected("vmin"),
    line: 1,
    column: 68,
  })
})
