import { ruleTester } from "../../../testUtils"
import selectorCombinatorSpace, { ruleName, messages } from ".."

const testSelectorCombinatorSpace = ruleTester(selectorCombinatorSpace, ruleName)

testSelectorCombinatorSpace({ before: "always" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a + a {}", "space before and after + combinator")
  tr.ok("a > a {}", "space before and after > combinator")
  tr.ok("a ~ a {}", "space before and after ~ combinator")
  tr.ok(".foo ~ a + bar {}", "multiple spaced combinators")
  tr.ok("a +a {}", "space before and none after + combinator")
  tr.ok("a >a {}", "space before and none after > combinator")
  tr.ok("a ~a {}", "space before and none after ~ combinator")
  tr.ok("a +\na {}", "space before and newline after + combinator")
  tr.ok("a >\na {}", "space before and newline after > combinator")
  tr.ok("a ~\na {}", "space before and newline after ~ combinator")
  tr.ok(".foo ~a +bar {}", "multiple combinators with space before and none after")

  tr.notOk(
    "a  +a {}",
    "two spaces before + combinator",
    messages.expectedBefore("+")
  )
  tr.notOk(
    "a\n+ a {}",
    "newline before + combinator",
    messages.expectedBefore("+")
  )
  tr.notOk(
    "a+a {}",
    "no space before + combinator",
    messages.expectedBefore("+")
  )
  tr.notOk(
    "a>a {}",
    "no space before > combinator",
    messages.expectedBefore(">")
  )
  tr.notOk(
    "a~a {}",
    "no space before ~ combinator",
    messages.expectedBefore("~")
  )
  tr.notOk(
    "a + .foo.bar~ a {}",
    "multiple combinators: no space before ~ combinator",
    messages.expectedBefore("~")
  )
  tr.notOk(
    "#foo+ .foo.bar ~ a {}",
    "multiple combinators: no space before + combinator",
    messages.expectedBefore("+")
  )
})

testSelectorCombinatorSpace({ before: "never" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a+ a {}", "no space before one after + combinator")
  tr.ok("a> a {}", "no space before one after > combinator")
  tr.ok("a~ a {}", "no space before one after ~ combinator")
  tr.ok("a+a {}", "no space before or after + combinator")
  tr.ok("a>a {}", "no space before or after > combinator")
  tr.ok("a~a {}", "no space before or after ~ combinator")
  tr.ok("a+\na {}", "no space before and newline after + combinator")
  tr.ok("a>\na {}", "no space before and newline after > combinator")
  tr.ok("a~\na {}", "no space before and newline after ~ combinator")
  tr.ok(".foo~ a+ bar {}", "multiple combinators with no space before")

  tr.notOk(
    "a +a {}",
    "space before + combinator",
    messages.rejectedBefore("+")
  )
  tr.notOk(
    "a >a {}",
    "space before > combinator",
    messages.rejectedBefore(">")
  )
  tr.notOk(
    "a ~a {}",
    "space before ~ combinator",
    messages.rejectedBefore("~")
  )
  tr.notOk(
    "a\n+a {}",
    "newline before + combinator",
    messages.rejectedBefore("+")
  )
  tr.notOk(
    "a\n>a {}",
    "newline before > combinator",
    messages.rejectedBefore(">")
  )
  tr.notOk(
    "a\n~a {}",
    "newline before ~ combinator",
    messages.rejectedBefore("~")
  )
  tr.notOk(
    "a + .foo.bar~ a {}",
    "multiple combinators: space before + combinator",
    messages.rejectedBefore("+")
  )
  tr.notOk(
    "#foo+ .foo.bar ~ a {}",
    "multiple combinators: no space before ~ combinator",
    messages.rejectedBefore("~")
  )
})

