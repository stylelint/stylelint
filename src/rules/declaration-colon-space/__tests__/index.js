import { ruleTester } from "../../../testUtils"
import declarationColonSpace, { ruleName, messages } from ".."

const testDeclarationColonSpace = ruleTester(declarationColonSpace, ruleName)

testDeclarationColonSpace({ "before": "always" }, tr => {
  tr.ok("a { color :pink }", "space only before")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color :\npink }", "space before and newline after")

  tr.notOk(
    "a { color: pink; }",
    messages.expectedBefore(),
    "no space before"
  )
  tr.notOk(
    "a { color  : pink; }",
    messages.expectedBefore(),
    "two spaces before"
  )
  tr.notOk(
    "a { color\t: pink; }",
    messages.expectedBefore(),
    "tab before"
  )
  tr.notOk(
    "a { color\n: pink; }",
    messages.expectedBefore(),
    "newline before"
  )
})

testDeclarationColonSpace({ "before": "never" }, tr => {
  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color: pink }", "no space before and space after")
  tr.ok("a { color:\npink }", "no space before and newline after")

  tr.notOk(
    "a { color : pink; }",
    messages.rejectedBefore(),
    "space before"
  )
  tr.notOk(
    "a { color  : pink; }",
    messages.rejectedBefore(),
    "two spaces before"
  )
  tr.notOk(
    "a { color\t: pink; }",
    messages.rejectedBefore(),
    "tab before"
  )
  tr.notOk(
    "a { color\n: pink; }",
    messages.rejectedBefore(),
    "newline before"
  )
})

testDeclarationColonSpace({ "after": "always" }, tr => {
  tr.ok("a { color: pink }", "space only after")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color\n: pink }", "newline before and space after")

  tr.notOk(
    "a { color :pink; }",
    messages.expectedAfter(),
    "no space after"
  )
  tr.notOk(
    "a { color :  pink; }",
    messages.expectedAfter(),
    "two spaces after"
  )
  tr.notOk(
    "a { color :\tpink; }",
    messages.expectedAfter(),
    "tab after"
  )
  tr.notOk(
    "a { color :\npink; }",
    messages.expectedAfter(),
    "newline after"
  )
})

testDeclarationColonSpace({ "after": "never" }, tr => {
  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color :pink }", "space before and no space after")
  tr.ok("a { color\n:pink }", "newline before and no space after")

  tr.notOk(
    "a { color : pink; }",
    messages.rejectedAfter(),
    "space after"
  )
  tr.notOk(
    "a { color:  pink; }",
    messages.rejectedAfter(),
    "two spaces after"
  )
  tr.notOk(
    "a { color :\tpink; }",
    messages.rejectedAfter(),
    "tab after"
  )
  tr.notOk(
    "a { color :\npink; }",
    messages.rejectedAfter(),
    "newline after"
  )
})

testDeclarationColonSpace({ "before": "always", "after": "never" }, tr => {
  tr.ok("a { color :pink; }", "space before and none after")

  tr.notOk(
    "a { color : pink }",
    messages.rejectedAfter(),
    "space before and after"
  )
  tr.notOk(
    "a { color  :pink; }",
    messages.expectedBefore(),
    "two spaces before"
  )
  tr.notOk(
    "a { color:pink; }",
    messages.expectedBefore(),
    "no space before"
  )
  tr.notOk(
    "a { color\n:pink; }",
    messages.expectedBefore(),
    "newline before"
  )
})

testDeclarationColonSpace({ before: "never", after: "always" }, tr => {
  tr.ok("a { color: pink }", "space only after")

  tr.notOk(
    "a { color : pink; }",
    messages.rejectedBefore(),
    "space before and after"
  )
  tr.notOk(
    "a { color:  pink!; }",
    messages.expectedAfter(),
    "two spaces after"
  )
  tr.notOk(
    "a { color:pink; }",
    messages.expectedAfter(),
    "no space after"
  )
  tr.notOk(
    "a { color:\npink; }",
    messages.expectedAfter(),
    "newline after"
  )
})

testDeclarationColonSpace({ "before": "always", "after": "always" }, tr => {
  tr.ok("a { color : pink }", "space before and after")

  tr.notOk(
    "a { color: pink; }",
    messages.expectedBefore(),
    "no space before and one after"
  )
  tr.notOk(
    "a { color  : pink; }",
    messages.expectedBefore(),
    "two spaces before and on after"
  )
  tr.notOk(
    "a { color\n: pink; }",
    messages.expectedBefore(),
    "newline before and spaceafter"
  )
  tr.notOk(
    "a { color :pink}",
    messages.expectedAfter(),
    "one space before and noe after"
  )
  tr.notOk(
    "a { color :  pink }",
    messages.expectedAfter(),
    "one before and two afte"
  )
  tr.notOk(
    "a { color :pink }",
    messages.expectedAfter(),
    "one space before and noe after"
  )
  tr.notOk(
    "a { color :\npink }",
    messages.expectedAfter(),
    "one space before and neline after"
  )
})

testDeclarationColonSpace({ "before": "never", "after": "never" }, tr => {
  tr.ok("a { color:pink; }", "no spaces before or after")

  tr.notOk(
    "a { color: pink; }",
    messages.rejectedAfter(),
    "no space before and oneafter"
  )
  tr.notOk(
    "a { color :pink; }",
    messages.rejectedBefore(),
    "one space before and non after"
  )
  tr.notOk(
    "a { color\n:pink; }",
    messages.rejectedBefore(),
    "newline before and no spce after"
  )
  tr.notOk(
    "a { color:\npink; }",
    messages.rejectedAfter(),
    "no space before and newine after"
  )
})
