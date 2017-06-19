/* @flow */
"use strict"
/*:: type postcssType = {
  atRule: Function,
  comment: Function,
  decl: Function,
  list: any,
  parse: any,
  plugin: Function,
  root: Function,
  rule: Function,
  stringify: any,
  vendor: any,
} */
const _ = require("lodash")
const createStylelint = require("./createStylelint")
const postcss/*: postcssType*/ = require("postcss")
const path = require("path")
//'block-no-empty': bool || Array
/*:: type OptionsT = {
  config?: {
    extends?: Array<string>,
    plugins?: Array<string>,
    rules?: Object,
  };
  configBasedir?: string;
  configFile?: string;
  defaultSeverity?: string;
  from?: string;
  ignoreDisables?: boolean;
  ignoreFiles?: string;
  pluginFunctions?: Object;
  plugins?: Array<string>;
  rules?: Object;
}
*/

/*:: type postcssPromise = Promise<?{ config: stylelint$config, filepath: string }>*/

module.exports = postcss.plugin("stylelint", function (options/*: OptionsT*/)/*: Function*/ {
  options = options || {}

  const tailoredOptions/*: Object*/ = options.rules
    ? { config: options }
    : options
  const stylelint/*: stylelint$internalApi*/ = createStylelint(tailoredOptions)

  return (root/*: Object*/, result/*: Object*/)/*: Promise<any>*/ => {
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