testSelectorCombinatorSpace({ after: "always" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a + a {}", "space before and after + combinator")
  tr.ok("a > a {}", "space before and after > combinator")
  tr.ok("a ~ a {}", "space before and after ~ combinator")
  tr.ok(".foo ~ a + bar {}", "multiple spaced combinators")
  tr.ok("a+ a {}", "no before and one after + combinator")
  tr.ok("a> a {}", "no before and one after > combinator")
  tr.ok("a~ a {}", "no before and one after ~ combinator")
  tr.ok("a\n+ a {}", "newline before space after + combinator")
  tr.ok("a\n> a {}", "newline before space after > combinator")
  tr.ok("a\n~ a {}", "newline before space after ~ combinator")
  tr.ok(".foo~ a+ bar {}", "multiple combinators with no space before and one after")

  tr.notOk(
    "a+  a {}",
    "two spaces after + combinator",
    messages.expectedAfter("+")
  )
  tr.notOk(
    "a+\na {}",
    "newline after + combinator",
    messages.expectedAfter("+")
  )
  tr.notOk(
    "a+a {}",
    "no space after + combinator",
    messages.expectedAfter("+")
  )
  tr.notOk(
    "a>a {}",
    "no space after > combinator",
    messages.expectedAfter(">")
  )
  tr.notOk(
    "a~a {}",
    "no space after ~ combinator",
    messages.expectedAfter("~")
  )
  tr.notOk(
    "a + .foo.bar ~a {}",
    "multiple combinators: no space after ~ combinator",
    messages.expectedAfter("~")
  )
  tr.notOk(
    "#foo +.foo.bar ~ a {}",
    "multiple combinators: no space after + combinator",
    messages.expectedAfter("+")
  )
})

testSelectorCombinatorSpace({ after: "never" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a +a {}", "space before none after + combinator")
  tr.ok("a >a {}", "space before none after > combinator")
  tr.ok("a ~a {}", "space before none after ~ combinator")
  tr.ok(".foo ~a +bar {}", "multiple combinators with no space after")
  tr.ok("a+a {}", "no space before or after + combinator")
  tr.ok("a>a {}", "no space before or after > combinator")
  tr.ok("a~a {}", "no space before or after ~ combinator")
  tr.ok("a\n+a {}", "newline before and no space after + combinator")
  tr.ok("a\n>a {}", "newline before and no space after > combinator")
  tr.ok("a\n~a {}", "newline before and no space after ~ combinator")

  tr.notOk(
    "a+ a {}",
    "space after + combinator",
    messages.rejectedAfter("+")
  )
  tr.notOk(
    "a> a {}",
    "space after > combinator",
    messages.rejectedAfter(">")
  )
  tr.notOk(
    "a~ a {}",
    "space after ~ combinator",
    messages.rejectedAfter("~")
  )
  tr.notOk(
    "a+\na{}",
    "newline after + combinator",
    messages.rejectedAfter("+")
  )
  tr.notOk(
    "a>\na{}",
    "newline after > combinator",
    messages.rejectedAfter(">")
  )
  tr.notOk(
    "a~\na{}",
    "newline after ~ combinator",
    messages.rejectedAfter("~")
  )
  tr.notOk(
    "a + .foo.bar ~a {}",
    "multiple combinators: space after + combinator",
    messages.rejectedAfter("+")
  )
  tr.notOk(
    "#foo +.foo.bar ~ a {}",
    "multiple combinators: no space after ~ combinator",
    messages.rejectedAfter("~")
  )
})

