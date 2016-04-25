import test from "tape"
import isStandardValue from "../isStandardValue"

test("isStandardValue", t => {
  t.ok(isStandardValue("initial"), "keyword")
  t.ok(isStandardValue("currentColor"), "svg keyword")
  t.ok(isStandardValue("10px"), "dimension")
  t.ok(isStandardValue("45deg"), "angle")
  t.notOk(isStandardValue("$sass-variable"), "scss var")
  t.notOk(isStandardValue("@less-variable"), "less var")
  t.notOk(isStandardValue("#{$var}"), "scss interpolation")
  t.notOk(isStandardValue("@{var}"), "less interpolation")

  t.end()
})
