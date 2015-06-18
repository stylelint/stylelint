import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {} b {}", "rule ignored")
  tr.ok("@font-face {}", "first node ignored")
  tr.ok("a {}\n\n@media {}")
  tr.ok("@keyframes foo {}\n\n@media {}")

  tr.notOk("a {} @media {}", messages.expected)
  tr.notOk("@keyframes foo {} @media {}", messages.expected)
  tr.notOk("a {}\n@media {}", messages.expected)
  tr.notOk("a {}\n\n/* comment */\n@media {}", messages.expected)
})

testRule("always-except-blockless-pair", tr => {
  tr.ok("")
  tr.ok("a {} b {}", "rule ignored")
  tr.ok("@font-face {}", "first node ignored")
  tr.ok("a {}\n\n@media {}")
  tr.ok("@keyframes foo {}\n\n@media {}")

  tr.ok("@keyframes foo {}\n\n@import 'x.css'", "empty line not blockless pair")
  tr.ok("@import 'x.css';\n@import 'y.css'", "no empty line blockless pair")
  tr.ok("@import 'x.css';", "single blockless rule")

  tr.notOk("a {} @media {}", messages.expected)
  tr.notOk("@keyframes foo {} @media {}", messages.expected)
  tr.notOk("a {}\n@media {}", messages.expected)
  tr.notOk("a {}\n\n/* comment */\n@media {}", messages.expected)

  tr.notOk("@keyframes foo {}\n@import 'x.css'", messages.expected)
  tr.notOk("@import 'x.css';\n\n@import 'y.css'", messages.expected)
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}\n\nb {}", "rule ignored")
  tr.ok("\n\n@font-face {}", "first node ignored")
  tr.ok("a {}\n@media {}")
  tr.ok("a {} @media {}")
  tr.ok("@keyframes foo {}\n@media {}")
  tr.ok("@keyframes foo {} @media {}")

  tr.notOk("a {}\n\n@media {}", messages.rejected)
  tr.notOk("@keyframes foo {}\n/* comment */\n\n@media {}", messages.rejected)
})
