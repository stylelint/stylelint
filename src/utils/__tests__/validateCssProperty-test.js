import test from "tape"
import validateCssProperty from "../validateCssProperty"

test("validateCssProperty", t => {
  t.ok(validateCssProperty("border-top-left-radius"))
  t.ok(validateCssProperty("-webkit-appearance"))
  t.ok(validateCssProperty("--custom-property"))
  t.notOk(validateCssProperty("$sass-variable"))
  t.notOk(validateCssProperty("@less-variable"))
  t.end()
})
