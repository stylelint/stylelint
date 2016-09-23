import needlessDisables from "../needlessDisables"
import path from "path"
import standalone from "../standalone"
import { stripIndent } from "common-tags"
import test from "tape"

function fixture(name) {
  return path.join(__dirname, "./fixtures/needlessDisables", name)
}

test("needlessDisables simple case", t => {
  const config = {
    rules: { "block-no-empty": true },
  }

  const css = stripIndent`
    /* stylelint-disable */
    a {}
    /* stylelint-enable */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    /* stylelint-disable */
    a { color: pink; }
    /* stylelint-enable */
    a {
      b { color: pink; } /* stylelint-disable-line block-no-empty */
    }
    `

  standalone({
    config,
    code: css,
    ignoreDisables: true,
  }).then(({ results }) => {
    const report = needlessDisables(results)
    t.equal(report.length, 1)
    t.deepEqual(report[0].ranges, [
      { start: 7, end: 9 },
      { start: 11, end: 11 },
    ])
    t.end()
  }).catch(t.end)
})

test("needlessDisables complex case", t => {
  const config = {
    rules: {
      "block-no-empty": true,
      "color-named": "never",
    },
  }

  standalone({
    config,
    files: [
      fixture("disabled-ranges-1.css"),
      fixture("disabled-ranges-2.css"),
      // ignore files contain `CssSyntaxError`
      fixture("disabled-ranges-3.css"),
    ],
    ignoreDisables: true,
  }).then(({ results }) => {
    t.deepEqual(needlessDisables(results), [
      {
        source: fixture("disabled-ranges-1.css"),
        ranges: [
          { start: 1, end: 3 },
          { start: 5, end: 7 },
          { start: 10, end: 10 },
        ],
      },
      {
        source: fixture("disabled-ranges-2.css"),
        ranges: [
          { start: 5, end: 5 },
          { start: 6, end: 6 },
          { start: 8 },
        ],
      },
    ])
    t.end()
  }).catch(t.end)
})

test("needlessDisables ignored case", t => {
  const config = {
    rules: {
      "block-no-empty": true,
    },
  }

  standalone({
    config,
    files: [
      fixture("disabled-ranges-1.css"),
      fixture("ignored-file.css"),
    ],
    ignoreDisables: true,
    ignorePath: fixture(".stylelintignore"),
  }).then(({ results }) => {
    t.deepEqual(needlessDisables(results), [
      {
        source: fixture("disabled-ranges-1.css"),
        ranges: [
          { start: 1, end: 3 },
          { start: 5, end: 7 },
          { start: 10, end: 10 },
        ],
      },
    ])
    t.end()
  }).catch(t.end)
})
