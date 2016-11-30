"use strict"

const isCustomSelector = require("../isCustomSelector")
const test = require("tape")

test("isCustomSelector", t => {
  t.ok(isCustomSelector(":--custom-selector"))
  t.notOk(isCustomSelector("a"))
  t.notOk(isCustomSelector("#div"))
  t.notOk(isCustomSelector(":hover"))
  t.notOk(isCustomSelector(":before"))
  t.notOk(isCustomSelector("::before"))
  t.end()
})
