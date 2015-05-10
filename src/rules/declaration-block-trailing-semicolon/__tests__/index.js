import { ruleTester } from "../../../testUtils"
import declarationBlockTrailingSemicolon, { ruleName, messages } from ".."

const testDeclarationBlockTrailingSemicolon = ruleTester(declarationBlockTrailingSemicolon, ruleName)

testDeclarationBlockTrailingSemicolon(true, tr => {
  tr.ok(
    "a { color: pink; }",
    "single-line declaration block with trailing semicolon"
  )
  tr.ok(
    "a { background: orange; color: pink; }",
    "multi-line declaration block with trailing semicolon"
  )

  tr.notOk(
    "a { color: pink }",
    "single-line declaration block without trailing semicolon",
    messages.expected
  )
  tr.notOk(
    "a { background: orange; color: pink }",
    "multi-line declaration block without trailing semicolon",
    messages.expected
  )
})

testDeclarationBlockTrailingSemicolon(false, tr => {
  tr.ok(
    "a { color: pink }",
    "single-line declaration block without trailing semicolon"
  )
  tr.ok(
    "a { background: orange; color: pink }",
    "multi-line declaration block without trailing semicolon"
  )

  tr.notOk(
    "a { color: pink; }",
    "single-line declaration block with trailing semicolon",
    messages.rejected
  )
  tr.notOk(
    "a { background: orange; color: pink; }",
    "multi-line declaration block with trailing semicolon",
    messages.rejected
  )
})
