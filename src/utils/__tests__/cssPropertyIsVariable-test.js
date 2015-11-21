import test from "tape"
import cssPropertyIsVariable from "../cssPropertyIsVariable"

test("cssPropertyIsVariable", t => {
  t.notOk(cssPropertyIsVariable("border-top-left-radius"))
  t.notOk(cssPropertyIsVariable("-webkit-appearance"))
  t.ok(cssPropertyIsVariable("--custom-property"))
  t.ok(cssPropertyIsVariable("$sass-variable"))
  t.ok(cssPropertyIsVariable("@less-variable"))
  t.end()
})
