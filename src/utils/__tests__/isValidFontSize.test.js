import isValidFontSize from "../isValidFontSize"
import test from "tape"

test("isValidFontSize", t => {
  t.ok(isValidFontSize("10px"))
  t.ok(isValidFontSize("20%"))
  t.notOk(isValidFontSize("20"))
  t.ok(isValidFontSize("small"))
  t.ok(isValidFontSize("smaller"))
  t.notOk(isValidFontSize("smallest"))
  t.notOk(isValidFontSize(null))
  t.end()
})
