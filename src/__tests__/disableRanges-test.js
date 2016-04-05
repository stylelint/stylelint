import test from "tape"
import { noop } from "lodash"
import postcss from "postcss"
import scss from "postcss-scss"
import less from "postcss-less"
import disableRanges from "../disableRanges"

test("disableRanges registers disable/enable commands without rules", t => {
  let planCount = 0

  testDisableRanges("a {}", result => {
    t.deepEqual(result.stylelint.disabledRanges, { all: [] })
  })
  planCount += 1

  testDisableRanges("/* stylelint-disable */\na {}", result => {
    t.deepEqual(result.stylelint.disabledRanges, {
      all: [{
        start: 1,
      }],
    })
  })
  planCount += 1

  testDisableRanges(
    "a {}\n" +
    "/* stylelint-disable */\n" +
    "b {}\n" +
    "/* stylelint-enable */\n" +
    ".foo {}",
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [
          { start: 2, end: 4 },
        ],
      })
    }
  )
  planCount += 1

  testDisableRanges(
    "a {}\n" +
    "/* stylelint-disable */\n" +
    "b {}\n" +
    "/* stylelint-enable */\n" +
    ".foo {}\n" +
    "/* stylelint-disable */\n" +
    "b {}\n" +
    "/* stylelint-enable */\n" +
    ".foo {}",
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [
          { start: 2, end: 4 },
          { start: 6, end: 8 },
        ],
      })
    }
  )
  planCount += 1

  t.plan(planCount)
})

test("disableRanges registers disable/enable commands with rules", t => {
  let planCount = 0

  testDisableRanges("/* stylelint-disable foo-bar */\na {}", result => {
    t.deepEqual(result.stylelint.disabledRanges, {
      all: [],
      "foo-bar": [{ start: 1 }],
    })
  })
  planCount += 1

  testDisableRanges(
    "a {}\n" +
    "/* stylelint-disable foo-bar */\n" +
    "b {}\n" +
    "/* stylelint-enable */\n" +
    ".foo {}\n" +
    "/* stylelint-disable foo-bar,baz-maz */\n" +
    "b {}\n" +
    "/* stylelint-enable */\n" +
    ".foo {}",
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [],
        "foo-bar": [
          { start: 2, end: 4 },
          { start: 6, end: 8 },
        ],
        "baz-maz": [
          { start: 6, end: 8 },
        ],
      })
    }
  )
  planCount += 1

  testDisableRanges(
    "/* stylelint-disable foo-bar, hoo-hah,\n\tslime */\n" +
    "b {}\n",
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [],
        "foo-bar": [{ start: 1 }],
        "hoo-hah": [{ start: 1 }],
        "slime": [{ start: 1 }],
      })
    }
  )
  planCount += 1

  testDisableRanges(
    "/* stylelint-disable selector-combinator-space-before */\n" +
    "a {}",
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [],
        "selector-combinator-space-before": [{ start: 1 }],
      })
    }
  )
  planCount += 1

  t.plan(planCount)
})

test("disableRanges disabling single lines", t => {
  let planCount = 0

  testDisableRanges("a {} /* stylelint-disable-line */", result => {
    t.deepEqual(result.stylelint.disabledRanges, {
      all: [{
        start: 1,
        end: 1,
      }],
    }, "disabling all rules")
  })
  planCount += 1

  testDisableRanges("a {} /* stylelint-disable-line block-no-empty */", result => {
    t.deepEqual(result.stylelint.disabledRanges, {
      all: [],
      "block-no-empty": [{
        start: 1,
        end: 1,
      }],
    }, "disabling a single rule")
  })
  planCount += 1

  testDisableRanges("b {}\n\na {} /* stylelint-disable-line block-no-empty, blergh */", result => {
    t.deepEqual(result.stylelint.disabledRanges, {
      all: [],
      "block-no-empty": [{
        start: 3,
        end: 3,
      }],
      "blergh": [{
        start: 3,
        end: 3,
      }],
    }, "disabling multiple specific rules")
  })
  planCount += 1

  t.plan(planCount)
})

