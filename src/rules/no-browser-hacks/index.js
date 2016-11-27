const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const Result = require("postcss/lib/result")
import { isString } from "lodash"
const stylehacks = require("stylehacks")

export const ruleName = "no-browser-hacks"

export const messages = ruleMessages(ruleName, {
  rejected: (type, hack) => `Unexpected ${type} hack "${hack}"`,
})

module.exports = function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      optional: true,
      actual: options,
      possible: {
        browsers: [isString],
      },
    })
    if (!validOptions) {
      return
    }

    const stylehacksOptions = { lint: true }
    if (options && options.browsers) {
      stylehacksOptions.browsers = options.browsers
    }

    const stylehacksResult = new Result()
    stylehacks(stylehacksOptions)(root, stylehacksResult)
    stylehacksResult.warnings().forEach(stylehacksWarning => {
      const message = messages.rejected(stylehacksWarning.identifier, stylehacksWarning.hack)
      report({
        ruleName,
        result,
        message,
        node: stylehacksWarning.node,
        line: stylehacksWarning.line,
        column: stylehacksWarning.column,
      })
    })
  }
}
