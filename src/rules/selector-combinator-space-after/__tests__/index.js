import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a + a {}", "space before and after + combinator")
  tr.ok("a > a {}", "space before and after > combinator")
  tr.ok("a ~ a {}", "space before and after ~ combinator")
  tr.ok(".foo ~ a + bar {}", "multiple spaced combinators")
  tr.ok("a+ a {}", "no before and one after + combinator")
  tr.ok("a> a {}", "no before and one after > combinator")
  tr.ok("a~ a {}", "no before and one after ~ combinator")
  tr.ok("a\n+ a {}", "newline before space after + combinator")
  tr.ok("a\n> a {}", "newline before space after > combinator")
  tr.ok("a\r\n> a {}", "CRLF before space after > combinator")
  tr.ok("a\n~ a {}", "newline before space after ~ combinator")
  tr.ok(".foo~ a+ bar {}", "multiple combinators with no space before and one after")
  tr.ok(".foo:nth-child(2n+1) {}", "unspaced + in nth-child argument")
  tr.ok(".foo:nth-child(2n-1) {}", "unspaced - in nth-child argument")
  tr.ok("a[rel~='copyright'] {}", "attribute selector with ~=")

  tr.notOk(
    "a+  a {}",
    messages.expectedAfter("+"),
    "two spaces after + combinator"
  )
  tr.notOk(
    "a+\na {}",
    {
      message: messages.expectedAfter("+"),
      line: 1,
      column: 2,
    },
    "newline after + combinator"
  )
  tr.notOk(
    "a+a {}",
    {
      message: messages.expectedAfter("+"),
      line: 1,
      column: 2,
    },
    "no space after + combinator"
  )
  tr.notOk(
    "a>a {}",
    {
      message: messages.expectedAfter(">"),
      line: 1,
      column: 2,
    },
    "no space after > combinator"
  )
  tr.notOk(
    "a~a {}",
    {
      message: messages.expectedAfter("~"),
      line: 1,
      column: 2,
    },
    "no space after ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar ~a {}",
    {
      message: messages.expectedAfter("~"),
      line: 1,
      column: 14,
    },
    "multiple combinators: no space after ~ combinator"
  )
  tr.notOk(
    "#foo +.foo.bar ~ a {}",
    {
      message: messages.expectedAfter("+"),
      line: 1,
      column: 6,
    },
    "multiple combinators: no space after + combinator"
  )
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a +a {}", "space before none after + combinator")
  tr.ok("a >a {}", "space before none after > combinator")
  tr.ok("a ~a {}", "space before none after ~ combinator")
  tr.ok(".foo ~a +bar {}", "multiple combinators with no space after")
  tr.ok("a+a {}", "no space before or after + combinator")
  tr.ok("a>a {}", "no space before or after > combinator")
  tr.ok("a~a {}", "no space before or after ~ combinator")
  tr.ok("a\n+a {}", "newline before and no space after + combinator")
  tr.ok("a\r\n+a {}", "CRLF before and no space after + combinator")
  tr.ok("a\n>a {}", "newline before and no space after > combinator")
  tr.ok("a\n~a {}", "newline before and no space after ~ combinator")
  tr.ok("a\r\n~a {}", "CRLF before and no space after ~ combinator")
  tr.ok(".foo:nth-child(2n + 1) {}", "spaced + in nth-child argument")
  tr.ok(".foo:nth-child(2n - 1) {}", "spaced - in nth-child argument")
  tr.ok("a[rel~='copyright'] {}", "attribute selector with ~=")

  tr.notOk(
    "a+ a {}",
    {
      message: messages.rejectedAfter("+"),
      line: 1,
      column: 2,
    },
    "space after + combinator"
  )
  tr.notOk(
    "a> a {}",
    {
      message: messages.rejectedAfter(">"),
      line: 1,
      column: 2,
    },
    "space after > combinator"
  )
  tr.notOk(
    "a~ a {}",
    {
      message: messages.rejectedAfter("~"),
      line: 1,
      column: 2,
    },
    "space after ~ combinator"
  )
  tr.notOk(
    "a+\na{}",
    {
      message: messages.rejectedAfter("+"),
      line: 1,
      column: 2,
    },
    "newline after + combinator"
  )
  tr.notOk(
    "a+\r\na{}",
    {
      message: messages.rejectedAfter("+"),
      line: 1,
      column: 2,
    },
    "CRLF after + combinator"
  )
  tr.notOk(
    "a>\na{}",
    {
      message: messages.rejectedAfter(">"),
      line: 1,
      column: 2,
    },
    "newline after > combinator"
  )
  tr.notOk(
    "a~\na{}",
    {
      message: messages.rejectedAfter("~"),
      line: 1,
      column: 2,
    },
    "newline after ~ combinator"
  )
  tr.notOk(
    "a~\r\na{}",
    {
      message: messages.rejectedAfter("~"),
      line: 1,
      column: 2,
    },
    "CRLF after ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar ~a {}",
    {
      message: messages.rejectedAfter("+"),
      line: 1,
      column: 3,
    },
    "multiple combinators: space after + combinator"
  )
  tr.notOk(
    "#foo +.foo.bar ~ a {}",
    {
      message: messages.rejectedAfter("~"),
      line: 1,
      column: 16,
    },
    "multiple combinators: no space after ~ combinator"
  )
})
