import path from "path"
import standalone from "../standalone"
import test from "tape"

const fixturesPath = path.join(__dirname, "fixtures")

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
  }).then(({ results }) => {
    t.equal(results.length, 1, "one file found")
    t.ok(results[0].source.indexOf("empty-block.css") !== -1, "empty-block.css found")
    t.equal(results[0].warnings.length, 1, "empty-block.css linted")
    t.end()
  }).catch(logError)
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
  }).then(({ results }) => {
    t.equal(results.length, 1, "one file found")
    t.equal(results[0].warnings.length, 0, "no warnings")
    t.notOk(results[0].ignored, "not marked as ignored")
    t.end()
  }).catch(logError)
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
  }).then(({ results }) => {
    t.equal(results.length, 1)
    t.ok(results[0].source.indexOf("invalid-hex.css") !== -1)
    t.equal(results[0].warnings.length, 1)
    t.notOk(results[0].ignored)
    t.end()
  }).catch(logError)
})

test("standalone with specified `ignorePath` file ignoring one file", t => {
  standalone({
    files: [`${fixturesPath}/empty-block.css`],
    config: {
      rules: {
        "block-no-empty": true,
      },
    },
    ignorePath: path.join(__dirname, "fixtures/ignore.txt"),
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ results }) => {
    t.equal(results.length, 0, "no files found")
    t.end()
  }).catch(logError)
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
  }).then(({ results }) => {
    t.equal(results.length, 2)
    t.ok(results[0].source.indexOf("empty-block.css") !== -1,
      "ignoreFiles in extended config has no effect")
    t.equal(results[0].warnings.length, 1)
    t.ok(results[1].source.indexOf("invalid-hex.css") !== -1)
    t.equal(results[1].warnings.length, 0)
  }).catch(logError)
  planned += 5
  t.plan(planned)
})

test("standalone using codeFilename and ignoreFiles together", t => {
  standalone({
    code: "a {}",
    codeFilename: path.join(__dirname, "foo.css"),
    config: {
      ignoreFiles: ["**/foo.css"],
      rules: { "block-no-empty": true },
    },
  }).then(({ results }) => {
    t.equal(results.length, 0)
  }).catch(logError)

  t.plan(1)
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
  }).then(({ results }) => {
    t.equal(results.length, 0)
  }).catch(logError)

  t.plan(1)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
