import { ruleTester } from "../../../testUtils"
import declarationNoImportant, { ruleName, messages } from ".."

const testDeclarationNoImportant = ruleTester(declarationNoImportant, ruleName)

testDeclarationNoImportant(true, tr => {
  tr.ok("a { color: pink; }", "declaration without !important")

  tr.notOk(
    "a { color: pink !important; }",
    "declaration with !important",
    messages.unexpected
  )
})

testDeclarationNoImportant(false, tr => {
  tr.ok("a { color: pink; }", "declaration without !important")
  tr.ok("a { color: pink !important; }", "declaration with !important")
})
