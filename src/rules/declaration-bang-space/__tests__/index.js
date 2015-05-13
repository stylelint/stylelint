import { ruleTester } from "../../../testUtils"
import declarationBangBefore, { ruleName, messages } from ".."

const testDeclarationBangBefore = ruleTester(declarationBangBefore, ruleName)

testDeclarationBangBefore({ before: "always" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink !important; }", "space only before")
  tr.ok("a { color: pink ! important; }", "space before and after")
  tr.ok("a { color: pink !\nimportant; }", "space before and newline after")

  tr.notOk(
    "a { color: pink  !important; }",
    "two spaces before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color: pink!important; }",
    "no space before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    "newline before",
    messages.expectedBefore()
  )
})

testDeclarationBangBefore({ before: "never" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no spaces")
  tr.ok("a { color: pink! important; }", "no space before and after")
  tr.ok("a { color: pink!\nimportant; }", "no space before and newline after")

  tr.notOk(
    "a { color: pink !important; }",
    "space before",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    "newline before",
    messages.rejectedBefore()
  )
})

testDeclarationBangBefore({ after: "always" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink! important; }", "space only after")
  tr.ok("a { color: pink ! important; }", "space before and after")
  tr.ok("a { color: pink\n! important; }", "newline before and space after")

  tr.notOk(
    "a { color: pink!important; }",
    "no space after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color: pink!  important; }",
    "two spaces after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    "newline after",
    messages.expectedAfter()
  )
})

testDeclarationBangBefore({ after: "never" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no space before or after")
  tr.ok("a { color: pink !important; }", "space before and none after")
  tr.ok("a { color: pink\n!important; }", "newline before and none after")

  tr.notOk(
    "a { color: pink! important; }",
    "space after",
    messages.rejectedAfter()
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    "newline after",
    messages.rejectedAfter()
  )
})

testDeclarationBangBefore({ before: "always", after: "never" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink !important; }", "space only before")

  tr.notOk(
    "a { color: pink ! important; }",
    "space before and after",
    messages.rejectedAfter()
  )
  tr.notOk(
    "a { color: pink  !important; }",
    "two spaces before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color: pink!important; }",
    "no space before",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    "newline before",
    messages.expectedBefore()
  )
})

testDeclarationBangBefore({ before: "never", after: "always" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink! important; }", "space only after")

  tr.notOk(
    "a { color: pink ! important; }",
    "space before and after",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color: pink!  important; }",
    "two spaces after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color: pink!important; }",
    "no space after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    "newline before",
    messages.expectedAfter()
  )
})

testDeclarationBangBefore({ before: "always", after: "always" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink ! important; }", "space before and after")

  tr.notOk(
    "a { color: pink! important; }",
    "no space before and one after",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color: pink  ! important; }",
    "two spaces before and one after",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color: pink! important; }",
    "no space before and one after",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color: pink\n! important; }",
    "newline before and one after",
    messages.expectedBefore()
  )
  tr.notOk(
    "a { color: pink !important; }",
    "one space before and none after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color: pink !  important; }",
    "one before and two after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color: pink !important; }",
    "one space before and none after",
    messages.expectedAfter()
  )
  tr.notOk(
    "a { color: pink !\nimportant; }",
    "one space before and newline after",
    messages.expectedAfter()
  )
})

testDeclarationBangBefore({ before: "never", after: "never" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no spaces before or after")

  tr.notOk(
    "a { color: pink! important; }",
    "no space before and one after",
    messages.rejectedAfter()
  )
  tr.notOk(
    "a { color: pink !important; }",
    "one space before and none after",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    "newline before and no space after",
    messages.rejectedBefore()
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    "no space before and newline after",
    messages.rejectedAfter()
  )
})
