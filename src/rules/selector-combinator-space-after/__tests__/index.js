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

  tr.notOk(
    "a+  a {}",
    messages.expectedAfter("+"),
    "two spaces after + combinator"
  )
  tr.notOk(
    "a+\na {}",
    messages.expectedAfter("+"),
    "newline after + combinator"
  )
  tr.notOk(
    "a+a {}",
    messages.expectedAfter("+"),
    "no space after + combinator"
  )
  tr.notOk(
    "a>a {}",
    messages.expectedAfter(">"),
    "no space after > combinator"
  )
  tr.notOk(
    "a~a {}",
    messages.expectedAfter("~"),
    "no space after ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar ~a {}",
    messages.expectedAfter("~"),
    "multiple combinators: no space after ~ combinator"
  )
  tr.notOk(
    "#foo +.foo.bar ~ a {}",
    messages.expectedAfter("+"),
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

  tr.notOk(
    "a+ a {}",
    messages.rejectedAfter("+"),
    "space after + combinator"
  )
  tr.notOk(
    "a> a {}",
    messages.rejectedAfter(">"),
    "space after > combinator"
  )
  tr.notOk(
    "a~ a {}",
    messages.rejectedAfter("~"),
    "space after ~ combinator"
  )
  tr.notOk(
    "a+\na{}",
    messages.rejectedAfter("+"),
    "newline after + combinator"
  )
  tr.notOk(
    "a+\r\na{}",
    messages.rejectedAfter("+"),
    "CRLF after + combinator"
  )
  tr.notOk(
    "a>\na{}",
    messages.rejectedAfter(">"),
    "newline after > combinator"
  )
  tr.notOk(
    "a~\na{}",
    messages.rejectedAfter("~"),
    "newline after ~ combinator"
  )
  tr.notOk(
    "a~\r\na{}",
    messages.rejectedAfter("~"),
    "CRLF after ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar ~a {}",
    messages.rejectedAfter("+"),
    "multiple combinators: space after + combinator"
  )
  tr.notOk(
    "#foo +.foo.bar ~ a {}",
    messages.rejectedAfter("~"),
    "multiple combinators: no space after ~ combinator"
  )
})
