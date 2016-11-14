import path from "path"
import standalone from "../../standalone"

describe("standalone with .stylelintignore file ignoring one file", () => {
  let actualCwd
  let results
  const fixturesPath = path.join(__dirname, "../fixtures")

  beforeAll(() => {
    actualCwd = process.cwd()
    process.chdir(__dirname, "../fixtures")
  })

  afterAll(() => {
    process.chdir(actualCwd)
  })

  beforeEach(() => {
    return standalone({
      files: [ `${fixturesPath}/empty-block.css`, `${fixturesPath}/invalid-hex.css` ],
      config: {
        extends: [
          `${fixturesPath}/config-block-no-empty`,
          `${fixturesPath}/config-color-no-invalid-hex`,
        ],
      },
    }).then(data => results = data.results)
  })

  it("two files found", () => {
    expect(results.length).toBe(2)
  })

  it("empty-block.css found", () => {
    expect(results[0].source.indexOf("empty-block.css")).not.toBe(-1)
  })

  it("empty-block.css not linted", () => {
    expect(results[0].warnings.length).toBe(0)
  })

  it("empty-block.css marked as ignored", () => {
    expect(results[0].ignored).toBeTruthy()
  })

  it("empty-block.css not parsed by standalone", () => {
    expect(results[0]._postcssResult.standaloneIgnored).toBeTruthy()
  })

  it("color-no-invalid-hex.css found", () => {
    expect(results[1].source.indexOf("invalid-hex.css")).not.toBe(-1)
  })

  it("color-no-invalid-hex.css linted", () => {
    expect(results[1].warnings.length).toBe(1)
  })

  it("color-no-invalid-hex.css not marked as ignored", () => {
    expect(results[1].ignored).toBeFalsy()
  })

  it("color-no-invalid-hex.css parsed by standalone", () => {
    expect(results[1]._postcssResult.standaloneIgnored).toBeFalsy()
  })
})
