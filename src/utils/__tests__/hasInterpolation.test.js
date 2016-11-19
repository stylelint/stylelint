import hasInterpolation from "../hasInterpolation"
import test from "tape"

test("hasInterpolation", t => {
  t.ok(hasInterpolation("(min-width#{$value}: 10px)"), "SCSS interpolation")
  t.ok(hasInterpolation("(@{value}min-width : 10px)"), "Less interpolation")
  t.ok(hasInterpolation("#{$Attr}-color"), "SASS interpolation")
  t.ok(hasInterpolation("@{Attr}-color"), "Less variable")
  t.ok(hasInterpolation("#{50% - $n}"), "SCSS interpolation (id)")
  t.ok(hasInterpolation(".n-#{$n}"), "SCSS interpolation (class)")
  t.ok(hasInterpolation(":n-#{$n}"), "SCSS interpolation (pseudo)")
  t.ok(hasInterpolation(".n-@{n}"), "Less interpolation")
  t.notOk(hasInterpolation("(min-width: 10px)"), "has no interpolation")
  t.notOk(hasInterpolation(".a{}"), "class with no interpolation")
  t.notOk(hasInterpolation("$sass-variable + 'foo'"), "sass-variable with no interpolation")
  t.notOk(hasInterpolation("10px"), "value with no interpolation")
  t.notOk(hasInterpolation("@less-variable + 'foo'"), "less-variable with no interpolation")

  t.end()
})
