import { ruleTester } from "../../../testUtils"
import declarationNoImportant, { ruleName, messages } from ".."

const testDeclarationNoImportant = ruleTester(declarationNoImportant, ruleName)

testDeclarationNoImportant(null, tr => {
  tr.ok("a {}", "no values")
  tr.ok("a { color: pink; }", "without !important")

  tr.notOk(
    "a { color: pink !important; }",
    "with !important",
    messages.rejected
  )

  tr.notOk(
    "a { color: pink ! important; }",
    "with ! important",
    messages.rejected
  )

  tr.notOk(
    "a { color: pink!important; }",
    "with value!important",
    messages.rejected
  )
})
