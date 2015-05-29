import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("single", tr => {
  tr.ok("")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: 'foo'; }")
  tr.ok("a::before { content: 'foo\"horse\"\'cow\''; }")
  tr.ok("a { background: url('foo'); }")
  tr.ok("a[id='foo'] {}")

  tr.notOk("a::before { content: \"foo\"; }", messages.expected("single", 1))
  tr.notOk("a::before\n{\n  content: \"foo\";\n}", messages.expected("single", 3))
  tr.notOk("a[id=\"foo\"] {}", messages.expected("single", 1))
  tr.notOk("a\n{ background: url(\"foo\"); }", messages.expected("single", 2))
})

testRule("double", tr => {
  tr.ok("")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \"foo\"; }")
  tr.ok(`a::before { content: "foo\"horse\"'cow'"; }`)
  tr.ok("a { background: url(\"foo\"); }")
  tr.ok("a[id=\"foo\"] {}")

  tr.notOk("a::before { content: 'foo'; }", messages.expected("double", 1))
  tr.notOk("a::before\n{\n  content: 'foo';\n}", messages.expected("double", 3))
  tr.notOk("a[id='foo'] {}", messages.expected("double", 1))
  tr.notOk("a { background: url('foo'); }", messages.expected("double", 1))
})
