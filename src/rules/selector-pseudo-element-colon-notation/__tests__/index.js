import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("single", tr => {
  warningFreeBasics(tr)
  tr.ok("a { color: pink; }")

  tr.ok("a:before { color: pink; }")
  tr.ok("a:after { color: pink; }")
  tr.ok("a:first-letter { color: pink; }")
  tr.ok("a:first-line { color: pink; }")
  tr.ok("a:before, a[data-before='before'] { color: pink; }")

  tr.notOk("a::before { color: pink; }", {
    message: messages.expected("single"),
    line: 1,
    column: 3,
  })
  tr.notOk("a::after { color: pink; }", {
    message: messages.expected("single"),
    line: 1,
    column: 3,
  })
  tr.notOk("a::first-line { color: pink; }", {
    message: messages.expected("single"),
    line: 1,
    column: 3,
  })
  tr.notOk("a::first-letter { color: pink; }", {
    message: messages.expected("single"),
    line: 1,
    column: 3,
  })

  // Ignores newer pseudo-elements that only accept double
  tr.ok("::selection { color: pink; }")
  tr.ok("a::spelling-error { color: pink; }")
  tr.ok("a::grammar-error { color: pink; }")
  tr.ok("li::marker { font-variant-numeric: tabular-nums; }")
  tr.ok("input::placeholder { color: pink; }")
})

testRule("double", tr => {
  warningFreeBasics(tr)
  tr.ok("a { color: pink; }")

  tr.ok("a::before { color: pink; }")
  tr.ok("a::after { color: pink; }")
  tr.ok("a::first-letter { color: pink; }")
  tr.ok("a::first-line { color: pink; }")
  tr.ok("a::before, a[data-before='before'] { color: pink; }")

  tr.notOk("a:before { color: pink; }", {
    message: messages.expected("double"),
    line: 1,
    column: 2,
  })
  tr.notOk("a:after { color: pink; }", {
    message: messages.expected("double"),
    line: 1,
    column: 2,
  })
  tr.notOk("a:first-line { color: pink; }", {
    message: messages.expected("double"),
    line: 1,
    column: 2,
  })
  tr.notOk("a:first-letter { color: pink; }", {
    message: messages.expected("double"),
    line: 1,
    column: 2,
  })

  tr.ok("::selection { color: pink; }")
  tr.ok("a::spelling-error { color: pink; }")
  tr.ok("a::grammar-error { color: pink; }")
  tr.ok("li::marker { font-variant-numeric: tabular-nums; }")
  tr.ok("input::placeholder { color: pink; }")
})
