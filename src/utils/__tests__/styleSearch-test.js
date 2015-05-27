import test from "tape"
import styleSearch from "../styleSearch"

test("default options", t => {
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: "c",
  }), [ 2, 4 ])
  t.deepEqual(styleSearchResults({
    source: "abc cb",
    target: "a",
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: "b",
  }), [ 1, 5 ])
  t.end()
})

test("`onlyOne` option", t => {
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: "c",
    onlyOne: true,
  }), [2])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: "a",
    onlyOne: true,
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: "b",
    onlyOne: false,
  }), [ 1, 5 ])
  t.end()
})

test("`insideFunction` option", t => {
  t.deepEqual(styleSearchResults({
    source: "abc var(--cba)",
    target: "c",
    insideFunction: true,
  }), [10])
  t.deepEqual(styleSearchResults({
    source: "abc var(--cba)",
    target: "a",
    insideFunction: true,
  }), [12])
  t.deepEqual(styleSearchResults({
    source: "abc \"var(--cba)\"",
    target: "a",
    insideFunction: true,
  }), [])
  t.deepEqual(styleSearchResults({
    source: "translate(1px, calc(1px * 2))",
    target: "1",
    insideFunction: true,
  }), [ 10, 20 ])
  t.deepEqual(styleSearchResults({
    source: "abc \"var(--cba)\"",
    target: "a",
    insideFunction: false,
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "var(--horse)",
    target: "v",
    insideFunction: true,
  }), [])
  t.end()
})

test("`outsideFunctions` option", t => {
  t.deepEqual(styleSearchResults({
    source: "abc var(--cba)",
    target: "c",
    outsideFunctions: true,
  }), [2])
  t.deepEqual(styleSearchResults({
    source: "abc var(--cba)",
    target: "a",
    outsideFunctions: true,
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "abc \"a var(--cba)\"",
    target: "a",
    outsideFunctions: true,
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "translate(1px, calc(1px * 2))",
    target: "1",
    outsideFunctions: true,
  }), [])
  t.deepEqual(styleSearchResults({
    source: "var(--horse)",
    target: "v",
    outsideFunctions: true,
  }), [])
  t.end()
})

test("ignores matches within single-quote strings", t => {
  t.deepEqual(styleSearchResults({
    source: "abc 'abc'",
    target: "c",
  }), [2])
  t.deepEqual(styleSearchResults({
    source: "abc 'abc' cba",
    target: "c",
  }), [ 2, 10 ])
  t.end()
})

test("ignores matches within double-quote strings", t => {
  /* eslint-disable quotes */
  t.deepEqual(styleSearchResults({
    source: 'abc "abc"',
    target: "c",
  }), [2])
  t.deepEqual(styleSearchResults({
    source: 'abc "abc" cba',
    target: "c",
  }), [ 2, 10 ])
  t.end()
  /* eslint-enable quotes */
})

test("handles escaped double-quotes in double-quote strings", t => {
  /* eslint-disable quotes */
  t.deepEqual(styleSearchResults({
    source: 'abc "ab\\"c"',
    target: "c",
  }), [2])
  t.deepEqual(styleSearchResults({
    source: 'abc "a\\"bc" foo cba',
    target: "c",
  }), [ 2, 16 ])
  t.end()
  /* eslint-enable quotes */
})

test("handles escaped double-quotes in single-quote strings", t => {
  t.deepEqual(styleSearchResults({
    source: "abc 'ab\\'c'",
    target: "c",
  }), [2])
  t.deepEqual(styleSearchResults({
    source: "abc 'a\\'bc' foo cba",
    target: "c",
  }), [ 2, 16 ])
  t.end()
})

test("count", t => {
  let endCounts = []
  styleSearch({ source: "123 123 123", target: "1" }, (index, count) => {
    endCounts.push(count)
  })
  t.deepEqual(endCounts, [ 1, 2, 3 ])
  t.end()
})

function styleSearchResults(options) {
  const results = []
  styleSearch(options, i => results.push(i))
  return results
}
