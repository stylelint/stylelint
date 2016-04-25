import test from "tape"
import isStandardProperty from "../isStandardProperty"

test("isStandardProperty", t => {
  t.ok(isStandardProperty("top"), "single word")
  t.ok(isStandardProperty("--custom-property"), "custom property")
  t.ok(isStandardProperty("border-top-left-radius"), "hyphenated words")
  t.ok(isStandardProperty("-webkit-appearance"), "vendor prefix")
  t.notOk(isStandardProperty("$sass-variable"), "sass variable")
  t.notOk(isStandardProperty("#{$Attr}-color"), "sass interpolation")
  t.notOk(isStandardProperty("@{Attr}-color"), "less variable")
  t.end()
})
