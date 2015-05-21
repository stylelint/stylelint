import test from "tape"
import valueIndexOf from "../valueIndexOf"

test("basically works", t => {
  t.deepEqual(valueIndexOfResults("abc cba", "c"), [ 2, 4 ])
  t.deepEqual(valueIndexOfResults("abc cba", "a"), [ 0, 6 ])
  t.deepEqual(valueIndexOfResults("abc cba", "b"), [ 1, 5 ])
  t.end()
})

test("ignores matches within single-quote strings", t => {
  t.deepEqual(valueIndexOfResults("abc 'abc'", "c"), [2])
  t.deepEqual(valueIndexOfResults("abc 'abc' cba", "c"), [ 2, 10 ])
  t.end()
})

test("ignores matches within double-quote strings", t => {
  /* eslint-disable quotes */
  t.deepEqual(valueIndexOfResults('abc "abc"', "c"), [2])
  t.deepEqual(valueIndexOfResults('abc "abc" cba', "c"), [ 2, 10 ])
  t.end()
  /* eslint-enable quotes */
})

test("handles escaped double-quotes in double-quote strings", t => {
  /* eslint-disable quotes */
  t.deepEqual(valueIndexOfResults('abc "ab\\"c"', "c"), [2])
  t.deepEqual(valueIndexOfResults('abc "a\\"bc" foo cba', "c"), [ 2, 16 ])
  t.end()
  /* eslint-enable quotes */
})

test("handles escaped double-quotes in single-quote strings", t => {
  t.deepEqual(valueIndexOfResults("abc 'ab\\'c'", "c"), [2])
  t.deepEqual(valueIndexOfResults("abc 'a\\'bc' foo cba", "c"), [ 2, 16 ])
  t.end()
})


function valueIndexOfResults(value, char) {
  const results = []
  valueIndexOf({ value, char }, i => results.push(i))
  return results
}
