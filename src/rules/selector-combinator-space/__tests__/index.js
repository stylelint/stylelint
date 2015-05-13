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
    messages.expectedBefore("+"),
    "two spaces before + combinator"
  )
  tr.notOk(
    "a\n+ a {}",
    messages.expectedBefore("+"),
    "newline before + combinator"
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

testSelectorCombinatorSpace({ before: "always", after: "always" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a + a {}", "space before and after + combinator")
  tr.ok("a > a {}", "space before and after > combinator")
  tr.ok("a ~ a {}", "space before and after ~ combinator")
  tr.ok(".foo ~ a + bar {}", "multiple spaced combinators")

  tr.notOk(
    "a  + a {}",
    messages.expectedBefore("+"),
    "two spaces before and one space after + combinator"
  )
  tr.notOk(
    "a +  a {}",
    messages.expectedAfter("+"),
    "one space before and two spaces after + combinator"
  )
  tr.notOk(
    "a\n + a {}",
    messages.expectedBefore("+"),
    "newline and space before and one space after + combinator"
  )
  tr.notOk(
    "a + \na {}",
    messages.expectedAfter("+"),
    "one space before and newline and space after + combinator"
  )
  tr.notOk(
    "a+ a {}",
    messages.expectedBefore("+"),
    "no space before but space after + combinator"
  )
  tr.notOk(
    "a> a {}",
    messages.expectedBefore(">"),
    "no space before but space after > combinator"
  )
  tr.notOk(
    "a~ a {}",
    messages.expectedBefore("~"),
    "no space before but space after ~ combinator"
  )
  tr.notOk(
    "a +a {}",
    messages.expectedAfter("+"),
    "space before but no space after + combinator"
  )
  tr.notOk(
    "a >a {}",
    messages.expectedAfter(">"),
    "space before but no space after > combinator"
  )
  tr.notOk(
    "a ~a {}",
    messages.expectedAfter("~"),
    "space before but no space after ~ combinator"
  )
  tr.notOk(
    "a + .foo.bar ~a {}",
    messages.expectedAfter("~"),
    "multiple combinators: space before but no space after ~ combinator"
  )
  tr.notOk(
    "#foo+ .foo.bar ~ a {}",
    messages.expectedBefore("+"),
    "multiple combinators: no space before but space after + combinator"
  )
})

testSelectorCombinatorSpace({ before: "always", after: "never" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a +a {}", "space before but no space after + combinator")
  tr.ok("a >a {}", "space before but no space after > combinator")
  tr.ok("a ~a {}", "space before but no space after ~ combinator")

  tr.notOk(
    "a + a {}",
    messages.rejectedAfter("+"),
    "space before and after + combinator"
  )
  tr.notOk(
    "a > a {}",
    messages.rejectedAfter(">"),
    "space before and after > combinator"
  )
  tr.notOk(
    "a ~ a {}",
    messages.rejectedAfter("~"),
    "space before and after ~ combinator"
  )
  tr.notOk(
    "a+a {}",
    messages.expectedBefore("+"),
    "no space before or after + combinator"
  )
  tr.notOk(
    "a>a {}",
    messages.expectedBefore(">"),
    "no space before or after > combinator"
  )
  tr.notOk(
    "a~a {}",
    messages.expectedBefore("~"),
    "no space before or after ~ combinator"
  )
})

testSelectorCombinatorSpace({ before: "never", after: "always" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a+ a {}", "no space before btu space after + combinator")
  tr.ok("a> a {}", "no space before btu space after > combinator")
  tr.ok("a~ a {}", "no space before btu space after ~ combinator")

  tr.notOk(
    "a + a {}",
    messages.rejectedBefore("+"),
    "space before and after + combinator"
  )
  tr.notOk(
    "a > a {}",
    messages.rejectedBefore(">"),
    "space before and after > combinator"
  )
  tr.notOk(
    "a ~ a {}",
    messages.rejectedBefore("~"),
    "space before and after ~ combinator"
  )
  tr.notOk(
    "a+a {}",
    messages.expectedAfter("+"),
    "no space before or after + combinator"
  )
  tr.notOk(
    "a>a {}",
    messages.expectedAfter(">"),
    "no space before or after > combinator"
  )
  tr.notOk(
    "a~a {}",
    messages.expectedAfter("~"),
    "no space before or after ~ combinator"
  )
})

testSelectorCombinatorSpace({ before: "never", after: "never" }, tr => {
  tr.ok("a {}", "no combinator")
  tr.ok("a+a {}", "no space before or after + combinator")
  tr.ok("a>a {}", "no space before or after > combinator")
  tr.ok("a~a {}", "no space before or after ~ combinator")

  tr.notOk(
    "a+ a {}",
    messages.rejectedAfter("+"),
    "no space before but space after + combinator"
  )
  tr.notOk(
    "a> a {}",
    messages.rejectedAfter(">"),
    "no space before but space after > combinator"
  )
  tr.notOk(
    "a~ a {}",
    messages.rejectedAfter("~"),
    "no space before but space after ~ combinator"
  )
  tr.notOk(
    "a +a {}",
    messages.rejectedBefore("+"),
    "space before but no space after + combinator"
  )
  tr.notOk(
    "a >a {}",
    messages.rejectedBefore(">"),
    "space before but no space after > combinator"
  )
  tr.notOk(
    "a ~a {}",
    messages.rejectedBefore("~"),
    "space before but no space after ~ combinator"
  )
})
