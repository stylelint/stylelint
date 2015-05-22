import test from "tape"
import valueIndexOf from "../valueIndexOf"

test("default options", t => {
  t.deepEqual(valueIndexOfResults({
    value: "abc cba",
    char: "c",
  }), [ 2, 4 ])
  t.deepEqual(valueIndexOfResults({
    value: "abc cb",
    char: "a",
  }), [0])
  t.deepEqual(valueIndexOfResults({
    value: "abc cba",
    char: "b",
  }), [ 1, 5 ])
  t.end()
})

test("`onlyOne` option", t => {
  t.deepEqual(valueIndexOfResults({
    value: "abc cba",
    char: "c",
    onlyOne: true,
  }), [2])
  t.deepEqual(valueIndexOfResults({
    value: "abc cba",
    char: "a",
    onlyOne: true,
  }), [0])
  t.deepEqual(valueIndexOfResults({
    value: "abc cba",
    char: "b",
    onlyOne: false,
  }), [ 1, 5 ])
  t.end()
})

test("`insideFunction` option", t => {
  t.deepEqual(valueIndexOfResults({
    value: "abc var(--cba)",
    char: "c",
    insideFunction: true,
  }), [10])
  t.deepEqual(valueIndexOfResults({
    value: "abc var(--cba)",
    char: "a",
    insideFunction: true,
  }), [12])
  t.deepEqual(valueIndexOfResults({
    value: "abc \"var(--cba)\"",
    char: "a",
    insideFunction: true,
  }), [])
  t.deepEqual(valueIndexOfResults({
    value: "translate(1px, calc(1px * 2))",
    char: "1",
    insideFunction: true,
  }), [ 10, 20 ])
  t.deepEqual(valueIndexOfResults({
    value: "abc \"var(--cba)\"",
    char: "a",
    insideFunction: false,
  }), [0])
  t.deepEqual(valueIndexOfResults({
    value: "var(--horse)",
    char: "v",
    insideFunction: true,
  }), [])
  t.end()
})

test("`outsideFunction` option", t => {
  t.deepEqual(valueIndexOfResults({
    value: "abc var(--cba)",
    char: "c",
    outsideFunction: true,
  }), [2])
  t.deepEqual(valueIndexOfResults({
    value: "abc var(--cba)",
    char: "a",
    outsideFunction: true,
  }), [0])
  t.deepEqual(valueIndexOfResults({
    value: "abc \"a var(--cba)\"",
    char: "a",
    outsideFunction: true,
  }), [0])
  t.deepEqual(valueIndexOfResults({
    value: "translate(1px, calc(1px * 2))",
    char: "1",
    outsideFunction: true,
  }), [])
  t.deepEqual(valueIndexOfResults({
    value: "var(--horse)",
    char: "v",
    outsideFunction: true,
  }), [])
  t.end()
})

test("ignores matches within single-quote strings", t => {
  t.deepEqual(valueIndexOfResults({
    value: "abc 'abc'",
    char: "c",
  }), [2])
  t.deepEqual(valueIndexOfResults({
    value: "abc 'abc' cba",
    char: "c",
  }), [ 2, 10 ])
  t.end()
})

test("ignores matches within double-quote strings", t => {
  /* eslint-disable quotes */
  t.deepEqual(valueIndexOfResults({
    value: 'abc "abc"',
    char: "c",
  }), [2])
  t.deepEqual(valueIndexOfResults({
    value: 'abc "abc" cba',
    char: "c",
  }), [ 2, 10 ])
  t.end()
  /* eslint-enable quotes */
})

test("handles escaped double-quotes in double-quote strings", t => {
  /* eslint-disable quotes */
  t.deepEqual(valueIndexOfResults({
    value: 'abc "ab\\"c"',
    char: "c",
  }), [2])
  t.deepEqual(valueIndexOfResults({
    value: 'abc "a\\"bc" foo cba',
    char: "c",
  }), [ 2, 16 ])
  t.end()
  /* eslint-enable quotes */
})

test("handles escaped double-quotes in single-quote strings", t => {
  t.deepEqual(valueIndexOfResults({
    value: "abc 'ab\\'c'",
    char: "c",
  }), [2])
  t.deepEqual(valueIndexOfResults({
    value: "abc 'a\\'bc' foo cba",
    char: "c",
  }), [ 2, 16 ])
  t.end()
})

function valueIndexOfResults(options) {
  const results = []
  valueIndexOf(options, i => results.push(i))
  return results
}
