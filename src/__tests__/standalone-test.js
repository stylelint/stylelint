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
  standalone({ code: "a {}", config: configBlockNoEmpty }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.end()
  }).catch(t.end)
})

test("standalone without input css and file(s) should throw error", t => {
  t.throws(
    () => standalone({ config: configBlockNoEmpty }),
    new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  )
  t.end()
})

test("standalone with non-existent-file should throw error with code 80", t => {
  const expectedError = new Error("Files glob patterns specified did not match any files")
  expectedError.code = 80

  standalone({
    files: `${fixturesPath}/non-existent-file.css`,
    config: configBlockNoEmpty,
  })
    .then(() => {
      t.fail("should not have succeeded")
      t.end()
    })
    .catch((actualError) => {
      t.deepEqual(actualError, expectedError)
      t.end()
    })
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
    t.end()
  }).catch(t.end)
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
    t.end()
  }).catch(t.end)
})

test("configuration error sets errored to true", t => {
  standalone({
    code: "a { color: 'red'; }",
    config: { rules: { "block-no-empty": "wahoo" } },
  }).then(({ errored }) => {
    t.ok(errored, "errored is true")
    t.end()
  }).catch(t.end)
})

test("unknown syntax option", t => {
  standalone({
    syntax: "unknown",
    code: "",
    config: { rules: { "block-no-empty": "wahoo" } },
  })
    .then(() => {
      t.fail("should not have succeeded")
      t.end()
    })
    .catch(err => {
      t.equal(err.message, "You must use a valid syntax option, either: scss, less or sugarss")
      t.end()
    })
})

test("unknown formatter option", t => {
  standalone({
    formatter: "unknown",
    code: "",
    config: { rules: { "block-no-empty": "wahoo" } },
  })
    .then(() => {
      t.fail("should not have succeeded")
      t.end()
    })
    .catch(err => {
      t.equal(err.message, "You must use a valid formatter option, either: json, string or verbose")
      t.end()
    })
})

test("standalone with deprecations", t => {
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
    t.end()
  }).catch(t.end)
})

test("standalone with different configs per file", t => {
  standalone({
    files: [path.join(__dirname, "./fixtures/config-per-file/**/*.css")],
  }).then(({ results }) => {
    const resultA = results.find((result) => result.source.indexOf("a.css") !== -1)
    const resultB = results.find((result) => result.source.indexOf("b.css") !== -1)
    const resultC = results.find((result) => result.source.indexOf("c.css") !== -1)
    const resultD = results.find((result) => result.source.indexOf("d.css") !== -1)
    t.equal(resultA.warnings.length, 0, "no warnings for A")
    t.equal(resultB.warnings.length, 1, "one warning for B")
    t.ok(resultB.warnings[0].text.indexOf("Unexpected empty block") !== -1, "correct warning for B")
    t.equal(resultC.warnings.length, 0, "no warnings for C")
    t.equal(resultD.warnings.length, 0, "no warnings for D")
    t.end()
  }).catch(t.end)
})

test("standalone with config locatable from process.cwd not file", t => {
  const actualCwd = process.cwd()
  process.chdir(path.join(__dirname, "./fixtures/getConfigForFile/a/b"))
  standalone({
    files: [path.join(__dirname, "./fixtures/empty-block.css")],
  }).then(({ results }) => {
    const result = results[0]
    t.equal(result.warnings.length, 2, "two warning")
    t.ok(result.warnings[0].text.indexOf("Unexpected empty block") !== -1, "first correct warning")
    t.ok(result.warnings[1].text.indexOf("foo") !== -1, "second correct warning")

    process.chdir(actualCwd)
    t.end()
  }).catch((err) => {
    process.chdir(actualCwd)
    t.end(err)
  })
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
