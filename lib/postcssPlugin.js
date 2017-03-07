/* @flow */
"use strict"
const _ = require("lodash")
const createStylelint = require("./createStylelint")
const postcss/*: Object*/ = require("postcss")
const path = require("path")

/*:: type OptionsT = {
  config?: Object;
  configBasedir?: string;
  defaultSeverity?: string;
  from?: string;
  ignoreDisables?: boolean;
  ignoreFiles?: string;
  pluginFunctions?: Object;
  plugins?: Array<string>;
  rules?: Object;
}
*/

module.exports = postcss.plugin("stylelint", function (options/*: OptionsT*/) {
  options = options || {}

  const tailoredOptions/*: Object*/ = options.rules
    ? { config: options }
    : options
  const stylelint/*: stylelint$internalApi*/ = createStylelint(tailoredOptions)

  return (root/*: Object*/, result/*: Object*/) => {
    let filePath = options.from || _.get(root, "source.input.file")
    if (filePath !== undefined && !path.isAbsolute(filePath)) {
      filePath = path.join(process.cwd(), filePath)
    }

    return stylelint._lintSource({
      filePath,
      existingPostcssResult: result,
    })
  }
})
