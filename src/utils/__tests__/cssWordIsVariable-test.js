import test from "tape"
import cssWordIsVariable from "../cssWordIsVariable"

test("cssWordIsVariable", t => {
  t.notOk(cssWordIsVariable("border-top-left-radius"))
  t.notOk(cssWordIsVariable("-webkit-appearance"))
  t.ok(cssWordIsVariable("--custom-property"))
  t.ok(cssWordIsVariable("$sass-variable"))
  t.ok(cssWordIsVariable("@less-variable"))
  t.ok(cssWordIsVariable("var(--something)"))
  t.ok(cssWordIsVariable("vAr(--something)"))
  t.ok(cssWordIsVariable("VAR(--something)"))
  t.ok(cssWordIsVariable("var(  --something  )"))
  t.end()
})
