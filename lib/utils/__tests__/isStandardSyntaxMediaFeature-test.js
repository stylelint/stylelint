"use strict"

const isStandardSyntaxMediaFeature = require("../isStandardSyntaxMediaFeature")
const test = require("tape")

test("isStandardSyntaxMediaFeature", t => {
  t.ok(isStandardSyntaxMediaFeature("(min-width: 10px)"), "prefix on range features")
  t.ok(isStandardSyntaxMediaFeature("(width <= 3rem)"), "range context")
  t.ok(isStandardSyntaxMediaFeature("(400px < width < 1000px)"), "nested range context")
  t.ok(isStandardSyntaxMediaFeature("(color)"), "boolean context")
  t.notOk(isStandardSyntaxMediaFeature("(min-width: calc(100% - 20px))"), "complex value")
  t.notOk(isStandardSyntaxMediaFeature("(min-width: ($var - 10px))"), "complex SCSS value")
  t.notOk(isStandardSyntaxMediaFeature("(min-width#{$value}: 10px)"), "scss interpolation")
  t.notOk(isStandardSyntaxMediaFeature("(@{value}min-width : 10px)"), "Less interpolation")
  t.end()
})
