import { ruleTester } from "../../../testUtils"
import declarationBlockTrailingSemicolon, { ruleName, messages } from ".."

const testDeclarationBlockTrailingSemicolon = ruleTester(declarationBlockTrailingSemicolon, ruleName)

testDeclarationBlockTrailingSemicolon(true, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { background: orange; color: pink; }")

  tr.notOk("a { color: pink }", messages.expected)
  tr.notOk("a { background: orange; color: pink }", messages.expected)
})

testDeclarationBlockTrailingSemicolon(false, tr => {
  tr.ok("a { color: pink }")
  tr.ok("a { background: orange; color: pink }")

  tr.notOk("a { color: pink; }", messages.rejected)
  tr.notOk("a { background: orange; color: pink; }", messages.rejected)
})
