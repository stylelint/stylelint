import test from "tape"
import propertyIsCustom from "../propertyIsCustom"

test("propertyIsCustom", t => {
  t.ok(propertyIsCustom("--custom-property"))
  t.notOk(propertyIsCustom("border-top-left-radius"))
  t.notOk(propertyIsCustom("-webkit-appearance"))
  t.notOk(propertyIsCustom("$sass-variable"))
  t.notOk(propertyIsCustom("@less-variable"))
  t.notOk(propertyIsCustom("var(--something)"))
  t.notOk(propertyIsCustom("var(  --something  )"))
  t.end()
})
