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
  tr.ok("a { margin: 0 0 0 0 }")
  tr.ok("a { margin: 0 10px 5rem 2in; }")
  tr.ok("a { background-position: top right, 1em 5vh; }")
  tr.ok("a { margin: calc(30vh - 10vh); }")
  tr.ok("a { animation: animation-name 300ms ease; }")
  tr.ok("a { -webkit-animation: animation-name 300ms ease; }")
  tr.ok("a { animation-duration: 3s; }")
  tr.ok("a { -webkit-animation-duration: 3s; }")

  tr.ok("a { font-size: /* 100px */ 1.2rem; }", "ignore unit within comments")
  tr.ok("a::before { font-size: \"10px\"}", "ignore unit within quotes")

  tr.ok("a { font-size: $fs10px; }", "ignore preprocessor variable includes unit")
  tr.ok("a { font-size: --some-fs-10px; }", "ignore css variable includes unit")

  tr.notOk("a { font-size: 12px; }", {
    message: messages.rejected("font-size", "px"),
    line: 1,
    column: 16,
  })

  tr.notOk("a { margin: 10px 0 5em; }", {
    message: messages.rejected("margin", "em"),
    line: 1,
    column: 20,
  })

  tr.notOk("a { background-position: 0 10%; }", {
    message: messages.rejected("background-position", "%"),
    line: 1,
    column: 28,
  })

  tr.notOk("a { background-position: top right, 0 10%; }", {
    message: messages.rejected("background-position", "%"),
    line: 1,
    column: 39,
  })

  tr.notOk("a { margin: calc(10vh - 10em); }", {
    message: messages.rejected("margin", "em"),
    column: 25,
  })

  tr.notOk("a { animation: foo 3s; }", messages.rejected("animation", "s"))
  tr.notOk("a { -webkit-animation: foo 3s; }", messages.rejected("-webkit-animation", "s"))
})

testRule({
  "/^animation/": ["s"],
}, tr => {
  tr.ok("a { animation: animation-name 300ms ease; }")
  tr.ok("a { -webkit-animation: animation-name 300ms ease; }")
  tr.ok("a { animation-duration: 300ms; }")
  tr.ok("a { -webkit-animation-duration: 300ms; }")

  tr.notOk("a { animation: animation-name 3s ease; }", messages.rejected("animation", "s"))
  tr.notOk("a { -webkit-animation: animation-name 3s ease; }", messages.rejected("-webkit-animation", "s"))
  tr.notOk("a { animation-duration: 3s; }", messages.rejected("animation-duration", "s"))
  tr.notOk("a { -webkit-animation-duration: 3s; }", messages.rejected("-webkit-animation-duration", "s"))
})
