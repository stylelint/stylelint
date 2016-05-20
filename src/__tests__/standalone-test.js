import standalone from "../standalone"
import test from "tape"
import path from "path"
import chalk from "chalk"
import stringFormatter from "../formatters/stringFormatter"
import configBlockNoEmpty from "./fixtures/config-block-no-empty"
import configExtendingOne from "./fixtures/config-extending-one"
import configExtendingAnotherExtend from "./fixtures/config-extending-another-extend"
import configExtendingThreeWithOverride from "./fixtures/config-extending-three-with-override"

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

test("standalone with extending configuration and configBasedir", t => {
  let planned = 0

  standalone({
    code: "a {}",
    config: configExtendingOne,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
  }).catch(logError)
  planned += 4

  // Recursive extending
  standalone({
    code: "a {}",
    config: configExtendingAnotherExtend,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
  }).catch(logError)
  planned += 4

  // Extending with overrides
  standalone({
    code: "a {}",
    config: configExtendingThreeWithOverride,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ results }) => {
    t.equal(results[0].warnings.length, 0)
  }).catch(logError)
  planned += 1

  t.plan(planned)
})

test("standalone with extending configuration and no configBasedir", t => {
  let planned = 0

  standalone({
    code: "a {}",
    config: configExtendingOne,
  }).catch(err => {
    t.equal(err.code, 78)
  })
  planned += 1

  t.plan(planned)
})

