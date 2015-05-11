import { ruleTester } from "../../../testUtils"
import declarationColonSpace, { ruleName, messages } from ".."

const testDeclarationColonSpace = ruleTester(declarationColonSpace, ruleName)

const beforeAlwaysMsg = messages.expected("before", "always")
const beforeNeverMsg = messages.expected("before", "never")

const afterAlwaysMsg = messages.expected("after", "always")
const afterNeverMsg = messages.expected("after", "never")

testDeclarationColonSpace({ "before": "always" }, tr => {
  tr.ok(
    "a { color : pink; }",
    "single space before declaration's colon"
  )
  tr.notOk(
    "a { color: pink; }",
    "nothing before declaration's colon",
    beforeAlwaysMsg
  )
  tr.notOk(
    "a { color   : pink; }",
    "multiple spaces before declaration's colon",
    beforeAlwaysMsg
  )
  tr.notOk(
    "a { color\t: pink; }",
    "tab before declaration's colon",
    beforeAlwaysMsg
  )
  tr.notOk(
    "a { color\n: pink; }",
    "newline before declaration's colon",
    beforeAlwaysMsg
  )
})

testDeclarationColonSpace({ "before": "never" }, tr => {
  tr.ok(
    "a { color: pink; }",
    "nothing before declaration's colon"
  )
  tr.notOk(
    "a { color : pink; }",
    "single space before declaration's colon",
    beforeNeverMsg
  )
  tr.notOk(
    "a { color  : pink; }",
    "multiple spaces before declaration's colon",
    beforeNeverMsg
  )
  tr.notOk(
    "a { color\t: pink; }",
    "tab before declaration's colon",
    beforeNeverMsg
  )

  tr.notOk(
    "a { color\n: pink; }",
    "newline before declaration's colon",
    beforeNeverMsg
  )
})

testDeclarationColonSpace({ "after": "always" }, tr => {
  tr.ok(
    "a { color: pink; }",
    "single space after declaration's colon"
  )
  tr.notOk(
    "a { color:pink; }",
    "nothing after declaration's colon",
    afterAlwaysMsg
  )
  tr.notOk(
    "a { color:    pink; }",
    "multiple spaces after declaration's colon",
    afterAlwaysMsg
  )
  tr.notOk(
    "a { color:\tpink; }",
    "tab after declaration's colon",
    afterAlwaysMsg
  )
  tr.notOk(
    "a { color:\npink; }",
    "newline after declaration's colon",
    afterAlwaysMsg
  )
})

testDeclarationColonSpace({ "after": "never" }, tr => {
  tr.ok(
    "a { color:pink; }",
    "nothing after declaration's colon"
  )
  tr.notOk(
    "a { color: pink; }",
    "single space after declaration's colon",
    afterNeverMsg
  )
  tr.notOk(
    "a { color:    pink; }",
    "multiple spaces after declaration's colon",
    afterNeverMsg
  )
  tr.notOk(
    "a { color:\tpink; }",
    "tab after declaration's colon",
    afterNeverMsg
  )

  tr.notOk(
    "a { color:\npink; }",
    "newline after declaration's colon",
    afterNeverMsg
  )
})

testDeclarationColonSpace({ "before": "always", "after": "always" }, tr => {
  tr.ok(
    "a { color : pink; }",
    "single space before and after declaration's colon"
  )
})

testDeclarationColonSpace({ "before": "always", "after": "never" }, tr => {
  tr.ok(
    "a { color :pink; }",
    "single space before, but not after declaration's colon"
  )
})

testDeclarationColonSpace({ "before": "never", "after": "always" }, tr => {
  tr.ok(
    "a { color: pink; }",
    "single space after, but not before declaration's colon"
  )
})

testDeclarationColonSpace({ "before": "never", "after": "never" }, tr => {
  tr.ok(
    "a { color:pink; }",
    "no space before or after declaration's colon"
  )
})
