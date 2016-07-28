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
    files: [`${fixturesPath}/*.css`],
    config: {
      extends: [
        `${fixturesPath}/config-block-no-empty`,
        `${fixturesPath}/config-color-no-invalid-hex`,
      ],
    },
  }).then(({ results }) => {
    t.equal(results.length, 1, "one file found")
    t.ok(results[0].source.indexOf("invalid-hex.css") !== -1, "color-no-invalid-hex.css found")
    t.equal(results[0].warnings.length, 1, "color-no-invalid-hex.css linted")
    t.notOk(results[0].ignored, "color-no-invalid-hex.css not marked as ignored")

    process.chdir(existingCwd)
    t.end()
  }).catch(err => console.error(err.stack)) // eslint-disable-line
})
