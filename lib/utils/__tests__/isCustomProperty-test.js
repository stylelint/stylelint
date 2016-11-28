"use strict"

const isCustomProperty = require("../isCustomProperty")
const test = require("tape")

test("isCustomProperty", t => {
  t.ok(isCustomProperty("--custom-property"))
  t.notOk(isCustomProperty("border-top-left-radius"))
  t.notOk(isCustomProperty("-webkit-appearance"))
  t.notOk(isCustomProperty("$sass-variable"))
  t.notOk(isCustomProperty("@less-variable"))
  t.notOk(isCustomProperty("var(--something)"))
  t.notOk(isCustomProperty("var(  --something  )"))
  t.end()
})
