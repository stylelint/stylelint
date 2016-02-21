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

test("`withinFunctionalNotation` option", t => {
  t.deepEqual(styleSearchResults({
    source: "abc var(--cba)",
    target: "c",
    withinFunctionalNotation: true,
  }), [10])
  t.deepEqual(styleSearchResults({
    source: "abc var(--cba)",
    target: "a",
    withinFunctionalNotation: true,
  }), [12])
  t.deepEqual(styleSearchResults({
    source: "abc \"var(--cba)\"",
    target: "a",
    withinFunctionalNotation: true,
  }), [])
  t.deepEqual(styleSearchResults({
    source: "translate(1px, calc(1px * 2))",
    target: "1",
    withinFunctionalNotation: true,
  }), [ 10, 20 ])
  t.deepEqual(styleSearchResults({
    source: "abc \"var(--cba)\"",
    target: "a",
    withinFunctionalNotation: false,
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "var(--horse)",
    target: "v",
    withinFunctionalNotation: true,
  }), [])
  t.end()
})

test("`outsideFunctionalNotation` option", t => {
  t.deepEqual(styleSearchResults({
    source: "abc var(--cba)",
    target: "c",
    outsideFunctionalNotation: true,
  }), [2])
  t.deepEqual(styleSearchResults({
    source: "abc var(--cba)",
    target: "a",
    outsideFunctionalNotation: true,
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "abc \"a var(--cba)\"",
    target: "a",
    outsideFunctionalNotation: true,
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "translate(1px, calc(1px * 2))",
    target: "1",
    outsideFunctionalNotation: true,
  }), [])
  t.deepEqual(styleSearchResults({
    source: "var(--horse)",
    target: "v",
    outsideFunctionalNotation: true,
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

test("`checkStrings` option", t => {
  t.deepEqual(styleSearchResults({
    source: "abc 'abc'",
    target: "b",
    checkStrings: true,
  }), [ 1, 6 ])
  t.end()
})

test("`withinStrings` option", t => {
  /* eslint-disable quotes */
  t.deepEqual(styleSearchResults({
    source: 'abc "abc"',
    target: "b",
    withinStrings: true,
  }), [6])
  /* eslint-enable quotes */
  t.end()
})

test("ignores matches within comments", t => {
  t.deepEqual(styleSearchResults({
    source: "abc/*comment*/",
    target: "m",
  }), [])
  t.deepEqual(styleSearchResults({
    source: "abc/*command*/",
    target: "a",
  }), [0])
  t.end()
})

test("`checkComments` option", t => {
  t.deepEqual(styleSearchResults({
    source: "abc/*abc*/",
    target: "b",
    checkComments: true,
  }), [ 1, 6 ])
  t.end()
})

test("`withinComments` option", t => {
  t.deepEqual(styleSearchResults({
    source: "abc/*abc*/",
    target: "b",
    withinComments: true,
  }), [6])
  t.end()
})

test("ignores matches within single-line comment", t => {
  t.deepEqual(styleSearchResults({
    source: "abc // comment",
    target: "m",
  }), [])
  t.deepEqual(styleSearchResults({
    source: "abc // command",
    target: "a",
  }), [0])
  t.end()
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

test("finds parentheses", t => {
  t.deepEqual(styleSearchResults({
    source: "a { color: rgb(0,0,0); }",
    target: "(",
  }), [14])
  t.deepEqual(styleSearchResults({
    source: "a { color: rgb(0,0,0); }",
    target: ")",
  }), [20])
  t.end()
})

test("finds function names on demand only", t => {
  t.deepEqual(styleSearchResults({
    source: "a { color: rgb(0,0,0); }",
    target: "rgb",
  }), [])
  t.deepEqual(styleSearchResults({
    source: "a { color: rgb(0,0,0); }",
    target: "rgb",
    checkFunctionNames: true,
  }), [11])
  t.end()
})

test("non-single-character target", t => {
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: "abc",
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: "cb",
  }), [4])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: "c c",
  }), [2])
  t.deepEqual(styleSearchResults({
    source: "abc cba abc",
    target: "abc",
  }), [ 0, 8 ])
  t.deepEqual(styleSearchResults({
    source: "abc cba 'abc'",
    target: "abc",
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "abc cb",
    target: "aa",
  }), [])
  t.end()
})

test("array target", t => {
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: [ "a", "b" ],
  }), [ 0, 1, 5, 6 ])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: [ "c", "b" ],
  }), [ 1, 2, 4, 5 ])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: [ "bc", "a" ],
  }), [ 0, 1, 6 ])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: [ "abc", "f" ],
  }), [0])
  t.deepEqual(styleSearchResults({
    source: "abc cba",
    target: [ 0, 1, 2 ],
  }), [])
  t.end()
})

test("match object", t => {
  styleSearch({ source: "abc", target: "bc" }, match => {
    t.equal(match.startIndex, 1)
    t.equal(match.endIndex, 3)
    t.equal(match.target, "bc")
    t.equal(match.insideFunction, false)
    t.equal(match.insideComment, false)
  })

  const twoMatches = []
  styleSearch({ source: "abc bca", target: [ "bc ", "ca" ] }, match => {
    twoMatches.push(match)
  })
  const firstMatch = twoMatches[0]
  const secondMatch = twoMatches[1]
  t.equal(firstMatch.startIndex, 1)
  t.equal(firstMatch.endIndex, 4)
  t.equal(firstMatch.target, "bc ")
  t.equal(firstMatch.insideFunction, false)
  t.equal(firstMatch.insideComment, false)
  t.equal(secondMatch.startIndex, 5)
  t.equal(secondMatch.endIndex, 7)
  t.equal(secondMatch.target, "ca")
  t.equal(secondMatch.insideFunction, false)
  t.equal(secondMatch.insideComment, false)

  t.test("match within a function", st => {
    styleSearch({ source: "a { color: rgb(0, 0, 1); }", target: "1" }, match => {
      st.equal(match.insideFunction, true)
      st.equal(match.insideComment, false)
      st.end()
    })
  })

  t.test("match within a comment", st => {
    styleSearch({ source: "a { color: /* 1 */ pink; }", target: "1", checkComments: true }, match => {
      st.equal(match.insideFunction, false)
      st.equal(match.insideComment, true)
      st.end()
    })
  })

  t.test("match within a block comment", st => {
    styleSearch({ source: "a { color:\n/**\n * 0\n * 1\n */\npink; }", target: "1", checkComments: true }, match => {
      st.equal(match.insideFunction, false)
      st.equal(match.insideComment, true)
      st.end()
    })
  })

  t.test("match within a comment within function", st => {
    styleSearch({ source: "a { color: rgb(0, 0, 0 /* 1 */); }", target: "1", checkComments: true }, match => {
      st.equal(match.insideFunction, true)
      st.equal(match.insideComment, true)
      st.end()
    })
  })

  t.end()
})

function styleSearchResults(options) {
  const results = []
  styleSearch(options, match => results.push(match.startIndex))
  return results
}
