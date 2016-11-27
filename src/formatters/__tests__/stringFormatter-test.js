const _slicedToArray = function () { function sliceIterator(arr, i) { const _arr = []; let _n = true; let _d = false; let _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break } } catch (err) { _d = true; _e = err } finally { try { if (!_n && _i["return"]) _i["return"]() } finally { if (_d) throw _e } } return _arr } return function (arr, i) { if (Array.isArray(arr)) { return arr } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i) } else { throw new TypeError("Invalid attempt to destructure non-iterable instance") } } }()

const chalk = require("chalk")
const stringFormatter = require("../stringFormatter")
import { stripIndent } from "common-tags"
const test = require("tape")

const symbolConversions = new Map()
symbolConversions.set("ℹ", "i")
symbolConversions.set("✔", "√")
symbolConversions.set("⚠", "‼")
symbolConversions.set("✖", "×")

test("no warnings", t => {
  const results = [{
    "source": "path/to/file.css",
    "errored": false,
    "warnings": [],
    "deprecations": [],
    "invalidOptionWarnings": [],
  }]

  const output = stringFormatter(results)

  t.equal(output, "")

  t.end()
})

test("warnings", t => {
  const results = [{
    "source": "path/to/file.css",
    "errored": true,
    "warnings": [{
      "line": 1,
      "column": 1,
      "rule": "bar",
      "severity": "error",
      "text": "Unexpected foo",
    }],
    "deprecations": [],
    "invalidOptionWarnings": [],
  }]

  const output = prepareFormatterOutput(results, stringFormatter)

  t.equal(output, stripIndent`
    path/to/file.css
     1:1  ×  Unexpected foo  bar
  `)

  t.end()
})

test("warnings without stdout `TTY`", t => {
  const oldTTY = process.stdout.isTTY
  process.stdout.isTTY = false

  const results = [{
    "source": "path/to/file.css",
    "errored": true,
    "warnings": [{
      "line": 1,
      "column": 1,
      "rule": "bar",
      "severity": "error",
      "text": "Unexpected foo",
    }],
    "deprecations": [],
    "invalidOptionWarnings": [],
  }]

  const output = prepareFormatterOutput(results, stringFormatter)

  t.equal(output, stripIndent`
    path/to/file.css
     1:1  ×  Unexpected foo  bar`)

  process.stdout.isTTY = oldTTY

  t.end()
})

test("warnings with more than 80 characters and `process.stdout.columns` equal 90 characters", t => {
  const oldTTY = process.stdout.isTTY
  const stdoutColumn = process.stdout.columns
  // For Windows tests
  process.stdout.isTTY = true
  process.stdout.columns = 90

  const results = [{
    "source": "path/to/file.css",
    "errored": true,
    "warnings": [{
      "line": 1,
      "column": 1,
      "rule": "bar-very-very-very-very-very-long",
      "severity": "error",
      "text": "Unexpected very very very very very very very very very very very very very long foo",
    }],
    "deprecations": [],
    "invalidOptionWarnings": [],
  }]

  const output = prepareFormatterOutput(results, stringFormatter)

  t.equal(output, stripIndent`
      path/to/file.css
       1:1  ×  Unexpected very very very very very very very  bar-very-very-very-very-very-long
               very very very very very very long foo
    `)

  process.stdout.isTTY = oldTTY
  process.stdout.columns = stdoutColumn

  t.end()
})

test("condensing of deprecations and invalid option warnings", t => {
  const results = [ {
    "source": "file.css",
    "deprecations": [{
      "text": "Deprecated foo",
      "reference": "bar",
    }],
    "invalidOptionWarnings": [{
      "text": "Unexpected option for baz",
    }],
    "errored": true,
    "warnings": [],
  }, {
    "source": "file2.css",
    "deprecations": [{
      "text": "Deprecated foo",
      "reference": "bar",
    }],
    "invalidOptionWarnings": [{
      "text": "Unexpected option for baz",
    }],
    "errored": true,
    "warnings": [],
  } ]

  const output = prepareFormatterOutput(results, stringFormatter)

  t.equal(output, stripIndent`
    Invalid Option: Unexpected option for baz

    Deprecation Warning: Deprecated foo See: bar
  `)

  t.end()
})

test("one ignored file", t => {
  const results = [{
    "source": "file.css",
    "warnings": [],
    "deprecations": [],
    "invalidOptionWarnings": [],
    "ignored": true,
  }]

  const output = prepareFormatterOutput(results, stringFormatter)

  t.equal(output, "")
  t.end()
})

export function prepareFormatterOutput(results, formatter) {
  let output = chalk.stripColor(formatter(results)).trim()

  for (const _ref of symbolConversions.entries()) {
    const _ref2 = _slicedToArray(_ref, 2)

    const nix = _ref2[0]
    const win = _ref2[1]

    output = output.replace(new RegExp(nix, "g"), win)
  }

  return output
}
