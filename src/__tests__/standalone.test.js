import configBlockNoEmpty from "./fixtures/config-block-no-empty"
import path from "path"
import ruleDefinitions from "../rules"
import sinon from "sinon"
import standalone from "../standalone"

const fixturesPath = path.join(__dirname, "fixtures")

describe("standalone with one input file", () => {
  let output, results

  beforeEach(() => {
    return standalone({
      files: `${fixturesPath}/empty-block.css`,
      // Path to config file
      configFile: path.join(__dirname, "fixtures/config-block-no-empty.json"),
    }).then(data => {
      output = data.output
      results = data.results
    })
  })

  it("triggers warning", () => {
    expect(output.indexOf("block-no-empty")).not.toBe(-1)
    expect(results.length).toBe(1)
    expect(results[0].warnings.length).toBe(1)
    expect(results[0].warnings[0].rule).toBe("block-no-empty")
  })
})

describe("standalone with two file-specific globs", () => {
  const twoCsses = [ `${fixturesPath}/e*y-block.*`, `${fixturesPath}/invalid-h*.css` ]

  let output, results

  beforeEach(() => {
    return standalone({
      files: twoCsses,
      config: {
        rules: { "block-no-empty": true, "color-no-invalid-hex": true },
      },
    }).then(data => {
      output = data.output
      results = data.results
    })
  })

  it("triggers warnings", () => {
    expect(output.indexOf("block-no-empty")).not.toBe(-1)
    expect(output.indexOf("color-no-invalid-hex")).not.toBe(-1)
    expect(results.length).toBe(2)
    expect(results[0].warnings.length).toBe(1)
    expect(results[1].warnings.length).toBe(1)
    // Ordering of the files is non-deterministic, I believe
    if (results[0].source.indexOf("empty-block") !== -1) {
      expect(results[0].warnings[0].rule).toBe("block-no-empty")
      expect(results[1].warnings[0].rule).toBe("color-no-invalid-hex")
    } else {
      expect(results[1].warnings[0].rule).toBe("block-no-empty")
      expect(results[0].warnings[0].rule).toBe("color-no-invalid-hex")
    }
  })
})

it("standalone with input css", () => {
  return standalone({ code: "a {}", config: configBlockNoEmpty }).then(({ output, results }) => {
    expect(typeof output).toBe("string")
    expect(results.length).toBe(1)
    expect(results[0].warnings.length).toBe(1)
    expect(results[0].warnings[0].rule).toBe("block-no-empty")
  })
})

it("standalone without input css and file(s) should throw error", () => {
  const expectedError = new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  expect(() => standalone({ config: configBlockNoEmpty })).toThrow(expectedError)
})

it("standalone with non-existent-file should throw error with code 80", () => {
  const expectedError = new Error("Files glob patterns specified did not match any files")
  expectedError.code = 80

  return standalone({
    files: `${fixturesPath}/non-existent-file.css`,
    config: configBlockNoEmpty,
  }).then(() => {
    throw new Error("should not have succeeded")
  }).catch((actualError) => {
    expect(actualError).toEqual(expectedError)
  })
})

describe("standalone passing code with syntax error", () => {
  let results

  beforeEach(() => {
    return standalone({
      code: "a { color: 'red; }",
      config: { rules: { "block-no-empty": true } },
    }).then(data => results = data.results)
  })

  it("<input css 1> as source", () => {
    expect(results[0].source).toBe("<input css 1>")
  })

  it("empty deprecations", () => {
    expect(results[0].deprecations.length).toBe(0)
  })

  it("empty invalidOptionWarnings", () => {
    expect(results[0].invalidOptionWarnings.length).toBe(0)
  })

  it("error registered", () => {
    expect(results[0].errored).toBeTruthy()
  })

  it("syntax error rule is CssSyntaxError", () => {
    expect(results[0].warnings.length).toBe(1)
    expect(results[0].warnings[0].rule, "CssSyntaxError")
  })

  it("syntax error severity is error", () => {
    expect(results[0].warnings[0].severity, "error")
  })

  it("(CssSyntaxError) in warning text", () => {
    expect(results[0].warnings[0].text.indexOf(" (CssSyntaxError)")).not.toBe(-1)
  })
})

it("standalone passing file with syntax error", () => {
  return standalone({
    code: "a { color: 'red; }",
    codeFilename: path.join(__dirname, "syntax-error.css"),
    config: { rules: { "block-no-empty": true } },
  }).then(({ results }) => {
    expect(results[0].source.indexOf("syntax-error.css")).not.toBe(-1)
  })
})

it("syntax error sets errored to true", () => {
  return standalone({
    code: "a { color: 'red; }",
    config: { rules: { "block-no-empty": true } },
  }).then(({ errored }) => {
    expect(errored).toBe(true)
  })
})

