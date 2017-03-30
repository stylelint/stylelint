"use strict"

const _ = require("lodash")
const path = require("path")
const standalone = require("../standalone")

const fixturesPath = path.join(__dirname, "fixtures")

describe("extending config and ignoreFiles glob ignoring single glob", () => {
  let results

  beforeEach(() => {
    return standalone({
      files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
      config: {
        ignoreFiles: "**/invalid-hex.css",
        extends: [ "./config-block-no-empty", "./config-color-no-invalid-hex" ],
      },
      configBasedir: path.join(__dirname, "fixtures"),
    }).then(data => results = data.results)
  })

  it("two files found", () => {
    expect(results.length).toBe(2)
  })

  it("empty-block.css found", () => {
    expect(results[0].source.indexOf("empty-block.css")).not.toBe(-1)
  })

  it("empty-block.css linted", () => {
    expect(results[0].warnings.length).toBe(1)
  })

  it("invalid-hex.css found", () => {
    expect(results[1].source.indexOf("invalid-hex.css")).not.toBe(-1)
  })

  it("invalid-hex.css not linted", () => {
    expect(results[1].warnings.length).toBe(0)
  })

  it("invalid-hex.css marked as ignored", () => {
    expect(results[1].ignored).toBeTruthy()
  })

  it("invalid-hex.css not parsed by standalone", () => {
    expect(_.get(results[1], [ "_postcssResult", "standaloneIgnored" ])).toBeTruthy()
  })
})

describe("same as above with no configBasedir, ignore-files path relative to process.cwd", () => {
  let actualCwd
  let results

  beforeAll(() => {
    actualCwd = process.cwd()
    process.chdir(__dirname)
  })

  afterAll(() => {
    process.chdir(actualCwd)
  })

  beforeEach(() => {
    return standalone({
      files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
      config: {
        ignoreFiles: "fixtures/invalid-hex.css",
        extends: [ `${fixturesPath}/config-block-no-empty.json`, `${fixturesPath}/config-color-no-invalid-hex` ],
      },
    }).then(data => results = data.results)
  })

  it("two files found", () => {
    expect(results.length).toBe(2)
  })

  it("empty-block.css found", () => {
    expect(results[0].source.indexOf("empty-block.css")).not.toBe(-1)
  })

  it("empty-block.css linted", () => {
    expect(results[0].warnings.length).toBe(1)
  })

  it("invalid-hex.css found", () => {
    expect(results[1].source.indexOf("invalid-hex.css")).not.toBe(-1)
  })

  it("invalid-hex.css not linted", () => {
    expect(results[1].warnings.length).toBe(0)
  })

  it("invalid-hex.css marked as ignored", () => {
    expect(results[1].ignored).toBeTruthy()
  })

  it("invalid-hex.css not parsed by standalone", () => {
    expect(_.get(results[1], [ "_postcssResult", "standaloneIgnored" ])).toBeTruthy()
  })
})

describe("absolute ignoreFiles glob path", () => {
  let results

  beforeEach(() => {
    return standalone({
      files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
      config: {
        ignoreFiles: [`${fixturesPath}/empty-b*.css`],
        rules: {
          "block-no-empty": true,
        },
      },
      configBasedir: path.join(__dirname, "fixtures"),
    }).then(data => results = data.results)
  })

  it("two files found", () => {
    expect(results.length).toBe(2)
  })

  it("first not linted", () => {
    expect(results[0].warnings.length).toBe(0)
  })

  it("first marked as ignored", () => {
    expect(results[0].ignored).toBeTruthy()
  })

  it("first not parsed by standalone", () => {
    expect(_.get(results[0], [ "_postcssResult", "standaloneIgnored" ])).toBeTruthy()
  })

  it("second has no warnings", () => {
    expect(results[1].warnings.length).toBe(0)
  })

  it("second not marked as ignored", () => {
    expect(results[1].ignored).toBeFalsy()
  })

  it("second parsed by standalone", () => {
    expect(_.get(results[1], [ "_postcssResult", "standaloneIgnored" ])).toBeFalsy()
  })
})

