"use strict"

const ignore = require("ignore")
const multimatch = require("multimatch")
const path = require("path")

module.exports = function getIsFileIgnored(
  ignorePatterns/*: Array<string>*/,
  ignoreFiles/*: string | Array<string>*/
)/*: Function */ {
  const ignorePatternsFilter = ignore().add(ignorePatterns).createFilter()

  return file => {
    const filepathRelativeToCwd = path.relative(process.cwd(), file)
    return ignorePatternsFilter && !ignorePatternsFilter(filepathRelativeToCwd) || ignoreFiles && multimatch(file, ignoreFiles).length
  }
}
