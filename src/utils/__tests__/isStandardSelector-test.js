import test from "tape"
import isStandardSelector from "../isStandardSelector"

test("isStandardSelector", t => {
  t.ok(isStandardSelector("a"), "type")
  t.ok(isStandardSelector(".a"), "class")
  t.ok(isStandardSelector("[a=a]"), "attribute")
  t.ok(isStandardSelector("*"), "universal")
  t.ok(isStandardSelector("a:last-child"), "pseudo-class")
  t.ok(isStandardSelector("a:not(.b)"), "pseudo-class with function")
  t.ok(isStandardSelector("a::after"), "pseudo-element")
  t.ok(isStandardSelector("a.b"), "compound")
  t.ok(isStandardSelector("a > b"), "complex")
  t.ok(isStandardSelector("a, b"), "list")
  t.notOk(isStandardSelector("#{50% - $n}"), "SCSS interpolation (id)")
  t.notOk(isStandardSelector(".n-#{$n}"), "SCSS interpolation (class)")
  t.notOk(isStandardSelector(".n-@{n}"), "Less interpolation")
  t.notOk(isStandardSelector("%foo"), "SCSS placeholder")
  t.end()
})
