import { ruleTester } from "../../../testUtils"
import declarationNoImportant, { ruleName, messages } from ".."

const testDeclarationNoImportant = ruleTester(declarationNoImportant, ruleName)

testDeclarationNoImportant(true, tr => {
  tr.ok("a { color: pink; }")

  tr.notOk("a { color: pink !important; }", messages.unexpected)
})

testDeclarationNoImportant(false, tr => {
  tr.ok("a { color: pink; }")

  tr.ok("a { color: pink !important; }")
})
