"use strict"

const isStandardSyntaxValue = require("../isStandardSyntaxValue")
const test = require("tape")

test("isStandardSyntaxValue", t => {
  t.ok(isStandardSyntaxValue("initial"), "keyword")
  t.ok(isStandardSyntaxValue("currentColor"), "svg keyword")
  t.ok(isStandardSyntaxValue("10px"), "dimension")
  t.ok(isStandardSyntaxValue("45deg"), "angle")
  t.notOk(isStandardSyntaxValue("$sass-variable"), "scss var")
  t.notOk(isStandardSyntaxValue("@less-variable"), "less var")
  t.notOk(isStandardSyntaxValue("#{$var}"), "scss interpolation")
  t.notOk(isStandardSyntaxValue("@{var}"), "less interpolation")

  t.end()
})
