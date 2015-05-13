import { ruleTester } from "../../../testUtils"
import declarationColonSpace, { ruleName, messages } from ".."

const testDeclarationColonSpace = ruleTester(declarationColonSpace, ruleName)

testDeclarationColonSpace({ "before": "always" }, tr => {
  tr.ok("a { color :pink }", "space only before")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color :\npink }", "space before and newline after")

  tr.notOk(
    "a { color: pink; }",
    "no space before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color  : pink; }",
    "two spaces before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color\t: pink; }",
    "tab before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color\n: pink; }",
    "newline before",
    messages.expectedBefore()
  )
})

testDeclarationColonSpace({ "before": "never" }, tr => {
  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color: pink }", "no space before and space after")
  tr.ok("a { color:\npink }", "no space before and newline after")

  tr.notOk(
    "a { color : pink; }",
    "space before",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color  : pink; }",
    "two spaces before",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color\t: pink; }",
    "tab before",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color\n: pink; }",
    "newline before",
    messages.rejectedBefore()
  )
})

testDeclarationColonSpace({ "after": "always" }, tr => {
  tr.ok("a { color: pink }", "space only after")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color\n: pink }", "newline before and space after")

  tr.notOk(
    "a { color :pink; }",
    "no space after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color :  pink; }",
    "two spaces after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color :\tpink; }",
    "tab after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color :\npink; }",
    "newline after",
    messages.expectedAfter()
  )
})

testDeclarationColonSpace({ "after": "never" }, tr => {
  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color :pink }", "space before and no space after")
  tr.ok("a { color\n:pink }", "newline before and no space after")

  tr.notOk(
    "a { color : pink; }",
    "space after",
    messages.rejectedAfter()
  )
  tr.notOk(
    "a { color:  pink; }",
    "two spaces after",
    messages.rejectedAfter()
  )
  tr.notOk(
    "a { color :\tpink; }",
    "tab after",
    messages.rejectedAfter()
  )
  tr.notOk(
    "a { color :\npink; }",
    "newline after",
    messages.rejectedAfter()
  )
})

testDeclarationColonSpace({ "before": "always", "after": "never" }, tr => {
  tr.ok("a { color :pink; }", "space before and none after")

  tr.notOk(
    "a { color : pink }",
    "space before and after",
    messages.rejectedAfter()
  )
  tr.notOk(
    "a { color  :pink; }",
    "two spaces before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color:pink; }",
    "no space before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color\n:pink; }",
    "newline before",
    messages.expectedBefore()
  )
})

testDeclarationColonSpace({ before: "never", after: "always" }, tr => {
  tr.ok("a { color: pink }", "space only after")

  tr.notOk(
    "a { color : pink; }",
    "space before and after",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color:  pink!; }",
    "two spaces after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color:pink; }",
    "no space after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color:\npink; }",
    "newline after",
    messages.expectedAfter()
  )
})

testDeclarationColonSpace({ "before": "always", "after": "always" }, tr => {
  tr.ok("a { color : pink }", "space before and after")

  tr.notOk(
    "a { color: pink; }",
    "no space before and one after",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color  : pink; }",
    "two spaces before and one after",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color\n: pink; }",
    "newline before and space after",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color :pink}",
    "one space before and none after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color :  pink }",
    "one before and two after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color :pink }",
    "one space before and none after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color :\npink }",
    "one space before and newline after",
    messages.expectedAfter()
  )
})

testDeclarationColonSpace({ "before": "never", "after": "never" }, tr => {
  tr.ok("a { color:pink; }", "no spaces before or after")

  tr.notOk(
    "a { color: pink; }",
    "no space before and one after",
    messages.rejectedAfter()
  )
  tr.notOk(
    "a { color :pink; }",
    "one space before and none after",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color\n:pink; }",
    "newline before and no space after",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color:\npink; }",
    "no space before and newline after",
    messages.rejectedAfter()
  )
})
