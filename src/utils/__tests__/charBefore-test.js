import test from "tape"
import charBefore from "../charBefore"

test("charBefore without lookback number", t => {
  t.equal(charBefore("bar", "r"), "a")
  t.equal(charBefore("bar", "a"), "b")
  t.equal(charBefore("foo", "o"), "f")
  t.equal(charBefore("foo", "z"), undefined)
  t.end()
})

test("charBefore with lookback number", t => {
  t.equal(charBefore("bar", "r", 2), "b")
  t.equal(charBefore("bar afoo", "o", 3), " ")
  t.equal(charBefore("bar", "a", 3), undefined)
  t.end()
})
