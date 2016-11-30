/* @flow */
"use strict"
const _ = require("lodash")
const createStylelint = require("./createStylelint")
const postcss = require("postcss")

module.exports = postcss.plugin("stylelint", function () {
  const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  const tailoredOptions/*: Object*/ = options.rules ? { config: options } : options

  const stylelint = createStylelint(tailoredOptions)
  return (root, result) => {
    return stylelint._lintSource({
      filePath: options.from || _.get(root, "source.input.file"),
      existingPostcssResult: result,
    })
  }
})
