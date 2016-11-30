"use strict"

const stringFormatter = require("../stringFormatter")
const stripIndent = require("common-tags").stripIndent
const test = require("tape")
const prepareFormatterOutput = require("./prepareFormatterOutput")

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
