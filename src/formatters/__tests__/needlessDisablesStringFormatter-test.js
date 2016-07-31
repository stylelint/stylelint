import chalk from "chalk"
import needlessDisablesStringFormatter from "../needlessDisablesStringFormatter"
import { stripIndent } from "common-tags"
import test from "tape"

test("needlessDisables formatter stringified", t => {
  const actual = chalk.stripColor(needlessDisablesStringFormatter([
    {
      source: "foo",
      ranges: [
        { start: 1, end: 3 },
        { start: 7 },
      ],
    },
    {
      source: "bar",
      ranges: [
        { start: 19, end: 33 },
        { start: 99, end: 102 },
      ],
    },
  ]))

  let expected = stripIndent`
    foo
    start: 1, end: 3
    start: 7

    bar
    start: 19, end: 33
    start: 99, end: 102`
  expected = `\n${expected}\n`

  t.equal(actual, expected)
  t.end()
})
