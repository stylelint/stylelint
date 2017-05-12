"use strict"

const configBlockNoEmpty = require("./fixtures/config-block-no-empty")
const ruleDefinitions = require("../rules")
const standalone = require("../standalone")

describe("standalone with deprecations", () => {
  let ruleDefinitionsStub, results, output

  beforeEach(() => {
    ruleDefinitionsStub = Object.assign(ruleDefinitions, { "block-no-empty": jest.fn(() => {
      return (root, result) => {
        result.warn("Some deprecation", {
          stylelintType: "deprecation",
        })
      }
    }) })
    return standalone({
      code: "a {}",
      config: configBlockNoEmpty,
    }).then(data => {
      results = data.results
      output = data.output
    })
  })

  afterEach(() => {
    ruleDefinitionsStub["block-no-empty"].mockClear()
    delete ruleDefinitionsStub["block-no-empty"]
  })

  it("works", () => {
    expect(output.indexOf("Some deprecation")).not.toBe(-1)
    expect(results.length).toBe(1)
    expect(results[0].deprecations.length).toBe(1)
    expect(results[0].deprecations[0].text).toBe("Some deprecation")
  })
})