test("SCSS // line-disabling comment", t => {
  let planCount = 0

  const scssSource = `a {
    color: pink !important; // stylelint-disable-line declaration-no-important
  }`
  postcss().use(disableRanges).process(scssSource, { syntax: scss }).then(result => {
    t.deepEqual(result.stylelint.disabledRanges, {
      all: [],
      "declaration-no-important": [{
        start: 2,
        end: 2,
      }],
    })
  }).catch(logError)
  planCount += 1

  t.plan(planCount)
})

test("Less // line-disabling comment", t => {
  let planCount = 0

  const lessSource = `a {
    color: pink !important; // stylelint-disable-line declaration-no-important
  }`
  postcss().use(disableRanges).process(lessSource, { syntax: less }).then(result => {
    t.deepEqual(result.stylelint.disabledRanges, {
      all: [],
      "declaration-no-important": [{
        start: 2,
        end: 2,
      }],
    })
  }).catch(logError)
  planCount += 1

  t.plan(planCount)
})

test("Nesting disabledRanges", t => {
  let planCount = 0

  testDisableRanges(
    `/* stylelint-disable foo */
    /* stylelint-disable bar */
    /* stylelint-disable baz, hop */
    /* stylelint-enable bar */
    /* stylelint-enable foo, hop */
    /* stylelint-enable baz */`,
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [],
        foo: [{ start: 1, end: 5 }],
        bar: [{ start: 2, end: 4 }],
        baz: [{ start: 3, end: 6 }],
        hop: [{ start: 3, end: 5 }],
      })
    }
  )
  planCount += 1

  testDisableRanges(
    `/* stylelint-disable */
    /* stylelint-enable bar */
    /* stylelint-disable bar */
    /* stylelint-enable */`,
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [{ start: 1, end: 4 }],
        bar: [
          { start: 1, end: 2 },
          { start: 3, end: 4 },
        ],
      })
    }
  )
  planCount += 1

  testDisableRanges(
    `/* stylelint-disable foo */
    /* stylelint-disable bar, baz */
    /* stylelint-enable */`,
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [],
        foo: [{ start: 1, end: 3 }],
        bar: [{ start: 2, end: 3 }],
        baz: [{ start: 2, end: 3 }],
      })
    }
  )
  planCount += 1

  testDisableRanges(
    `/* stylelint-disable */
    /* stylelint-enable foo */
    /* stylelint-enable */
    /* stylelint-disable bar */`,
    result => {
      t.deepEqual(result.stylelint.disabledRanges, {
        all: [{ start: 1, end: 3 }],
        foo: [{ start: 1, end: 2 }],
        bar: [
          { start: 1, end: 3 },
          { start: 4 },
        ],
      })
    }
  )
  planCount += 1

  t.plan(planCount)
})

test("disabledRanges errors", t => {
  let planCount = 0

  testDisableRanges(
    `/* stylelint-disable */
    a {} /* stylelint-disable-line */`,
    noop,
    err => {
      t.equal(err.reason, "All rules have already been disabled")
    }
  )
  planCount += 1

  testDisableRanges(
    `/* stylelint-disable */
    a {} /* stylelint-disable-line foo */`,
    noop,
    err => {
      t.equal(err.reason, "All rules have already been disabled")
    }
  )
  planCount += 1

  testDisableRanges(
    `/* stylelint-disable foo */
    a {} /* stylelint-disable-line foo */`,
    noop,
    err => {
      t.equal(err.reason, "\"foo\" has already been disabled")
    }
  )
  planCount += 1

  testDisableRanges("/* stylelint-disable */ /* stylelint-disable */", noop, err => {
    t.equal(err.reason, "All rules have already been disabled")
  })
  planCount += 1

  testDisableRanges("/* stylelint-disable foo */ /* stylelint-disable foo*/", noop, err => {
    t.equal(err.reason, "\"foo\" has already been disabled")
  })
  planCount += 1

  testDisableRanges("/* stylelint-enable */", noop, err => {
    t.equal(err.reason, "No rules have been disabled")
  })
  planCount += 1

  testDisableRanges("/* stylelint-enable foo */", noop, err => {
    t.equal(err.reason, "\"foo\" has not been disabled")
  })
  planCount += 1

  t.plan(planCount)
})

function testDisableRanges(source, cb, errorHandler = logError) {
  postcss()
    .use(disableRanges)
    .process(source)
    .then(cb)
    .catch(errorHandler)
}

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
