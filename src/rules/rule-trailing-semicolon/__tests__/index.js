import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok(
    "a { color: pink; }",
    "single-line declaration block with trailing semicolon"
  )
  tr.ok(
    "a { background: orange; color: pink; }",
    "multi-line declaration block with trailing semicolon"
  )

  tr.notOk(
    "a { color: pink }",
    messages.expected,
    "single-line declaration block without trailing semicolon"
  )
  tr.notOk(
    "a { background: orange; color: pink }",
    messages.expected,
    "multi-line declaration block without trailing semicolon"
  )
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok(
    "a { color: pink }",
    "single-line declaration block without trailing semicolon"
  )
  tr.ok(
    "a { background: orange; color: pink }",
    "multi-line declaration block without trailing semicolon"
  )

  tr.notOk(
    "a { color: pink; }",
    messages.rejected,
    "single-line declaration block with trailing semicolon"
  )
  tr.notOk(
    "a { background: orange; color: pink; }",
    messages.rejected,
    "multi-line declaration block with trailing semicolon"
  )
})
