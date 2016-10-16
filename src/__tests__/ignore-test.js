import path from "path"
import standalone from "../standalone"
import test from "tape"

const fixturesPath = path.join(__dirname, "fixtures")

test("standalone with extending config and ignoreFiles glob ignoring single glob", t => {
  standalone({
    files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
    config: {
      ignoreFiles: "**/invalid-hex.css",
      extends: [
        "./config-block-no-empty",
        "./config-color-no-invalid-hex",
      ],
    },
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ results }) => {
    t.equal(results.length, 2, "two files found")
    t.ok(results[0].source.indexOf("empty-block.css") !== -1, "empty-block.css found")
    t.equal(results[0].warnings.length, 1, "empty-block.css linted")
    t.ok(results[1].source.indexOf("invalid-hex.css") !== -1, "invalid-hex.css found")
    t.equal(results[1].warnings.length, 0, "invalid-hex.css not linted")
    t.ok(results[1].ignored, "invalid-hex.css marked as ignored")
    t.ok(results[1]._postcssResult.standaloneIgnored, "invalid-hex.css not parsed by standalone")
    t.end()
  }).catch(t.end)
})

test("same as above with no configBasedir, ignore-files path relative to process.cwd", t => {
  const actualCwd = process.cwd()
  process.chdir(__dirname)
  standalone({
    files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
    config: {
      ignoreFiles: "fixtures/invalid-hex.css",
      extends: [
        `${fixturesPath}/config-block-no-empty.json`,
        `${fixturesPath}/config-color-no-invalid-hex`,
      ],
    },
  }).then(({ results }) => {
    t.equal(results.length, 2, "two files found")
    t.ok(results[0].source.indexOf("empty-block.css") !== -1, "empty-block.css found")
    t.equal(results[0].warnings.length, 1, "empty-block.css linted")
    t.ok(results[1].source.indexOf("invalid-hex.css") !== -1, "invalid-hex.css found")
    t.equal(results[1].warnings.length, 0, "invalid-hex.css not linted")
    t.ok(results[1].ignored, "invalid-hex.css marked as ignored")
    t.ok(results[1]._postcssResult.standaloneIgnored, "invalid-hex.css not parsed by standalone")

    process.chdir(actualCwd)
    t.end()
  }).catch((err) => {
    process.chdir(actualCwd)
    t.end(err)
  })
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
    t.equal(results.length, 2, "two files found")
    t.equal(results[0].warnings.length, 0, "first not linted")
    t.ok(results[0].ignored, "first marked as ignored")
    t.ok(results[0]._postcssResult.standaloneIgnored, "first not parsed by standalone")
    t.equal(results[1].warnings.length, 0, "second has no warnings")
    t.notOk(results[1].ignored, "second not marked as ignored")
    t.notOk(results[1]._postcssResult.standaloneIgnored, "second parsed by standalone")
    t.end()
  }).catch(t.end)
})

test("standalone with extending config with ignoreFiles glob ignoring one by negation", t => {
  standalone({
    files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
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
    t.equal(results.length, 2)
    t.ok(results[0].source.indexOf("empty-block.css") !== -1)
    t.equal(results[0].warnings.length, 0)
    t.ok(results[0].ignored)
    t.ok(results[0]._postcssResult.standaloneIgnored)
    t.ok(results[1].source.indexOf("invalid-hex.css") !== -1)
    t.equal(results[1].warnings.length, 1)
    t.notOk(results[1].ignored)
    t.notOk(results[1]._postcssResult.standaloneIgnored)
    t.end()
  }).catch(t.end)
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
    t.equal(results[0].warnings.length, 0, "no warnings registered")
    t.ok(results[0].ignored, "marked as ignored")
    t.ok(results[0]._postcssResult.standaloneIgnored, "not parsed by standalone")
    t.end()
  }).catch(t.end)
})

test("standalone using ignoreFiles with input files that would cause a postcss syntax error", t => {
  standalone({
    files: [`${fixturesPath}/standaloneNoParsing/*`],
    config: {
      ignoreFiles: ["**/*.scss"],
      rules: {
        "block-no-empty": true,
      },
    },
  }).then(({ results }) => {
    t.equal(results.length, 2, "two files found")
    t.ok(results[0].source.indexOf("no-syntax-error.css") !== -1, "no-syntax-error.css found")
    t.equal(results[0].warnings.length, 0, "no-syntax-error.css linted")
    t.ok(results[1].source.indexOf("syntax-error-ignored.scss") !== -1, "syntax-error-ignored.scss found")
    t.equal(results[1].warnings.length, 0, "syntax-error-ignored.scss not linted")
    t.ok(results[1].ignored, "syntax-error-ignored.scss marked as ignored")
    t.ok(results[1]._postcssResult.standaloneIgnored, "syntax-error-ignored.scss not parsed by standalone")
    t.end()
  }).catch(t.end)
})

test("standalone extending a config that ignores files", t => {
  standalone({
    files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
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
    t.end()
  }).catch(t.end)
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
    t.equal(results[0].warnings.length, 0)
    t.ok(results[0].ignored)
    t.ok(results[0]._postcssResult.standaloneIgnored)
    t.end()
  }).catch(t.end)
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
    t.equal(results[0].warnings.length, 0)
    t.ok(results[0].ignored)
    t.ok(results[0]._postcssResult.standaloneIgnored)
    t.end()
  }).catch(t.end)
})
