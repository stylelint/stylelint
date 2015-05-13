import { ruleTester } from "../../../testUtils"
import selectorCombinatorSpace, { ruleName, messages } from ".."

const testSelectorCombinatorSpace = ruleTester(selectorCombinatorSpace, ruleName)

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
