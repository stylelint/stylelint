const needlessDisables = require("../needlessDisables")
const path = require("path")
const standalone = require("../standalone")
const stripIndent = require("common-tags").stripIndent

function fixture(name) {
  return path.join(__dirname, "./fixtures/needlessDisables", name)
}

it("needlessDisables simple case", () => {
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

  return standalone({
    config,
    code: css,
    ignoreDisables: true,
  }).then((_ref) => {
    const results = _ref.results

    const report = needlessDisables(results)
    expect(report.length).toBe(1)
    expect(report[0].ranges).toEqual([ { start: 7, end: 9 }, { start: 11, end: 11 } ])
  })
})

it("needlessDisables complex case", () => {
  const config = {
    rules: {
      "block-no-empty": true,
      "color-named": "never",
    },
  }

  return standalone({
    config,
    files: [ fixture("disabled-ranges-1.css"), fixture("disabled-ranges-2.css"),
    // ignore files contain `CssSyntaxError`
      fixture("disabled-ranges-3.css") ],
    ignoreDisables: true,
  }).then((_ref2) => {
    const results = _ref2.results

    expect(needlessDisables(results)).toEqual([ {
      source: fixture("disabled-ranges-1.css"),
      ranges: [ { start: 1, end: 3 }, { start: 5, end: 7 }, { start: 10, end: 10 } ],
    }, {
      source: fixture("disabled-ranges-2.css"),
      ranges: [ { start: 5, end: 5 }, { start: 6, end: 6 }, { start: 8 } ],
    } ])
  })
})

it("needlessDisables ignored case", () => {
  const config = {
    rules: {
      "block-no-empty": true,
    },
  }

  return standalone({
    config,
    files: [ fixture("disabled-ranges-1.css"), fixture("ignored-file.css") ],
    ignoreDisables: true,
    ignorePath: fixture(".stylelintignore"),
  }).then((_ref3) => {
    const results = _ref3.results

    expect(needlessDisables(results)).toEqual([{
      source: fixture("disabled-ranges-1.css"),
      ranges: [ { start: 1, end: 3 }, { start: 5, end: 7 }, { start: 10, end: 10 } ],
    }])
  })
})
