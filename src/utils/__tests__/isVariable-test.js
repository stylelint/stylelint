import test from "tape"
import isVariable from "../isVariable"

test("isVariable", t => {
  t.ok(isVariable("var(--something)"))
  t.ok(isVariable("var(  --something  )"))
  t.notOk(isVariable("initial"))
  t.notOk(isVariable("currentColor"))
  t.notOk(isVariable("-webkit-appearance"))
  t.notOk(isVariable("--custom-property"))
  t.notOk(isVariable("$sass-variable"))
  t.notOk(isVariable("@less-variable"))  
  t.end()
})