test("standalone with input css and alternate formatter specified by keyword", t => {
  let planned = 0

  standalone({ code: "a {}", config: configBlockNoEmpty, formatter: "string" }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("1:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with input css and alternate formatter function", t => {
  let planned = 0

  standalone({ code: "a {}", config: configBlockNoEmpty, formatter: stringFormatter }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("1:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with input css and quiet mode", t => {
  let planned = 0
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": [ true, { "severity": "warning" } ],
    },
  }

  standalone({ code: "a {}", config }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)
    t.deepEqual(parsedOutput[0].warnings, [])
  }).catch(logError)
  planned += 1

  t.plan(planned)
})

test("standalone with scss syntax", t => {
  let planned = 0
  const config = {
    rules: {
      "block-no-empty": true,
    },
  }

  standalone({
    config,
    code: "$foo: bar; // foo;\nb {}",
    syntax: "scss",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("2:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with sugarss syntax", t => {
  let planned = 0
  const config = {
    rules: {
      "number-zero-length-no-unit": true,
    },
  }

  standalone({
    config,
    code: ".one\n  color: black\n  top: 0px\n.two",
    syntax: "sugarss",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("3:9") !== -1)
    t.ok(strippedOutput.indexOf("number-zero-length-no-unit") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with Less syntax", t => {
  let planned = 0
  const config = {
    rules: {
      "block-no-empty": true,
    },
  }

  standalone({
    config,
    code: "@foo: bar; // foo;\nb {}",
    syntax: "less",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("2:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with extending config and ignoreFiles glob ignoring single glob", t => {
  standalone({
    files: [`${fixturesPath}/*.css`],
    config: {
      ignoreFiles: "**/invalid-hex.css",
      extends: [
        "./config-block-no-empty",
        "./config-color-no-invalid-hex",
      ],
    },
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)
    t.equal(parsedOutput.length, 2)
    t.ok(parsedOutput[0].source.indexOf("empty-block.css") !== -1)
    t.equal(parsedOutput[0].warnings.length, 1)
    t.ok(parsedOutput[1].source.indexOf("invalid-hex.css") !== -1)
    t.equal(parsedOutput[1].warnings.length, 1)
    t.equal(parsedOutput[1].warnings[0].severity, "info", "must be an information")
    t.equal(parsedOutput[1].warnings[0].text, "This file is ignored")
  }).catch(logError)
  t.plan(7)
})

test("standalone with absolute ignoreFiles glob path", t => {
  standalone({
    files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
    config: {
      ignoreFiles: [`${fixturesPath}/empty-b*.css`],
      rules: {
        "block-no-empty": true,
      },
    },
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)
    t.equal(parsedOutput.length, 2)
    t.equal(parsedOutput[0].warnings.length, 1)
    t.equal(parsedOutput[0].warnings[0].severity, "info", "must be an information")
    t.equal(parsedOutput[0].warnings[0].text, "This file is ignored")
    t.equal(parsedOutput[1].warnings.length, 0)
  }).catch(logError)
  t.plan(5)
})

test("standalone with extending config with ignoreFiles glob ignoring one by negation", t => {
  standalone({
    files: [`${fixturesPath}/*.css`],
    config: {
      ignoreFiles: [
        "**/*.css",
        "!**/invalid-hex.css",
      ],
      extends: [
        `${fixturesPath}/config-block-no-empty`,
        `${fixturesPath}/config-color-no-invalid-hex`,
      ],
    },
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)
    t.equal(parsedOutput.length, 2)
    t.ok(parsedOutput[0].source.indexOf("empty-block.css") !== -1)
    t.equal(parsedOutput[0].warnings.length, 1)
    t.equal(parsedOutput[0].warnings[0].severity, "info", "must be an information")
    t.equal(parsedOutput[0].warnings[0].text, "This file is ignored")
    t.ok(parsedOutput[1].source.indexOf("invalid-hex.css") !== -1)
    t.equal(parsedOutput[1].warnings.length, 1)
  }).catch(logError)
  t.plan(7)
})

test("standalone with .stylelintignore file ignoring one file", t => {
  standalone({
    files: [`${fixturesPath}/*.css`],
    config: {
      extends: [
        `${fixturesPath}/config-block-no-empty`,
        `${fixturesPath}/config-color-no-invalid-hex`,
      ],
    },
    configBasedir: path.join(__dirname, "fixtures/ignore_config"),
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)
    t.equal(parsedOutput.length, 2)
    t.ok(parsedOutput[0].source.indexOf("empty-block.css") !== -1)
    t.equal(parsedOutput[0].warnings.length, 1)
    t.equal(parsedOutput[0].warnings[0].severity, "info", "must be an information")
    t.equal(parsedOutput[0].warnings[0].text, "This file is ignored")
    t.ok(parsedOutput[1].source.indexOf("invalid-hex.css") !== -1,
      "violation is for block-no-empty, not color-no-invalid-hex")
    t.equal(parsedOutput[1].warnings.length, 1)
  }).catch(logError)
  t.plan(7)
})

test("standalone with specified `ignorePath` file ignoring one file", t => {
  standalone({
    files: [`${fixturesPath}/empty-block.css`],
    config: {
      rules: {
        "block-no-empty": true,
      },
    },
    ignorePath: path.join(__dirname, "fixtures/ignore_config/foo.txt"),
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)
    t.equal(parsedOutput[0].warnings.length, 1)
    t.equal(parsedOutput[0].warnings[0].text, "This file is ignored")
  }).catch(logError)
  t.plan(2)
})

test("standalone extending a config that ignores files", t => {
  let planned = 0
  standalone({
    files: [`${fixturesPath}/*.css`],
    config: {
      extends: [
        `${fixturesPath}/config-extending-and-ignoring`,
      ],
    },
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)
    t.equal(parsedOutput.length, 2)
    t.ok(parsedOutput[0].source.indexOf("empty-block.css") !== -1,
      "ignoreFiles in extended config has no effect")
    t.equal(parsedOutput[0].warnings.length, 1)
    t.ok(parsedOutput[1].source.indexOf("invalid-hex.css") !== -1)
    t.equal(parsedOutput[1].warnings.length, 0)
  }).catch(logError)
  planned += 5
  t.plan(planned)
})

test("standalone extending a config that is overridden", t => {
  standalone({
    code: "a { b: \"c\" }",
    config: {
      extends: [
        `${fixturesPath}/config-string-quotes-single`,
      ],
      rules: { "string-quotes": "double" },
    },
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)
    t.equal(parsedOutput[0].warnings.length, 0)
  }).catch(logError)
  t.plan(1)
})

test("standalone loading YAML with custom message", t => {
  standalone({
    code: "a { color: pink; }",
    configFile: path.join(__dirname, "fixtures/config-color-named-custom-message.yaml"),
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)[0]
    t.equal(parsedOutput.warnings.length, 1)
    t.equal(parsedOutput.warnings[0].text, "Unacceptable")
  }).catch(logError)

  t.plan(2)
})

test("standalone using codeFilename and ignoreFiles together", t => {
  standalone({
    code: "a {}",
    codeFilename: path.join(__dirname, "foo.css"),
    config: {
      ignoreFiles: ["**/foo.css"],
      rules: { "block-no-empty": true },
    },
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)[0]
    t.equal(parsedOutput.warnings.length, 1, "Must have one warning that is an information")
    t.equal(parsedOutput.warnings[0].severity, "info", "must be an information")
    t.equal(parsedOutput.warnings[0].text, "This file is ignored")
  }).catch(logError)

  t.plan(3)
})

test("standalone using codeFilename and ignoreFiles with configBasedir", t => {
  standalone({
    code: "a {}",
    codeFilename: path.join(__dirname, "foo.css"),
    config: {
      ignoreFiles: ["foo.css"],
      rules: { "block-no-empty": true },
    },
    configBasedir: __dirname,
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)[0]
    t.equal(parsedOutput.warnings.length, 1, "Must have one warning that is an information")
    t.equal(parsedOutput.warnings[0].severity, "info", "must be an information")
    t.equal(parsedOutput.warnings[0].text, "This file is ignored")
  }).catch(logError)

  t.plan(3)
})

test("standalone passing code with syntax error", t => {
  standalone({
    code: "a { color: 'red; }",
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)[0]
    t.equal(parsedOutput.source, "<input css 1>", "<input css 1> as source")
    t.equal(parsedOutput.deprecations.length, 0, "empty deprecations")
    t.equal(parsedOutput.invalidOptionWarnings.length, 0,
      "empty invalidOptionWarnings")
    t.ok(parsedOutput.errored)
    t.equal(parsedOutput.warnings.length, 1, "syntax error in warnings")
    t.equal(parsedOutput.warnings[0].rule, "CssSyntaxError",
      "syntax error rule is CssSyntaxError")
    t.equal(parsedOutput.warnings[0].severity, "error",
      "syntax error severity is error")
    t.ok(parsedOutput.warnings[0].text.indexOf(" (CssSyntaxError)" !== -1),
      "(CssSyntaxError) in warning text")
  }).catch(logError)

  t.plan(8)
})

test("standalone passing file with syntax error", t => {
  standalone({
    code: "a { color: 'red; }",
    codeFilename: path.join(__dirname, "syntax-error.css"),
  }).then(({ output }) => {
    const parsedOutput = JSON.parse(output)[0]
    t.ok(parsedOutput.source.indexOf("syntax-error.css") !== -1,
      "filename as source")
  }).catch(logError)

  t.plan(1)
})

test("syntax error sets errored to true", t => {
  standalone({
    code: "a { color: 'red; }",
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

test("standalone with style tag extraction from code string", t => {
  let planned = 0
  standalone({
    code: "<script>\n</script>\n\n<style>\na {}\n</style>",
    config: configExtendingOne,
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.equal(results[0].warnings[0].line, 5)
    t.equal(results[0].warnings[0].column, 3)
  }).catch(logError)
  planned += 6

  t.plan(planned)
})

test("standalone style tag extraction that has complex structure", t => {
  let planned = 0
  standalone({
    code: "<style>\na {}\n</style>\n\n<script>\n</script>\n\n<style>\n  a {}\n</style>",
    config: configExtendingOne,
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 2)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.equal(results[0].warnings[0].line, 2)
    t.equal(results[0].warnings[0].column, 3)
    t.equal(results[0].warnings[1].rule, "block-no-empty")
    t.equal(results[0].warnings[1].line, 9)
    t.equal(results[0].warnings[1].column, 5)
  }).catch(logError)
  planned += 9

  t.plan(planned)
})

test("standalone with style tag extraction from file", t => {
  let planned = 0

  standalone({
    files: [`${fixturesPath}/invalid-hex.html`],
    config: {
      "rules": {
        "color-no-invalid-hex": true,
      },
    },
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "color-no-invalid-hex")
    t.equal(results[0].warnings[0].line, 12)
    t.equal(results[0].warnings[0].column, 12)
  }).catch(logError)
  planned += 6

  t.plan(planned)
})

test("standalone with extraction accepts html with no style tag", t => {
  let planned = 0

  standalone({
    code: "<script>\n</script>",
    config: configExtendingOne,
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 0)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with extraction accepts plain css", t => {
  let planned = 0

  standalone({
    code: "a { }",
    config: configExtendingOne,
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.equal(results[0].warnings[0].line, 1)
    t.equal(results[0].warnings[0].column, 3)
  }).catch(logError)
  planned += 6

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