describe("extending config with ignoreFiles glob ignoring one by negation", () => {
  let results

  beforeEach(() => {
    return standalone({
      files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
      config: {
        ignoreFiles: [ "**/*.css", "!**/invalid-hex.css" ],
        extends: [ `${fixturesPath}/config-block-no-empty`, `${fixturesPath}/config-color-no-invalid-hex` ],
      },
      configBasedir: path.join(__dirname, "fixtures"),
    }).then(data => results = data.results)
  })

  it("two files found", () => {
    expect(results.length).toBe(2)
  })

  it("empty-block.css found", () => {
    expect(results[0].source.indexOf("empty-block.css")).not.toBe(-1)
  })

  it("empty-block.css has no warnings", () => {
    expect(results[0].warnings.length).toBe(0)
  })

  it("empty-block.css was ignored", () => {
    expect(results[0].ignored).toBeTruthy()
  })

  it("empty-block.css was standaloneIgnored", () => {
    expect(_.get(results[0], [ "_postcssResult", "standaloneIgnored" ])).toBeTruthy()
  })

  it("invalid-hex.css found", () => {
    expect(results[1].source.indexOf("invalid-hex.css")).not.toBe(-1)
  })

  it("invalid-hex.css has warnings", () => {
    expect(results[1].warnings.length).toBe(1)
  })

  it("invalid-hex.css was not ignored", () => {
    expect(results[1].ignored).toBeFalsy()
  })

  it("invalid-hex.css was not standaloneIgnored", () => {
    expect(_.get(results[1], [ "_postcssResult", "standaloneIgnored" ])).toBeFalsy()
  })
})

describe("specified `ignorePath` file ignoring one file", () => {
  let results
  let actualCwd

  beforeAll(() => {
    actualCwd = process.cwd()
    process.chdir(__dirname)
  })

  afterAll(() => {
    process.chdir(actualCwd)
  })

  beforeEach(() => {
    return standalone({
      files: [`${fixturesPath}/empty-block.css`],
      config: {
        rules: {
          "block-no-empty": true,
        },
      },
      ignorePath: path.join(__dirname, "fixtures/ignore.txt"),
    }).then(data => results = data.results)
  })

  it("no warnings registered", () => {
    expect(results[0].warnings.length).toBe(0)
  })
  it("marked as ignored", () => {
    expect(results[0].ignored).toBeTruthy()
  })
  it("not parsed by standalone", () => {
    expect(_.get(results[0], [ "_postcssResult", "standaloneIgnored" ])).toBeTruthy()
  })
})

describe("using ignoreFiles with input files that would cause a postcss syntax error", () => {
  let results

  beforeEach(() => {
    return standalone({
      files: [`${fixturesPath}/standaloneNoParsing/*`],
      config: {
        ignoreFiles: ["**/*.scss"],
        rules: {
          "block-no-empty": true,
        },
      },
    }).then(data => results = data.results)
  })

  it("two files found", () => {
    expect(results.length).toBe(2)
  })

  it("no-syntax-error.css found", () => {
    expect(results[0].source.indexOf("no-syntax-error.css")).not.toBe(-1)
  })

  it("no-syntax-error.css linted", () => {
    expect(results[0].warnings.length).toBe(0)
  })

  it("syntax-error-ignored.scss found", () => {
    expect(results[1].source.indexOf("syntax-error-ignored.scss")).not.toBe(-1)
  })

  it("syntax-error-ignored.scss not linted", () => {
    expect(results[1].warnings.length).toBe(0)
  })

  it("syntax-error-ignored.scss marked as ignored", () => {
    expect(results[1].ignored).toBeTruthy()
  })

  it("syntax-error-ignored.scss not parsed by standalone", () => {
    expect(_.get(results[1], [ "_postcssResult", "standaloneIgnored" ])).toBeTruthy()
  })
})

