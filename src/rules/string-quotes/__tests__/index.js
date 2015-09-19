import {
  ruleTester,
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
  tr.notOk("a::before { content: \"foo\"; }", {
    message: messages.expected("single"),
    line: 1,
    column: 22,
  })
  tr.notOk("a::before\n{\n  content: \"foo\";\n}", {
    message: messages.expected("single"),
    line: 3,
    column: 12,
  })
  tr.notOk("a[id=\"foo\"] {}", {
    message: messages.expected("single"),
    line: 1,
    column: 6,
  })
  tr.notOk("a\n{ background: url(\"foo\"); }", {
    message: messages.expected("single"),
    line: 2,
    column: 19,
  })

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
  tr.notOk("a::before { content: 'foo'; }", {
    message: messages.expected("double"),
    line: 1,
    column: 22,
  })
  tr.notOk("a::before\n{\n  content: 'foo';\n}", {
    message: messages.expected("double"),
    line: 3,
    column: 12,
  })
  tr.notOk("a[id='foo'] {}", {
    message: messages.expected("double"),
    line: 1,
    column: 6,
  })
  tr.notOk("a { background: url('foo'); }", {
    message: messages.expected("double"),
    line: 1,
    column: 21,
  })

  tr.ok(`a::before { content: "foo\"horse\"'cow'"; }`, "string in strings")
  tr.ok("a { /* 'horse' */ }", "ignores comment")
})
