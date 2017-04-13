"use strict"

const os = require("os")
const path = require("path")
const fs = require("fs")
const _ = require("lodash")
const pify = require("pify")
const del = require("del")
const cpFile = require("cp-file")
const systemTestUtils = require("../systemTestUtils")
const stylelint = require("../../lib")

describe("fix", () => {
  let tmpDir
  let stylesheetPath

  beforeEach(() => {
    tmpDir = os.tmpdir()
    stylesheetPath = path.join(tmpDir, `stylesheet-${_.uniqueId()}.css`)
    return cpFile(path.join(__dirname, "stylesheet.css"), stylesheetPath)
  })

  afterEach(() => {
    return del(stylesheetPath, { force: true })
  })

  it("expected stylelint results", () => {
    return stylelint.lint({
      files: [stylesheetPath],
      configFile: systemTestUtils.caseConfig("fix"),
      fix: true,
    }).then((output) => {
      // Remove the path to tmpDir
      const cleanedResults = output.results.map(r => Object.assign({}, r, { source: "stylesheet.css" }))
      expect(systemTestUtils.prepResults(cleanedResults)).toMatchSnapshot()
    })
  })

  it("expected fixes to PostCSS Result", () => {
    return stylelint.lint({
      files: [stylesheetPath],
      configFile: systemTestUtils.caseConfig("fix"),
      fix: true,
    }).then((output) => {
      const result = output.results[0]._postcssResult
      expect(result.root.toString(result.opts.syntax)).toMatchSnapshot()
    })
  })

  it("overwrites the original file", () => {
    return stylelint.lint({
      files: [stylesheetPath],
      configFile: systemTestUtils.caseConfig("fix"),
      fix: true,
    }).then((output) => {
      const result = output.results[0]._postcssResult
      return pify(fs.readFile)(stylesheetPath, "utf8").then((fileContent) => {
        expect(fileContent).toBe(result.root.toString(result.opts.syntax))
      })
    })
  })
})