describe("extending a config that ignores files", () => {
  let results

  beforeEach(() => {
    return standalone({
      files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
      config: {
        extends: [`${fixturesPath}/config-extending-and-ignoring`],
      },
      configBasedir: path.join(__dirname, "fixtures"),
    }).then(data => results = data.results)
  })

  it("found correct files", () => {
    expect(results.length).toBe(2)
  })

  it("empty-block.css found", () => {
    expect(results[0].source.indexOf("empty-block.css")).not.toBe(-1)
  })

  it("empty-block.css linted", () => {
    expect(results[0].warnings.length).toBe(1)
  })

  it("invalid-hex.css found", () => {
    expect(results[1].source.indexOf("invalid-hex.css")).not.toBe(-1)
  })

  it("invalid-hex.css not linted", () => {
    expect(results[1].warnings.length).toBe(0)
  })
})

describe("using codeFilename and ignoreFiles together", () => {
  let results

  beforeEach(() => {
    return standalone({
      code: "a {}",
      codeFilename: path.join(__dirname, "foo.css"),
      config: {
        ignoreFiles: ["**/foo.css"],
        rules: { "block-no-empty": true },
      },
    }).then(data => results = data.results)
  })

  it("no warnings", () => {
    expect(results[0].warnings.length).toBe(0)
  })

  it("ignored", () => {
    expect(results[0].ignored).toBeTruthy()
  })

  it("standaloneIgnored", () => {
    expect(_.get(results[0], [ "_postcssResult", "standaloneIgnored" ])).toBeTruthy()
  })
})

describe("using codeFilename and ignoreFiles with configBasedir", () => {
  let results

  beforeEach(() => {
    return standalone({
      code: "a {}",
      codeFilename: path.join(__dirname, "foo.css"),
      config: {
        ignoreFiles: ["foo.css"],
        rules: { "block-no-empty": true },
      },
      configBasedir: __dirname,
    }).then(data => results = data.results)
  })

  it("no warnings", () => {
    expect(results[0].warnings.length).toBe(0)
  })

  it("ignored", () => {
    expect(results[0].ignored).toBeTruthy()
  })

  it("standaloneIgnored", () => {
    expect(_.get(results[0], [ "_postcssResult", "standaloneIgnored" ])).toBeTruthy()
  })
})

describe("file in node_modules", () => {
  const lint = () => standalone({
    code: "a {}",
    codeFilename: "/something/node_modules/path/to/something.css",
    config: {
      rules: {
        "block-no-empty": true,
      },
    },
  })

  it("is ignored", () => {
    return lint().then((output) => {
      expect(output.results[0].warnings.length).toBe(0)
      expect(output.results[0].ignored).toBeTruthy()
    })
  })
})

describe("file in bower_components", () => {
  const lint = () => standalone({
    code: "a {}",
    codeFilename: "/something/bower_components/path/to/something.css",
    config: {
      rules: {
        "block-no-empty": true,
      },
    },
  })

  it("is ignored", () => {
    return lint().then((output) => {
      expect(output.results[0].warnings.length).toBe(0)
      expect(output.results[0].ignored).toBeTruthy()
    })
  })
})

describe("file in node_modules, ignore is overridden by user", () => {
  const lint = () => standalone({
    code: "a {}",
    codeFilename: "/something/node_modules/path/to/something.css",
    config: {
      ignoreFiles: ["foo.css"],
      rules: {
        "block-no-empty": true,
      },
    },
  })

  it("is not ignored", () => {
    return lint().then((output) => {
      expect(output.results[0].warnings.length).toBe(1)
      expect(output.results[0].ignored).toBeFalsy()
    })
  })
})

describe("file in bower_components, ignore is overridden by user", () => {
  const lint = () => standalone({
    code: "a {}",
    codeFilename: "/something/bower_components/path/to/something.css",
    config: {
      ignoreFiles: ["foo.css"],
      rules: {
        "block-no-empty": true,
      },
    },
  })

  it("is not ignored", () => {
    return lint().then((output) => {
      expect(output.results[0].warnings.length).toBe(1)
      expect(output.results[0].ignored).toBeFalsy()
    })
  })
})
