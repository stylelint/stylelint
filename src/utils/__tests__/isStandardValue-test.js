import test from "tape"
import isStandardValue from "../isStandardValue"

test("isStandardValue", t => {
  t.ok(isStandardValue("initial"))
  t.ok(isStandardValue("currentColor"))
  t.ok(isStandardValue("10px"))
  t.ok(isStandardValue("45deg"))
  t.notOk(isStandardValue("$sass-variable"))
  t.notOk(isStandardValue("@less-variable"))
  t.end()
})
