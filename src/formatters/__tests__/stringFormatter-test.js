import { stripIndent } from "common-tags"
import chalk from "chalk"
import test from "tape"
import stringFormatter from "../stringFormatter"

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

export function prepareFormatterOutput(results, formatter) {

  let output = chalk.stripColor(formatter(results)).trim()

  for (const [ nix, win ] of symbolConversions.entries()) {
    output = output.replace(new RegExp(nix, "g"), win)
  }

  return output
}
