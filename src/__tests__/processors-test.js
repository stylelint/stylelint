import standalone from "../standalone"
import test from "tape"
import path from "path"
import configHtmlProcessor from "./fixtures/config-html-processor"

const fixturesPath = path.join(__dirname, "./fixtures")

test("standalone with HTML style tag extraction from code string", t => {
  let planned = 0
  standalone({
    code: "<script>\n</script>\n\n<style>\na {}\n</style>",
    config: configHtmlProcessor,
    configBasedir: fixturesPath,
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

test("standalone HTML style tag extraction that has complex structure", t => {
  let planned = 0
  standalone({
    code: "<style>\na {}\n</style>\n\n<script>\n</script>\n\n<style>\n  a {}\n</style>",
    config: configHtmlProcessor,
    configBasedir: fixturesPath,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 2)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.equal(results[0].warnings[0].line, 2)
    t.equal(results[0].warnings[0].column, 3)
    t.equal(results[0].warnings[1].rule, "block-no-empty")
    t.equal(results[0].warnings[1].line, 9)
    t.equal(results[0].warnings[1].column, 3)
  }).catch(logError)
  planned += 9

  t.plan(planned)
})

test("standalone with HTMLstyle tag extraction from file", t => {
  let planned = 0

  standalone({
    files: [`${fixturesPath}/invalid-hex.html`],
    config: {
      // Try a processors array
      processors: ["./processor-html"],
      rules: {
        "color-no-invalid-hex": true,
      },
    },
    configBasedir: fixturesPath,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "color-no-invalid-hex")
    t.equal(results[0].warnings[0].line, 12)
    t.equal(results[0].warnings[0].column, 10)
  }).catch(logError)
  planned += 6

  t.plan(planned)
})

test("standalone with HTMLextraction accepts HTML with no style tag", t => {
  let planned = 0

  standalone({
    code: "<script>\n</script>",
    config: configHtmlProcessor,
    configBasedir: fixturesPath,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 0)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with HTML extraction accepts plain CSS", t => {
  let planned = 0

  standalone({
    code: "a { }",
    config: configHtmlProcessor,
    configBasedir: fixturesPath,
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
