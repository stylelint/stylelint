"use strict"

const isStandardSyntaxSelector = require("../isStandardSyntaxSelector")
const test = require("tape")

test("isStandardSyntaxSelector", t => {
  t.ok(isStandardSyntaxSelector("a"), "type")
  t.ok(isStandardSyntaxSelector(".a"), "class")
  t.ok(isStandardSyntaxSelector("[a=a]"), "attribute")
  t.ok(isStandardSyntaxSelector("*"), "universal")
  t.ok(isStandardSyntaxSelector("a:last-child"), "pseudo-class")
  t.ok(isStandardSyntaxSelector("a:not(.b)"), "pseudo-class with function")
  t.ok(isStandardSyntaxSelector("a::after"), "pseudo-element")
  t.ok(isStandardSyntaxSelector("a.b"), "compound")
  t.ok(isStandardSyntaxSelector("a > b"), "complex")
  t.ok(isStandardSyntaxSelector("a, b"), "list")
  t.notOk(isStandardSyntaxSelector("#{50% - $n}"), "SCSS interpolation (id)")
  t.notOk(isStandardSyntaxSelector(".n-#{$n}"), "SCSS interpolation (class)")
  t.notOk(isStandardSyntaxSelector(":n-#{$n}"), "SCSS interpolation (pseudo)")
  t.notOk(isStandardSyntaxSelector(".n-@{n}"), "Less interpolation")
  t.notOk(isStandardSyntaxSelector("%foo"), "SCSS placeholder")
  t.end()
})
