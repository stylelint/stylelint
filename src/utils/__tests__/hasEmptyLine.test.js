import hasEmptyLine from "../hasEmptyLine"
import test from "tape"

test("hasEmptyLine", t => {
  t.ok(hasEmptyLine("\n\n"))
  t.ok(hasEmptyLine("\r\n\r\n"))
  t.ok(hasEmptyLine("\n\n\n\n"))
  t.ok(hasEmptyLine("\r\n\r\n\r\n\r\n"))
  t.ok(hasEmptyLine("   \n\n"))
  t.ok(hasEmptyLine("\n\n   \n\n"))
  t.notOk(hasEmptyLine(""))
  t.notOk(hasEmptyLine(" "))
  t.notOk(hasEmptyLine("\t"))
  t.notOk(hasEmptyLine("\n"))
  t.notOk(hasEmptyLine("\r\n"))
  t.end()
})
