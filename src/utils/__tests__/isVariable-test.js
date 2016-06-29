import isVariable from "../isVariable"
import test from "tape"

test("isVariable", t => {
  t.ok(isVariable("var(--something)"))
  t.ok(isVariable("vAr(--something)"))
  t.ok(isVariable("VAR(--something)"))
  t.ok(isVariable("var(  --something  )"))
  t.notOk(isVariable("initial"))
  t.notOk(isVariable("currentColor"))
  t.notOk(isVariable("-webkit-appearance"))
  t.notOk(isVariable("--custom-property"))
  t.notOk(isVariable("$sass-variable"))
  t.notOk(isVariable("@less-variable"))
  t.end()
})
