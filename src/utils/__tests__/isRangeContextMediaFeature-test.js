import isRangeContextMediaFeature from "../isRangeContextMediaFeature"
import test from "tape"

test("isRangeContextMediaFeature", t => {
  t.ok(isRangeContextMediaFeature("(width = 10px)"))
  t.ok(isRangeContextMediaFeature("(width > 10px)"))
  t.ok(isRangeContextMediaFeature("(width < 10px)"))
  t.ok(isRangeContextMediaFeature("(HEIGHT >= 10px)"))
  t.ok(isRangeContextMediaFeature("(HEIGHT <= 10px)"))
  t.ok(isRangeContextMediaFeature("(5px > width < 10px)"))
  t.ok(isRangeContextMediaFeature("(5px => HEIGHT <= 10px)"))
  t.ok(isRangeContextMediaFeature("(5px > HEIGHT <= 10px)"))
  t.notOk(isRangeContextMediaFeature("(color)"))
  t.notOk(isRangeContextMediaFeature("(MONOCHROME)"))
  t.notOk(isRangeContextMediaFeature("(min-width: 10px)"))
  t.end()
})
