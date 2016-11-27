const doiuse = require("doiuse")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const Result = require("postcss/lib/result")
const _ = require("lodash")

export const ruleName = "no-unsupported-browser-features"

export const messages = ruleMessages(ruleName, {
  rejected: details => `Unexpected browser feature ${details}`,
})

module.exports = function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      optional: true,
      actual: options,
      possible: {
        browsers: [_.isString],
        ignore: [_.isString],
      },
    })
    if (!validOptions) {
      return
    }

    const doiuseOptions = {}

    if (options && options.browsers) {
      doiuseOptions.browsers = options.browsers
    }

    if (options && options.ignore) {
      doiuseOptions.ignore = options.ignore
    }

    const doiuseResult = new Result()
    doiuse(doiuseOptions).postcss(root, doiuseResult)
    doiuseResult.warnings().forEach(doiuseWarning => {
      report({
        ruleName,
        result,
        message: messages.rejected(cleanDoiuseWarningText(doiuseWarning.text)),
        node: doiuseWarning.node,
        line: doiuseWarning.line,
        column: doiuseWarning.column,
      })
    })
  }
}

function cleanDoiuseWarningText(warningText) {
  // Get index of feature Id
  const featureIdIndex = warningText.lastIndexOf("(")

  // Get feature Id, then replace brackets with quotes
  const featureId = warningText.slice(featureIdIndex, warningText.length).replace(/\(|\)/g, "\"")

  // Get start of support text i.e. "x not supported by...", or "y only partially supported by..."
  const browserSupportStartIndex = warningText.indexOf("not") !== -1 ? warningText.indexOf("not") : warningText.indexOf("only")

  // Get browser support text, then strip brackets.
  const browserSupport = warningText.slice(browserSupportStartIndex, featureIdIndex - 1).replace(/\(|\)|:/g, "")

  return `${featureId} is ${browserSupport}`
}
