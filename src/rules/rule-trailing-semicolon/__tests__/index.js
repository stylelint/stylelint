import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok(
    "a { color: pink; }",
    "single-line declaration block with trailing semicolon"
  )
  tr.ok(
    "a { background: orange; color: pink; }",
    "multi-line declaration block with trailing semicolon"
  )

  tr.ok(
    "a {{ &:hover { color: pink; }}}",
    "nesting without first-level decl"
  )

  tr.ok(
    "a { color: red; { &:hover { color: pink; }}}",
    "nesting with first-level decl"
  )

  tr.ok(
    "a { &:hover { color: pink; }}",
    "nested"
  )

  tr.notOk(
    "a { color: pink }",
    {
      message: messages.expected,
      line: 1,
      column: 16,
    },
    "single-line declaration block without trailing semicolon"
  )
  tr.notOk(
    "a { background: orange; color: pink }",
    {
      message: messages.expected,
      line: 1,
      column: 36,
    },
    "multi-line declaration block without trailing semicolon"
  )

  tr.notOk(
    "a {{ &:hover { color: pink }}}",
    {
      message: messages.expected,
      line: 1,
      column: 27,
    },
    "nesting without first-level decl"
  )

  tr.notOk(
    "a { color: red; { &:hover { color: pink }}}",
    {
      message: messages.expected,
      line: 1,
      column: 40,
    },
    "nesting with first-level decl"
  )

  tr.notOk(
    "a { &:hover { color: pink }}",
    {
      message: messages.expected,
      line: 1,
      column: 26,
    },
    "nested"
  )
})

testRule("never", tr => {
  warningFreeBasics(tr)

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
    {
      message: messages.rejected,
      line: 1,
      column: 16,
    },
    "single-line declaration block with trailing semicolon"
  )
  tr.notOk(
    "a { background: orange; color: pink; }",
    {
      message: messages.rejected,
      line: 1,
      column: 36,
    },
    "multi-line declaration block with trailing semicolon"
  )
})