describe("configuration error sets errored to true", () => {
  return standalone({
    code: "a { color: 'red'; }",
    config: { rules: { "block-no-empty": "wahoo" } },
  }).then(({ errored }) => {
    expect(errored).toBe(true)
  })
})

it("unknown syntax option", () => {
  return standalone({
    syntax: "unknown",
    code: "",
    config: { rules: { "block-no-empty": "wahoo" } },
  }).then(() => {
    throw new Error("should not have succeeded")
  }).catch(err => {
    expect(err.message).toBe("You must use a valid syntax option, either: scss, less or sugarss")
  })
})

it("unknown custom syntax option", () => {
  return standalone({
    customSyntax: "unknown-module",
    code: "",
    config: { rules: { "block-no-empty": "wahoo" } },
  }).then(() => {
    throw new Error("should not have succeeded")
  }).catch(err => {
    expect(err.message).toBe("Cannot resolve custom syntax module unknown-module")
  })
})

it("unknown formatter option", () => {
  return standalone({
    formatter: "unknown",
    code: "",
    config: { rules: { "block-no-empty": "wahoo" } },
  }).then(() => {
    throw new Error("should not have succeeded")
  }).catch(err => {
    expect(err.message.indexOf("You must use a valid formatter option")).toBe(0)
  })
})

describe("standalone with deprecations", () => {
  let ruleDefinitionsStub, results, output

  beforeEach(() => {
    ruleDefinitionsStub = sinon.stub(ruleDefinitions, "block-no-empty", () => {
      return (root, result) => {
        result.warn(("Some deprecation"), {
          stylelintType: "deprecation",
        })
      }
    })
    return standalone({
      code: "a {}",
      config: configBlockNoEmpty,
    }).then(data => {
      results = data.results
      output = data.output
    })
  })

  afterEach(() => {
    ruleDefinitionsStub.restore()
  })

  it("works", () => {
    expect(output.indexOf("Some deprecation")).not.toBe(-1)
    expect(results.length).toBe(1)
    expect(results[0].deprecations.length).toBe(1)
    expect(results[0].deprecations[0].text).toBe("Some deprecation")
  })
})

it("standalone with different configs per file", () => {
  let results

  beforeEach(() => {
    return standalone({
      code: "a {}",
      config: configBlockNoEmpty,
    }).then(data => results = data.results)
  })

  it("no warnings for A", () => {
    const resultA = results.find((result) => result.source.indexOf("a.css") !== -1)
    expect(resultA.warnings.length, 0)
  })

  it("one warning for B", () => {
    const resultB = results.find((result) => result.source.indexOf("b.css") !== -1)
    expect(resultB.warnings.length, 1)
  })

  it("correct warning for B", () => {
    const resultB = results.find((result) => result.source.indexOf("b.css") !== -1)
    expect(resultB.warnings[0].text.indexOf("Unexpected empty block")).not.toBe(-1)
  })

  it("no warnings for C", () => {
    const resultC = results.find((result) => result.source.indexOf("c.css") !== -1)
    expect(resultC.warnings.length, 0)
  })

  it("no warnings for D", () => {
    const resultD = results.find((result) => result.source.indexOf("d.css") !== -1)
    expect(resultD.warnings.length, 0)
  })
})

describe("standalone with config locatable from process.cwd not file", () => {
  let actualCwd, results

  beforeAll(() => {
    actualCwd = process.cwd()
    process.chdir(path.join(__dirname, "./fixtures/getConfigForFile/a/b"))
  })

  afterAll(() => {
    process.chdir(actualCwd)
  })

  beforeEach(() => {
    return standalone({
      files: [path.join(__dirname, "./fixtures/empty-block.css")],
    }).then(data => results = data.results)
  })

  it("two warning", () => {
    expect(results[0].warnings.length, 2)
  })

  it("first correct warning", () => {
    expect(results[0].warnings[0].text.indexOf("Unexpected empty block")).not.toBe(-1)
  })

  it("second correct warning", () => {
    expect(results[0].warnings[1].text.indexOf("foo")).not.toBe(-1)
  })
})

it("Setting `plugins` inside `configOverrides` object should overrides the ones set in `config` object", () => {
  return standalone({
    code: ".bar {}",
    configBasedir: __dirname,
    config: {
      plugins: [],
      rules: {
        "plugin/warn-about-bar": "always",
      },
    },
    configOverrides: {
      plugins: ["./fixtures/plugin-warn-about-bar"],
    },
  }).then(({ results }) => {
    expect(results[0].warnings.length).toBe(1)
    expect(results[0].warnings[0].text).toBe("found .bar (plugin/warn-about-bar)")
  })
})
