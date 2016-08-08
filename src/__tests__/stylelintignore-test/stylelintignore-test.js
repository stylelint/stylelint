// IMPORTANT: This test will only work when the tests are run
// **from this directory**. The automatic discovery of `.stylelintignore`
// files only happens at `process.cwd()`.
import path from "path"
import standalone from "../../standalone"
import test from "tape"

test("standalone with .stylelintignore file ignoring one file", t => {
  const fixturesPath = path.join(__dirname, "../fixtures")
  const existingCwd = process.cwd()
  process.chdir(__dirname)
  standalone({
    files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
    config: {
      extends: [
        `${fixturesPath}/config-block-no-empty`,
        `${fixturesPath}/config-color-no-invalid-hex`,
      ],
    },
  }).then(({ results }) => {
    t.equal(results.length, 2, "two files found")
    t.ok(results[0].source.indexOf("empty-block.css") !== -1, "empty-block.css found")
    t.equal(results[0].warnings.length, 0, "empty-block.css not linted")
    t.ok(results[0].ignored, "empty-block.css marked as ignored")
    t.ok(results[0]._postcssResult.standaloneIgnored, "empty-block.css not parsed by standalone")
    t.ok(results[1].source.indexOf("invalid-hex.css") !== -1, "color-no-invalid-hex.css found")
    t.equal(results[1].warnings.length, 1, "color-no-invalid-hex.css linted")
    t.notOk(results[1].ignored, "color-no-invalid-hex.css not marked as ignored")
    t.notOk(results[1]._postcssResult.standaloneIgnored, "color-no-invalid-hex.css parsed by standalone")

    process.chdir(existingCwd)
    t.end()
  }).catch(err => console.error(err.stack)) // eslint-disable-line
})
