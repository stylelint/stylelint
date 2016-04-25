import test from "tape"
import isVariable from "../isVariable"

test("isVariable", t => {
  t.notOk(isVariable("initial"))
  t.notOk(isVariable("currentColor"))
  t.notOk(isVariable("-webkit-appearance"))
  t.notOk(isVariable("--custom-property"))
  t.ok(isVariable("$sass-variable"))
  t.ok(isVariable("@less-variable"))
  t.ok(isVariable("var(--something)"))
  t.ok(isVariable("var(  --something  )"))
  t.end()
})
