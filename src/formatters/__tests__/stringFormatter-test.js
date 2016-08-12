import chalk from "chalk"
import stringFormatter from "../stringFormatter"
import { stripIndent } from "common-tags"
import test from "tape"

const symbolConversions = new Map()
symbolConversions.set("ℹ", "i")
symbolConversions.set("✔", "√")
symbolConversions.set("⚠", "‼")
symbolConversions.set("✖", "×")

test("no warnings", t => {

  const results = [{
    "source":  "path/to/file.css",
    "errored": false,
    "warnings": [],
    "deprecations": [],
    "invalidOptionWarnings":[],
  }]

  const output = stringFormatter(results)

  t.equal(output, "")
  t.end()
})

test("returning no unicode", t => {
  const results = [{
    "source":  "path/to/file.css",
    "errored": true,
    "warnings":[ {
      "line": 1,
      "column": 2,
      "rule": "bar",
      "severity": "error",
      "text": "Unexpected foo",
    }, {
      "line": 3,
      "column": 3,
      "rule": "foo",
      "severity": "warning",
      "text": "Missing unit for foobar",
    } ],
    "deprecations": [],
    "invalidOptionWarnings":[],
  }]

  const output = prepareFormatterOutput(results, stringFormatter, { noUnicode: true })

  t.equal(output, stripIndent`
    path/to/file.css
     1:2  error    Unexpected foo           bar
     3:3  warning  Missing unit for foobar  foo
  `)
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
    "warnings":[],
    "deprecations": [],
    "invalidOptionWarnings": [],
    "ignored": true,
  }]

  const output = prepareFormatterOutput(results, stringFormatter)

  t.equal(output, "")
  t.end()
})

export function prepareFormatterOutput(results, formatter, opts = {}) {

  let output = chalk.stripColor(formatter(results, opts)).trim()

  for (const [ nix, win ] of symbolConversions.entries()) {
    output = output.replace(new RegExp(nix, "g"), win)
  }

  return output
}
