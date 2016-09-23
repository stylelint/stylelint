import configBlockNoEmpty from "./fixtures/config-block-no-empty"
import path from "path"
import ruleDefinitions from "../rules"
import sinon from "sinon"
import standalone from "../standalone"
import test from "tape"

const fixturesPath = path.join(__dirname, "fixtures")

test("standalone with input file(s)", t => {
  let planned = 0

  standalone({
    files: `${fixturesPath}/empty-block.css`,
    // Path to config file
    configFile: path.join(__dirname, "fixtures/config-block-no-empty.json"),
  }).then(({ output, results }) => {
    t.ok(output.indexOf("block-no-empty") !== -1)
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
  }).catch(logError)
  planned += 4

  const twoCsses = [ `${fixturesPath}/e*y-block.*`, `${fixturesPath}/invalid-h*.css` ]
  standalone({
    files: twoCsses,
    config: {
      rules: { "block-no-empty": true, "color-no-invalid-hex": true },
    },
  }).then(({ output, results }) => {
    t.ok(output.indexOf("block-no-empty") !== -1)
    t.ok(output.indexOf("color-no-invalid-hex") !== -1)
    t.equal(results.length, 2)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[1].warnings.length, 1)
    // Ordering of the files is non-deterministic, I believe
    if (results[0].source.indexOf("empty-block") !== -1) {
      t.equal(results[0].warnings[0].rule, "block-no-empty")
      t.equal(results[1].warnings[0].rule, "color-no-invalid-hex")
    } else {
      t.equal(results[1].warnings[0].rule, "block-no-empty")
      t.equal(results[0].warnings[0].rule, "color-no-invalid-hex")
    }
  }).catch(logError)
  planned += 7

  t.plan(planned)
})

test("standalone with input css", t => {
  let planned = 0

  standalone({ code: "a {}", config: configBlockNoEmpty }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("standalone without input css and file(s) should throw error", t => {
  t.throws(
    () => standalone({ config: configBlockNoEmpty }),
    new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  )
  t.end()
})

test("standalone with non-existent-file should throw error with code 80", t => {
  let planned = 0

  const expectedError = new Error("Files glob patterns specified did not match any files")
  expectedError.code = 80

  standalone({
    files: `${fixturesPath}/non-existent-file.css`,
    config: configBlockNoEmpty,
  }).catch((actualError) => {
    t.deepEqual(actualError, expectedError)
  })
  planned += 1

  t.plan(planned)
})

test("standalone passing code with syntax error", t => {
  standalone({
    code: "a { color: 'red; }",
    config: { rules: { "block-no-empty": true } },
  }).then(({ results }) => {
    const result = results[0]
    t.equal(result.source, "<input css 1>", "<input css 1> as source")
    t.equal(result.deprecations.length, 0, "empty deprecations")
    t.equal(result.invalidOptionWarnings.length, 0,
      "empty invalidOptionWarnings")
    t.ok(result.errored)
    t.equal(result.warnings.length, 1, "syntax error in warnings")
    t.equal(result.warnings[0].rule, "CssSyntaxError",
      "syntax error rule is CssSyntaxError")
    t.equal(result.warnings[0].severity, "error",
      "syntax error severity is error")
    t.ok(result.warnings[0].text.indexOf(" (CssSyntaxError)" !== -1),
      "(CssSyntaxError) in warning text")
  }).catch(logError)

  t.plan(8)
})

test("standalone passing file with syntax error", t => {
  standalone({
    code: "a { color: 'red; }",
    codeFilename: path.join(__dirname, "syntax-error.css"),
    config: { rules: { "block-no-empty": true } },
  }).then(({ results }) => {
    t.ok(results[0].source.indexOf("syntax-error.css") !== -1,
      "filename as source")
  }).catch(logError)

  t.plan(1)
})

test("syntax error sets errored to true", t => {
  standalone({
    code: "a { color: 'red; }",
    config: { rules: { "block-no-empty": true } },
  }).then(({ errored }) => {
    t.ok(errored, "errored is true")
  }).catch(logError)

  t.plan(1)
})

test("configuration error sets errored to true", t => {
  standalone({
    code: "a { color: 'red'; }",
    config: { rules: { "block-no-empty": "wahoo" } },
  }).then(({ errored }) => {
    t.ok(errored, "errored is true")
  }).catch(logError)

  t.plan(1)
})

test("unknown syntax option", t => {
  standalone({
    syntax: "unknown",
    code: "",
    config: { rules: { "block-no-empty": "wahoo" } },
  }).then()
    .catch(err => {
      t.equal(err.message, "You must use a valid syntax option, either: scss, less or sugarss")
    })

  t.plan(1)
})

test("unknown formatter option", t => {
  standalone({
    formatter: "unknown",
    code: "",
    config: { rules: { "block-no-empty": "wahoo" } },
  }).then()
    .catch(err => {
      t.equal(err.message, "You must use a valid formatter option, either: json, string or verbose")
    })

  t.plan(1)
})

test("standalone with deprecations", t => {
  let planned = 0

  sinon.stub(ruleDefinitions, "block-no-empty", () => {
    return (root, result) => {
      result.warn(("Some deprecation"), {
        stylelintType: "deprecation",
      })
    }
  })

  standalone({ code: "a {}", config: configBlockNoEmpty }).then(({ output, results }) => {
    t.ok(output.indexOf("Some deprecation") !== -1)
    t.equal(results.length, 1)
    t.equal(results[0].deprecations.length, 1)
    t.equal(results[0].deprecations[0].text, "Some deprecation")
    ruleDefinitions["block-no-empty"].restore()
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
