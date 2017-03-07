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

/*::type StylelintT = {
  _options: stylelint$options,
  _extendExplorer: { load: Function },
  _fullExplorer: { load: Function },
  _configCache: Map<string, Object>,
  _specifiedConfigCache: Map<string, Object>,
  _postcssResultCache: Map<string, Object>,

  _augmentConfig: Function,
  _getPostcssResult: Function,
  _lintSource: Function,
  _createStylelintResult: Function,
  _createEmptyPostcssResult?: Function,

  getConfigForFile: Function,
  isPathIgnored: Function,
  lintSource: Function,
}*/

module.exports = postcss.plugin("stylelint", function (options/*: OptionsT*/) {
  options = options || {}

  const tailoredOptions/*: Object*/ = options.rules
    ? { config: options }
    : options
  const stylelint/*: StylelintT*/ = createStylelint(tailoredOptions)

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