testSelectorCombinatorSpace({ before: "always", after: "always" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a + a {}", "space before and after + combinator")
  tr.ok("a > a {}", "space before and after > combinator")
  tr.ok("a ~ a {}", "space before and after ~ combinator")
  tr.ok(".foo ~ a + bar {}", "multiple spaced combinators")

  tr.notOk(
    "a  + a {}",
    "two spaces before and one space after + combinator",
    messages.expectedBefore("+")
  )
  tr.notOk(
    "a +  a {}",
    "one space before and two spaces after + combinator",
    messages.expectedAfter("+")
  )
  tr.notOk(
    "a\n + a {}",
    "newline and space before and one space after + combinator",
    messages.expectedBefore("+")
  )
  tr.notOk(
    "a + \na {}",
    "one space before and newline and space after + combinator",
    messages.expectedAfter("+")
  )
  tr.notOk(
    "a+ a {}",
    "no space before but space after + combinator",
    messages.expectedBefore("+")
  )
  tr.notOk(
    "a> a {}",
    "no space before but space after > combinator",
    messages.expectedBefore(">")
  )
  tr.notOk(
    "a~ a {}",
    "no space before but space after ~ combinator",
    messages.expectedBefore("~")
  )
  tr.notOk(
    "a +a {}",
    "space before but no space after + combinator",
    messages.expectedAfter("+")
  )
  tr.notOk(
    "a >a {}",
    "space before but no space after > combinator",
    messages.expectedAfter(">")
  )
  tr.notOk(
    "a ~a {}",
    "space before but no space after ~ combinator",
    messages.expectedAfter("~")
  )
  tr.notOk(
    "a + .foo.bar ~a {}",
    "multiple combinators: space before but no space after ~ combinator",
    messages.expectedAfter("~")
  )
  tr.notOk(
    "#foo+ .foo.bar ~ a {}",
    "multiple combinators: no space before but space after + combinator",
    messages.expectedBefore("+")
  )
})

testSelectorCombinatorSpace({ before: "always", after: "never" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a +a {}", "space before but no space after + combinator")
  tr.ok("a >a {}", "space before but no space after > combinator")
  tr.ok("a ~a {}", "space before but no space after ~ combinator")

  tr.notOk(
    "a + a {}",
    "space before and after + combinator",
    messages.rejectedAfter("+")
  )
  tr.notOk(
    "a > a {}",
    "space before and after > combinator",
    messages.rejectedAfter(">")
  )
  tr.notOk(
    "a ~ a {}",
    "space before and after ~ combinator",
    messages.rejectedAfter("~")
  )
  tr.notOk(
    "a+a {}",
    "no space before or after + combinator",
    messages.expectedBefore("+")
  )
  tr.notOk(
    "a>a {}",
    "no space before or after > combinator",
    messages.expectedBefore(">")
  )
  tr.notOk(
    "a~a {}",
    "no space before or after ~ combinator",
    messages.expectedBefore("~")
  )
})

testSelectorCombinatorSpace({ before: "never", after: "always" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a+ a {}", "no space before btu space after + combinator")
  tr.ok("a> a {}", "no space before btu space after > combinator")
  tr.ok("a~ a {}", "no space before btu space after ~ combinator")

  tr.notOk(
    "a + a {}",
    "space before and after + combinator",
    messages.rejectedBefore("+")
  )
  tr.notOk(
    "a > a {}",
    "space before and after > combinator",
    messages.rejectedBefore(">")
  )
  tr.notOk(
    "a ~ a {}",
    "space before and after ~ combinator",
    messages.rejectedBefore("~")
  )
  tr.notOk(
    "a+a {}",
    "no space before or after + combinator",
    messages.expectedAfter("+")
  )
  tr.notOk(
    "a>a {}",
    "no space before or after > combinator",
    messages.expectedAfter(">")
  )
  tr.notOk(
    "a~a {}",
    "no space before or after ~ combinator",
    messages.expectedAfter("~")
  )
})

testSelectorCombinatorSpace({ before: "never", after: "never" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a+a {}", "no space before or after + combinator")
  tr.ok("a>a {}", "no space before or after > combinator")
  tr.ok("a~a {}", "no space before or after ~ combinator")

  tr.notOk(
    "a+ a {}",
    "no space before but space after + combinator",
    messages.rejectedAfter("+")
  )
  tr.notOk(
    "a> a {}",
    "no space before but space after > combinator",
    messages.rejectedAfter(">")
  )
  tr.notOk(
    "a~ a {}",
    "no space before but space after ~ combinator",
    messages.rejectedAfter("~")
  )
  tr.notOk(
    "a +a {}",
    "space before but no space after + combinator",
    messages.rejectedBefore("+")
  )
  tr.notOk(
    "a >a {}",
    "space before but no space after > combinator",
    messages.rejectedBefore(">")
  )
  tr.notOk(
    "a ~a {}",
    "space before but no space after ~ combinator",
    messages.rejectedBefore("~")
  )
})
