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
    messages.expectedBefore(),
    "two spaces before"
  )
  tr.notOk(
    "a { color: pink!important; }",
    messages.expectedBefore(),
    "no space before"
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    messages.expectedBefore(),
    "newline before"
  )
})

testDeclarationBangBefore({ before: "never" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no spaces")
  tr.ok("a { color: pink! important; }", "no space before and after")
  tr.ok("a { color: pink!\nimportant; }", "no space before and newline after")

  tr.notOk(
    "a { color: pink !important; }",
    messages.rejectedBefore(),
    "space before"
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    messages.rejectedBefore(),
    "newline before"
  )
})

testDeclarationBangBefore({ after: "always" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink! important; }", "space only after")
  tr.ok("a { color: pink ! important; }", "space before and after")
  tr.ok("a { color: pink\n! important; }", "newline before and space after")

  tr.notOk(
    "a { color: pink!important; }",
    messages.expectedAfter(),
    "no space after"
  )
  tr.notOk(
    "a { color: pink!  important; }",
    messages.expectedAfter(),
    "two spaces after"
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    messages.expectedAfter(),
    "newline after"
  )
})

testDeclarationBangBefore({ after: "never" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no space before or after")
  tr.ok("a { color: pink !important; }", "space before and none after")
  tr.ok("a { color: pink\n!important; }", "newline before and none after")

  tr.notOk(
    "a { color: pink! important; }",
    messages.rejectedAfter(),
    "space after"
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    messages.rejectedAfter(),
    "newline after"
  )
})

testDeclarationBangBefore({ before: "always", after: "never" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink !important; }", "space only before")

  tr.notOk(
    "a { color: pink ! important; }",
    messages.rejectedAfter(),
    "space before and after"
  )
  tr.notOk(
    "a { color: pink  !important; }",
    messages.expectedBefore(),
    "two spaces before"
  )
  tr.notOk(
    "a { color: pink!important; }",
    messages.expectedBefore(),
    "no space before"
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    messages.expectedBefore(),
    "newline before"
  )
})

testDeclarationBangBefore({ before: "never", after: "always" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink! important; }", "space only after")

  tr.notOk(
    "a { color: pink ! important; }",
    messages.rejectedBefore(),
    "space before and after"
  )
  tr.notOk(
    "a { color: pink!  important; }",
    messages.expectedAfter(),
    "two spaces after"
  )
  tr.notOk(
    "a { color: pink!important; }",
    messages.expectedAfter(),
    "no space after"
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    messages.expectedAfter(),
    "newline before"
  )
})

testDeclarationBangBefore({ before: "always", after: "always" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink ! important; }", "space before and after")

  tr.notOk(
    "a { color: pink! important; }",
    messages.expectedBefore(),
    "no space before and one after"
  )
  tr.notOk(
    "a { color: pink  ! important; }",
    messages.expectedBefore(),
    "two spaces before and one after"
  )
  tr.notOk(
    "a { color: pink! important; }",
    messages.expectedBefore(),
    "no space before and one after"
  )
  tr.notOk(
    "a { color: pink\n! important; }",
    messages.expectedBefore(),
    "newline before and one after"
  )
  tr.notOk(
    "a { color: pink !important; }",
    messages.expectedAfter(),
    "one space before and none after"
  )
  tr.notOk(
    "a { color: pink !  important; }",
    messages.expectedAfter(),
    "one before and two after"
  )
  tr.notOk(
    "a { color: pink !important; }",
    messages.expectedAfter(),
    "one space before and none after"
  )
  tr.notOk(
    "a { color: pink !\nimportant; }",
    messages.expectedAfter(),
    "one space before and newline after"
  )
})

testDeclarationBangBefore({ before: "never", after: "never" }, tr => {
  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no spaces before or after")

  tr.notOk(
    "a { color: pink! important; }",
    messages.rejectedAfter(),
    "no space before and one after"
  )
  tr.notOk(
    "a { color: pink !important; }",
    messages.rejectedBefore(),
    "one space before and none after"
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    messages.rejectedBefore(),
    "newline before and no space after"
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    messages.rejectedAfter(),
    "no space before and newline after"
  )
})
