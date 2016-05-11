import test from "tape"
import isCustomIdentPropertyAnimationName from "../isCustomIdentPropertyAnimationName"

test("isCustomIdents", t => {
  t.ok(isCustomIdentPropertyAnimationName("animation"))
  t.ok(isCustomIdentPropertyAnimationName("aNiMaTiOn"))
  t.ok(isCustomIdentPropertyAnimationName("ANIMATION"))
  t.ok(isCustomIdentPropertyAnimationName("test_05"))
  t.ok(isCustomIdentPropertyAnimationName("-specific"))
  t.ok(isCustomIdentPropertyAnimationName("sliding-vertically"))
  t.ok(isCustomIdentPropertyAnimationName("test1"))
  t.ok(isCustomIdentPropertyAnimationName("-moz-specific"))
  t.ok(isCustomIdentPropertyAnimationName("sliding"))
  t.notOk(isCustomIdentPropertyAnimationName("none"))
  t.notOk(isCustomIdentPropertyAnimationName("inherit"))
  t.notOk(isCustomIdentPropertyAnimationName("initial"))
  t.notOk(isCustomIdentPropertyAnimationName("unset"))
  t.end()
})
