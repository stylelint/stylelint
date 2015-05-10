import { ruleTester } from "../../../testUtils"
import blockOpeningBraceBefore, { ruleName, messages } from ".."

const testBlockOpeningBraceBefore = ruleTester(blockOpeningBraceBefore, ruleName)

const spaceMsg = messages.expected("space")
const newlineMsg = messages.expected("newline")

testBlockOpeningBraceBefore("space", tr => {
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a{ color: pink; }", spaceMsg)
  tr.notOk("a  { color: pink; }", spaceMsg)
  tr.notOk("a\t{ color: pink; }", spaceMsg)
  tr.notOk("a\n{ color: pink; }", spaceMsg)
  tr.notOk("@media print\n{ a { color: pink; } }", spaceMsg)
  tr.notOk("@media print { a\n{ color: pink; } }", spaceMsg)
})

testBlockOpeningBraceBefore("newline", tr => {
  tr.ok("a\n{ color: pink; }")
  tr.ok("@media print\n{ a\n{ color: pink; } }")

  tr.notOk("a{ color: pink; }", newlineMsg)
  tr.notOk("a  { color: pink; }", newlineMsg)
  tr.notOk("a\t{ color: pink; }", newlineMsg)
  tr.notOk("a { color: pink; }", newlineMsg)
  tr.notOk("@media print\n{ a { color: pink; } }", newlineMsg)
  tr.notOk("@media print { a\n{ color: pink; } }", newlineMsg)
})
