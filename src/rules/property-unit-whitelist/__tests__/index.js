import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule({
  "font-size": [ "px", "em" ],
  "margin": ["em"],
  "background-position": ["%"],
  "animation": ["s"],
}, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { top: 0; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { margin: 0 0 0 0; }")
  tr.ok("a { margin: 0 10em; }")
  tr.ok("a { background-position: top right, 0 50%; }")
  tr.ok("a { margin: calc(30em - 10em); }")
  tr.ok("a { animation: animation-name 1s ease; }")
  tr.ok("a { -webkit-animation: animation-name 100ms ease; }")

  tr.ok("a { font-size: /* 1.2rem */ 12px; }", "ignore unit within comments")
  tr.ok("a::before { font-size: \"1.2rem\"}", "ignore unit within quotes")

  tr.ok("a { font-size: $fs1rem; }", "ignore preprocessor variable includes unit")
  tr.ok("a { font-size: --some-fs-1rem; }", "ignore css variable includes unit")

  tr.notOk("a { font-size: 1.2rem; }", {
    message: messages.rejected("font-size", "rem"),
    line: 1,
    column: 16,
  })

  tr.notOk("a { margin: 10em 0 1rem; }", {
    message: messages.rejected("margin", "rem"),
    line: 1,
    column: 20,
  })

  tr.notOk("a { background-position: 0 10px; }", {
    message: messages.rejected("background-position", "px"),
    line: 1,
    column: 28,
  })

  tr.notOk("a { background-position: top right, 0 10px; }", {
    message: messages.rejected("background-position", "px"),
    line: 1,
    column: 39,
  })

  tr.notOk("a { margin: calc(10em - 10px); }", {
    message: messages.rejected("margin", "px"),
    column: 25,
  })

  tr.notOk("a { animation: animation-name 300ms ease; }", {
    message: messages.rejected("animation", "ms"),
    column: 31,
  })

})
