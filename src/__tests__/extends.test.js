import configExtendingAnotherExtend from "./fixtures/config-extending-another-extend.json"
import configExtendingOne from "./fixtures/config-extending-one"
import configExtendingThreeWithOverride from "./fixtures/config-extending-three-with-override"
import path from "path"
import standalone from "../standalone"

const fixturesPath = path.join(__dirname, "fixtures")

it("basic extending", () => {
  return standalone({
    code: "a {}",
    config: configExtendingOne,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then((_ref) => {
    let output = _ref.output,
      results = _ref.results

    expect(typeof output, "string")
    expect(results.length, 1)
    expect(results[0].warnings.length, 1)
    expect(results[0].warnings[0].rule, "block-no-empty")
  })
})

it("recursive extending", () => {
  return standalone({
    code: "a {}",
    config: configExtendingAnotherExtend,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then((_ref2) => {
    let output = _ref2.output,
      results = _ref2.results

    expect(typeof output).toBe("string")
    expect(results.length).toBe(1)
    expect(results[0].warnings.length).toBe(1)
    expect(results[0].warnings[0].rule).toBe("block-no-empty")
  })
})

it("extending with overrides", () => {
  return standalone({
    code: "a {}",
    config: configExtendingThreeWithOverride,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then((_ref3) => {
    const results = _ref3.results

    expect(results[0].warnings.length).toBe(0)
  })
})

it("extending configuration and no configBasedir", () => {
  return standalone({
    code: "a {}",
    config: configExtendingOne,
  }).then(() => {
    throw new Error("should have failed")
  }).catch(err => {
    expect(err.code).toBe(78)
  })
})

it("extending a config that is overridden", () => {
  return standalone({
    code: "a { b: \"c\" }",
    config: {
      extends: [`${fixturesPath}/config-string-quotes-single`],
      rules: { "string-quotes": "double" },
    },
  }).then((_ref4) => {
    const results = _ref4.results

    expect(results[0].warnings.length).toBe(0)
  })
})

describe("extending a config from process.cwd", () => {
  let actualCwd

  beforeAll(() => {
    actualCwd = process.cwd()
    process.chdir(__dirname)
  })

  afterAll(() => {
    process.chdir(actualCwd)
  })

  it("works", () => {
    return standalone({
      code: "a { b: \"c\" }",
      config: {
        extends: ["./fixtures/config-string-quotes-single"],
      },
    }).then((_ref5) => {
      const results = _ref5.results

      expect(results[0].warnings.length).toBe(1)
    })
  })
})
