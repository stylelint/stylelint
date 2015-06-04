import { ruleTester } from "../../../testUtils"
import declarationBlockTrailingSemicolon, { ruleName, messages } from ".."

const testDeclarationBlockTrailingSemicolon = ruleTester(declarationBlockTrailingSemicolon, ruleName)

testDeclarationBlockTrailingSemicolon("always", tr => {
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
    messages.expected,
    "single-line declaration block without trailing semicolon"
  )
  tr.notOk(
    "a { background: orange; color: pink }",
    messages.expected,
    "multi-line declaration block without trailing semicolon"
  )
})

testDeclarationBlockTrailingSemicolon("never", tr => {
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
    messages.rejected,
    "single-line declaration block with trailing semicolon"
  )
  tr.notOk(
    "a { background: orange; color: pink; }",
    messages.rejected,
    "multi-line declaration block with trailing semicolon"
  )
})
