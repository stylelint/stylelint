import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a + a {}", "space before and after + combinator")
  tr.ok("a > a {}", "space before and after > combinator")
  tr.ok("a ~ a {}", "space before and after ~ combinator")
  tr.ok(".foo ~ a + bar {}", "multiple spaced combinators")
  tr.ok("a +a {}", "space before and none after + combinator")
  tr.ok("a >a {}", "space before and none after > combinator")
  tr.ok("a ~a {}", "space before and none after ~ combinator")
  tr.ok("a +\na {}", "space before and newline after + combinator")
  tr.ok("a +\r\na {}", "space before and CRLF after + combinator")
  tr.ok("a >\na {}", "space before and newline after > combinator")
  tr.ok("a ~\na {}", "space before and newline after ~ combinator")
  tr.ok("a ~\r\na {}", "space before and CRLF after ~ combinator")
  tr.ok(".foo ~a +bar {}", "multiple combinators with space before and none after")
  tr.ok(".foo:nth-child(2n+1) {}", "unspaced + in nth-child argument")
  tr.ok(".foo:nth-child(2n-1) {}", "unspaced - in nth-child argument")
  tr.ok("a[rel~='copyright'] {}", "attribute selector with ~=")

  tr.notOk(
    "a  +a {}",
    {
      message: messages.expectedBefore("+"),
      line: 1,
      column: 4,
    },
    "two spaces before + combinator"
  )
  tr.notOk(
    "a\n+ a {}",
    {
      message: messages.expectedBefore("+"),
      line: 2,
      column: 1,
    },
    "newline before + combinator"
  )
  tr.notOk(
    "a\r\n+ a {}",
    {
      message: messages.expectedBefore("+"),
      line: 2,
      column: 1,
    },
    "CRLF before + combinator"
  )
  tr.notOk(
    "a+a {}",
    {
      message: messages.expectedBefore("+"),
      line: 1,
      column: 2,
    },
    "no space before + combinator"
  )
  tr.notOk(
    "a>a {}",
    {
      message: messages.expectedBefore(">"),
      line: 1,
      column: 2,
    },
    "no space before > combinator"
  )
  tr.notOk(
    "a~a {}",
    {
      message: messages.expectedBefore("~"),
      line: 1,
      column: 2,
    },
    "no space before ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar~ a {}",
    {
      message: messages.expectedBefore("~"),
      line: 1,
      column: 13,
    },
    "multiple combinators: no space before ~ combinator"
  )
  tr.notOk(
    "#foo+ .foo.bar ~ a {}",
    {
      message: messages.expectedBefore("+"),
      line: 1,
      column: 5,
    },
    "multiple combinators: no space before + combinator"
  )
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a+ a {}", "no space before one after + combinator")
  tr.ok("a> a {}", "no space before one after > combinator")
  tr.ok("a~ a {}", "no space before one after ~ combinator")
  tr.ok("a+a {}", "no space before or after + combinator")
  tr.ok("a>a {}", "no space before or after > combinator")
  tr.ok("a~a {}", "no space before or after ~ combinator")
  tr.ok("a+\na {}", "no space before and newline after + combinator")
  tr.ok("a>\na {}", "no space before and newline after > combinator")
  tr.ok("a>\r\na {}", "no space before and CRLF after > combinator")
  tr.ok("a~\na {}", "no space before and newline after ~ combinator")
  tr.ok(".foo~ a+ bar {}", "multiple combinators with no space before")
  tr.ok(".foo:nth-child(2n + 1) {}", "spaced + in nth-child argument")
  tr.ok(".foo:nth-child(2n - 1) {}", "spaced - in nth-child argument")
  tr.ok("a[rel~='copyright'] {}", "attribute selector with ~=")

  tr.notOk(
    "a +a {}",
    {
      message: messages.rejectedBefore("+"),
      line: 1,
      column: 3,
    },
    "space before + combinator"
  )
  tr.notOk(
    "a >a {}",
    {
      message: messages.rejectedBefore(">"),
      line: 1,
      column: 3,
    },
    "space before > combinator"
  )
  tr.notOk(
    "a ~a {}",
    {
      message: messages.rejectedBefore("~"),
      line: 1,
      column: 3,
    },
    "space before ~ combinator"
  )
  tr.notOk(
    "a\n+a {}",
    {
      message: messages.rejectedBefore("+"),
      line: 2,
      column: 1,
    },
    "newline before + combinator"
  )
  tr.notOk(
    "a\n>a {}",
    {
      message: messages.rejectedBefore(">"),
      line: 2,
      column: 1,
    },
    "newline before > combinator"
  )
  tr.notOk(
    "a\n~a {}",
    {
      message: messages.rejectedBefore("~"),
      line: 2,
      column: 1,
    },
    "newline before ~ combinator"
  )
  tr.notOk(
    "a\r\n~a {}",
    {
      message: messages.rejectedBefore("~"),
      line: 2,
      column: 1,
    },
    "CRLF before ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar~ a {}",
    {
      message: messages.rejectedBefore("+"),
      line: 1,
      column: 3,
    },
    "multiple combinators: space before + combinator"
  )
  tr.notOk(
    "#foo+ .foo.bar ~ a {}",
    {
      message: messages.rejectedBefore("~"),
      line: 1,
      column: 16,
    },
    "multiple combinators: no space before ~ combinator"
  )
})
