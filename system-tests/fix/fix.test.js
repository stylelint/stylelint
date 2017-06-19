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
const spawn = require("child_process").spawn

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

  it("should not fix ignored files", () => {
    const readFile = () => {
      return pify(fs.readFile)(stylesheetPath, "utf8")
    }

    const runCli = () => {
      return new Promise((r, rj) => {
        const localPath = path.resolve(__dirname)
        const cliPath = path.join(localPath, "../../lib/cli.js")

        const cliProcess = spawn("node", [
          cliPath, stylesheetPath,
          "--ignore-path", "custom-ignore",
          "--config", "config.json",
          "--fix",
        ], { cwd: localPath })

        cliProcess.on("error", function (error) {
          rj(error)
        })

        cliProcess.on("close", function (code) {
          r(code)
        })
      })
    }

    return (readFile()
      .then((originalContent) => {
        return (runCli()
          .then((code) => {
            expect(code).toEqual(0)
          })
          .then(readFile)
          .then((newContent) => {
            expect(newContent).toBe(originalContent)
          })
        )
      })
    )
  })
})
