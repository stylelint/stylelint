import isCustomMediaQuery from "../isCustomMediaQuery"
import test from "tape"

test("isCustomMediaQuery", t => {
  t.ok(isCustomMediaQuery("--custom-media-query"))
  t.notOk(isCustomMediaQuery("border-top-left-radius"))
  t.notOk(isCustomMediaQuery("-webkit-appearance"))
  t.notOk(isCustomMediaQuery("$sass-variable"))
  t.notOk(isCustomMediaQuery("@less-variable"))
  t.notOk(isCustomMediaQuery("var(--something)"))
  t.notOk(isCustomMediaQuery("var(  --something  )"))
  t.end()
})
