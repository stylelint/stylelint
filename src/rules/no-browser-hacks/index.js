import stylehacks from "stylehacks"
import Result from "postcss/lib/result"
import { isString } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-browser-hacks"

export const messages = ruleMessages(ruleName, {
  rejected: (type, hack) => `Unexpected ${type} hack "${hack}"`,
})

export default function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      optional: true,
      actual: options,
      possible: {
        browsers: [isString],
      },
    })
    if (!validOptions) { return }

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
