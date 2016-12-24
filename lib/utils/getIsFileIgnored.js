"use strict"

const ignore = require("ignore")
const micromatch = require("micromatch")
const path = require("path")

module.exports = function getIsFileIgnored(
  ignorePatterns/*: Array<string>*/,
  ignoreFiles/*: string | Array<string>*/
)/*: Function */ {
  const ignorePatternsFilter = ignore().add(ignorePatterns).createFilter()

  return file => {
    const filepathRelativeToCwd = path.relative(process.cwd(), file)
    return ignorePatternsFilter && !ignorePatternsFilter(filepathRelativeToCwd) || ignoreFiles && micromatch(file, ignoreFiles).length
  }
}
