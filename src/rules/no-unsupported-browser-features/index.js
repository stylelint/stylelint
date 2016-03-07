const doiuse = require("doiuse")
import Result from "postcss/lib/result"
import { isString } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-unsupported-browser-features"

export const messages = ruleMessages(ruleName, {
  rejected: details => `Unexpected browser feature ${details}`,
})

export default function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      optional: true,
      actual: options,
      possible: {
        browsers: [isString],
        ignore: [isString],
      },
    })
    if (!validOptions) { return }

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
  return warningText.replace(/\s*\(\S+?\)$/, "")
}
