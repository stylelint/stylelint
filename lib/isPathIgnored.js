/* @flow */
"use strict"
const ignore = require("ignore")
const multimatch = require("multimatch")
const path = require("path")

const alwaysIgnoredGlobs = [ "**/node_modules/**", "**/bower_components/**" ]

// To find out if a path is ignored, we need to load the config,
// which may have an ignoreFiles property,
// and will have incorporated any .stylelintignore file that was found
// into its ignorePatterns property. We then check the path
// against these.
module.exports = function (
  stylelint/*: stylelint$internalApi*/,
  filePathArg/*:: ?: string*/
)/*: Promise<boolean>*/ {
  const filePath = filePathArg // to please Flow
  if (!filePath) {
    return Promise.resolve(false)
  }

  return stylelint.getConfigForFile(filePath).then((result) => {
    const config = result.config

    const absoluteFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath)

    const ignoreFiles = alwaysIgnoredGlobs.concat(config.ignoreFiles || [])
    if (multimatch(absoluteFilePath, ignoreFiles).length) {
      return true
    }

    const ignorePatternsFilter = ignore().add(config.ignorePatterns).createFilter()

    const filepathRelativeToCwd = path.relative(process.cwd(), filePath)

    if (ignorePatternsFilter && !ignorePatternsFilter(filepathRelativeToCwd)) {
      return true
    }

    return false
  })
}
