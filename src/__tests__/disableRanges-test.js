import test from "tape"
import postcss from "postcss"
import scss from "postcss-scss"
import disableRanges from "../disableRanges"

test("disableRanges registers disable/enable commands without rules", t => {
  t.plan(4)

  testDisableRanges("a {}", result => {
    t.deepEqual(result.stylelint.disabledRanges, [])
  })

  testDisableRanges("/* stylelint-disable */\na {}", result => {
    t.deepEqual(result.stylelint.disabledRanges, [
      { start: 1 },
    ])
  })

  testDisableRanges(
    "a {}\n" +
    "/* stylelint-disable */\n" +
    "b {}\n" +
    "/* stylelint-enable */\n" +
    ".foo {}",
    result => {
      t.deepEqual(result.stylelint.disabledRanges, [
        { start: 2, end: 4 },
      ])
    }
  )

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
      t.deepEqual(result.stylelint.disabledRanges, [
        { start: 2, end: 4 },
        { start: 6, end: 8 },
      ])
    }
  )
})

test("disableRanges registers disable/enable commands with rules", t => {
  let planCount = 0

  testDisableRanges("/* stylelint-disable foo-bar */\na {}", result => {
    t.deepEqual(result.stylelint.disabledRanges, [
      { start: 1, rules: ["foo-bar"] },
    ])
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
      t.deepEqual(result.stylelint.disabledRanges, [
        { start: 2, end: 4, rules: ["foo-bar"] },
        { start: 6, end: 8, rules: [ "foo-bar", "baz-maz" ] },
      ])
    }
  )
  planCount += 1

  testDisableRanges(
    "/* stylelint-disable foo-bar, hoo-hah,\n\tslime */\n" +
    "b {}\n",
    result => {
      t.deepEqual(result.stylelint.disabledRanges, [
        { start: 1, rules: [ "foo-bar", "hoo-hah", "slime" ] },
      ])
    }
  )
  planCount += 1

  testDisableRanges(
    "/* stylelint-disable selector-combinator-space-before */\n" +
    "a {}",
    result => {
      t.deepEqual(result.stylelint.disabledRanges, [
        { start: 1, rules: ["selector-combinator-space-before"] },
      ])
    }
  )
  planCount += 1

  t.plan(planCount)
})

test("disableRanges disabling single lines", t => {
  let planCount = 0

  testDisableRanges("a {} /* stylelint-disable-line */", result => {
    t.deepEqual(result.stylelint.disabledRanges, [{
      start: 1,
      end: 1,
    }], "disabling all rules")
  })
  planCount += 1

  testDisableRanges("a {} /* stylelint-disable-line block-no-empty */", result => {
    t.deepEqual(result.stylelint.disabledRanges, [{
      start: 1,
      end: 1,
      rules: ["block-no-empty"],
    }], "disabling a single rule")
  })
  planCount += 1

  testDisableRanges("b {}\n\na {} /* stylelint-disable-line block-no-empty, blergh */", result => {
    t.deepEqual(result.stylelint.disabledRanges, [{
      start: 3,
      end: 3,
      rules: [ "block-no-empty", "blergh" ],
    }], "disabling multiple specific rules")
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
    t.deepEqual(result.stylelint.disabledRanges, [{
      start: 2,
      end: 2,
      rules: ["declaration-no-important"],
    }])
  }).catch(logError)
  planCount += 1

  t.plan(planCount)
})

function testDisableRanges(source, cb) {
  postcss()
    .use(disableRanges)
    .process(source)
    .then(cb)
    .catch(logError)
}

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
