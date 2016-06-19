import test from "tape"
import isValidFontSize from "../isValidFontSize"

test("isValidFontSize", t => {
  t.ok(isValidFontSize("10px"))
  t.ok(isValidFontSize("20%"))
  t.notOk(isValidFontSize("20"))
  t.ok(isValidFontSize("small"))
  t.ok(isValidFontSize("smaller"))
  t.notOk(isValidFontSize("smallest"))
  t.end()
})
