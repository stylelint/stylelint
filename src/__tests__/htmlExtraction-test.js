import standalone from "../standalone"
import test from "tape"
import path from "path"
import configExtendingOne from "./fixtures/config-extending-one"

const fixturesPath = path.join(__dirname, "fixtures")

const codeA = `<script>
</script>

<style>
a {}
</style>`

test("standalone with style tag extraction from code string", t => {
  let planned = 0
  standalone({
    code: codeA,
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

const codeB = `<style>
a {}
</style>

<script>
</script>

<style>
  a {}
</style>`

test("standalone style tag extraction that has complex structure", t => {
  let planned = 0
  standalone({
    code: codeB,
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

const codeC = `<style
  id="foo"
>
a {}
</style>`

test("standalone with style tag extraction when style opening tag is multiline", t => {
  let planned = 0
  standalone({
    code: codeC,
    config: configExtendingOne,
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.equal(results[0].warnings[0].line, 4)
    t.equal(results[0].warnings[0].column, 3)
  }).catch(logError)
  planned += 6

  t.plan(planned)
})

const codeD = `<style>b { color: pink; }</style>
<style>a {}</style>`

test("standalone with style tag extraction when style tag opens and closes on one line", t => {
  let planned = 0
  standalone({
    code: codeD,
    config: configExtendingOne,
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.equal(results[0].warnings[0].line, 2)
    t.equal(results[0].warnings[0].column, 10)
  }).catch(logError)
  planned += 6

  t.plan(planned)
})

const codeE = `<style
  id="horse"
  class="cow">a {}
</style>`

test("standalone with style tag extraction when style oepningn tag is multi-line, but content does not start with newline", t => {
  let planned = 0
  standalone({
    code: codeE,
    config: configExtendingOne,
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.equal(results[0].warnings[0].line, 3)
    t.equal(results[0].warnings[0].column, 15)
  }).catch(logError)
  planned += 6

  t.plan(planned)
})

const codeF = "<style></style><style>a {}</style>"

test("standalone with style tag extraction when multiple style tags share a line", t => {
  let planned = 0
  standalone({
    code: codeF,
    config: configExtendingOne,
    configBasedir: fixturesPath,
    extractStyleTagsFromHtml: true,
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
    t.equal(results[0].warnings[0].line, 1)
    t.equal(results[0].warnings[0].column, 25)
  }).catch(logError)
  planned += 6

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
