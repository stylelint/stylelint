import isOnlyWhitespace from "../isOnlyWhitespace"
import test from "tape"

test("isOnlyWhitespace", t => {
  t.ok(isOnlyWhitespace("\r\n \t \n   "))
  t.notOk(isOnlyWhitespace("   s"))
  t.notOk(isOnlyWhitespace("s\t"))
  t.notOk(isOnlyWhitespace("\n  .\t"))
  t.end()
})
