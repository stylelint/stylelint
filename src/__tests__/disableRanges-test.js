import test from "tape"
import postcss from "postcss"
import disableRanges from "../disableRanges"

test("disableRanges registers disable/enable commands without rules", t => {
  t.plan(4)

  testDisableRanges("a {}", result => {
    t.deepEqual(result.disabledRanges, [])
  })

  testDisableRanges("/* stylelint-disable */\na {}", result => {
    t.deepEqual(result.disabledRanges, [
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
      t.deepEqual(result.disabledRanges, [
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
      t.deepEqual(result.disabledRanges, [
        { start: 2, end: 4 },
        { start: 6, end: 8 },
      ])
    }
  )
})

test("disableRanges registers disable/enable commands with rules", t => {
  let planCount = 0

  testDisableRanges("/* stylelint-disable foo-bar */\na {}", result => {
    t.deepEqual(result.disabledRanges, [
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
      t.deepEqual(result.disabledRanges, [
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
      t.deepEqual(result.disabledRanges, [
        { start: 1, rules: [ "foo-bar", "hoo-hah", "slime" ] },
      ])
    }
  )
  planCount += 1

  testDisableRanges(
    "/* stylelint-disable selector-combinator-space-before */\n" +
    "a {}",
    result => {
      t.deepEqual(result.disabledRanges, [
        { start: 1, rules: ["selector-combinator-space-before"] },
      ])
    }
  )
  planCount += 1

  t.plan(planCount)
})

function testDisableRanges(source, cb) {
  postcss()
    .use(disableRanges)
    .process(source)
    .then(cb)
    .catch(err => { throw err })
}
