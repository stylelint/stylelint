const _ = require("lodash")
const isValidHex = require("../../utils/isValidHex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const Result = require("postcss/lib/result")
const colorguard = require("colorguard")

export const ruleName = "no-indistinguishable-colors"

export const messages = ruleMessages(ruleName, {
  rejected: (a, b) => `Unexpected indistinguishable colors "${a}" and "${b}"`,
})

module.exports = function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      optional: true,
      actual: options,
      possible: {
        ignore: isValidHex,
        threshold: x => _.isNumber(x) && x >= 0 && x <= 100,
        whitelist: x => _.isArray(x) && x.every(isValidHex),
      },
    })
    if (!validOptions) {
      return
    }

    const colorguardResult = new Result()
    colorguard(options)(root, colorguardResult)
    colorguardResult.warnings().forEach(colorguardWarning => {
      const message = messages.rejected(colorguardWarning.secondColor, colorguardWarning.firstColor)
      report({
        ruleName,
        result,
        message,
        node: colorguardWarning.node,
        index: colorguardWarning.node.toString().indexOf(colorguardWarning.secondColor),
      })
    })
  }
}
