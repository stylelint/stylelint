import { ruleTester } from "../../../testUtils"
import declarationColonBefore, { ruleName, messages } from ".."

const testDeclarationColonBefore = ruleTester(declarationColonBefore, ruleName)

const spaceMsg = messages.expected("space")
const nothingMsg = messages.expected("nothing")

testDeclarationColonBefore("space", tr => {
  tr.ok(
    "a { color : pink; }",
    "single space before declaration's colon"
  )
  tr.notOk(
    "a { color: pink; }",
    "nothing before declaration's colon",
    spaceMsg
  )
  tr.notOk(
    "a { color   : pink; }",
    "multiple spaces before declaration's colon",
    spaceMsg
  )
  tr.notOk(
    "a { color\t: pink; }",
    "tab before declaration's colon",
    spaceMsg
  )
  tr.notOk(
    "a { color\n: pink; }",
    "newline before declaration's colon",
    spaceMsg
  )
})

testDeclarationColonBefore("nothing", tr => {
  tr.ok(
    "a { color: pink; }",
    "nothing before declaration's colon"
  )
  tr.notOk(
    "a { color : pink; }",
    "single space before declaration's colon",
    nothingMsg
  )
  tr.notOk(
    "a { color  : pink; }",
    "multiple spaces before declaration's colon",
    nothingMsg
  )
  tr.notOk(
    "a { color\t: pink; }",
    "tab before declaration's colon",
    nothingMsg
  )

  tr.notOk(
    "a { color\n: pink; }",
    "newline before declaration's colon",
    nothingMsg
  )
})
