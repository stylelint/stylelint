import test from "tape"
import charNeighbor from "../charNeighbor"

test("charNeighbor with default offset", t => {
  t.equal(charNeighbor("bar", "r"), "a")
  t.equal(charNeighbor("bar", "a"), "b")
  t.equal(charNeighbor("foo", "o"), "f")
  t.equal(charNeighbor("foo", "z"), undefined)
  t.end()
})

test("charNeighbor with negative offset", t => {
  t.equal(charNeighbor("bar", "r", -2), "b")
  t.equal(charNeighbor("bar afoo", "o", -3), " ")
  t.equal(charNeighbor("bar", "a", -3), undefined)
  t.end()
})

test("charNeighbor with positive offset", t => {
  t.equal(charNeighbor("bar", "b", 2), "r")
  t.equal(charNeighbor("bar afoo", "b", 3), " ")
  t.equal(charNeighbor("bar afoo", "a", 3), "a")
  t.equal(charNeighbor("bar afoo", "b", 8), undefined)
  t.end()
})
