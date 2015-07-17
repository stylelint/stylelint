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

  tr.notOk(
    "a  +a {}",
    messages.expectedBefore("+"),
    "two spaces before + combinator"
  )
  tr.notOk(
    "a\n+ a {}",
    messages.expectedBefore("+"),
    "newline before + combinator"
  )
  tr.notOk(
    "a\r\n+ a {}",
    messages.expectedBefore("+"),
    "CRLF before + combinator"
  )
  tr.notOk(
    "a+a {}",
    messages.expectedBefore("+"),
    "no space before + combinator"
  )
  tr.notOk(
    "a>a {}",
    messages.expectedBefore(">"),
    "no space before > combinator"
  )
  tr.notOk(
    "a~a {}",
    messages.expectedBefore("~"),
    "no space before ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar~ a {}",
    messages.expectedBefore("~"),
    "multiple combinators: no space before ~ combinator"
  )
  tr.notOk(
    "#foo+ .foo.bar ~ a {}",
    messages.expectedBefore("+"),
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

  tr.notOk(
    "a +a {}",
    messages.rejectedBefore("+"),
    "space before + combinator"
  )
  tr.notOk(
    "a >a {}",
    messages.rejectedBefore(">"),
    "space before > combinator"
  )
  tr.notOk(
    "a ~a {}",
    messages.rejectedBefore("~"),
    "space before ~ combinator"
  )
  tr.notOk(
    "a\n+a {}",
    messages.rejectedBefore("+"),
    "newline before + combinator"
  )
  tr.notOk(
    "a\n>a {}",
    messages.rejectedBefore(">"),
    "newline before > combinator"
  )
  tr.notOk(
    "a\n~a {}",
    messages.rejectedBefore("~"),
    "newline before ~ combinator"
  )
  tr.notOk(
    "a\r\n~a {}",
    messages.rejectedBefore("~"),
    "CRLF before ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar~ a {}",
    messages.rejectedBefore("+"),
    "multiple combinators: space before + combinator"
  )
  tr.notOk(
    "#foo+ .foo.bar ~ a {}",
    messages.rejectedBefore("~"),
    "multiple combinators: no space before ~ combinator"
  )
})
