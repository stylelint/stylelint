import {
  ruleTester
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

// warningFreeBasics won't work because it includes a string
testRule("single", tr => {
  // special-warning-free-basics
  tr.ok("")
  tr.ok("a {}")
  tr.ok("@import url(foo.css);")
  tr.ok("a { color: pink; }")

  tr.ok("a::before { content: 'foo'; }")
  tr.ok("a { background: url('foo'); }")
  tr.ok("a[id='foo'] {}")
  tr.notOk("a::before { content: \"foo\"; }", messages.expected("single", 1))
  tr.notOk("a::before\n{\n  content: \"foo\";\n}", messages.expected("single", 3))
  tr.notOk("a[id=\"foo\"] {}", messages.expected("single", 1))
  tr.notOk("a\n{ background: url(\"foo\"); }", messages.expected("single", 2))

  tr.ok("a::before { content: 'foo\"horse\"\'cow\''; }", "string in strings")
  tr.ok("a { /* \"horse\" */ }", "ignores comment")
})

testRule("double", tr => {
  // special-warning-free-basics
  tr.ok("")
  tr.ok("a {}")
  tr.ok("@import url(foo.css);")
  tr.ok("a { color: pink; }")

  tr.ok("a::before { content: \"foo\"; }")
  tr.ok("a { background: url(\"foo\"); }")
  tr.ok("a[id=\"foo\"] {}")
  tr.notOk("a::before { content: 'foo'; }", messages.expected("double", 1))
  tr.notOk("a::before\n{\n  content: 'foo';\n}", messages.expected("double", 3))
  tr.notOk("a[id='foo'] {}", messages.expected("double", 1))
  tr.notOk("a { background: url('foo'); }", messages.expected("double", 1))

  tr.ok(`a::before { content: "foo\"horse\"'cow'"; }`, "string in strings")
  tr.ok("a { /* 'horse' */ }", "ignores comment")
})
