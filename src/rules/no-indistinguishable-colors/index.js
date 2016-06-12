import colorguard from "colorguard"
import { isArray, isNumber } from "lodash"
import Result from "postcss/lib/result"
import {
  isValidHex,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-indistinguishable-colors"

export const messages = ruleMessages(ruleName, {
  rejected: (a, b) => `Unexpected indistinguishable colors "${a}" and "${b}"`,
})

export default function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      optional: true,
      actual: options,
      possible: {
        ignore: isValidHex,
        threshold: x => isNumber(x) && x >= 0 && x <= 100,
        whitelist: x => isArray(x) && x.every(isValidHex),
      },
    })
    if (!validOptions) { return }

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
